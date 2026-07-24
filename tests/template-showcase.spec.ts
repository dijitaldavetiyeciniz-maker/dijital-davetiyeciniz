import { test, expect } from '@playwright/test';

test.describe('Template Showcase Lab', () => {
  test('should render template showcase catalog and template cards', async ({ page }) => {
    await page.goto('/sablonlar');
    
    // Check main catalog header
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();

    // Check template cards present
    const cards = page.locator('a[href*="/olustur"]').or(page.locator('button'));
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});
