import { emitDebug } from "../debug";
import { isRetryableRequestError, shouldRetryStatus, sleep } from "../retry";
import type { FirecrawlImageFallbackOptions, ImageFallback } from "../types";
import { validatePublicUrl, validatePublicUrlForServer } from "../url-validator";

const DEFAULT_API_URL = "https://api.firecrawl.dev/v2/scrape";
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRY_COUNT = 1;
const DEFAULT_RETRY_DELAY_MS = 500;

function normalizeOptions(
  input: FirecrawlImageFallbackOptions | string,
): FirecrawlImageFallbackOptions {
  if (typeof input === "string") {
    return { apiKey: input };
  }

  return input;
}

function normalizeApiKey(apiKey: string): string {
  const normalized = apiKey.trim();
  if (normalized.length === 0) {
    throw new Error("Firecrawl API key is required");
  }

  return normalized;
}

function shouldKeepImage(imageUrl: string): boolean {
  if (imageUrl.endsWith(".svg")) {
    return false;
  }

  const validation = validatePublicUrl(imageUrl);
  if (!validation.valid) {
    return false;
  }

  return !/logo|icon|favicon|badge|sprite|button/i.test(imageUrl);
}

export function createFirecrawlImageFallback(
  input: FirecrawlImageFallbackOptions | string,
): ImageFallback {
  const options = normalizeOptions(input);
  const apiKey = normalizeApiKey(options.apiKey);
  const apiUrl = options.apiUrl?.trim() || DEFAULT_API_URL;
  const timeoutMs = Math.max(1, Math.floor(options.timeoutMs ?? DEFAULT_TIMEOUT_MS));
  const retryCount = Math.max(0, Math.floor(options.retryCount ?? DEFAULT_RETRY_COUNT));
  const retryDelayMs = Math.max(0, Math.floor(options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS));

  return async (url) => {
    const validation = options.validateResolvedIp
      ? await validatePublicUrlForServer(url)
      : validatePublicUrl(url);
    if (!validation.valid || !validation.url) {
      throw new Error(validation.error ?? "Invalid page URL");
    }

    for (let attempt = 1; attempt <= retryCount + 1; attempt += 1) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(apiUrl, {
          body: JSON.stringify({
            url: validation.url.href,
            onlyMainContent: true,
            maxAge: 172800000,
            formats: ["images"],
          }),
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          signal: controller.signal,
        });

        const data = (await response.json().catch(() => null)) as {
          success?: boolean;
          error?: string;
          data?: { images?: string[] };
        } | null;

        if (attempt <= retryCount && shouldRetryStatus(response.status)) {
          emitDebug(options.onDebug, {
            attempt,
            message: `Firecrawl returned ${response.status} for ${validation.url.href}`,
            status: response.status,
            type: "fallback:retry",
            url: validation.url.href,
          });
          await sleep(retryDelayMs * attempt);
          continue;
        }

        if (!response.ok) {
          throw new Error(data?.error || `Firecrawl returned ${response.status}`);
        }

        const images = data?.data?.images;
        if (!data?.success || !Array.isArray(images)) {
          throw new Error(data?.error || "No images returned from Firecrawl");
        }

        const filteredImages = images.filter(shouldKeepImage);

        emitDebug(options.onDebug, {
          attempt,
          message: `Firecrawl returned ${filteredImages.length} images for ${validation.url.href}`,
          type: "fallback:success",
          url: validation.url.href,
        });
        return {
          images: filteredImages.map((imageUrl) => ({
            alt: null,
            source: "raw" as const,
            url: imageUrl,
          })),
          metadata: {
            candidateCount: filteredImages.length,
            fallback: "firecrawl",
            timeoutMs,
          },
        };
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          if (attempt <= retryCount) {
            emitDebug(options.onDebug, {
              attempt,
              error: error.message,
              message: `Firecrawl timed out for ${validation.url.href}`,
              type: "fallback:retry",
              url: validation.url.href,
            });
            await sleep(retryDelayMs * attempt);
            continue;
          }

          throw new Error(`Firecrawl timed out after ${timeoutMs}ms`, { cause: error });
        }

        if (attempt <= retryCount && isRetryableRequestError(error)) {
          emitDebug(options.onDebug, {
            attempt,
            error: error instanceof Error ? error.message : String(error),
            message: `Firecrawl request failed for ${validation.url.href}`,
            type: "fallback:retry",
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

    throw new Error(`Firecrawl failed for ${validation.url.href}`);
  };
}
