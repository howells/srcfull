// apps/web/src/lib/resolver.ts
import { getCached, setCache } from './cache-repo';
import { findPatternByDomain, savePattern, incrementSuccess } from './patterns-repo';
import { matchCuratedPattern, applyPattern } from './pattern-matcher';
import { probeForSource } from './prober';
import { validateImageUrl } from './validator';

export type ResolveResult = {
  original: string;
  resolved: string;
  method: 'cached' | 'pattern' | 'learned' | 'probed' | 'fallback';
  confidence?: number;
  sizeIncrease?: string;
};

export async function resolve(imageUrl: string): Promise<ResolveResult> {
  const original = imageUrl;

  // 1. Check cache
  try {
    const cached = await getCached(imageUrl);
    if (cached) {
      return { original, resolved: cached, method: 'cached' };
    }
  } catch {
    // Cache unavailable, continue
  }

  // Get original size for comparison
  const originalValidation = await validateImageUrl(imageUrl);
  const originalSize = originalValidation.size ?? 0;

  // 2. Try curated patterns
  const curatedResult = matchCuratedPattern(imageUrl);
  if (curatedResult) {
    const validation = await validateImageUrl(curatedResult);
    if (validation.valid) {
      const sizeIncrease = calculateSizeIncrease(originalSize, validation.size);
      await cacheResult(imageUrl, curatedResult);
      return {
        original,
        resolved: curatedResult,
        method: 'pattern',
        confidence: 0.95,
        sizeIncrease,
      };
    }
  }

  // 3. Try learned patterns
  try {
    const domain = new URL(imageUrl).hostname;
    const learnedPatterns = await findPatternByDomain(domain);

    for (const pattern of learnedPatterns) {
      const result = applyPattern(imageUrl, pattern);
      if (result) {
        const validation = await validateImageUrl(result);
        if (validation.valid) {
          await incrementSuccess(pattern.id);
          const sizeIncrease = calculateSizeIncrease(originalSize, validation.size);
          await cacheResult(imageUrl, result, pattern.id);
          return {
            original,
            resolved: result,
            method: 'learned',
            confidence: pattern.confidence,
            sizeIncrease,
          };
        }
      }
    }
  } catch {
    // Database unavailable, continue
  }

  // 4. Probe for source
  try {
    const probeResult = await probeForSource(imageUrl, originalSize);
    if (probeResult) {
      // Learn the pattern for next time
      await learnPattern(imageUrl, probeResult.url);
      const sizeIncrease = calculateSizeIncrease(originalSize, probeResult.size);
      await cacheResult(imageUrl, probeResult.url);
      return {
        original,
        resolved: probeResult.url,
        method: 'probed',
        confidence: 0.5,
        sizeIncrease,
      };
    }
  } catch {
    // Probing failed, continue to fallback
  }

  // 5. Fallback - return original
  return { original, resolved: imageUrl, method: 'fallback' };
}

async function cacheResult(
  original: string,
  resolved: string,
  patternId?: number
): Promise<void> {
  try {
    await setCache(original, resolved, patternId);
  } catch {
    // Cache write failed, not critical
  }
}

async function learnPattern(original: string, resolved: string): Promise<void> {
  try {
    const domain = new URL(original).hostname;
    // Create a simple pattern from this transformation
    // This is a basic implementation - could be smarter
    const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await savePattern(domain, `^${escaped}$`, resolved);
  } catch {
    // Learning failed, not critical
  }
}

function calculateSizeIncrease(original?: number, resolved?: number): string | undefined {
  if (!original || !resolved || original === 0) return undefined;
  const increase = resolved / original;
  if (increase <= 1) return undefined;
  return `${increase.toFixed(1)}x`;
}
