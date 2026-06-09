import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createFileCache, createFilePatternStore } from "../src/stores/file";

describe("createFileCache", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("persists values across instances and trims old entries", async () => {
    const directory = await mkdtemp(join(tmpdir(), "srcfull-cache-"));
    const filePath = join(directory, "cache.json");

    const cache = createFileCache({ filePath, maxEntries: 2 });
    await cache.set("https://example.com/1.jpg", "https://cdn.example.com/1.jpg");
    await cache.set("https://example.com/2.jpg", "https://cdn.example.com/2.jpg");
    await cache.set("https://example.com/3.jpg", "https://cdn.example.com/3.jpg");

    const reloadedCache = createFileCache({ filePath, maxEntries: 2 });
    expect(await reloadedCache.get("https://example.com/1.jpg")).toBeNull();
    expect(await reloadedCache.get("https://example.com/3.jpg")).toBe(
      "https://cdn.example.com/3.jpg",
    );
  });

  it("expires stale values when maxAgeMs is exceeded", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-04T12:00:00Z"));

    const directory = await mkdtemp(join(tmpdir(), "srcfull-cache-ttl-"));
    const filePath = join(directory, "cache.json");

    const cache = createFileCache({ filePath, maxAgeMs: 100 });
    await cache.set("https://example.com/1.jpg", "https://cdn.example.com/1.jpg");

    vi.setSystemTime(new Date("2026-04-04T12:00:01Z"));

    const reloadedCache = createFileCache({ filePath, maxAgeMs: 100 });
    expect(await reloadedCache.get("https://example.com/1.jpg")).toBeNull();
  });

  it("recovers after a transient write failure", async () => {
    const directory = await mkdtemp(join(tmpdir(), "srcfull-cache-recover-"));
    const blockedDirectory = join(directory, "blocked");
    const filePath = join(blockedDirectory, "cache.json");

    await writeFile(blockedDirectory, "not a directory", "utf-8");
    const cache = createFileCache({ filePath });

    await expect(
      cache.set("https://example.com/1.jpg", "https://cdn.example.com/1.jpg"),
    ).rejects.toThrow();

    await rm(blockedDirectory);
    await mkdir(blockedDirectory);
    await cache.set("https://example.com/2.jpg", "https://cdn.example.com/2.jpg");

    expect(await cache.get("https://example.com/2.jpg")).toBe("https://cdn.example.com/2.jpg");
  });
});

describe("createFilePatternStore", () => {
  it("persists saved patterns and confidence updates", async () => {
    const directory = await mkdtemp(join(tmpdir(), "srcfull-patterns-"));
    const filePath = join(directory, "patterns.json");

    const store = createFilePatternStore({ filePath });
    const created = await store.save(
      "example.com",
      "^https://example.com/(.*)$",
      "https://cdn.example.com/$1",
    );
    await store.incrementSuccess(created.id ?? 1);

    const reloadedStore = createFilePatternStore({ filePath });
    const patterns = await reloadedStore.findByDomain("example.com");

    expect(patterns).toHaveLength(1);
    expect(patterns[0]?.transform).toBe("https://cdn.example.com/$1");
    expect(patterns[0]?.confidence).toBeGreaterThan(0.5);

    const rawFile = JSON.parse(await readFile(filePath, "utf-8")) as {
      patterns: { domain: string }[];
    };
    expect(rawFile.patterns[0]?.domain).toBe("example.com");
  });
});
