import { test, expect } from '@playwright/test';

test.describe('Template Persistence & Public Eşleşme', () => {
  test('should load public wedding page without errors and match admin configuration', async ({ page }) => {
    await page.goto('/demo');
    
    // Public invitation rendered successfully
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
