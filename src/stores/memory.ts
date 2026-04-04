import type { LearnedPattern, PatternStore, ResolutionCache } from "../types";

export function createMemoryCache(): ResolutionCache {
  const entries = new Map<string, string>();

  return {
    async get(originalUrl) {
      return entries.get(originalUrl) ?? null;
    },
    async set(originalUrl, resolvedUrl) {
      entries.set(originalUrl, resolvedUrl);
    },
  };
}

export function createMemoryPatternStore(
  initialPatterns: LearnedPattern[] = [],
): PatternStore {
  let nextId = 1;
  const patterns = initialPatterns.map((pattern) => ({
    ...pattern,
    id: pattern.id ?? nextId++,
  }));

  return {
    async findByDomain(domain) {
      return patterns
        .filter((pattern) => pattern.domain === domain)
        .sort((left, right) => right.confidence - left.confidence);
    },
    async save(domain, matchRegex, transform) {
      const existing = patterns.find(
        (pattern) =>
          pattern.domain === domain && pattern.matchRegex === matchRegex,
      );

      if (existing) {
        existing.transform = transform;
        existing.confidence = Math.min(existing.confidence + 0.1, 0.99);
        return existing;
      }

      const created = {
        id: nextId++,
        domain,
        matchRegex,
        transform,
        confidence: 0.5,
      };
      patterns.push(created);
      return created;
    },
    async incrementSuccess(patternId) {
      const pattern = patterns.find((entry) => entry.id === patternId);
      if (pattern) {
        pattern.confidence = Math.min(pattern.confidence + 0.1, 0.99);
      }
    },
    async incrementFailure(patternId) {
      const pattern = patterns.find((entry) => entry.id === patternId);
      if (pattern) {
        pattern.confidence = Math.max(pattern.confidence - 0.2, 0);
      }
    },
  };
}
