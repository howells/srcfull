import curatedPatternsJson from "../data/patterns.json";

export type CuratedPattern = {
  domain: string;
  description?: string;
  extractSource?: {
    pattern: string;
    replacement: string;
  };
  stripParams?: string[];
  stripSuffixes?: string[];
  confidence: "high" | "medium" | "low";
};

const curatedPatterns = curatedPatternsJson as Record<string, CuratedPattern>;

const FIX_QUERY_PARAM_SEPARATORS_REGEX = /\?&/g;
const FIX_DUPLICATE_AMPERSANDS_REGEX = /&&+/g;
const STRIP_TRAILING_QUERY_SEPARATORS_REGEX = /[?&]+$/g;

function tryExtractSource(
  url: string,
  extractSource: NonNullable<CuratedPattern["extractSource"]>,
): string | null {
  try {
    const regex = new RegExp(extractSource.pattern);
    return regex.test(url)
      ? url.replace(regex, extractSource.replacement)
      : null;
  } catch {
    return null;
  }
}

function tryStripParams(url: string, stripParams: string[]): string | null {
  let cleanUrl = url;

  for (const param of stripParams) {
    try {
      cleanUrl = cleanUrl.replace(new RegExp(param, "g"), "");
    } catch {
      // Ignore invalid regex patterns in curated data.
    }
  }

  cleanUrl = cleanUrl
    .replace(FIX_QUERY_PARAM_SEPARATORS_REGEX, "?")
    .replace(FIX_DUPLICATE_AMPERSANDS_REGEX, "&")
    .replace(STRIP_TRAILING_QUERY_SEPARATORS_REGEX, "");

  return cleanUrl === url ? null : cleanUrl;
}

function tryStripSuffixes(url: string, stripSuffixes: string[]): string | null {
  let cleanUrl = url;

  for (const suffix of stripSuffixes) {
    try {
      cleanUrl = cleanUrl.replace(new RegExp(`${suffix}(\\.\\w+)$`), "$1");
    } catch {
      // Ignore invalid regex patterns in curated data.
    }
  }

  return cleanUrl === url ? null : cleanUrl;
}

function tryApplyCuratedPattern(
  url: string,
  pattern: CuratedPattern,
): string | null {
  if (pattern.extractSource) {
    const extracted = tryExtractSource(url, pattern.extractSource);
    if (extracted) {
      return extracted;
    }
  }

  if (pattern.stripParams) {
    const stripped = tryStripParams(url, pattern.stripParams);
    if (stripped) {
      return stripped;
    }
  }

  if (pattern.stripSuffixes) {
    const stripped = tryStripSuffixes(url, pattern.stripSuffixes);
    if (stripped) {
      return stripped;
    }
  }

  return null;
}

export function matchCuratedPattern(url: string): string | null {
  for (const [name, pattern] of Object.entries(curatedPatterns)) {
    if (name === "generic") {
      continue;
    }

    if (!url.includes(pattern.domain)) {
      continue;
    }

    const resolved = tryApplyCuratedPattern(url, pattern);
    if (resolved) {
      return resolved;
    }
  }

  return null;
}

export function applyPattern(
  url: string,
  pattern: { matchRegex: string; transform: string },
): string | null {
  try {
    const regex = new RegExp(pattern.matchRegex);
    return regex.test(url) ? url.replace(regex, pattern.transform) : null;
  } catch {
    return null;
  }
}
