import { describe, expect, it, vi } from "vitest";
import { scrapePage } from "../src/scrape";

describe("scrapePage", () => {
  it("filters logos and respects maxImages", async () => {
    const result = await scrapePage("https://example.com/listing", {
      maxImages: 2,
      fetchHtml: async () => ({
        html: `
          <img src="https://example.com/logo.png" width="1200" height="800" />
          <img src="https://example.com/image-1.jpg" width="1200" height="800" />
          <img src="https://example.com/image-2.jpg" width="1200" height="800" />
          <img src="https://example.com/image-3.jpg" width="1200" height="800" />
        `,
      }),
      resolve: async (url) => ({
        original: url,
        resolved: url,
        method: "pattern",
      }),
      validate: async (url) => ({
        valid: true,
        size: url.includes("image-3") ? 300 : 100,
      }),
    });

    expect(result.images).toHaveLength(2);
    expect(result.images.some((image) => image.original.includes("logo"))).toBe(
      false,
    );
  });

  it("resolves relative image URLs against the page URL", async () => {
    const result = await scrapePage("https://example.com/listing", {
      fetchHtml: async () => ({
        html: `
          <img src="/images/chair.jpg" width="1200" height="800" />
        `,
      }),
      resolve: async (url) => ({
        original: url,
        resolved: url,
        method: "fallback",
      }),
      validate: async () => ({
        valid: true,
        size: 100,
      }),
    });

    expect(result.images[0]?.original).toBe(
      "https://example.com/images/chair.jpg",
    );
    expect(result.stats.returned).toBe(1);
  });

  it("caps pre-resolution validation to a bounded candidate pool", async () => {
    const validate = vi.fn(async (url: string) => ({
      valid: true,
      size: Number(url.match(/image-(\d+)/)?.[1] ?? 0),
    }));

    const result = await scrapePage("https://example.com/listing", {
      maxImages: 2,
      fetchHtml: async () => ({
        html: Array.from(
          { length: 10 },
          (_, index) =>
            `<img src="https://example.com/image-${index}.jpg" width="${1000 - index}" height="800" />`,
        ).join("\n"),
      }),
      resolve: async (url) => ({
        original: url,
        resolved: url,
        method: "fallback",
      }),
      validate,
    });

    expect(result.images).toHaveLength(2);
    expect(validate).toHaveBeenCalledTimes(6);
    expect(result.images[0]?.originalSize).not.toBeNull();
  });
});
