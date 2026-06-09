import { createLimiter } from "./concurrency";
import { emitDebug } from "./debug";
import { extractImageCandidates } from "./extract";
import { resolveImageUrl } from "./resolve";
import { isRetryableRequestError, RetryableStatusError, shouldRetryStatus, sleep } from "./retry";
import type {
  DefaultHtmlFetcherOptions,
  HtmlFetchResult,
  ImageCandidate,
  ScrapePageOptions,
  ScrapePageResult,
} from "./types";
import { validatePublicUrl, validatePublicUrlForServer } from "./url-validator";
import { validateImageUrl } from "./validator";

const DEFAULT_MIN_SIZE = 200;
const DEFAULT_FETCH_TIMEOUT_MS = 10_000;
const DEFAULT_USER_AGENT = "Mozilla/5.0 (compatible; Srcfull/2.0)";
const DEFAULT_RETRY_COUNT = 1;
const DEFAULT_RETRY_DELAY_MS = 500;
const VALIDATION_POOL_MULTIPLIER = 3;
const LOGO_PATTERNS = [
  /logo/i,
  /icon/i,
  /favicon/i,
  /badge/i,
  /sprite/i,
  /thumbnail/i,
  /avatar/i,
  /social/i,
  /button/i,
];

function createAbortController(timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}

