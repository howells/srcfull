import { executeScrapeWebpage } from '../tools/scrape-webpage';
import { executeExtractImageElements } from '../tools/extract-image-elements';
import { executeMatchKnownPatterns } from '../tools/match-known-patterns';
import { loadPatterns } from '../utils/patterns';
import type { ImageCandidate } from '../tools/types';

/**
 * Validates that a URL returns a valid image response
 */
async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/*',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return false;

    const contentType = response.headers.get('content-type');
    const isImage = contentType?.startsWith('image/') || false;

    const contentLength = response.headers.get('content-length');
    const isTooSmall = contentLength && parseInt(contentLength) < 1000;

    return isImage && !isTooSmall;
  } catch {
    return false;
  }
}

/**
 * Generates candidate clean URLs for an image
 */
function generateCleanCandidates(url: string, srcset?: string[]): string[] {
  const candidates: string[] = [];

  // Strategy 1: Try largest srcset variant (usually last)
  if (srcset && srcset.length > 0) {
    candidates.push(srcset[srcset.length - 1]);
  }

  // Strategy 2: Strip common resizing query parameters
  try {
    const urlObj = new URL(url);
    const resizingParams = [
      'w', 'h', 'width', 'height', 'resize', 'size',
      'quality', 'q', 'fit', 'crop', 'auto', 'fm',
      'format', 'dpr', 'scale', 'blur', 'sharp',
    ];

    let hadParams = false;
    resizingParams.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.delete(param);
        hadParams = true;
      }
    });

    if (hadParams) {
      candidates.push(urlObj.toString());
    }
  } catch {
    // Invalid URL, skip
  }

  // Strategy 3: Remove all query parameters
  const noQueryUrl = url.split('?')[0];
  if (noQueryUrl !== url && !candidates.includes(noQueryUrl)) {
    candidates.push(noQueryUrl);
  }

  // Strategy 4: Remove size suffixes from filename
  const sizePatterns = [
    /-\d+x\d+(\.\w+)$/,
    /_\d+x\d+(\.\w+)$/,
    /-(?:small|medium|large|thumb|thumbnail)(\.\w+)$/i,
  ];

  for (const pattern of sizePatterns) {
    const match = url.match(pattern);
    if (match) {
      const cleaned = url.replace(pattern, match[1]);
      if (!candidates.includes(cleaned)) {
        candidates.push(cleaned);
      }
    }
  }

  // Always include original as fallback
  if (!candidates.includes(url)) {
    candidates.push(url);
  }

  return candidates;
}

/**
 * Processes a single image candidate and returns the best clean URL
 */
async function processCandidate(candidate: ImageCandidate): Promise<string | null> {
  // Step 1: Try pattern matching first
  const patternResult = await executeMatchKnownPatterns(candidate.url);
  if (patternResult.success && patternResult.data) {
    const isValid = await validateImageUrl(patternResult.data);
    if (isValid) {
      return patternResult.data;
    }
  }

  // Step 2: Generate and try candidate URLs
  const candidates = generateCleanCandidates(candidate.url, candidate.srcset);

  for (const candidateUrl of candidates) {
    const isValid = await validateImageUrl(candidateUrl);
    if (isValid) {
      return candidateUrl;
    }
  }

  // Step 3: Try original URL as last resort
  const originalValid = await validateImageUrl(candidate.url);
  if (originalValid) {
    return candidate.url;
  }

  return null;
}

/**
 * Main extraction function - does the full pipeline server-side
 */
export async function extractImagesFromUrl(url: string): Promise<{
  success: boolean;
  images?: string[];
  error?: string;
}> {
  // Step 1: Scrape the webpage
  const scrapeResult = await executeScrapeWebpage(url);

  if (!scrapeResult.success || !scrapeResult.data) {
    return {
      success: false,
      error: scrapeResult.error || 'Failed to scrape webpage',
    };
  }

  // Step 2: Extract image elements from HTML
  const extractResult = await executeExtractImageElements(scrapeResult.data);

  if (!extractResult.success || !extractResult.data) {
    return {
      success: false,
      error: extractResult.error || 'Failed to extract images',
    };
  }

  const allCandidates = extractResult.data;

  // Step 3: Filter to "main" images
  const MIN_SIZE = 200;
  const MAX_LOGO_SIZE = 150;

  const logoPatterns = [
    /logo/i, /icon/i, /favicon/i, /badge/i, /sprite/i,
    /thumbnail/i, /avatar/i, /profile-pic/i, /social/i,
    /share/i, /button/i, /arrow/i, /chevron/i,
  ];

  const mainCandidates = allCandidates.filter(candidate => {
    // Filter out logo-like URLs
    if (logoPatterns.some(pattern => pattern.test(candidate.url))) {
      return false;
    }

    // Check dimensions if available
    if (candidate.width || candidate.height) {
      const maxDim = Math.max(candidate.width || 0, candidate.height || 0);
      if (maxDim < MAX_LOGO_SIZE) return false;
      return maxDim >= MIN_SIZE;
    }

    // Include if has srcset (likely main image)
    if (candidate.srcset && candidate.srcset.length > 0) {
      return true;
    }

    // Include background images
    if (candidate.source === 'background') {
      return true;
    }

    return true;
  });

  // Sort by size (largest first)
  mainCandidates.sort((a, b) => {
    const sizeA = Math.max(a.width || 0, a.height || 0);
    const sizeB = Math.max(b.width || 0, b.height || 0);
    return sizeB - sizeA;
  });

  // Limit to reasonable number
  const toProcess = mainCandidates.slice(0, 20);

  console.log(`Processing ${toProcess.length} of ${mainCandidates.length} main candidates`);

  // Step 4: Process candidates in parallel (with concurrency limit)
  const CONCURRENCY = 5;
  const validatedUrls: string[] = [];

  for (let i = 0; i < toProcess.length; i += CONCURRENCY) {
    const batch = toProcess.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(candidate => processCandidate(candidate))
    );

    for (const result of results) {
      if (result && !validatedUrls.includes(result)) {
        validatedUrls.push(result);
      }
    }
  }

  console.log(`Validated ${validatedUrls.length} images`);

  return {
    success: true,
    images: validatedUrls,
  };
}
