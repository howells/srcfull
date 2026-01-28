import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test("redirects unauthenticated users to sign-in", async ({ page }) => {
    await page.goto("/dashboard");

    // Clerk middleware should redirect to /sign-in
    await page.waitForURL(/\/sign-in/);
    await expect(page).toHaveURL(/\/sign-in/);
  });
});
