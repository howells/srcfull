import { describe, expect, it } from "vitest";
import {
  applyCuratedPattern,
  applyPattern,
  matchCuratedPattern,
} from "../src/pattern-matcher";

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

  it("does not match host-like pattern domains inside unrelated hostnames", () => {
    expect(
      matchCuratedPattern(
        "https://res.cloudinary.com.evil.test/demo/image/upload/w_400/file.jpg",
      ),
    ).toBeNull();
  });

  it("unwraps SpeedSize image proxy URLs to original source images", () => {
    expect(
      matchCuratedPattern(
        "https://aicdn.speedsize.com/e0ef94ef-bbea-450b-a400-575c3145c135/www.tilebar.com/media/catalog/product/lines-black-tile.jpg?w=800&q=80&format=webp",
      ),
    ).toBe(
      "https://www.tilebar.com/media/catalog/product/lines-black-tile.jpg",
    );
  });

  it("strips empty numeric cachebuster query params with the generic pattern", () => {
    expect(
      applyCuratedPattern(
        "https://www.tilebar.com/media/wysiwyg/Vinyl.png?1=",
        "generic",
      ),
    ).toBe("https://www.tilebar.com/media/wysiwyg/Vinyl.png");
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