export function createDefaultHtmlFetcher(options: DefaultHtmlFetcherOptions = {}) {
  const timeoutMs = Math.max(1, Math.floor(options.timeoutMs ?? DEFAULT_FETCH_TIMEOUT_MS));
  const retryCount = Math.max(0, Math.floor(options.retryCount ?? DEFAULT_RETRY_COUNT));
  const retryDelayMs = Math.max(0, Math.floor(options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS));
  const userAgent = options.userAgent?.trim() || DEFAULT_USER_AGENT;
  const accept =
    options.accept?.trim() || "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";

  return async (url: string): Promise<HtmlFetchResult> => {
    const validation = options.validateResolvedIp
      ? await validatePublicUrlForServer(url)
      : validatePublicUrl(url);
    if (!validation.valid || !validation.url) {
      throw new Error(validation.error ?? "Invalid page URL");
    }

    for (let attempt = 1; attempt <= retryCount + 1; attempt += 1) {
      const { controller, timeoutId } = createAbortController(timeoutMs);

      try {
        const response = await fetch(validation.url.href, {
          headers: {
            Accept: accept,
            "User-Agent": userAgent,
            ...options.headers,
          },
          signal: controller.signal,
        });

        if (attempt <= retryCount && shouldRetryStatus(response.status)) {
          emitDebug(options.onDebug, {
            attempt,
            message: `Page fetch returned ${response.status} for ${validation.url.href}`,
            status: response.status,
            type: "fetch:retry",
            url: validation.url.href,
          });
          await sleep(retryDelayMs * attempt);
          continue;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch page: ${response.status}`);
        }

        const contentType = response.headers.get("content-type") ?? "";
        if (
          !options.allowNonHtml &&
          contentType &&
          !/text\/html|application\/xhtml\+xml/i.test(contentType)
        ) {
          throw new Error(`Expected HTML response but received ${contentType}`);
        }

        emitDebug(options.onDebug, {
          attempt,
          message: `Fetched page HTML for ${validation.url.href}`,
          metadata: {
            contentType,
            status: response.status,
          },
          type: "fetch:success",
          url: validation.url.href,
        });
        return {
          html: await response.text(),
          metadata: {
            contentType,
            fetcher: "default",
            status: response.status,
          },
        };
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          if (attempt <= retryCount) {
            emitDebug(options.onDebug, {
              attempt,
              error: error.message,
              message: `Page fetch timed out for ${validation.url.href}`,
              type: "fetch:retry",
              url: validation.url.href,
            });
            await sleep(retryDelayMs * attempt);
            continue;
          }

          throw new Error(`Timed out fetching page after ${timeoutMs}ms`, { cause: error });
        }

        if (attempt <= retryCount && isRetryableRequestError(error)) {
          emitDebug(options.onDebug, {
            attempt,
            error: error instanceof Error ? error.message : String(error),
            message: `Page fetch failed for ${validation.url.href}`,
            type: "fetch:retry",
            url: validation.url.href,
          });
          await sleep(retryDelayMs * attempt);
          continue;
        }

        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    }

    throw new RetryableStatusError(503, `Unable to fetch ${validation.url.href}`);
  };
}

export const defaultHtmlFetcher = createDefaultHtmlFetcher();

function filterMainImages(candidates: ImageCandidate[], minSize: number): ImageCandidate[] {
  return candidates.filter((candidate) => {
    if (candidate.url.startsWith("data:")) {
      return false;
    }

    if (LOGO_PATTERNS.some((pattern) => pattern.test(candidate.url))) {
      return false;
    }

    if (candidate.width && candidate.width < minSize) {
      return false;
    }

    if (candidate.height && candidate.height < minSize) {
      return false;
    }

    return true;
  });
}

async function getImageSize(
  url: string,
  options: ScrapePageOptions,
  knownSize?: number,
): Promise<number | null> {
  if (knownSize !== undefined) {
    return knownSize;
  }

  const validation = options.validate
    ? await options.validate(url)
    : await validateImageUrl(url, {
        onDebug: options.onDebug,
        retryCount: options.retryCount,
        retryDelayMs: options.retryDelayMs,
        validateResolvedIp: options.validateResolvedIp,
      });
  return validation.size ?? null;
}

function candidateHintScore(candidate: ImageCandidate): number {
  const sourceScore =
    candidate.source === "img"
      ? 4
      : candidate.source === "picture"
        ? 3
        : candidate.source === "background"
          ? 2
          : 1;
  const area = candidate.width && candidate.height ? candidate.width * candidate.height : 0;
  return area + sourceScore;
}

async function rankCandidatesForResolution(
  candidates: ImageCandidate[],
  options: ScrapePageOptions,
): Promise<ImageCandidate[]> {
  const maxImages = Math.max(1, Math.floor(options.maxImages ?? 20));
  const validationLimit = Math.min(
    candidates.length,
    Math.max(maxImages, maxImages * VALIDATION_POOL_MULTIPLIER),
  );
  const validationPool = [...candidates]
    .sort((left, right) => candidateHintScore(right) - candidateHintScore(left))
    .slice(0, validationLimit);

  const withSizes = await Promise.all(
    validationPool.map(async (candidate) => ({
      ...candidate,
      size: (await getImageSize(candidate.url, options)) ?? undefined,
    })),
  );

  withSizes.sort((left, right) => {
    const sizeDifference = (right.size ?? 0) - (left.size ?? 0);
    return sizeDifference || candidateHintScore(right) - candidateHintScore(left);
  });

  return withSizes.slice(0, maxImages);
}

export async function scrapePage(
  url: string,
  options: ScrapePageOptions = {},
): Promise<ScrapePageResult> {
  const start = Date.now();
  const validation = options.validateResolvedIp
    ? await validatePublicUrlForServer(url)
    : validatePublicUrl(url);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const fetchHtml =
    options.fetchHtml ??
    createDefaultHtmlFetcher({
      onDebug: options.onDebug,
      retryCount: options.retryCount,
      retryDelayMs: options.retryDelayMs,
      validateResolvedIp: options.validateResolvedIp,
    });
  const htmlResult = await fetchHtml(url);
  const sourceDomain = new URL(url).hostname.replace(/^www\./, "");

  let candidates = filterMainImages(
    await extractImageCandidates(htmlResult.html, {
      baseUrl: url,
      includeRaw: true,
      sourceDomain,
    }),
    options.minSize ?? DEFAULT_MIN_SIZE,
  );

  let fallbackMetadata: Record<string, unknown> | undefined;
  if (candidates.length === 0 && options.imageFallback) {
    const fallback = await options.imageFallback(url);
    candidates = filterMainImages(fallback.images, options.minSize ?? DEFAULT_MIN_SIZE);
    fallbackMetadata = fallback.metadata;
  }

  if (candidates.length === 0) {
    throw new Error("Failed to extract images");
  }

  emitDebug(options.onDebug, {
    message: `Collected ${candidates.length} candidates for ${url}`,
    metadata: {
      sourceDomain,
    },
    type: "scrape:candidates",
    url,
  });

  const toResolve = await rankCandidatesForResolution(candidates, options);
  const resolve =
    options.resolve ??
    ((imageUrl: string) =>
      resolveImageUrl(imageUrl, {
        onDebug: options.onDebug,
        originalSize: toResolve.find((entry) => entry.url === imageUrl)?.size,
        retryCount: options.retryCount,
        retryDelayMs: options.retryDelayMs,
        validateResolvedIp: options.validateResolvedIp,
      }));
  const limit = createLimiter(options.resolveConcurrency ?? 5);

  let resolved = 0;
  let failed = 0;

  const images = (
    await Promise.all(
      toResolve.map((candidate) =>
        limit(async () => {
          try {
            const result = await resolve(candidate.url);
            if (result.method !== "fallback") {
              resolved += 1;
            }

            return {
              alt: candidate.alt ?? null,
              method: result.method,
              original: result.original,
              originalSize: candidate.size ?? null,
              resolved: result.resolved,
              resolvedSize: await getImageSize(
                result.resolved,
                options,
                result.resolvedSize ??
                  (result.resolved === candidate.url ? candidate.size : undefined),
              ),
              sizeIncrease: result.sizeIncrease ?? null,
            };
          } catch (error) {
            failed += 1;
            emitDebug(options.onDebug, {
              error: error instanceof Error ? error.message : String(error),
              message: `Failed to resolve ${candidate.url}`,
              type: "scrape:resolve_failed",
              url: candidate.url,
            });
            return null;
          }
        }),
      ),
    )
  ).filter((image): image is NonNullable<typeof image> => image !== null);

  images.sort((left, right) => (right.resolvedSize ?? 0) - (left.resolvedSize ?? 0));

  return {
    images,
    metadata: {
      ...(htmlResult.metadata ?? {}),
      ...(fallbackMetadata ?? {}),
    },
    stats: {
      durationMs: Date.now() - start,
      failed,
      found: candidates.length,
      resolved,
      returned: images.length,
    },
    url,
  };
}
