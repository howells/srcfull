import { emitDebug } from "../debug";
import { isRetryableRequestError, shouldRetryStatus, sleep } from "../retry";
import type { DebugLogger, HtmlFetcher } from "../types";
import { validatePublicUrl, validatePublicUrlForServer } from "../url-validator";

export interface BrowserbaseFetchHtmlFetcherOptions {
  apiKey: string;
  apiUrl?: string;
  allowRedirects?: boolean;
  allowInsecureSsl?: boolean;
  allowNonHtml?: boolean;
  proxies?: boolean;
  timeoutMs?: number;
  retryCount?: number;
  retryDelayMs?: number;
  validateResolvedIp?: boolean;
  onDebug?: DebugLogger;
}

interface BrowserbaseFetchResponse {
  statusCode?: number;
  headers?: Record<string, string>;
  content?: string;
  contentType?: string;
  encoding?: string;
  error?: string;
  message?: string;
}

const DEFAULT_API_URL = "https://api.browserbase.com/v1/fetch";
const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_RETRY_COUNT = 1;
const DEFAULT_RETRY_DELAY_MS = 500;

function normalizeApiKey(apiKey: string): string {
  const normalized = apiKey.trim();
  if (normalized.length === 0) {
    throw new Error("Browserbase API key is required");
  }

  return normalized;
}

function createAbortController(timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}

async function readBrowserbaseResponse(response: Response): Promise<BrowserbaseFetchResponse> {
  const data = (await response.json().catch(() => null)) as BrowserbaseFetchResponse | null;

  if (!data || typeof data !== "object") {
    throw new Error(`Browserbase returned ${response.status}`);
  }

  return data;
}

export function createBrowserbaseFetchHtmlFetcher(
  options: BrowserbaseFetchHtmlFetcherOptions,
): HtmlFetcher {
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

    const safeUrl = validation.url.href;

    for (let attempt = 1; attempt <= retryCount + 1; attempt += 1) {
      const { controller, timeoutId } = createAbortController(timeoutMs);

      try {
        const response = await fetch(apiUrl, {
          body: JSON.stringify({
            url: safeUrl,
            ...(options.allowRedirects === undefined
              ? {}
              : { allowRedirects: options.allowRedirects }),
            ...(options.allowInsecureSsl === undefined
              ? {}
              : { allowInsecureSsl: options.allowInsecureSsl }),
            ...(options.proxies === undefined ? {} : { proxies: options.proxies }),
          }),
          headers: {
            "Content-Type": "application/json",
            "X-BB-API-Key": apiKey,
          },
          method: "POST",
          signal: controller.signal,
        });

        const data = await readBrowserbaseResponse(response);
        const statusCode = data.statusCode ?? response.status;

        if (
          attempt <= retryCount &&
          (shouldRetryStatus(response.status) || shouldRetryStatus(statusCode))
        ) {
          emitDebug(options.onDebug, {
            attempt,
            message: `Browserbase returned ${statusCode} for ${safeUrl}`,
            status: statusCode,
            type: "fetch:retry",
            url: safeUrl,
          });
          await sleep(retryDelayMs * attempt);
          continue;
        }

        if (!response.ok) {
          throw new Error(data.message || data.error || `Browserbase returned ${response.status}`);
        }

        if (statusCode >= 400) {
          throw new Error(`Browserbase target returned ${statusCode}`);
        }

        const contentType =
          data.contentType ??
          data.headers?.["content-type"] ??
          data.headers?.["Content-Type"] ??
          "";
        if (
          !options.allowNonHtml &&
          contentType &&
          !/text\/html|application\/xhtml\+xml/i.test(contentType)
        ) {
          throw new Error(`Expected HTML response but received ${contentType}`);
        }

        if (data.encoding === "base64") {
          throw new Error("Browserbase returned base64 content; expected HTML");
        }

        if (typeof data.content !== "string") {
          throw new TypeError("Browserbase returned an empty response");
        }

        emitDebug(options.onDebug, {
          attempt,
          message: `Browserbase fetched ${safeUrl}`,
          metadata: {
            contentType,
            proxies: options.proxies ?? false,
            status: statusCode,
          },
          type: "fetch:success",
          url: safeUrl,
        });
        return {
          html: data.content,
          metadata: {
            contentType,
            fetcher: "browserbase",
            proxies: options.proxies ?? false,
            status: statusCode,
            timeoutMs,
          },
        };
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          if (attempt <= retryCount) {
            emitDebug(options.onDebug, {
              attempt,
              error: error.message,
              message: `Browserbase timed out for ${safeUrl}`,
              type: "fetch:retry",
              url: safeUrl,
            });
            await sleep(retryDelayMs * attempt);
            continue;
          }

          throw new Error(`Browserbase timed out after ${timeoutMs}ms`, { cause: error });
        }

        if (attempt <= retryCount && isRetryableRequestError(error)) {
          emitDebug(options.onDebug, {
            attempt,
            error: error instanceof Error ? error.message : String(error),
            message: `Browserbase request failed for ${safeUrl}`,
            type: "fetch:retry",
            url: safeUrl,
          });
          await sleep(retryDelayMs * attempt);
          continue;
        }

        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    }

    throw new Error(`Browserbase failed for ${safeUrl}`);
  };
}
