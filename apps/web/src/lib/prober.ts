// apps/web/src/lib/prober.ts
import { validateImageUrl } from './validator';

const RESIZE_PARAMS = [
  'w', 'h', 'width', 'height', 'size', 'resize',
  'q', 'quality', 'fit', 'crop', 'auto', 'fm', 'format',
  'dpr', 'scale', 'blur', 'sharp',
];

const SIZE_SUFFIXES = [
  /_\d+x\d+(\.\w+)$/,
  /-\d+x\d+(\.\w+)$/,
  /_(?:small|medium|large|thumb|thumbnail)(\.\w+)$/i,
  /-(?:small|medium|large|thumb|thumbnail)(\.\w+)$/i,
];

const PATH_VARIANTS = ['master', 'original', 'full', 'source', 'raw'];

export function generateCandidates(url: string): string[] {
  const candidates: string[] = [];

  try {
    const urlObj = new URL(url);

    // 1. Strip resize query params
    const strippedUrl = new URL(url);
    RESIZE_PARAMS.forEach(param => strippedUrl.searchParams.delete(param));
    if (strippedUrl.href !== url) {
      candidates.push(strippedUrl.href);
    }

    // 2. Try larger dimensions
    if (urlObj.searchParams.has('w')) {
      const largeUrl = new URL(url);
      largeUrl.searchParams.set('w', '2560');
      largeUrl.searchParams.delete('h');
      candidates.push(largeUrl.href);
    }
    if (urlObj.searchParams.has('width')) {
      const largeUrl = new URL(url);
      largeUrl.searchParams.set('width', '2560');
      largeUrl.searchParams.delete('height');
      candidates.push(largeUrl.href);
    }

    // 3. Strip all query params
    const noQueryUrl = urlObj.origin + urlObj.pathname;
    if (noQueryUrl !== url && !candidates.includes(noQueryUrl)) {
      candidates.push(noQueryUrl);
    }

    // 4. Remove size suffixes from filename
    for (const pattern of SIZE_SUFFIXES) {
      const match = urlObj.pathname.match(pattern);
      if (match) {
        const cleanPath = urlObj.pathname.replace(pattern, match[1]);
        const cleanUrl = urlObj.origin + cleanPath + urlObj.search;
        if (!candidates.includes(cleanUrl)) {
          candidates.push(cleanUrl);
        }
      }
    }

    // 5. Try path variants (master, original, etc.)
    const pathParts = urlObj.pathname.split('/');
    for (const variant of PATH_VARIANTS) {
      // Try replacing aspect ratio segments like "1:1", "4:3"
      const variantParts = pathParts.map(part =>
        /^\d+:\d+$/.test(part) ? variant : part
      );
      if (variantParts.join('/') !== pathParts.join('/')) {
        const variantUrl = urlObj.origin + variantParts.join('/') + urlObj.search;
        if (!candidates.includes(variantUrl)) {
          candidates.push(variantUrl);
        }
      }
    }

  } catch {
    // Invalid URL, return empty
  }

  return candidates;
}

export type ProbeResult = {
  url: string;
  size: number;
  method: 'probed';
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
    return { url: bestUrl, size: bestSize, method: 'probed' };
  }

  return null;
}
