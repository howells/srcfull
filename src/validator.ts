import { httpLimiter } from "./concurrency";
import { emitDebug } from "./debug";
import {
  isRetryableRequestError,
  RetryableStatusError,
  shouldRetryStatus,
  sleep,
} from "./retry";
import type { ValidateImageUrlOptions, ValidationResult } from "./types";
import { validatePublicUrl } from "./url-validator";

const REQUEST_TIMEOUT_MS = 5_000;
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
  const retryCount = Math.max(
    0,
    Math.floor(options.retryCount ?? DEFAULT_RETRY_COUNT),
  );
  const retryDelayMs = Math.max(
    0,
    Math.floor(options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS),
  );

  for (let attempt = 1; attempt <= retryCount + 1; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Accept: "image/*",
          "User-Agent": USER_AGENT,
          ...(method === "GET" ? { Range: "bytes=0-0" } : {}),
        },
        signal: controller.signal,
      });

      if (attempt <= retryCount && shouldRetryStatus(response.status)) {
        emitDebug(options.onDebug, {
          type: "validate:retry",
          message: `${method} returned ${response.status} for ${url}`,
          url,
          method,
          status: response.status,
          attempt,
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
        type: "validate:retry",
        message: `${method} failed for ${url}`,
        url,
        method,
        attempt,
        error: error instanceof Error ? error.message : String(error),
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
  const publicUrl = validatePublicUrl(url);
  const safeUrl = publicUrl.url?.href;
  if (!publicUrl.valid || !safeUrl) {
    emitDebug(options.onDebug, {
      type: "validate:rejected",
      message: publicUrl.error ?? `Rejected ${url}`,
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
            type: "validate:status",
            message: `${method} returned ${response.status} for ${safeUrl}`,
            url: safeUrl,
            method,
            status: response.status,
          });
          continue;
        }

        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.startsWith("image/")) {
          emitDebug(options.onDebug, {
            type: "validate:content_type",
            message: `${method} returned non-image content for ${safeUrl}`,
            url: safeUrl,
            method,
            metadata: {
              contentType,
            },
          });
          continue;
        }

        emitDebug(options.onDebug, {
          type: "validate:success",
          message: `${method} validated ${safeUrl}`,
          url: safeUrl,
          method,
          metadata: {
            contentType,
            size: parseSize(response),
          },
        });
        return {
          valid: true,
          contentType,
          size: parseSize(response),
        };
      }

      emitDebug(options.onDebug, {
        type: "validate:failed",
        message: `Validation failed for ${safeUrl}`,
        url: safeUrl,
      });
      return { valid: false };
    } catch (error) {
      emitDebug(options.onDebug, {
        type: "validate:error",
        message: `Validation threw for ${safeUrl}`,
        url: safeUrl,
        error: error instanceof Error ? error.message : String(error),
      });
      return { valid: false };
    }
  });
}
