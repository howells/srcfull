// apps/web/src/app/api/scrape/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { type ResolveResult, resolve } from "@/lib/resolver";
import { requireSession } from "@/lib/session";
import { executeExtractImageElements } from "@/lib/tools/extract-image-elements";
import { executeScrapeWebpage } from "@/lib/tools/scrape-webpage";

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
  try {
    const user = await requireSession();
    if (user.plan !== "pro") {
      return NextResponse.json(
        { error: "Subscription required", code: "PAYMENT_REQUIRED" },
        { status: 402 }
      );
    }

    const body = await request.json();
    const { url, maxImages } = ScrapeRequestSchema.parse(body);

    // Scrape the page
    const scrapeResult = await executeScrapeWebpage(url);
    if (!(scrapeResult.success && scrapeResult.data)) {
      return NextResponse.json(
        { error: "Failed to fetch page", code: "FETCH_FAILED" },
        { status: 500 }
      );
    }

    // Extract image elements
    const extractResult = await executeExtractImageElements(scrapeResult.data);
    if (!(extractResult.success && extractResult.data)) {
      return NextResponse.json(
        { error: "Failed to extract images", code: "EXTRACT_FAILED" },
        { status: 500 }
      );
    }

    // Filter to main images (skip logos, small images)
    const candidates = extractResult.data.filter((img) => {
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

    if (candidates.length === 0) {
      return NextResponse.json(
        { error: "No images found", code: "NO_IMAGES" },
        { status: 404 }
      );
    }

    // Resolve each image (limit to 20, with concurrency control)
    const toResolve = candidates.slice(0, maxImages ?? 20);
    const CONCURRENCY = 5;
    const results: ResolveResult[] = [];

    for (let i = 0; i < toResolve.length; i += CONCURRENCY) {
      const batch = toResolve.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(
        batch.map((img) => resolve(img.url))
      );
      results.push(...batchResults);
    }

    return NextResponse.json({
      page: url,
      images: results,
      count: results.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid URL", code: "INVALID_URL" },
        { status: 400 }
      );
    }

    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: "Failed to scrape page", code: "SCRAPE_FAILED" },
      { status: 500 }
    );
  }
}
