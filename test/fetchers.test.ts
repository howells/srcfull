import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createFirecrawlImageFallback } from "../src/providers/firecrawl";
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

  it("rejects private URLs before calling Firecrawl", async () => {
    const fallback = createFirecrawlImageFallback("firecrawl-key");

    await expect(fallback("http://127.0.0.1/private")).rejects.toThrow(
      "This hostname is not allowed",
    );
  });
});
