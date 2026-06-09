import { emitDebug } from "./debug";
import { applyPattern, matchCuratedPattern } from "./pattern-matcher";
import { probeForSource } from "./prober";
import type { ResolveImageOptions, ResolveResult } from "./types";
import { validateImageUrl } from "./validator";

function calculateSizeIncrease(original?: number, resolved?: number): string | undefined {
  if (!(original && resolved) || original === 0) {
    return undefined;
  }

  return `${(resolved / original).toFixed(1)}x`;
}

async function cacheResult(
  original: string,
  resolved: string,
  options: ResolveImageOptions,
  patternId?: string | number,
): Promise<void> {
  await options.cache?.set(original, resolved, patternId);
  emitDebug(options.onDebug, {
    message: `Stored cache entry for ${original}`,
    metadata: {
      patternId,
      resolved,
    },
    type: "cache:write",
    url: original,
  });
}

async function learnPattern(
  original: string,
  resolved: string,
  options: ResolveImageOptions,
): Promise<void> {
  if (!options.patternStore) {
    return;
  }

  try {
    const domain = new URL(original).hostname;
    const escaped = original.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
    await options.patternStore.save(domain, `^${escaped}$`, resolved);
  } catch {
    // Pattern learning is best-effort.
  }
}

export async function resolveImageUrl(
  imageUrl: string,
  options: ResolveImageOptions = {},
): Promise<ResolveResult> {
  const validate =
    options.validate ??
    ((url: string) =>
      validateImageUrl(url, {
        onDebug: options.onDebug,
        retryCount: options.retryCount,
        retryDelayMs: options.retryDelayMs,
        validateResolvedIp: options.validateResolvedIp,
      }));
  const original = imageUrl;

  emitDebug(options.onDebug, {
    message: `Resolving ${imageUrl}`,
    type: "resolve:start",
    url: imageUrl,
  });

  try {
    const cached = await options.cache?.get(imageUrl);
    if (cached) {
      emitDebug(options.onDebug, {
        message: `Cache hit for ${imageUrl}`,
        metadata: {
          resolved: cached,
        },
        type: "resolve:cached",
        url: imageUrl,
      });
      return { method: "cached", original, resolved: cached };
    }
  } catch {
    // Cache failures should not block resolution.
  }

  const originalSize = options.originalSize ?? (await validate(imageUrl)).size ?? 0;

  const curated = matchCuratedPattern(imageUrl);
  if (curated) {
    emitDebug(options.onDebug, {
      message: `Curated pattern matched ${imageUrl}`,
      metadata: {
        resolved: curated,
      },
      type: "pattern:curated",
      url: imageUrl,
    });
    const validation = await validate(curated);
    if (validation.valid) {
      await cacheResult(imageUrl, curated, options);
      return {
        confidence: 0.95,
        method: "pattern",
        original,
        resolved: curated,
        resolvedSize: validation.size,
        sizeIncrease: calculateSizeIncrease(originalSize, validation.size),
      };
    }

    emitDebug(options.onDebug, {
      message: `Curated pattern candidate was rejected for ${imageUrl}`,
      metadata: {
        resolved: curated,
      },
      type: "pattern:rejected",
      url: imageUrl,
    });
  }

  if (options.patternStore) {
    try {
      const domain = new URL(imageUrl).hostname;
      const patterns = await options.patternStore.findByDomain(domain);
      emitDebug(options.onDebug, {
        message: `Loaded ${patterns.length} learned patterns for ${domain}`,
        metadata: {
          count: patterns.length,
          domain,
        },
        type: "pattern:loaded",
        url: imageUrl,
      });

      for (const pattern of patterns) {
        const resolved = applyPattern(imageUrl, pattern);
        if (!resolved) {
          continue;
        }

        const validation = await validate(resolved);
        if (!validation.valid) {
          await options.patternStore.incrementFailure?.(pattern.id ?? pattern.domain);
          emitDebug(options.onDebug, {
            message: `Learned pattern candidate was rejected for ${imageUrl}`,
            metadata: {
              patternId: pattern.id,
              resolved,
            },
            type: "pattern:rejected",
            url: imageUrl,
          });
          continue;
        }

        if (pattern.id !== undefined) {
          await options.patternStore.incrementSuccess(pattern.id);
        }

        await cacheResult(imageUrl, resolved, options, pattern.id);
        emitDebug(options.onDebug, {
          message: `Learned pattern resolved ${imageUrl}`,
          metadata: {
            patternId: pattern.id,
            resolved,
          },
          type: "pattern:applied",
          url: imageUrl,
        });
        return {
          confidence: pattern.confidence,
          method: "learned",
          original,
          resolved,
          resolvedSize: validation.size,
          sizeIncrease: calculateSizeIncrease(originalSize, validation.size),
        };
      }
    } catch {
      // Store lookup failures should not block resolution.
    }
  }

  try {
    const probeResult = await probeForSource(imageUrl, originalSize, validate);
    if (probeResult) {
      await learnPattern(imageUrl, probeResult.url, options);
      await cacheResult(imageUrl, probeResult.url, options);
      emitDebug(options.onDebug, {
        message: `Probe improved ${imageUrl}`,
        metadata: {
          resolved: probeResult.url,
          size: probeResult.size,
        },
        type: "probe:resolved",
        url: imageUrl,
      });
      return {
        confidence: 0.5,
        method: "probed",
        original,
        resolved: probeResult.url,
        resolvedSize: probeResult.size,
        sizeIncrease: calculateSizeIncrease(originalSize, probeResult.size),
      };
    }
  } catch (error) {
    // Probing failures should fall through.
    emitDebug(options.onDebug, {
      error: error instanceof Error ? error.message : String(error),
      message: `Probe failed for ${imageUrl}`,
      type: "probe:failed",
      url: imageUrl,
    });
  }

  emitDebug(options.onDebug, {
    message: `Falling back to original URL for ${imageUrl}`,
    type: "resolve:fallback",
    url: imageUrl,
  });
  return {
    method: "fallback",
    original,
    resolved: imageUrl,
    resolvedSize: originalSize || undefined,
  };
}
