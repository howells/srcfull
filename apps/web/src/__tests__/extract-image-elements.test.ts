import { describe, expect, it } from "vitest";
import { executeExtractImageElements } from "../lib/tools/extract-image-elements";

describe("extractImageElements", () => {
  it("should extract images from img tags", async () => {
    const html = `
      <html>
        <body>
          <img src="https://example.com/image1.jpg" alt="Test image" width="800" height="600" />
          <img src="https://example.com/image2.jpg" />
        </body>
      </html>
    `;

    const result = await executeExtractImageElements(html);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data?.[0]).toMatchObject({
      url: "https://example.com/image1.jpg",
      source: "img",
      width: 800,
      height: 600,
      alt: "Test image",
    });
    expect(result.data?.[1]).toMatchObject({
      url: "https://example.com/image2.jpg",
      source: "img",
    });
  });

  it("should extract images from img tags with srcset", async () => {
    const html = `
      <html>
        <body>
          <img
            src="https://example.com/image-small.jpg"
            srcset="https://example.com/image-medium.jpg 800w, https://example.com/image-large.jpg 1200w"
            alt="Responsive image"
          />
        </body>
      </html>
    `;

    const result = await executeExtractImageElements(html);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0]).toMatchObject({
      url: "https://example.com/image-small.jpg",
      source: "img",
      alt: "Responsive image",
      srcset: [
        "https://example.com/image-medium.jpg",
        "https://example.com/image-large.jpg",
      ],
    });
  });

  it("should extract images from picture elements", async () => {
    const html = `
      <html>
        <body>
          <picture>
            <source srcset="https://example.com/image-wide.jpg 1200w, https://example.com/image-narrow.jpg 600w" />
            <img src="https://example.com/fallback.jpg" />
          </picture>
        </body>
      </html>
    `;

    const result = await executeExtractImageElements(html);

    expect(result.success).toBe(true);
    expect(result.data?.length).toBeGreaterThanOrEqual(2);

    const pictureImages = result.data?.filter(
      (img) => img.source === "picture"
    );
    expect(pictureImages?.length).toBe(2);
    expect(pictureImages).toContainEqual(
      expect.objectContaining({
        url: "https://example.com/image-wide.jpg",
        source: "picture",
      })
    );
  });

  it("should extract background images from inline styles", async () => {
    const html = `
      <html>
        <body>
          <div style="background-image: url('https://example.com/bg1.jpg');"></div>
          <div style="background-image: url(https://example.com/bg2.jpg)"></div>
          <div style="background-image:url('https://example.com/bg3.jpg')"></div>
        </body>
      </html>
    `;

    const result = await executeExtractImageElements(html);

    expect(result.success).toBe(true);
    expect(result.data?.length).toBeGreaterThanOrEqual(3);

    const bgImages = result.data?.filter((img) => img.source === "background");
    expect(bgImages?.length).toBe(3);
    expect(bgImages?.map((img) => img.url)).toContain(
      "https://example.com/bg1.jpg"
    );
    expect(bgImages?.map((img) => img.url)).toContain(
      "https://example.com/bg2.jpg"
    );
    expect(bgImages?.map((img) => img.url)).toContain(
      "https://example.com/bg3.jpg"
    );
  });

  it("should deduplicate images with the same URL", async () => {
    const html = `
      <html>
        <body>
          <img src="https://example.com/same.jpg" />
          <img src="https://example.com/same.jpg" alt="Different alt" />
          <div style="background-image: url('https://example.com/same.jpg')"></div>
        </body>
      </html>
    `;

    const result = await executeExtractImageElements(html);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0].url).toBe("https://example.com/same.jpg");
  });

  it("should handle empty HTML", async () => {
    const result = await executeExtractImageElements("");

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(0);
  });

  it("should handle HTML with no images", async () => {
    const html = `
      <html>
        <body>
          <h1>No images here</h1>
          <p>Just text content</p>
        </body>
      </html>
    `;

    const result = await executeExtractImageElements(html);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(0);
  });

  it("should skip img tags without src attribute", async () => {
    const html = `
      <html>
        <body>
          <img alt="No source" />
          <img src="https://example.com/valid.jpg" />
        </body>
      </html>
    `;

    const result = await executeExtractImageElements(html);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0].url).toBe("https://example.com/valid.jpg");
  });

  it("should handle malformed HTML gracefully", async () => {
    const html = `
      <html>
        <body>
          <img src="https://example.com/image.jpg"
          <div>Unclosed tag
          <img src="https://example.com/image2.jpg" />
        </body>
    `;

    const result = await executeExtractImageElements(html);

    expect(result.success).toBe(true);
    expect(result.data?.length).toBeGreaterThan(0);
  });

  it("should extract real-world Shopify product images", async () => {
    const html = `
      <html>
        <body>
          <img
            src="https://cdn.shopify.com/s/files/1/0001/2345/products/product_large.jpg?v=1234"
            srcset="https://cdn.shopify.com/s/files/1/0001/2345/products/product_small.jpg 300w,
                    https://cdn.shopify.com/s/files/1/0001/2345/products/product_medium.jpg 600w,
                    https://cdn.shopify.com/s/files/1/0001/2345/products/product_large.jpg 1200w"
            alt="Product"
            width="1200"
            height="800"
          />
        </body>
      </html>
    `;

    const result = await executeExtractImageElements(html);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0]).toMatchObject({
      url: "https://cdn.shopify.com/s/files/1/0001/2345/products/product_large.jpg?v=1234",
      source: "img",
      width: 1200,
      height: 800,
      srcset: expect.arrayContaining([
        expect.stringContaining("product_small.jpg"),
        expect.stringContaining("product_medium.jpg"),
        expect.stringContaining("product_large.jpg"),
      ]),
    });
  });

  it("should extract Cloudinary images", async () => {
    const html = `
      <html>
        <body>
          <img src="https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill/sample.jpg" />
        </body>
      </html>
    `;

    const result = await executeExtractImageElements(html);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0].url).toContain("res.cloudinary.com");
    expect(result.data?.[0].url).toContain("sample.jpg");
  });
});
