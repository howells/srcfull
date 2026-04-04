import { load } from "cheerio";
import type { ExtractImageOptions, ImageCandidate } from "./types";
import { validateImageUrl } from "./validator";

const IMAGE_URL_REGEX =
  /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|webp|gif|avif|jfif)(?:\?[^\s"'<>]*)?/gi;

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

const IMAGE_ATTRIBUTE_NAMES = [
  "src",
  "data-src",
  "data-lazy-src",
  "data-original",
  "data-image",
  "data-url",
];

const SRCSET_ATTRIBUTE_NAMES = ["srcset", "data-srcset", "data-lazy-srcset"];

const META_IMAGE_SELECTORS = [
  'meta[property="og:image"]',
  'meta[property="og:image:url"]',
  'meta[name="twitter:image"]',
  'meta[name="twitter:image:src"]',
  'meta[itemprop="image"]',
];

const LINK_IMAGE_SELECTORS = [
  'link[rel="image_src"]',
  'link[rel="preload"][as="image"]',
];

function normalizeCandidateUrl(
  rawUrl: string | undefined,
  baseUrl?: string,
): string | null {
  if (!rawUrl) {
    return null;
  }

  const candidate = rawUrl.trim();
  if (
    candidate.length === 0 ||
    candidate.startsWith("data:") ||
    candidate.startsWith("javascript:")
  ) {
    return null;
  }

  try {
    if (candidate.startsWith("//")) {
      const normalized = new URL(`https:${candidate}`);
      normalized.hash = "";
      return normalized.href;
    }

    if (baseUrl) {
      const normalized = new URL(candidate, baseUrl);
      normalized.hash = "";
      return normalized.href;
    }

    const normalized = new URL(candidate);
    normalized.hash = "";
    return normalized.href;
  } catch {
    return null;
  }
}

function parseSrcsetUrls(srcset: string): string[] {
  return srcset
    .split(",")
    .map((entry) => entry.trim().split(/\s+/)[0])
    .filter((value): value is string => Boolean(value));
}

function extractCssUrls(style: string | undefined): string[] {
  if (!style) {
    return [];
  }

  return Array.from(
    style.matchAll(/url\((['"]?)(.*?)\1\)/g),
    (match) => match[2]?.trim() ?? "",
  ).filter(Boolean);
}

function pushCandidate(
  candidates: ImageCandidate[],
  candidate: ImageCandidate | null,
): void {
  if (!candidate) {
    return;
  }

  if (!candidates.some((entry) => entry.url === candidate.url)) {
    candidates.push(candidate);
  }
}

function createCandidate(
  url: string | undefined,
  source: ImageCandidate["source"],
  baseUrl?: string,
  extra: Omit<ImageCandidate, "url" | "source"> = {},
): ImageCandidate | null {
  const normalizedUrl = normalizeCandidateUrl(url, baseUrl);
  if (!normalizedUrl) {
    return null;
  }

  return {
    ...extra,
    url: normalizedUrl,
    source,
  };
}

export function extractImageUrlsFromRaw(
  html: string,
  sourceDomain?: string,
): string[] {
  const matches = html.match(IMAGE_URL_REGEX) || [];
  const seen = new Set<string>();
  const filtered: string[] = [];

  for (const url of matches) {
    const baseUrl = url.split("?")[0];
    if (!baseUrl || seen.has(baseUrl)) {
      continue;
    }
    seen.add(baseUrl);

    if (EXCLUDED_PATTERNS.some((pattern) => pattern.test(url))) {
      continue;
    }

    const isSameDomain = sourceDomain && url.includes(sourceDomain);
    const isCdn = CDN_PATTERNS.some((pattern) => pattern.test(url));

    if (isSameDomain || isCdn) {
      filtered.push(url);
    }
  }

  return filtered;
}

export function extractImageCandidatesFromHtml(
  html: string,
  baseUrl?: string,
): ImageCandidate[] {
  const $ = load(html);
  const candidates: ImageCandidate[] = [];

  $("img").each((_, element) => {
    const node = $(element);
    const width = Number.parseInt(node.attr("width") || "0", 10) || undefined;
    const height = Number.parseInt(node.attr("height") || "0", 10) || undefined;
    const alt = node.attr("alt") ?? null;
    const srcsetCandidates = SRCSET_ATTRIBUTE_NAMES.flatMap((attribute) =>
      parseSrcsetUrls(node.attr(attribute) ?? "")
        .map((url) => normalizeCandidateUrl(url, baseUrl))
        .filter((url): url is string => Boolean(url)),
    );

    for (const attribute of IMAGE_ATTRIBUTE_NAMES) {
      pushCandidate(
        candidates,
        createCandidate(node.attr(attribute), "img", baseUrl, {
          width,
          height,
          alt,
          srcset: srcsetCandidates.length > 0 ? srcsetCandidates : undefined,
        }),
      );
    }

    for (const srcsetUrl of srcsetCandidates) {
      pushCandidate(candidates, {
        url: srcsetUrl,
        source: "img",
        width,
        height,
        alt,
        srcset: srcsetCandidates,
      });
    }
  });

  $("picture source").each((_, element) => {
    const urls = SRCSET_ATTRIBUTE_NAMES.flatMap((attribute) =>
      parseSrcsetUrls($(element).attr(attribute) ?? "")
        .map((url) => normalizeCandidateUrl(url, baseUrl))
        .filter((url): url is string => Boolean(url)),
    );

    for (const url of urls) {
      pushCandidate(candidates, {
        url,
        source: "picture",
        srcset: urls,
      });
    }
  });

  $('[style*="background-image"]').each((_, element) => {
    for (const url of extractCssUrls($(element).attr("style"))) {
      pushCandidate(candidates, createCandidate(url, "background", baseUrl));
    }
  });

  for (const selector of META_IMAGE_SELECTORS) {
    $(selector).each((_, element) => {
      pushCandidate(
        candidates,
        createCandidate($(element).attr("content"), "raw", baseUrl),
      );
    });
  }

  for (const selector of LINK_IMAGE_SELECTORS) {
    $(selector).each((_, element) => {
      pushCandidate(
        candidates,
        createCandidate($(element).attr("href"), "raw", baseUrl),
      );
    });
  }

  return candidates;
}

export async function extractImageCandidates(
  html: string,
  options: ExtractImageOptions = {},
): Promise<ImageCandidate[]> {
  const {
    includeRaw = false,
    sortBySize = false,
    sourceDomain,
    validate = validateImageUrl,
  } = options;

  const candidates = [...extractImageCandidatesFromHtml(html, options.baseUrl)];
  const seenUrls = new Set(
    candidates.map((candidate) => candidate.url.split("?")[0]),
  );

  if (includeRaw) {
    for (const url of extractImageUrlsFromRaw(html, sourceDomain)) {
      const baseUrl = url.split("?")[0];
      if (!baseUrl || seenUrls.has(baseUrl)) {
        continue;
      }

      candidates.push({
        url,
        source: "raw",
      });
      seenUrls.add(baseUrl);
    }
  }

  if (!sortBySize) {
    return candidates;
  }

  const httpCandidates = candidates.filter((candidate) =>
    candidate.url.startsWith("http"),
  );
  const otherCandidates = candidates.filter(
    (candidate) => !candidate.url.startsWith("http"),
  );

  const withSizes = await Promise.all(
    httpCandidates.map(async (candidate) => ({
      candidate,
      size: (await validate(candidate.url)).size ?? 0,
    })),
  );

  withSizes.sort((left, right) => right.size - left.size);
  return [...withSizes.map((entry) => entry.candidate), ...otherCandidates];
}
