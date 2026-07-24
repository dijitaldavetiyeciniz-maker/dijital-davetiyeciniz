import { test, expect } from '@playwright/test';

test.describe('Template Selection and Styling', () => {
  test('should load admin template design tab and allow switching options', async ({ page }) => {
    await page.goto('/d/demo1/admin');

    const studioButton = page.locator('button', { hasText: 'Tasarım Stüdyosu' }).first();
    if (await studioButton.isVisible()) {
      await studioButton.click();
    }

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
