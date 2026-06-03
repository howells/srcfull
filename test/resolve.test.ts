import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LearnedPattern } from "../src";
import { resolveImageUrl } from "../src/resolve";

describe("resolveImageUrl", () => {
  const cache = {
    get: vi.fn<(url: string) => Promise<string | null>>(
      async (_url: string) => null,
    ),
    set: vi.fn(async () => undefined),
  };

  const patternStore = {
    findByDomain: vi.fn<(domain: string) => Promise<LearnedPattern[]>>(
      async (_domain: string) => [],
    ),
    save: vi.fn(
      async (_domain: string, matchRegex: string, transform: string) => ({
        id: 1,
        domain: "example.com",
        matchRegex,
        transform,
        confidence: 0.5,
      }),
    ),
    incrementSuccess: vi.fn(async () => undefined),
    incrementFailure: vi.fn(async () => undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns cached values first", async () => {
    cache.get.mockResolvedValueOnce("https://cached.com/image.jpg");
    const onDebug = vi.fn();

    const result = await resolveImageUrl("https://original.com/image.jpg", {
      cache,
      patternStore,
      validate: vi.fn(async () => ({ valid: true, size: 100 })),
      onDebug,
    });

    expect(result).toMatchObject({
      resolved: "https://cached.com/image.jpg",
      method: "cached",
    });
    expect(onDebug).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "resolve:cached",
      }),
    );
  });

  it("uses learned patterns when provided", async () => {
    const validate = vi.fn(async (url: string) => ({
      valid: true,
      size: url.includes("source") ? 200 : 100,
    }));

    patternStore.findByDomain.mockResolvedValueOnce([
      {
        id: 123,
        domain: "example.com",
        matchRegex: "^(https://example.com)/(.*)$",
        transform: "https://source.example.com/$2",
        confidence: 0.8,
      },
    ]);

    const result = await resolveImageUrl("https://example.com/image.jpg", {
      cache,
      patternStore,
      validate,
    });

    expect(result).toMatchObject({
      resolved: "https://source.example.com/image.jpg",
      method: "learned",
      confidence: 0.8,
      sizeIncrease: "2.0x",
    });
    expect(patternStore.incrementSuccess).toHaveBeenCalledWith(123);
  });

  it("uses a known original size instead of revalidating the original URL", async () => {
    const validate = vi.fn(async (url: string) => ({
      valid: true,
      size: url.includes("master") ? 400 : 100,
    }));

    const result = await resolveImageUrl(
      "https://media.houseandgarden.co.uk/photos/63e509b43404638ef031982b/1:1/w_400/thumb.jpg",
      {
        cache,
        patternStore,
        originalSize: 200,
        validate,
      },
    );

    expect(result.method).toBe("pattern");
    expect(result.resolvedSize).toBe(400);
    expect(result.sizeIncrease).toBe("2.0x");
    expect(validate).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenCalledWith(result.resolved);
  });

  it("falls back to probing when no pattern matches", async () => {
    const validate = vi.fn(async (url: string) => ({
      valid: true,
      size: url.includes("w=2560") ? 250 : 100,
    }));

    const result = await resolveImageUrl(
      "https://example.com/image.jpg?w=400",
      {
        cache,
        patternStore,
        validate,
      },
    );

    expect(result.method).toBe("probed");
    expect(result.resolved).toContain("w=2560");
  });

  it("falls back to the original URL when nothing improves it", async () => {
    const validate = vi.fn(async () => ({ valid: true, size: 100 }));

    const result = await resolveImageUrl("https://example.com/image.jpg", {
      cache,
      patternStore,
      validate,
    });

    expect(result).toMatchObject({
      resolved: "https://example.com/image.jpg",
      method: "fallback",
    });
  });
});
