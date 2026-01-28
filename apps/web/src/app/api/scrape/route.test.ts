import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(async () => ({
    has: () => true,
  })),
}));

vi.mock("@/lib/session", () => ({
  requireSession: vi.fn(async () => ({ plan: "pro" })),
}));

vi.mock("@/lib/tools/scrape-webpage", () => ({
  executeScrapeWebpage: vi.fn(async () => ({
    success: true,
    data: "<html></html>",
  })),
}));

vi.mock("@/lib/tools/extract-image-elements", () => ({
  executeExtractImageElements: vi.fn(async () => ({
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

describe("POST /api/scrape", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("respects maxImages while still filtering logos", async () => {
    const { POST } = await import("./route");

    const request = new Request("http://localhost/api/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: "https://example.com/listing",
        maxImages: 25,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.count).toBe(25);
    expect(Array.isArray(data.images)).toBe(true);
    expect(data.images).toHaveLength(25);
    expect(
      data.images.some((img: { original: string }) =>
        img.original.includes("logo")
      )
    ).toBe(false);
  });
});
