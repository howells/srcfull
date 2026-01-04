import fs from 'fs';
import path from 'path';

export type CuratedPattern = {
  domain: string;
  description?: string;
  extractSource?: {
    pattern: string;
    replacement: string;
  };
  stripParams?: string[];
  stripSuffixes?: string[];
  confidence: 'high' | 'medium' | 'low';
};

type CuratedPatterns = Record<string, CuratedPattern>;

let cachedPatterns: CuratedPatterns | null = null;

function loadCuratedPatterns(): CuratedPatterns {
  if (cachedPatterns) return cachedPatterns;

  try {
    const patternsPath = path.join(process.cwd(), '../../data/patterns.json');
    const data = fs.readFileSync(patternsPath, 'utf-8');
    cachedPatterns = JSON.parse(data);
    return cachedPatterns!;
  } catch {
    return {};
  }
}

export function matchCuratedPattern(url: string): string | null {
  const patterns = loadCuratedPatterns();

  for (const [name, pattern] of Object.entries(patterns)) {
    if (name === 'generic') continue;
    if (!url.includes(pattern.domain)) continue;

    // Try extractSource first
    if (pattern.extractSource) {
      const regex = new RegExp(pattern.extractSource.pattern);
      if (regex.test(url)) {
        return url.replace(regex, pattern.extractSource.replacement);
      }
    }

    // Try stripParams
    if (pattern.stripParams) {
      let cleanUrl = url;
      for (const param of pattern.stripParams) {
        cleanUrl = cleanUrl.replace(new RegExp(param, 'g'), '');
      }
      cleanUrl = cleanUrl
        .replace(/\?&/g, '?')
        .replace(/&&+/g, '&')
        .replace(/[?&]+$/g, '');

      if (cleanUrl !== url) return cleanUrl;
    }

    // Try stripSuffixes
    if (pattern.stripSuffixes) {
      let cleanUrl = url;
      for (const suffix of pattern.stripSuffixes) {
        cleanUrl = cleanUrl.replace(new RegExp(suffix + '(\\.\\w+)$'), '$1');
      }
      if (cleanUrl !== url) return cleanUrl;
    }
  }

  return null;
}

export function applyPattern(
  url: string,
  pattern: { match_regex: string; transform: string }
): string | null {
  try {
    const regex = new RegExp(pattern.match_regex);
    if (regex.test(url)) {
      return url.replace(regex, pattern.transform);
    }
  } catch {
    // Invalid regex
  }
  return null;
}
