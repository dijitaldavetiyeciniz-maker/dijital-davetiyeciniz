# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-background.spec.ts >> Admin Panel Background Selection >> should apply selected background to the outer scene root and update decorations
- Location: tests\admin-background.spec.ts:4:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Tasarım Stüdyosu')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]: Böyle bir düğün bulunamadı.
  - button "Open Next.js Dev Tools" [ref=e8] [cursor=pointer]:
    - img [ref=e9]
  - alert [ref=e12]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Admin Panel Background Selection', () => {
  4  |   test('should apply selected background to the outer scene root and update decorations', async ({ page }) => {
  5  |     await page.goto('/d/test-wedding/admin');
  6  | 
> 7  |     await page.click('text=Tasarım Stüdyosu');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  8  |     
  9  |     const bgButtons = page.locator('button.group.relative.overflow-hidden.rounded-xl.border-2');
  10 |     await bgButtons.nth(0).waitFor({ state: 'visible' });
  11 | 
  12 |     // Ensure we are testing the scene root, not the blue card layout
  13 |     const sceneRoot = page.getByTestId("invitation-scene-root");
  14 |     
  15 |     const before = await sceneRoot.evaluate((element) => {
  16 |       const style = window.getComputedStyle(element);
  17 |       return {
  18 |         backgroundImage: style.backgroundImage,
  19 |         backgroundColor: style.backgroundColor,
  20 |       };
  21 |     });
  22 | 
  23 |     // 2. Click a specific background, e.g. gold-vein-marble
  24 |     // Our test might not know the exact index of gold-vein-marble, so let's just click the second one which we assume changes it.
  25 |     // Or we can find by text if we know it:
  26 |     const goldVeinButton = page.locator('button', { hasText: 'Altın Damarlı Mermer' }).first();
  27 |     
  28 |     if (await goldVeinButton.isVisible()) {
  29 |       await goldVeinButton.click();
  30 |     } else {
  31 |       await bgButtons.nth(1).click();
  32 |     }
  33 |     
  34 |     await page.waitForTimeout(500);
  35 | 
  36 |     const after = await sceneRoot.evaluate((element) => {
  37 |       const style = window.getComputedStyle(element);
  38 |       return {
  39 |         backgroundImage: style.backgroundImage,
  40 |         backgroundColor: style.backgroundColor,
  41 |       };
  42 |     });
  43 | 
  44 |     expect(after.backgroundImage).not.toBe(before.backgroundImage);
  45 |     
  46 |     if (await goldVeinButton.isVisible()) {
  47 |       expect(after.backgroundImage).toContain("gold-vein-marble");
  48 |       // Check that pastel hearts or petals are NOT rendered
  49 |       await expect(page.getByTestId("scene-decoration-pastel-hearts")).toHaveCount(0);
  50 |     }
  51 |   });
  52 | });
  53 | 
```