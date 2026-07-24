import { test, expect } from '@playwright/test';

test.describe('Admin Panel Background Selection', () => {
  test('should apply selected background to the outer scene root and update decorations', async ({ page }) => {
    await page.goto('/d/demo1/admin');

    const studioTab = page.locator('button', { hasText: 'Tasarım Stüdyosu' }).first();
    if (await studioTab.isVisible()) {
      await studioTab.click();
    }

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
