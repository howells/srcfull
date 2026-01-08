// apps/web/src/lib/prober.ts
import { validateImageUrl } from "./validator";

const ASPECT_RATIO_SEGMENT_REGEX = /^\d+:\d+$/;

const RESIZE_PARAMS = [
  "w",
  "h",
  "width",
  "height",
  "size",
  "resize",
  "q",
  "quality",
  "fit",
  "crop",
  "auto",
  "fm",
  "format",
  "dpr",
  "scale",
  "blur",
  "sharp",
];

const SIZE_SUFFIXES = [
  /_\d+x\d+(\.\w+)$/,
  /-\d+x\d+(\.\w+)$/,
  /_(?:small|medium|large|thumb|thumbnail)(\.\w+)$/i,
  /-(?:small|medium|large|thumb|thumbnail)(\.\w+)$/i,
];

const PATH_VARIANTS = ["master", "original", "full", "source", "raw"];

function pushUnique(candidates: string[], url: string | null): void {
  if (!url) {
    return;
  }

  if (!candidates.includes(url)) {
    candidates.push(url);
  }
}

function pushManyUnique(candidates: string[], urls: string[]): void {
  for (const url of urls) {
    pushUnique(candidates, url);
  }
}

function stripResizeParamsCandidate(originalUrl: string): string | null {
  const strippedUrl = new URL(originalUrl);
  for (const param of RESIZE_PARAMS) {
    strippedUrl.searchParams.delete(param);
  }

  if (strippedUrl.href === originalUrl) {
    return null;
  }

  return strippedUrl.href;
}

function largerDimensionCandidates(urlObj: URL): string[] {
  const candidates: string[] = [];

  if (urlObj.searchParams.has("w")) {
    const largeUrl = new URL(urlObj.href);
    largeUrl.searchParams.set("w", "2560");
    largeUrl.searchParams.delete("h");
    candidates.push(largeUrl.href);
  }

  if (urlObj.searchParams.has("width")) {
    const largeUrl = new URL(urlObj.href);
    largeUrl.searchParams.set("width", "2560");
    largeUrl.searchParams.delete("height");
    candidates.push(largeUrl.href);
  }

  return candidates;
}

function noQueryCandidate(urlObj: URL, originalUrl: string): string | null {
  const noQueryUrl = urlObj.origin + urlObj.pathname;
  if (noQueryUrl === originalUrl) {
    return null;
  }

  return noQueryUrl;
}

function stripSizeSuffixCandidates(urlObj: URL): string[] {
  const candidates: string[] = [];

  for (const pattern of SIZE_SUFFIXES) {
    const match = urlObj.pathname.match(pattern);
    if (!match) {
      continue;
    }

    const cleanPath = urlObj.pathname.replace(pattern, match[1]);
    const cleanUrl = urlObj.origin + cleanPath + urlObj.search;
    candidates.push(cleanUrl);
  }

  return candidates;
}

function pathVariantCandidates(urlObj: URL): string[] {
  const candidates: string[] = [];
  const pathParts = urlObj.pathname.split("/");

  for (const variant of PATH_VARIANTS) {
    // Try replacing aspect ratio segments like "1:1", "4:3"
    const variantParts = pathParts.map((part) =>
      ASPECT_RATIO_SEGMENT_REGEX.test(part) ? variant : part
    );

    if (variantParts.join("/") === pathParts.join("/")) {
      continue;
    }

    const variantUrl = urlObj.origin + variantParts.join("/") + urlObj.search;
    candidates.push(variantUrl);
  }

  return candidates;
}

export function generateCandidates(url: string): string[] {
  const candidates: string[] = [];

  try {
    const urlObj = new URL(url);

    // 1. Strip resize query params
    pushUnique(candidates, stripResizeParamsCandidate(url));

    // 2. Try larger dimensions
    pushManyUnique(candidates, largerDimensionCandidates(urlObj));

    // 3. Strip all query params
    pushUnique(candidates, noQueryCandidate(urlObj, url));

    // 4. Remove size suffixes from filename
    pushManyUnique(candidates, stripSizeSuffixCandidates(urlObj));

    // 5. Try path variants (master, original, etc.)
    pushManyUnique(candidates, pathVariantCandidates(urlObj));
  } catch {
    // Invalid URL, return empty
  }

  return candidates;
}

export type ProbeResult = {
  url: string;
  size: number;
  method: "probed";
} | null;

export async function probeForSource(
  originalUrl: string,
  originalSize?: number
): Promise<ProbeResult> {
  const candidates = generateCandidates(originalUrl);

  let bestUrl = originalUrl;
  let bestSize = originalSize ?? 0;

  for (const candidate of candidates) {
    const validation = await validateImageUrl(candidate);

    if (validation.valid && validation.size && validation.size > bestSize) {
      bestUrl = candidate;
      bestSize = validation.size;
    }
  }

  if (bestUrl !== originalUrl) {
    return { url: bestUrl, size: bestSize, method: "probed" };
  }

  return null;
}
