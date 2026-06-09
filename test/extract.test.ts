import { describe, expect, it, vi } from "vitest";
import {
  extractImageCandidates,
  extractImageCandidatesFromHtml,
  extractImageUrlsFromRaw,
} from "../src/extract";

describe("extractImageCandidatesFromHtml", () => {
  it("extracts images from img tags", () => {
    const html = `
      <img src="https://example.com/image1.jpg" alt="Test image" width="800" height="600" />
      <img src="https://example.com/image2.jpg" />
    `;

    const result = extractImageCandidatesFromHtml(html);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      alt: "Test image",
      height: 600,
      source: "img",
      url: "https://example.com/image1.jpg",
      width: 800,
    });
  });

  it("extracts srcset entries from picture elements", () => {
    const html = `
      <picture>
        <source srcset="https://example.com/image-wide.jpg 1200w, https://example.com/image-narrow.jpg 600w" />
      </picture>
    `;

    const result = extractImageCandidatesFromHtml(html);

    expect(result).toContainEqual(
      expect.objectContaining({
        source: "picture",
        url: "https://example.com/image-wide.jpg",
      }),
    );
    expect(result).toContainEqual(
      expect.objectContaining({
        source: "picture",
        url: "https://example.com/image-narrow.jpg",
      }),
    );
  });

  it("extracts background images from inline styles", () => {
    const html = `
      <div style="background-image: url('https://example.com/bg1.jpg')"></div>
      <div style="background-image:url(https://example.com/bg2.jpg)"></div>
    `;

    const result = extractImageCandidatesFromHtml(html);

    expect(result).toContainEqual(
      expect.objectContaining({
        source: "background",
        url: "https://example.com/bg1.jpg",
      }),
    );
    expect(result).toContainEqual(
      expect.objectContaining({
        source: "background",
        url: "https://example.com/bg2.jpg",
      }),
    );
  });

  it("normalizes relative and lazy-loaded candidates against a base URL", () => {
    const html = `
      <img data-src="/images/product.jpg" data-srcset="/images/product@2x.jpg 2x" alt="Product" />
      <meta property="og:image" content="/social/share.jpg" />
      <link rel="preload" as="image" href="//cdn.example.com/hero.jpg" />
    `;

    const result = extractImageCandidatesFromHtml(html, "https://shop.example.com/products/chair");

    expect(result).toContainEqual(
      expect.objectContaining({
        alt: "Product",
        source: "img",
        url: "https://shop.example.com/images/product.jpg",
      }),
    );
    expect(result).toContainEqual(
      expect.objectContaining({
        source: "img",
        url: "https://shop.example.com/images/product@2x.jpg",
      }),
    );
    expect(result).toContainEqual(
      expect.objectContaining({
        source: "raw",
        url: "https://shop.example.com/social/share.jpg",
      }),
    );
    expect(result).toContainEqual(
      expect.objectContaining({
        source: "raw",
        url: "https://cdn.example.com/hero.jpg",
      }),
    );
  });

  it("keeps modern image formats and strips fragments during normalization", () => {
    const html = `
      <img src="/images/hero.avif#preview" />
    `;

    const result = extractImageCandidatesFromHtml(html, "https://example.com/article");

    expect(result).toContainEqual(
      expect.objectContaining({
        url: "https://example.com/images/hero.avif",
      }),
    );
  });
});

describe("extractImageUrlsFromRaw", () => {
  it("filters obvious junk and keeps same-domain images", () => {
    const html = `
      <div>
        https://shop.example.com/product.jpg
        https://shop.example.com/logo.png
        https://cdn.shopify.com/s/files/thing.webp
        https://shop.example.com/photo.avif
      </div>
    `;

    const result = extractImageUrlsFromRaw(html, "shop.example.com");

    expect(result).toContain("https://shop.example.com/product.jpg");
    expect(result).toContain("https://cdn.shopify.com/s/files/thing.webp");
    expect(result).toContain("https://shop.example.com/photo.avif");
    expect(result).not.toContain("https://shop.example.com/logo.png");
  });
});

describe("extractImageCandidates", () => {
  it("adds raw candidates missed by DOM parsing", async () => {
    const html = `
      <div data-hidden="true">
        https://cdn.shopify.com/s/files/hidden-image.jpg
      </div>
    `;

    const validate = vi.fn(async () => ({ size: 100, valid: true }));
    const result = await extractImageCandidates(html, {
      includeRaw: true,
      sourceDomain: "example.com",
      validate,
    });

    expect(
      result.some(
        (candidate) => candidate.url === "https://cdn.shopify.com/s/files/hidden-image.jpg",
      ),
    ).toBe(true);
  });

  it("sorts http candidates by size when requested", async () => {
    const html = `
      <img src="https://example.com/small.jpg" />
      <img src="https://example.com/large.jpg" />
    `;

    const validate = vi.fn(async (url: string) => ({
      size: url.includes("large") ? 200 : 100,
      valid: true,
    }));

    const result = await extractImageCandidates(html, {
      sortBySize: true,
      validate,
    });

    expect(result[0]?.url).toBe("https://example.com/large.jpg");
  });
});
