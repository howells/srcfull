import { load } from "cheerio";

const BACKGROUND_IMAGE_REGEX =
  /background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/;

export type ImageCandidate = {
  url: string;
  source: "img" | "picture" | "background";
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
