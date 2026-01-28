import { NextResponse } from "next/server";
import { z } from "zod";
import { logUsage, validateApiKey } from "@/lib/api-auth";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { type ResolveResult, resolve } from "@/lib/resolver";
import { extractImageElementsEnhanced } from "@/lib/tools/extract-image-elements";
import { scrapeWithFirecrawl } from "@/lib/tools/scrape-firecrawl";
import { executeScrapeWebpage } from "@/lib/tools/scrape-webpage";
import { validateUrl } from "@/lib/url-validator";

// Get file size via HEAD request
async function getImageSize(url: string): Promise<number | null> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentLength = response.headers.get("content-length");
    return contentLength ? parseInt(contentLength, 10) : null;
  } catch {
    return null;
  }
}

type ScrapedImage = {
  original: string;
  resolved: string;
  originalSize: number | null;
  resolvedSize: number | null;
  sizeIncrease: string | null;
  alt: string | null;
  method: ResolveResult["method"];
};

const ScrapeRequestSchema = z.object({
  url: z.string().url(),
  maxImages: z.number().int().min(1).max(200).optional(),
});

const MIN_SIZE = 200;
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

export async function POST(request: Request) {
  const startTime = Date.now();

  // Validate API key
  const apiKey = await validateApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Invalid or missing API key" },
      },
      { status: 401 }
    );
  }

  // Check rate limit (100 requests per minute per API key)
  const rateLimit = checkRateLimit(`api:${apiKey.id}`, 100, 60_000);
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "RATE_LIMITED", message: "Too many requests" },
      },
      { status: 429, headers: rateLimitHeaders(rateLimit) }
    );
  }

  try {
    const body = await request.json();
    const { url, maxImages } = ScrapeRequestSchema.parse(body);

    // SSRF protection - validate URL before scraping
    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      const response = NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_URL", message: urlValidation.error },
        },
        { status: 400 }
      );
      await logUsage(apiKey.id, "/v1/scrape", 400, Date.now() - startTime);
      return response;
    }

    // Scrape the page
    const scrapeResult = await executeScrapeWebpage(url);
    const scrapeMetadata = scrapeResult.metadata;
    let usedFirecrawl = false;

    let candidates: {
      url: string;
      alt?: string | null;
      width?: number | null;
      height?: number | null;
    }[] = [];

    // Extract source domain for raw image filtering
    const sourceDomain = new URL(url).hostname.replace(/^www\./, "");

    if (scrapeResult.success && scrapeResult.data) {
      // Extract image elements from HTML (includes raw extraction for aria-hidden content)
      // sortBySize: true makes HEAD requests to get actual file sizes and sorts largest first
      const extractResult = await extractImageElementsEnhanced(
        scrapeResult.data,
        {
          includeRaw: true,
          sourceDomain,
          sortBySize: true,
        }
      );
      if (extractResult.success && extractResult.data) {
        // Filter to main images
        candidates = extractResult.data.filter((img) => {
          // Skip data URIs - they're inline images, not actual URLs
          if (img.url.startsWith("data:")) {
            return false;
          }
          if (LOGO_PATTERNS.some((p) => p.test(img.url))) {
            return false;
          }
          if (img.width && img.width < MIN_SIZE) {
            return false;
          }
          if (img.height && img.height < MIN_SIZE) {
            return false;
          }
          return true;
        });
      }
    }

    // Fallback to Firecrawl if ScrapingBee failed or found no images
    if (candidates.length === 0) {
      console.log(
        `ScrapingBee returned no images for ${url}, trying Firecrawl`
      );
      const firecrawlResult = await scrapeWithFirecrawl(url);
      if (firecrawlResult.success && firecrawlResult.images) {
        usedFirecrawl = true;
        candidates = firecrawlResult.images;
      }
    }

    // If still no images, return error
    if (candidates.length === 0) {
      const response = NextResponse.json(
        {
          success: false,
          error: { code: "SCRAPE_FAILED", message: "Failed to extract images" },
        },
        { status: 502 }
      );
      await logUsage(apiKey.id, "/v1/scrape", 502, Date.now() - startTime, {
        usedStealthProxy: scrapeMetadata?.usedStealthProxy,
        targetDomain: scrapeMetadata?.domain,
      });
      return response;
    }

    // Resolve each image
    const toResolve = candidates.slice(0, maxImages ?? 20);
    const CONCURRENCY = 5;
    const results: ScrapedImage[] = [];
    let resolved = 0;
    let failed = 0;

    for (let i = 0; i < toResolve.length; i += CONCURRENCY) {
      const batch = toResolve.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(
        batch.map(async (img) => {
          try {
            const result = await resolve(img.url);
            if (result.method !== "fallback") {
              resolved += 1;
            }
            // Get file size for the resolved image
            const resolvedSize = await getImageSize(result.resolved);
            const image: ScrapedImage = {
              original: result.original,
              resolved: result.resolved,
              originalSize: null,
              resolvedSize,
              sizeIncrease: result.sizeIncrease ?? null,
              alt: img.alt ?? null,
              method: result.method,
            };
            return image;
          } catch {
            failed += 1;
            return null;
          }
        })
      );
      results.push(
        ...batchResults.filter((value): value is ScrapedImage => value !== null)
      );
    }

    // Sort by file size descending (largest/highest quality first)
    results.sort((a, b) => {
      const sizeA = a.resolvedSize ?? 0;
      const sizeB = b.resolvedSize ?? 0;
      return sizeB - sizeA;
    });

    const response = NextResponse.json({
      success: true,
      url,
      images: results,
      stats: {
        found: candidates.length,
        resolved,
        failed,
        durationMs: Date.now() - startTime,
        scraper: usedFirecrawl ? "fc" : "b",
      },
    });

    await logUsage(apiKey.id, "/v1/scrape", 200, Date.now() - startTime, {
      usedStealthProxy: scrapeMetadata?.usedStealthProxy,
      targetDomain: scrapeMetadata?.domain,
      usedFirecrawl,
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_URL",
            message: "The provided URL is not valid",
          },
        },
        { status: 400 }
      );
      await logUsage(apiKey.id, "/v1/scrape", 400, Date.now() - startTime);
      return response;
    }

    console.error("Scrape error:", error);
    const response = NextResponse.json(
      {
        success: false,
        error: { code: "SCRAPE_FAILED", message: "Failed to scrape page" },
      },
      { status: 500 }
    );
    await logUsage(apiKey.id, "/v1/scrape", 500, Date.now() - startTime);
    return response;
  }
}
