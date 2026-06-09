import { httpLimiter } from "./concurrency";
import { emitDebug } from "./debug";
import { isRetryableRequestError, RetryableStatusError, shouldRetryStatus, sleep } from "./retry";
import type { ValidateImageUrlOptions, ValidationResult } from "./types";
import { validatePublicUrl, validatePublicUrlForServer } from "./url-validator";

const REQUEST_TIMEOUT_MS = 5000;
const USER_AGENT = "Mozilla/5.0 (compatible; Srcfull/2.0)";
const DEFAULT_RETRY_COUNT = 1;
const DEFAULT_RETRY_DELAY_MS = 500;

function parseSize(response: Response): number | undefined {
  const contentLength = response.headers.get("content-length");
  if (contentLength) {
    const parsed = Number.parseInt(contentLength, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  const contentRange = response.headers.get("content-range");
  if (!contentRange) {
    return undefined;
  }

  const total = contentRange.split("/")[1];
  if (!total) {
    return undefined;
  }

  const parsed = Number.parseInt(total, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function requestImage(
  url: string,
  method: "HEAD" | "GET",
  options: ValidateImageUrlOptions,
): Promise<Response> {
  const retryCount = Math.max(0, Math.floor(options.retryCount ?? DEFAULT_RETRY_COUNT));
  const retryDelayMs = Math.max(0, Math.floor(options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS));

  for (let attempt = 1; attempt <= retryCount + 1; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "image/*",
          "User-Agent": USER_AGENT,
          ...(method === "GET" ? { Range: "bytes=0-0" } : {}),
        },
        method,
        signal: controller.signal,
      });

      if (attempt <= retryCount && shouldRetryStatus(response.status)) {
        emitDebug(options.onDebug, {
          attempt,
          message: `${method} returned ${response.status} for ${url}`,
          method,
          status: response.status,
          type: "validate:retry",
          url,
        });
        await sleep(retryDelayMs * attempt);
        continue;
      }

      return response;
    } catch (error) {
      if (!isRetryableRequestError(error) || attempt > retryCount) {
        throw error;
      }

      emitDebug(options.onDebug, {
        attempt,
        error: error instanceof Error ? error.message : String(error),
        message: `${method} failed for ${url}`,
        method,
        type: "validate:retry",
        url,
      });
      await sleep(retryDelayMs * attempt);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new RetryableStatusError(503, `Unable to validate ${url}`);
}

export async function validateImageUrl(
  url: string,
  options: ValidateImageUrlOptions = {},
): Promise<ValidationResult> {
  const publicUrl = options.validateResolvedIp
    ? await validatePublicUrlForServer(url)
    : validatePublicUrl(url);
  const safeUrl = publicUrl.url?.href;
  if (!publicUrl.valid || !safeUrl) {
    emitDebug(options.onDebug, {
      message: publicUrl.error ?? `Rejected ${url}`,
      type: "validate:rejected",
      url,
    });
    return { valid: false };
  }

  return httpLimiter(async () => {
    try {
      for (const method of ["HEAD", "GET"] as const) {
        const response = await requestImage(safeUrl, method, options);
        if (!response.ok) {
          emitDebug(options.onDebug, {
            message: `${method} returned ${response.status} for ${safeUrl}`,
            method,
            status: response.status,
            type: "validate:status",
            url: safeUrl,
          });
          continue;
        }

        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.startsWith("image/")) {
          emitDebug(options.onDebug, {
            message: `${method} returned non-image content for ${safeUrl}`,
            metadata: {
              contentType,
            },
            method,
            type: "validate:content_type",
            url: safeUrl,
          });
          continue;
        }

        emitDebug(options.onDebug, {
          message: `${method} validated ${safeUrl}`,
          metadata: {
            contentType,
            size: parseSize(response),
          },
          method,
          type: "validate:success",
          url: safeUrl,
        });
        return {
          contentType,
          size: parseSize(response),
          valid: true,
        };
      }

      emitDebug(options.onDebug, {
        message: `Validation failed for ${safeUrl}`,
        type: "validate:failed",
        url: safeUrl,
      });
      return { valid: false };
    } catch (error) {
      emitDebug(options.onDebug, {
        error: error instanceof Error ? error.message : String(error),
        message: `Validation threw for ${safeUrl}`,
        type: "validate:error",
        url: safeUrl,
      });
      return { valid: false };
    }
  });
}
