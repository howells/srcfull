import { describe, expect, it } from "vitest";
import { generateProbeCandidates } from "../src/prober";

describe("generateProbeCandidates", () => {
  it("strips common query params", () => {
    const candidates = generateProbeCandidates("https://example.com/image.jpg?w=400&h=300&q=80");

    expect(candidates).toContain("https://example.com/image.jpg");
  });

  it("tries larger dimensions", () => {
    const candidates = generateProbeCandidates("https://example.com/image.jpg?w=400");

    expect(candidates.some((candidate) => candidate.includes("w=2560"))).toBe(true);
  });

  it("tries master and original path variants", () => {
    const candidates = generateProbeCandidates(
      "https://cdn.example.com/photos/abc/1:1/w_400/image.jpg",
    );

    expect(candidates.some((candidate) => candidate.includes("/master/"))).toBe(true);
    expect(candidates.some((candidate) => candidate.includes("/original/"))).toBe(true);
  });
});
