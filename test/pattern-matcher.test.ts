import { describe, expect, it } from "vitest";
import { applyPattern, matchCuratedPattern } from "../src/pattern-matcher";

describe("matchCuratedPattern", () => {
  it("matches Conde Nast URLs and transforms to high-quality", () => {
    const url =
      "https://media.houseandgarden.co.uk/photos/63e509b43404638ef031982b/1:1/w_400/thumb.jpg";

    expect(matchCuratedPattern(url)).toBe(
      "https://media.houseandgarden.co.uk/photos/63e509b43404638ef031982b/master/w_2560,c_limit/image.jpg",
    );
  });

  it("returns null for unknown URLs", () => {
    expect(matchCuratedPattern("https://unknown-cdn.com/image.jpg")).toBeNull();
  });
});

describe("applyPattern", () => {
  it("applies regex replacement", () => {
    expect(
      applyPattern("https://example.com/photos/abc/small/image.jpg", {
        matchRegex: "^(https://example.com/photos/[^/]+)/small/(.+)$",
        transform: "$1/large/$2",
      }),
    ).toBe("https://example.com/photos/abc/large/image.jpg");
  });
});
