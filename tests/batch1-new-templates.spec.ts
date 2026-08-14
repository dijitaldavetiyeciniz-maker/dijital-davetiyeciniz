import { test, expect } from '@playwright/test';

test.describe('PART 3 — Batch C1 New Unique Templates E2E Validation', () => {

  test('All 10 new unique templates must render successfully and have no horizontal scroll overflow', async ({ page }) => {
    const newTemplateIds = [
      'venice-canal-palazzo',
      'cappadocia-sunset-balloon',
      'japanese-folding-screen-sakura',
      'seljuk-geometry',
      'architecture-conference-blueprint',
      'ai-summit-corporate',
      'planetarium-romance',
      'atlantis-ceremony',
      'underwater-journey',
      'experimental-infinite-gallery',
      'experimental-midnight-radio',
    ];

    for (const tplId of newTemplateIds) {
      const response = await page.goto(`/demo?templateId=${tplId}`);
      expect(response?.status()).toBe(200);

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth, `Horizontal scroll overflow detected in new template: ${tplId}`).toBeLessThanOrEqual(clientWidth + 15);

      // Verify that the page content loaded and is not empty
      const title = await page.locator('h1').first();
      expect(await title.isVisible()).toBe(true);
    }
  });
});
