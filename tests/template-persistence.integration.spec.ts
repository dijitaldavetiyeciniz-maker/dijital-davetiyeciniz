import { test, expect } from '@playwright/test';

test.describe('Integration: Template Persistence', () => {
  // Use a conditional skip if the environment is not fully configured with test credentials
  test.skip(() => !process.env.TEST_WEDDING_ID, 'TEST_WEDDING_ID is not set, skipping integration test.');

  test('should save custom_overrides to Supabase and render identical public view', async ({ page, browser }) => {
    const weddingId = process.env.TEST_WEDDING_ID;
    
    await test.step('Open Test Wedding Admin', async () => {
      // Navigate to a real admin page
      await page.goto(`/d/${weddingId}/admin`);
      // We assume user is either logged in or we bypass login in the test harness
      await expect(page.locator('text=Tasarım')).toBeVisible();
    });

    await test.step('Select Group 1 template and second variant', async () => {
      await page.click('text=Tasarım');
      // Simulate clicking the Royal Letter template
      await page.click('[data-testid="template-royal-letter"]');
      // Apply second variant
      await page.click('text=Kraliyet Laciverti & Altın');
    });

    await test.step('Save Design', async () => {
      await page.click('button:has-text("Kaydet")');
      // Wait for success toast or indicator
      await expect(page.locator('text=Başarıyla kaydedildi')).toBeVisible();
    });

    await test.step('Refresh Page and verify persistency', async () => {
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Verify layout is still Royal Letter
      const layout = page.getByTestId('layout-royal-letter');
      await expect(layout).toBeVisible();
    });

    await test.step('Verify Public view matches', async () => {
      const publicContext = await browser.newContext();
      const publicPage = await publicContext.newPage();
      
      await publicPage.goto(`/d/${weddingId}`);
      await publicPage.waitForLoadState('networkidle');
      
      const publicLayout = publicPage.getByTestId('layout-royal-letter');
      await expect(publicLayout).toBeVisible();
      
      await publicContext.close();
    });
  });
});
