import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test("requires checkout (no email login)", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByRole("heading", { name: "Beeline" })).toBeVisible();
    await expect(page.getByText("paid-only")).toBeVisible();

    await expect(page.getByPlaceholder("you@example.com")).toHaveCount(0);

    const subscribeLinks = page.locator('a[href^="/api/checkout"]');
    if ((await subscribeLinks.count()) === 0) {
      await expect(
        page.getByText("NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID")
      ).toBeVisible();
    } else {
      await expect(subscribeLinks.first()).toBeVisible();
    }
  });
});
