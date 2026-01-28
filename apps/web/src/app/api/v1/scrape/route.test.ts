import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api-auth", () => ({
  validateApiKey: vi.fn(async () => ({ id: "key_123" })),
  logUsage: vi.fn(async () => null),
}));

vi.mock("@/lib/tools/scrape-webpage", () => ({
  executeScrapeWebpage: vi.fn(async () => ({
    success: true,
    data: "<html></html>",
  })),
}));

vi.mock("@/lib/tools/extract-image-elements", () => ({
  extractImageElementsEnhanced: vi.fn(async () => ({
    success: true,
    data: Array.from({ length: 31 }, (_, index) => {
      const url =
        index === 0
          ? "https://example.com/logo.png"
          : `https://example.com/image-${index}.jpg`;
      return {
        url,
        source: "img",
        width: 1200,
        height: 800,
        alt: null,
      };
    }),
  })),
}));

vi.mock("@/lib/resolver", () => ({
  resolve: vi.fn(async (url: string) => ({
    original: url,
    resolved: url,
    method: "pattern",
    sizeIncrease: null,
  })),
}));

describe("POST /api/v1/scrape", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("respects maxImages while still filtering logos", async () => {
    const { POST } = await import("./route");

    const request = new Request("http://localhost/api/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer sk_live_test123",
      },
      body: JSON.stringify({
        url: "https://example.com/listing",
        maxImages: 25,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.images).toHaveLength(25);
    expect(
      data.images.some((img: { original: string }) =>
        img.original.includes("logo")
      )
    ).toBe(false);
  });
});
