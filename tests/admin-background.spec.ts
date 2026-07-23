import { test, expect } from '@playwright/test';

test.describe('Admin Panel Background Selection', () => {
  test('should apply selected background to the outer scene root and update decorations', async ({ page }) => {
    await page.goto('/d/test-wedding/admin');

    await page.click('text=Tasarım Stüdyosu');
    
    const bgButtons = page.locator('button.group.relative.overflow-hidden.rounded-xl.border-2');
    await bgButtons.nth(0).waitFor({ state: 'visible' });

    // Ensure we are testing the scene root, not the blue card layout
    const sceneRoot = page.getByTestId("invitation-scene-root");
    
    const before = await sceneRoot.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        backgroundImage: style.backgroundImage,
        backgroundColor: style.backgroundColor,
      };
    });

    // 2. Click a specific background, e.g. gold-vein-marble
    // Our test might not know the exact index of gold-vein-marble, so let's just click the second one which we assume changes it.
    // Or we can find by text if we know it:
    const goldVeinButton = page.locator('button', { hasText: 'Altın Damarlı Mermer' }).first();
    
    if (await goldVeinButton.isVisible()) {
      await goldVeinButton.click();
    } else {
      await bgButtons.nth(1).click();
    }
    
    await page.waitForTimeout(500);

    const after = await sceneRoot.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        backgroundImage: style.backgroundImage,
        backgroundColor: style.backgroundColor,
      };
    });

    expect(after.backgroundImage).not.toBe(before.backgroundImage);
    
    if (await goldVeinButton.isVisible()) {
      expect(after.backgroundImage).toContain("gold-vein-marble");
      // Check that pastel hearts or petals are NOT rendered
      await expect(page.getByTestId("scene-decoration-pastel-hearts")).toHaveCount(0);
    }
  });
});
