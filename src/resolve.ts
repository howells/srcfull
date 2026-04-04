import { emitDebug } from "./debug";
import { applyPattern, matchCuratedPattern } from "./pattern-matcher";
import { probeForSource } from "./prober";
import type { ResolveImageOptions, ResolveResult } from "./types";
import { validateImageUrl } from "./validator";

function calculateSizeIncrease(
  original?: number,
  resolved?: number,
): string | undefined {
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
    type: "cache:write",
    message: `Stored cache entry for ${original}`,
    url: original,
    metadata: {
      resolved,
      patternId,
    },
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
    const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
      }));
  const original = imageUrl;

  emitDebug(options.onDebug, {
    type: "resolve:start",
    message: `Resolving ${imageUrl}`,
    url: imageUrl,
  });

  try {
    const cached = await options.cache?.get(imageUrl);
    if (cached) {
      emitDebug(options.onDebug, {
        type: "resolve:cached",
        message: `Cache hit for ${imageUrl}`,
        url: imageUrl,
        metadata: {
          resolved: cached,
        },
      });
      return { original, resolved: cached, method: "cached" };
    }
  } catch {
    // Cache failures should not block resolution.
  }

  const originalValidation = await validate(imageUrl);
  const originalSize = originalValidation.size ?? 0;

  const curated = matchCuratedPattern(imageUrl);
  if (curated) {
    emitDebug(options.onDebug, {
      type: "pattern:curated",
      message: `Curated pattern matched ${imageUrl}`,
      url: imageUrl,
      metadata: {
        resolved: curated,
      },
    });
    const validation = await validate(curated);
    if (validation.valid) {
      await cacheResult(imageUrl, curated, options);
      return {
        original,
        resolved: curated,
        method: "pattern",
        confidence: 0.95,
        sizeIncrease: calculateSizeIncrease(originalSize, validation.size),
      };
    }

    emitDebug(options.onDebug, {
      type: "pattern:rejected",
      message: `Curated pattern candidate was rejected for ${imageUrl}`,
      url: imageUrl,
      metadata: {
        resolved: curated,
      },
    });
  }

  if (options.patternStore) {
    try {
      const domain = new URL(imageUrl).hostname;
      const patterns = await options.patternStore.findByDomain(domain);
      emitDebug(options.onDebug, {
        type: "pattern:loaded",
        message: `Loaded ${patterns.length} learned patterns for ${domain}`,
        url: imageUrl,
        metadata: {
          domain,
          count: patterns.length,
        },
      });

      for (const pattern of patterns) {
        const resolved = applyPattern(imageUrl, pattern);
        if (!resolved) {
          continue;
        }

        const validation = await validate(resolved);
        if (!validation.valid) {
          await options.patternStore.incrementFailure?.(
            pattern.id ?? pattern.domain,
          );
          emitDebug(options.onDebug, {
            type: "pattern:rejected",
            message: `Learned pattern candidate was rejected for ${imageUrl}`,
            url: imageUrl,
            metadata: {
              patternId: pattern.id,
              resolved,
            },
          });
          continue;
        }

        if (pattern.id !== undefined) {
          await options.patternStore.incrementSuccess(pattern.id);
        }

        await cacheResult(imageUrl, resolved, options, pattern.id);
        emitDebug(options.onDebug, {
          type: "pattern:applied",
          message: `Learned pattern resolved ${imageUrl}`,
          url: imageUrl,
          metadata: {
            patternId: pattern.id,
            resolved,
          },
        });
        return {
          original,
          resolved,
          method: "learned",
          confidence: pattern.confidence,
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
        type: "probe:resolved",
        message: `Probe improved ${imageUrl}`,
        url: imageUrl,
        metadata: {
          resolved: probeResult.url,
          size: probeResult.size,
        },
      });
      return {
        original,
        resolved: probeResult.url,
        method: "probed",
        confidence: 0.5,
        sizeIncrease: calculateSizeIncrease(originalSize, probeResult.size),
      };
    }
  } catch (error) {
    // Probing failures should fall through.
    emitDebug(options.onDebug, {
      type: "probe:failed",
      message: `Probe failed for ${imageUrl}`,
      url: imageUrl,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  emitDebug(options.onDebug, {
    type: "resolve:fallback",
    message: `Falling back to original URL for ${imageUrl}`,
    url: imageUrl,
  });
  return { original, resolved: imageUrl, method: "fallback" };
}
