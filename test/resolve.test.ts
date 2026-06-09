import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LearnedPattern } from "../src";
import { resolveImageUrl } from "../src/resolve";

describe("resolveImageUrl", () => {
  const cache = {
    get: vi.fn<(url: string) => Promise<string | null>>(async (_url: string) => null),
    set: vi.fn(async () => {}),
  };

  const patternStore = {
    findByDomain: vi.fn<(domain: string) => Promise<LearnedPattern[]>>(
      async (_domain: string) => [],
    ),
    incrementFailure: vi.fn(async () => {}),
    incrementSuccess: vi.fn(async () => {}),
    save: vi.fn(async (_domain: string, matchRegex: string, transform: string) => ({
      id: 1,
      domain: "example.com",
      matchRegex,
      transform,
      confidence: 0.5,
    })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns cached values first", async () => {
    cache.get.mockResolvedValueOnce("https://cached.com/image.jpg");
    const onDebug = vi.fn();

    const result = await resolveImageUrl("https://original.com/image.jpg", {
      cache,
      onDebug,
      patternStore,
      validate: vi.fn(async () => ({ valid: true, size: 100 })),
    });

    expect(result).toMatchObject({
      method: "cached",
      resolved: "https://cached.com/image.jpg",
    });
    expect(onDebug).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "resolve:cached",
      }),
    );
  });

  it("uses learned patterns when provided", async () => {
    const validate = vi.fn(async (url: string) => ({
      size: url.includes("source") ? 200 : 100,
      valid: true,
    }));

    patternStore.findByDomain.mockResolvedValueOnce([
      {
        confidence: 0.8,
        domain: "example.com",
        id: 123,
        matchRegex: "^(https://example.com)/(.*)$",
        transform: "https://source.example.com/$2",
      },
    ]);

    const result = await resolveImageUrl("https://example.com/image.jpg", {
      cache,
      patternStore,
      validate,
    });

    expect(result).toMatchObject({
      confidence: 0.8,
      method: "learned",
      resolved: "https://source.example.com/image.jpg",
      sizeIncrease: "2.0x",
    });
    expect(patternStore.incrementSuccess).toHaveBeenCalledWith(123);
  });

  it("uses a known original size instead of revalidating the original URL", async () => {
    const validate = vi.fn(async (url: string) => ({
      size: url.includes("master") ? 400 : 100,
      valid: true,
    }));

    const result = await resolveImageUrl(
      "https://media.houseandgarden.co.uk/photos/63e509b43404638ef031982b/1:1/w_400/thumb.jpg",
      {
        cache,
        originalSize: 200,
        patternStore,
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
      size: url.includes("w=2560") ? 250 : 100,
      valid: true,
    }));

    const result = await resolveImageUrl("https://example.com/image.jpg?w=400", {
      cache,
      patternStore,
      validate,
    });

    expect(result.method).toBe("probed");
    expect(result.resolved).toContain("w=2560");
  });

  it("falls back to the original URL when nothing improves it", async () => {
    const validate = vi.fn(async () => ({ size: 100, valid: true }));

    const result = await resolveImageUrl("https://example.com/image.jpg", {
      cache,
      patternStore,
      validate,
    });

    expect(result).toMatchObject({
      method: "fallback",
      resolved: "https://example.com/image.jpg",
    });
  });
});
