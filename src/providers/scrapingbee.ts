import { ScrapingBeeClient } from "scrapingbee";
import { emitDebug } from "../debug";
import { sleep } from "../retry";
import type { DebugLogger, HtmlFetcher } from "../types";
import {
  validatePublicUrl,
  validatePublicUrlForServer,
} from "../url-validator";

export type ScrapingBeeFetcherOptions = {
  apiKey: string;
  renderJs?: boolean;
  waitMs?: number;
  fallbackToStealth?: boolean;
  timeoutMs?: number;
  retryCount?: number;
  retryDelayMs?: number;
  validateResolvedIp?: boolean;
  onDebug?: DebugLogger;
};

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRY_COUNT = 1;
const DEFAULT_RETRY_DELAY_MS = 500;

function normalizeApiKey(apiKey: string): string {
  const normalized = apiKey.trim();
  if (normalized.length === 0) {
    throw new Error("ScrapingBee API key is required");
  }

  return normalized;
}

function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([operation, timeoutPromise]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
}

async function scrapeWithParams(
  client: ScrapingBeeClient,
  url: string,
  renderJs: boolean,
  waitMs: number,
  extraParams: Record<string, unknown> = {},
) {
  const response = await client.get({
    url,
    params: {
      render_js: renderJs,
      wait: waitMs,
      block_resources: false,
      ...extraParams,
    },
  });

  const html = response.data.toString();
  if (!html) {
    throw new Error("Received empty response from ScrapingBee");
  }

  return html;
}

export function createScrapingBeeHtmlFetcher(
  options: ScrapingBeeFetcherOptions,
): HtmlFetcher {
  const apiKey = normalizeApiKey(options.apiKey);
  const client = new ScrapingBeeClient(apiKey);
  const renderJs = options.renderJs ?? true;
  const waitMs = Math.max(0, Math.floor(options.waitMs ?? 5_000));
  const fallbackToStealth = options.fallbackToStealth ?? true;
  const timeoutMs = Math.max(
    1,
    Math.floor(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
  );
  const retryCount = Math.max(
    0,
    Math.floor(options.retryCount ?? DEFAULT_RETRY_COUNT),
  );
  const retryDelayMs = Math.max(
    0,
    Math.floor(options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS),
  );

  return async (url) => {
    const validation = options.validateResolvedIp
      ? await validatePublicUrlForServer(url)
      : validatePublicUrl(url);
    if (!validation.valid || !validation.url) {
      throw new Error(validation.error ?? "Invalid page URL");
    }

    const safeUrl = validation.url.href;
    const domain = validation.url.hostname;

    async function runAttempt(
      usedStealthProxy: boolean,
      extraParams: Record<string, unknown> = {},
    ): Promise<Awaited<ReturnType<HtmlFetcher>>> {
      for (let attempt = 1; attempt <= retryCount + 1; attempt += 1) {
        try {
          const html = await withTimeout(
            scrapeWithParams(client, safeUrl, renderJs, waitMs, extraParams),
            timeoutMs,
            `ScrapingBee timed out after ${timeoutMs}ms`,
          );

          emitDebug(options.onDebug, {
            type: "fetch:success",
            message: `ScrapingBee fetched ${safeUrl}`,
            url: safeUrl,
            attempt,
            metadata: {
              usedStealthProxy,
            },
          });
          return {
            html,
            metadata: {
              fetcher: "scrapingbee",
              domain,
              usedStealthProxy,
              timeoutMs,
            },
          };
        } catch (error) {
          if (attempt > retryCount) {
            throw error;
          }

          emitDebug(options.onDebug, {
            type: "fetch:retry",
            message: `ScrapingBee request failed for ${safeUrl}`,
            url: safeUrl,
            attempt,
            error: error instanceof Error ? error.message : String(error),
            metadata: {
              usedStealthProxy,
            },
          });
          await sleep(retryDelayMs * attempt);
        }
      }

      throw new Error(`ScrapingBee failed for ${safeUrl}`);
    }

    try {
      return await runAttempt(false);
    } catch (error) {
      if (!fallbackToStealth) {
        throw error;
      }

      emitDebug(options.onDebug, {
        type: "fetch:fallback",
        message: `Retrying ${safeUrl} with ScrapingBee stealth proxy`,
        url: safeUrl,
        error: error instanceof Error ? error.message : String(error),
      });
      return runAttempt(true, {
        stealth_proxy: true,
      });
    }
  };
}
