import { test, expect } from '@playwright/test';

test.describe('Category Filter & Event Type Architecture', () => {
  test('should isolate Baby Shower event type and verify zero Gelin Adı language', async ({ page }) => {
    await page.goto('/d/demo-wedding/admin');
    
    // Check Event Type dropdown
    const select = page.locator('select').first();
    if (await select.isVisible()) {
      await select.selectOption({ label: 'Baby Shower Daveti' });
      await page.waitForTimeout(300);

      // Verify Baby Shower label is present
      await expect(page.locator('text=Bebeğin Adı veya Kullanılacak Hitap')).toBeVisible();

      // Verify NO "Gelin Adı" or "Doğum Günü Partisi" appears in the form labels
      const brideNameLabel = page.locator('label', { hasText: 'Gelin Adı' });
      await expect(brideNameLabel).toHaveCount(0);

      const birthdayLabel = page.locator('label', { hasText: 'Doğum Günü Partisi' });
      await expect(birthdayLabel).toHaveCount(0);
    }
  });
});
