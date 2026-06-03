import curatedPatternsJson from "../data/patterns.json";

export type CuratedPattern = {
  domain: string;
  domains?: string[];
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
    if (!regex.test(url)) {
      return null;
    }

    const extracted = url.replace(regex, extractSource.replacement);
    if (/^https?:\/\//.test(extracted)) {
      return extracted;
    }

    const { origin } = new URL(url);
    return new URL(extracted, `${origin}/`).toString();
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
  let current = url;
  let changed = false;

  if (pattern.extractSource) {
    const extracted = tryExtractSource(current, pattern.extractSource);
    if (extracted) {
      current = extracted;
      changed = true;
    }
  }

  if (pattern.stripParams) {
    const stripped = tryStripParams(current, pattern.stripParams);
    if (stripped) {
      current = stripped;
      changed = true;
    }
  }

  if (pattern.stripSuffixes) {
    const stripped = tryStripSuffixes(current, pattern.stripSuffixes);
    if (stripped) {
      current = stripped;
      changed = true;
    }
  }

  return changed ? current : null;
}

function tokenMatchesUrl(url: URL, token: string): boolean {
  const normalized = token.toLowerCase();
  const href = url.href.toLowerCase();
  const hostname = url.hostname.toLowerCase();

  if (normalized.includes("/")) {
    return href.includes(normalized);
  }

  if (normalized.startsWith(".")) {
    return hostname.endsWith(normalized);
  }

  if (normalized.endsWith(".")) {
    return hostname.startsWith(normalized);
  }

  return hostname === normalized || hostname.endsWith(`.${normalized}`);
}

function patternMatchesUrl(rawUrl: string, pattern: CuratedPattern): boolean {
  if (pattern.domain === "*") {
    return true;
  }

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }

  const domains = pattern.domains ?? [pattern.domain];
  return domains.some((domain) => tokenMatchesUrl(url, domain));
}

export function applyCuratedPattern(
  url: string,
  patternName: string,
): string | null {
  const pattern = curatedPatterns[patternName];
  if (!pattern || !patternMatchesUrl(url, pattern)) {
    return null;
  }

  return tryApplyCuratedPattern(url, pattern);
}

export function matchCuratedPattern(url: string): string | null {
  for (const [name, pattern] of Object.entries(curatedPatterns)) {
    if (name === "generic") {
      continue;
    }

    if (!patternMatchesUrl(url, pattern)) {
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
