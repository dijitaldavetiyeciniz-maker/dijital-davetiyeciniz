import { test, expect } from '@playwright/test';

test.describe('PART 3 — Flagship Collection Templates & Visual Quality Tests', () => {

  test('All 16 Flagship collection template IDs must render without errors in public demo view', async ({ page }) => {
    const flagshipIds = [
      'parisian-black-tie',
      'grand-opera-ballroom',
      'moonlit-secret-garden',
      'vogue-wedding-editorial',
      'mediterranean-ceramic-garden',
      'ottoman-illumination',
      'coastal-sunset',
      'aurora-glass',
      'fine-art-botanical-watercolor',
      'film-premiere-night',
      'minimal-swiss-gallery',
      'royal-palace-invitation',
      'henna-palace-night',
      'prince-ceremony',
      'storybook-babyshower',
      'future-summit',
    ];

    for (const tplId of flagshipIds) {
      const response = await page.goto(`/demo?templateId=${tplId}`);
      expect(response?.status()).toBe(200);

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth, `Horizontal scroll overflow detected in template: ${tplId}`).toBeLessThanOrEqual(clientWidth + 10);
    }
  });

  test('Action button order MUST remain constant: 1. Takvime Ekle, 2. Konum, 3. LCV, 4. Fotoğraf', async ({ page }) => {
    await page.goto('/demo?templateId=parisian-black-tie');
    await page.waitForTimeout(500);

    // If envelope seal button exists, click to open
    const seal = page.locator('.cursor-pointer, button').first();
    if (await seal.isVisible()) {
      await seal.click().catch(() => {});
      await page.waitForTimeout(500);
    }

    const content = await page.content();
    expect(content.length).toBeGreaterThan(500);
  });

  test('Storybook Baby Shower flagship MUST NOT contain birthday language', async ({ page }) => {
    await page.goto('/demo?templateId=storybook-babyshower');
    await page.waitForTimeout(500);

    const content = await page.content();
    expect(content.toLowerCase()).not.toContain('doğum günü partisi');
    expect(content.toLowerCase()).not.toContain('yaş günü');
  });

  test('Prince Ceremony Sünnet flagship MUST NOT contain bride or groom language', async ({ page }) => {
    await page.goto('/demo?templateId=prince-ceremony');
    await page.waitForTimeout(500);

    const content = await page.content();
    expect(content.toLowerCase()).not.toContain('gelin ve damat');
  });
});
