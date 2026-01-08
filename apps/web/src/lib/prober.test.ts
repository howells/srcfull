// apps/web/src/lib/prober.test.ts
import { describe, expect, it } from "vitest";
import { generateCandidates } from "./prober";

describe("generateCandidates", () => {
  it("strips common query params", () => {
    const url = "https://example.com/image.jpg?w=400&h=300&q=80";
    const candidates = generateCandidates(url);

    expect(candidates).toContain("https://example.com/image.jpg");
  });

  it("tries larger dimensions", () => {
    const url = "https://example.com/image.jpg?w=400";
    const candidates = generateCandidates(url);

    expect(candidates.some((c) => c.includes("w=2560"))).toBe(true);
  });

  it("tries master/original path variants", () => {
    const url = "https://cdn.example.com/photos/abc/1:1/w_400/image.jpg";
    const candidates = generateCandidates(url);

    expect(candidates.some((c) => c.includes("/master/"))).toBe(true);
    expect(candidates.some((c) => c.includes("/original/"))).toBe(true);
  });

  it("removes size suffixes from filename", () => {
    const url = "https://example.com/image_800x600.jpg";
    const candidates = generateCandidates(url);

    expect(candidates).toContain("https://example.com/image.jpg");
  });
});
