import { expect, test } from "@playwright/test";

test.describe("Public API (unauthorized)", () => {
  test("GET / loads marketing page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Get the source.")).toBeVisible();
  });

  test("POST /api/v1/transform returns 401 without API key", async ({
    request,
  }) => {
    const response = await request.post("/api/v1/transform", {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ url: "https://example.com/image.jpg" }),
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe("UNAUTHORIZED");
  });

  test("POST /api/v1/scrape returns 401 without API key", async ({
    request,
  }) => {
    const response = await request.post("/api/v1/scrape", {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ url: "https://example.com" }),
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe("UNAUTHORIZED");
  });
});
