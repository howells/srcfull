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
  if (url && !candidates.includes(url)) {
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
  return strippedUrl.href === originalUrl ? null : strippedUrl.href;
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
  return noQueryUrl === originalUrl ? null : noQueryUrl;
}

function stripSizeSuffixCandidates(urlObj: URL): string[] {
  const candidates: string[] = [];

  for (const pattern of SIZE_SUFFIXES) {
    const match = urlObj.pathname.match(pattern);
    if (!match) {
      continue;
    }
    candidates.push(urlObj.origin + urlObj.pathname.replace(pattern, match[1]) + urlObj.search);
  }

  return candidates;
}

function pathVariantCandidates(urlObj: URL): string[] {
  const pathParts = urlObj.pathname.split("/");
  const candidates: string[] = [];

  for (const variant of PATH_VARIANTS) {
    const variantParts = pathParts.map((part) =>
      ASPECT_RATIO_SEGMENT_REGEX.test(part) ? variant : part,
    );

    if (variantParts.join("/") !== pathParts.join("/")) {
      candidates.push(urlObj.origin + variantParts.join("/") + urlObj.search);
    }
  }

  return candidates;
}

export function generateProbeCandidates(url: string): string[] {
  const candidates: string[] = [];

  try {
    const urlObj = new URL(url);
    pushUnique(candidates, stripResizeParamsCandidate(url));
    pushManyUnique(candidates, largerDimensionCandidates(urlObj));
    pushUnique(candidates, noQueryCandidate(urlObj, url));
    pushManyUnique(candidates, stripSizeSuffixCandidates(urlObj));
    pushManyUnique(candidates, pathVariantCandidates(urlObj));
  } catch {
    return [];
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
  originalSize = 0,
  validate = validateImageUrl,
): Promise<ProbeResult> {
  const candidates = generateProbeCandidates(originalUrl);
  let bestUrl = originalUrl;
  let bestSize = originalSize;

  for (const candidate of candidates) {
    const validation = await validate(candidate);
    if (validation.valid && validation.size && validation.size > bestSize) {
      bestUrl = candidate;
      bestSize = validation.size;
    }
  }

  return bestUrl === originalUrl ? null : { method: "probed", size: bestSize, url: bestUrl };
}
