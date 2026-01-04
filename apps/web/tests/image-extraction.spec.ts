import { test, expect } from '@playwright/test';

test('extracts images from kvadrat.dk', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');

  // Verify the page loaded
  await expect(page.getByRole('heading', { name: 'Beeline' })).toBeVisible();

  // Enter the URL
  const urlInput = page.getByPlaceholder('Enter a URL to extract images from...');
  await urlInput.fill('https://www.kvadrat.dk/en');

  // Click extract button
  const extractButton = page.getByRole('button', { name: /Extract/i });
  await extractButton.click();

  // Wait for processing to start (button becomes disabled with "Processing..." text)
  await expect(page.getByRole('button', { name: /Processing/i })).toBeVisible({ timeout: 5000 });

  // Wait for any validated URL to appear (these come from the tool results in the stream)
  // The stream validates URLs and they should appear even if final aggregation has issues
  const imageUrlPattern = /https:\/\/kvadrat-imageresizer\.azureedge\.net/;

  await page.waitForFunction(
    (pattern) => {
      const pageText = document.body.textContent || '';
      return pattern.test(pageText);
    },
    imageUrlPattern,
    { timeout: 120000 } // 2 minutes max
  );

  console.log('✅ Found validated image URLs in the response');

  // Check the page content for URLs
  const pageContent = await page.textContent('body');
  const urlMatches = pageContent?.match(/https:\/\/kvadrat-imageresizer\.azureedge\.net[^\s]*/g) || [];

  console.log(`✅ Found ${urlMatches.length} validated URLs`);
  expect(urlMatches.length).toBeGreaterThan(0);

  console.log(`✅ First image URL: ${urlMatches[0]}`);

  // Should be an actual image URL from Azure CDN
  expect(urlMatches[0]).toMatch(/kvadrat-imageresizer\.azureedge\.net/);
  expect(urlMatches[0]).not.toMatch(/\.(css|js|json)/i);
});
