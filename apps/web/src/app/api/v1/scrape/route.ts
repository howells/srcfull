import { NextResponse } from 'next/server';
import { z } from 'zod';
import { executeScrapeWebpage } from '@/lib/tools/scrape-webpage';
import { executeExtractImageElements } from '@/lib/tools/extract-image-elements';
import { resolve } from '@/lib/resolver';
import { validateApiKey, logUsage } from '@/lib/api-auth';

const ScrapeRequestSchema = z.object({
  url: z.string().url(),
});

const MIN_SIZE = 200;
const LOGO_PATTERNS = [
  /logo/i, /icon/i, /favicon/i, /badge/i, /sprite/i,
  /thumbnail/i, /avatar/i, /social/i, /button/i,
];

export async function POST(request: Request) {
  const startTime = Date.now();

  // Validate API key
  const apiKey = await validateApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or missing API key' } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { url } = ScrapeRequestSchema.parse(body);

    // Scrape the page
    const scrapeResult = await executeScrapeWebpage(url);
    if (!scrapeResult.success || !scrapeResult.data) {
      const response = NextResponse.json(
        { success: false, error: { code: 'SCRAPE_FAILED', message: 'Failed to fetch page' } },
        { status: 502 }
      );
      await logUsage(apiKey.id, '/v1/scrape', 502, Date.now() - startTime);
      return response;
    }

    // Extract image elements
    const extractResult = await executeExtractImageElements(scrapeResult.data);
    if (!extractResult.success || !extractResult.data) {
      const response = NextResponse.json(
        { success: false, error: { code: 'SCRAPE_FAILED', message: 'Failed to extract images' } },
        { status: 502 }
      );
      await logUsage(apiKey.id, '/v1/scrape', 502, Date.now() - startTime);
      return response;
    }

    // Filter to main images
    const candidates = extractResult.data.filter(img => {
      if (LOGO_PATTERNS.some(p => p.test(img.url))) return false;
      if (img.width && img.width < MIN_SIZE) return false;
      if (img.height && img.height < MIN_SIZE) return false;
      return true;
    });

    // Resolve each image
    const toResolve = candidates.slice(0, 20);
    const CONCURRENCY = 5;
    const results = [];
    let resolved = 0;
    let failed = 0;

    for (let i = 0; i < toResolve.length; i += CONCURRENCY) {
      const batch = toResolve.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(
        batch.map(async (img) => {
          try {
            const result = await resolve(img.url);
            if (result.method !== 'fallback') resolved++;
            return {
              original: result.original,
              resolved: result.resolved,
              originalSize: null,
              resolvedSize: null,
              sizeIncrease: result.sizeIncrease ?? null,
              alt: img.alt ?? null,
              method: result.method,
            };
          } catch {
            failed++;
            return null;
          }
        })
      );
      results.push(...batchResults.filter(Boolean));
    }

    const response = NextResponse.json({
      success: true,
      url,
      images: results,
      stats: {
        found: extractResult.data.length,
        resolved,
        failed,
        durationMs: Date.now() - startTime,
      },
    });

    await logUsage(apiKey.id, '/v1/scrape', 200, Date.now() - startTime);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json(
        { success: false, error: { code: 'INVALID_URL', message: 'The provided URL is not valid' } },
        { status: 400 }
      );
      await logUsage(apiKey.id, '/v1/scrape', 400, Date.now() - startTime);
      return response;
    }

    console.error('Scrape error:', error);
    const response = NextResponse.json(
      { success: false, error: { code: 'SCRAPE_FAILED', message: 'Failed to scrape page' } },
      { status: 500 }
    );
    await logUsage(apiKey.id, '/v1/scrape', 500, Date.now() - startTime);
    return response;
  }
}
