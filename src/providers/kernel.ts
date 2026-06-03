import { emitDebug } from "../debug";
import { isRetryableRequestError, shouldRetryStatus, sleep } from "../retry";
import type { DebugLogger, HtmlFetcher } from "../types";
import {
  validatePublicUrl,
  validatePublicUrlForServer,
} from "../url-validator";

export type KernelViewport = {
  width: number;
  height: number;
  refreshRate?: number;
};

export type KernelHtmlFetcherOptions = {
  apiKey: string;
  apiUrl?: string;
  headless?: boolean;
  stealth?: boolean;
  proxyId?: string;
  profile?: { id: string } | { name: string };
  persistence?: { id: string };
  viewport?: KernelViewport;
  waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
  waitMs?: number;
  allowNonHtml?: boolean;
  timeoutMs?: number;
  executionTimeoutSec?: number;
  browserTimeoutSec?: number;
  retryCount?: number;
  retryDelayMs?: number;
  validateResolvedIp?: boolean;
  onDebug?: DebugLogger;
};

type KernelBrowserSession = {
  session_id?: string;
  browser_live_view_url?: string;
};

type KernelExecuteResponse = {
  success?: boolean;
  result?: unknown;
  error?: string;
  stderr?: string;
};

type KernelHtmlResult = {
  html?: string;
  status?: number | null;
  contentType?: string;
  finalUrl?: string;
};

const DEFAULT_API_URL = "https://api.onkernel.com";
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRY_COUNT = 1;
const DEFAULT_RETRY_DELAY_MS = 500;

function normalizeApiKey(apiKey: string): string {
  const normalized = apiKey.trim();
  if (normalized.length === 0) {
    throw new Error("Kernel API key is required");
  }

  return normalized;
}

function createAbortController(timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, "")}${path}`;
}

function kernelHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

async function parseJsonResponse<T>(
  response: Response,
  service: string,
): Promise<T> {
  const data = (await response.json().catch(() => null)) as
    | (T & { message?: string; error?: string })
    | null;

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || `${service} returned ${response.status}`,
    );
  }

  if (!data || typeof data !== "object") {
    throw new Error(`${service} returned an empty response`);
  }

  return data;
}

function createPlaywrightCode(
  url: string,
  options: {
    waitUntil: NonNullable<KernelHtmlFetcherOptions["waitUntil"]>;
    waitMs: number;
    timeoutMs: number;
  },
): string {
  return `
