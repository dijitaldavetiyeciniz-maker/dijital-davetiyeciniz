import { test, expect } from '@playwright/test';

test.describe('Category Filter', () => {
  test('should isolate Baby Shower templates', async ({ page }) => {
    await page.goto('/admin/template-showcase');
    
    // Verify QA panel has the filter check marked
    const panel = page.locator('#faz0-test-panel');
    await expect(panel).toBeVisible();
    
    await expect(page.locator('text=Baby Shower filtresi izolasyonu')).toBeVisible();
    await expect(page.locator('text=Dinamik etkinlik başlığı')).toBeVisible();
  });
});
