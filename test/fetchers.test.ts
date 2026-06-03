import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createBrowserbaseFetchHtmlFetcher } from "../src/providers/browserbase";
import { createFirecrawlImageFallback } from "../src/providers/firecrawl";
import { createKernelHtmlFetcher } from "../src/providers/kernel";
import { createScrapingBeeHtmlFetcher } from "../src/providers/scrapingbee";
import { createDefaultHtmlFetcher } from "../src/scrape";

describe("createDefaultHtmlFetcher", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("rejects non-html responses by default", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("{}", {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      }),
    );

    const fetchHtml = createDefaultHtmlFetcher();

    await expect(fetchHtml("https://example.com/data")).rejects.toThrow(
      "Expected HTML response but received application/json",
    );
  });

  it("retries transient HTML fetch failures", async () => {
    const onDebug = vi.fn();
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response("", {
          status: 503,
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        }),
      )
      .mockResolvedValueOnce(
        new Response("<html>ok</html>", {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        }),
      );

    const fetchHtml = createDefaultHtmlFetcher({
      onDebug,
      retryDelayMs: 0,
    });

    const result = await fetchHtml("https://example.com/page");

    expect(result.html).toContain("ok");
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
    expect(onDebug).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "fetch:retry",
        status: 503,
      }),
    );
  });
});

describe("provider guards", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("rejects blank ScrapingBee API keys at creation time", () => {
    expect(() =>
      createScrapingBeeHtmlFetcher({
        apiKey: "   ",
      }),
    ).toThrow("ScrapingBee API key is required");
  });

  it("rejects blank Firecrawl API keys at creation time", () => {
    expect(() => createFirecrawlImageFallback("   ")).toThrow(
      "Firecrawl API key is required",
    );
  });

  it("rejects blank Browserbase API keys at creation time", () => {
    expect(() =>
      createBrowserbaseFetchHtmlFetcher({
        apiKey: "   ",
      }),
    ).toThrow("Browserbase API key is required");
  });

  it("rejects blank Kernel API keys at creation time", () => {
    expect(() =>
      createKernelHtmlFetcher({
        apiKey: "   ",
      }),
    ).toThrow("Kernel API key is required");
  });

  it("rejects private URLs before calling Firecrawl", async () => {
    const fallback = createFirecrawlImageFallback("firecrawl-key");

    await expect(fallback("http://127.0.0.1/private")).rejects.toThrow(
      "This hostname is not allowed",
    );
  });

  it("fetches HTML through Browserbase Fetch API", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          statusCode: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
          content: "<html>browserbase</html>",
          contentType: "text/html; charset=utf-8",
          encoding: "utf-8",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    const fetchHtml = createBrowserbaseFetchHtmlFetcher({
      apiKey: "browserbase-key",
      proxies: true,
    });

    const result = await fetchHtml("https://example.com/page");
    const request = vi.mocked(fetch).mock.calls[0];

    expect(result.html).toContain("browserbase");
    expect(request?.[0]).toBe("https://api.browserbase.com/v1/fetch");
    expect(request?.[1]).toMatchObject({
      method: "POST",
      headers: {
        "X-BB-API-Key": "browserbase-key",
      },
    });
    expect(JSON.parse(String(request?.[1]?.body))).toMatchObject({
      url: "https://example.com/page",
      proxies: true,
    });
  });

  it("rejects private URLs before calling Browserbase", async () => {
    const fetchHtml = createBrowserbaseFetchHtmlFetcher({
      apiKey: "browserbase-key",
    });

    await expect(fetchHtml("http://127.0.0.1/private")).rejects.toThrow(
      "This hostname is not allowed",
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("renders HTML through Kernel and deletes the browser session", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            session_id: "browser-123",
            browser_live_view_url: "https://kernel.example/live",
          }),
          {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            result: {
              html: "<html>kernel</html>",
              status: 200,
              contentType: "text/html; charset=utf-8",
              finalUrl: "https://example.com/page",
            },
          }),
          {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          },
        ),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }));

    const fetchHtml = createKernelHtmlFetcher({
      apiKey: "kernel-key",
      stealth: true,
      waitMs: 250,
    });

    const result = await fetchHtml("https://example.com/page");
    const calls = vi.mocked(fetch).mock.calls;

    expect(result.html).toContain("kernel");
    expect(calls[0]?.[0]).toBe("https://api.onkernel.com/browsers");
    expect(JSON.parse(String(calls[0]?.[1]?.body))).toMatchObject({
      headless: true,
      stealth: true,
    });
    expect(calls[1]?.[0]).toBe(
      "https://api.onkernel.com/browsers/browser-123/playwright/execute",
    );
    expect(JSON.parse(String(calls[1]?.[1]?.body)).code).toContain("page.goto");
    expect(calls[2]?.[0]).toBe("https://api.onkernel.com/browsers/browser-123");
    expect(calls[2]?.[1]).toMatchObject({
      method: "DELETE",
    });
  });

  it("rejects private URLs before calling Kernel", async () => {
    const fetchHtml = createKernelHtmlFetcher({
      apiKey: "kernel-key",
    });

    await expect(fetchHtml("http://127.0.0.1/private")).rejects.toThrow(
      "This hostname is not allowed",
    );
    expect(fetch).not.toHaveBeenCalled();
  });
});