const response = await page.goto(${JSON.stringify(url)}, {
  waitUntil: ${JSON.stringify(options.waitUntil)},
  timeout: ${options.timeoutMs},
});
if (${options.waitMs} > 0) {
  await page.waitForTimeout(${options.waitMs});
}
return {
  html: await page.content(),
  status: response ? response.status() : null,
  contentType: response ? (response.headers()["content-type"] || "") : "",
  finalUrl: page.url(),
};
`;
}

function isKernelHtmlResult(value: unknown): value is KernelHtmlResult {
  return Boolean(value && typeof value === "object" && "html" in value);
}

export function createKernelHtmlFetcher(
  options: KernelHtmlFetcherOptions,
): HtmlFetcher {
  const apiKey = normalizeApiKey(options.apiKey);
  const apiUrl = options.apiUrl?.trim() || DEFAULT_API_URL;
  const timeoutMs = Math.max(
    1,
    Math.floor(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
  );
  const waitMs = Math.max(0, Math.floor(options.waitMs ?? 0));
  const retryCount = Math.max(
    0,
    Math.floor(options.retryCount ?? DEFAULT_RETRY_COUNT),
  );
  const retryDelayMs = Math.max(
    0,
    Math.floor(options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS),
  );
  const executionTimeoutSec = Math.max(
    1,
    Math.min(300, Math.ceil(options.executionTimeoutSec ?? timeoutMs / 1000)),
  );
  const browserTimeoutSec = Math.max(
    10,
    Math.floor(options.browserTimeoutSec ?? executionTimeoutSec + 10),
  );
  const waitUntil = options.waitUntil ?? "domcontentloaded";

  return async (url) => {
    const validation = options.validateResolvedIp
      ? await validatePublicUrlForServer(url)
      : validatePublicUrl(url);
    if (!validation.valid || !validation.url) {
      throw new Error(validation.error ?? "Invalid page URL");
    }

    const safeUrl = validation.url.href;

    for (let attempt = 1; attempt <= retryCount + 1; attempt += 1) {
      let sessionId: string | undefined;

      try {
        const { controller: createController, timeoutId: createTimeoutId } =
          createAbortController(timeoutMs);
        const createResponse = await fetch(joinUrl(apiUrl, "/browsers"), {
          method: "POST",
          headers: kernelHeaders(apiKey),
          body: JSON.stringify({
            headless: options.headless ?? true,
            stealth: options.stealth ?? false,
            timeout_seconds: browserTimeoutSec,
            ...(options.proxyId ? { proxy_id: options.proxyId } : {}),
            ...(options.profile ? { profile: options.profile } : {}),
            ...(options.persistence
              ? { persistence: options.persistence }
              : {}),
            ...(options.viewport
              ? {
                  viewport: {
                    width: options.viewport.width,
                    height: options.viewport.height,
                    ...(options.viewport.refreshRate
                      ? { refresh_rate: options.viewport.refreshRate }
                      : {}),
                  },
                }
              : {}),
          }),
          signal: createController.signal,
        }).finally(() => {
          clearTimeout(createTimeoutId);
        });
        const session = await parseJsonResponse<KernelBrowserSession>(
          createResponse,
          "Kernel",
        );

        if (!session.session_id) {
          throw new Error("Kernel did not return a browser session ID");
        }
        sessionId = session.session_id;

        const { controller: executeController, timeoutId: executeTimeoutId } =
          createAbortController(timeoutMs + waitMs);
        const executeResponse = await fetch(
          joinUrl(
            apiUrl,
            `/browsers/${encodeURIComponent(sessionId)}/playwright/execute`,
          ),
          {
            method: "POST",
            headers: kernelHeaders(apiKey),
            body: JSON.stringify({
              code: createPlaywrightCode(safeUrl, {
                waitUntil,
                waitMs,
                timeoutMs,
              }),
              timeout_sec: executionTimeoutSec,
            }),
            signal: executeController.signal,
          },
        ).finally(() => {
          clearTimeout(executeTimeoutId);
        });
        const executed = await parseJsonResponse<KernelExecuteResponse>(
          executeResponse,
          "Kernel",
        );

        if (!executed.success) {
          throw new Error(
            executed.error ||
              executed.stderr ||
              "Kernel browser execution failed",
          );
        }

        if (!isKernelHtmlResult(executed.result)) {
          throw new Error("Kernel did not return rendered HTML");
        }

        const result = executed.result;
        const status = result.status ?? undefined;
        if (status && attempt <= retryCount && shouldRetryStatus(status)) {
          emitDebug(options.onDebug, {
            type: "fetch:retry",
            message: `Kernel target returned ${status} for ${safeUrl}`,
            url: safeUrl,
            status,
            attempt,
          });
          await sleep(retryDelayMs * attempt);
          continue;
        }

        if (status && status >= 400) {
          throw new Error(`Kernel target returned ${status}`);
        }

        const contentType = result.contentType ?? "";
        if (
          !options.allowNonHtml &&
          contentType &&
          !/text\/html|application\/xhtml\+xml/i.test(contentType)
        ) {
          throw new Error(`Expected HTML response but received ${contentType}`);
        }

        if (typeof result.html !== "string" || result.html.length === 0) {
          throw new Error("Kernel returned empty rendered HTML");
        }

        emitDebug(options.onDebug, {
          type: "fetch:success",
          message: `Kernel rendered ${safeUrl}`,
          url: safeUrl,
          attempt,
          metadata: {
            status,
            contentType,
            sessionId,
            liveViewUrl: session.browser_live_view_url,
          },
        });
        return {
          html: result.html,
          metadata: {
            fetcher: "kernel",
            status,
            contentType,
            finalUrl: result.finalUrl,
            sessionId,
            liveViewUrl: session.browser_live_view_url,
            timeoutMs,
          },
        };
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          if (attempt <= retryCount) {
            emitDebug(options.onDebug, {
              type: "fetch:retry",
              message: `Kernel timed out for ${safeUrl}`,
              url: safeUrl,
              attempt,
              error: error.message,
            });
            await sleep(retryDelayMs * attempt);
            continue;
          }

          throw new Error(`Kernel timed out after ${timeoutMs}ms`);
        }

        if (attempt <= retryCount && isRetryableRequestError(error)) {
          emitDebug(options.onDebug, {
            type: "fetch:retry",
            message: `Kernel request failed for ${safeUrl}`,
            url: safeUrl,
            attempt,
            error: error instanceof Error ? error.message : String(error),
          });
          await sleep(retryDelayMs * attempt);
          continue;
        }

        throw error;
      } finally {
        if (sessionId) {
          const { controller, timeoutId } = createAbortController(timeoutMs);
          await fetch(
            joinUrl(apiUrl, `/browsers/${encodeURIComponent(sessionId)}`),
            {
              method: "DELETE",
              headers: kernelHeaders(apiKey),
              signal: controller.signal,
            },
          )
            .catch((error) => {
              emitDebug(options.onDebug, {
                type: "fetch:cleanup_failed",
                message: `Failed to delete Kernel browser ${sessionId}`,
                url: safeUrl,
                error: error instanceof Error ? error.message : String(error),
              });
            })
            .finally(() => {
              clearTimeout(timeoutId);
            });
        }
      }
    }

    throw new Error(`Kernel failed for ${safeUrl}`);
  };
}
