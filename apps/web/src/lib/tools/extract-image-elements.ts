import { load } from "cheerio";
import { validateImageUrl } from "../validator";

const BACKGROUND_IMAGE_REGEX =
  /background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/;

/** Regex to find image URLs in raw HTML (catches aria-hidden, carousel, gallery images) */
const IMAGE_URL_REGEX =
  /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|webp|gif)(?:\?[^\s"'<>]*)?/gi;

/** CDN patterns that indicate legitimate product images */
const CDN_PATTERNS = [
  /amazonaws\.com/,
  /cloudfront\.net/,
  /cloudinary\.com/,
  /imgix\.net/,
  /akamaihd\.net/,
  /fastly\.net/,
  /staticmedia\./,
  /media\..*\.com/,
  /cdn\.shopify\.com/,
  /squarespace-cdn\.com/,
  /ctfassets\.net/,
  /sanity\.io/,
];

/** Patterns that indicate non-product images (icons, social, tracking) */
const EXCLUDED_PATTERNS = [
  /favicon/i,
  /\/icon/i,
  /\/logo/i,
  /tracking/i,
  /pixel/i,
  /1x1/i,
  /social/i,
  /facebook/i,
  /twitter/i,
  /instagram/i,
  /linkedin/i,
  /pinterest/i,
  /youtube/i,
  /flag/i,
  /chat/i,
  /badge/i,
  /avatar/i,
  /emoji/i,
  /spinner/i,
  /loading/i,
];

export type ImageCandidate = {
  url: string;
  source: "img" | "picture" | "background" | "raw";
  width?: number;
  height?: number;
  srcset?: string[];
  alt?: string;
};

export type ToolResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Extract image URLs from raw HTML using regex.
 * This catches images that DOM parsing might miss (aria-hidden, carousels, etc.)
 */
export function extractImageUrlsFromRaw(
  html: string,
  sourceDomain?: string
): string[] {
  const matches = html.match(IMAGE_URL_REGEX) || [];
  const seen = new Set<string>();
  const filtered: string[] = [];

  for (const url of matches) {
    // Normalize URL for deduping (remove query params)
    const baseUrl = url.split("?")[0];
    if (seen.has(baseUrl)) continue;
    seen.add(baseUrl);

    // Skip excluded patterns
    if (EXCLUDED_PATTERNS.some((pattern) => pattern.test(url))) {
      continue;
    }

    // Check if URL is from same domain or known CDN
    const isSameDomain = sourceDomain && url.includes(sourceDomain);
    const isCdn = CDN_PATTERNS.some((pattern) => pattern.test(url));

    if (isSameDomain || isCdn) {
      filtered.push(url);
    }
  }

  return filtered;
}

// Internal function for testing
export function executeExtractImageElements(
  html: string
): ToolResult<ImageCandidate[]> {
  try {
    const $ = load(html);
    const candidates: ImageCandidate[] = [];

    // Extract from <img> tags
    $("img").each((_, el) => {
      const $el = $(el);
      const src = $el.attr("src");
      const srcset = $el.attr("srcset");
      const width = Number.parseInt($el.attr("width") || "0", 10) || undefined;
      const height =
        Number.parseInt($el.attr("height") || "0", 10) || undefined;
      const alt = $el.attr("alt");

      if (src) {
        const srcsetUrls = srcset
          ? srcset.split(",").map((s) => s.trim().split(" ")[0])
          : [];

        candidates.push({
          url: src,
          source: "img",
          width,
          height,
          srcset: srcsetUrls.length > 0 ? srcsetUrls : undefined,
          alt,
        });
      }
    });

    // Extract from <picture> tags
    $("picture source").each((_, el) => {
      const $el = $(el);
      const srcset = $el.attr("srcset");

      if (srcset) {
        const urls = srcset.split(",").map((s) => s.trim().split(" ")[0]);
        for (const url of urls) {
          candidates.push({
            url,
            source: "picture",
            srcset: urls,
          });
        }
      }
    });

    // Extract from CSS background-image
    $('[style*="background-image"]').each((_, el) => {
      const $el = $(el);
      const style = $el.attr("style");
      if (style) {
        const match = style.match(BACKGROUND_IMAGE_REGEX);
        if (match?.[1]) {
          candidates.push({
            url: match[1],
            source: "background",
          });
        }
      }
    });

    // Deduplicate by URL
    const uniqueCandidates = candidates.filter(
      (candidate, index, self) =>
        index === self.findIndex((c) => c.url === candidate.url)
    );

    return {
      success: true,
      data: uniqueCandidates,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to extract images: ${message}`,
    };
  }
}

interface ExtractOptions {
  /** Include images found via raw regex extraction (catches aria-hidden, carousels) */
  includeRaw?: boolean;
  /** Source domain for filtering raw-extracted images */
  sourceDomain?: string;
  /** Sort results by file size (largest first). Requires HEAD requests. */
  sortBySize?: boolean;
}

/**
 * Enhanced image extraction that combines DOM parsing with raw HTML regex.
 * Use includeRaw: true to catch images in aria-hidden elements, carousels, etc.
 * Use sortBySize: true to sort by actual file size (requires HEAD requests).
 */
export async function extractImageElementsEnhanced(
  html: string,
  options: ExtractOptions = {}
): Promise<ToolResult<ImageCandidate[]>> {
  const { includeRaw = false, sourceDomain, sortBySize = false } = options;

  // First, get DOM-parsed candidates
  const domResult = executeExtractImageElements(html);
  if (!domResult.success || !domResult.data) {
    return domResult;
  }

  const candidates = [...domResult.data];
  const seenUrls = new Set(candidates.map((c) => c.url.split("?")[0]));

  // Optionally add raw-extracted images not found by DOM parsing
  if (includeRaw) {
    const rawUrls = extractImageUrlsFromRaw(html, sourceDomain);
    for (const url of rawUrls) {
      const baseUrl = url.split("?")[0];
      if (!seenUrls.has(baseUrl)) {
        candidates.push({
          url,
          source: "raw",
        });
        seenUrls.add(baseUrl);
      }
    }
  }

  // Optionally sort by actual file size (largest first)
  if (sortBySize) {
    // Filter to only valid HTTP URLs (skip data URIs, relative paths)
    const httpCandidates = candidates.filter((c) => c.url.startsWith("http"));
    const otherCandidates = candidates.filter((c) => !c.url.startsWith("http"));

    // Get sizes in parallel (with concurrency limit from validator)
    const sizesPromises = httpCandidates.map(async (c) => {
      const validation = await validateImageUrl(c.url);
      return { candidate: c, size: validation.size ?? 0 };
    });

    const withSizes = await Promise.all(sizesPromises);

    // Sort by size descending
    withSizes.sort((a, b) => b.size - a.size);

    // Return sorted HTTP candidates first, then others
    return {
      success: true,
      data: [...withSizes.map((w) => w.candidate), ...otherCandidates],
    };
  }

  return {
    success: true,
    data: candidates,
  };
}
