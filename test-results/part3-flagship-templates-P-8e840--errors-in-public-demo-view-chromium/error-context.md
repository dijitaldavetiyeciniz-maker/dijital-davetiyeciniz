# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: part3-flagship-templates.spec.ts >> PART 3 — Flagship Collection Templates & Visual Quality Tests >> All 16 Flagship collection template IDs must render without errors in public demo view
- Location: tests\part3-flagship-templates.spec.ts:5:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/demo?templateId=coastal-sunset", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Davetiyeyi açmak için dokununuz":
    - generic [ref=e3] [cursor=pointer]:
      - generic [ref=e6]:
        - paragraph [ref=e7]: Together with their families
        - heading "Elif Yılmaz & Kerem Arslan" [level=1] [ref=e8]:
          - text: Elif Yılmaz
          - generic [ref=e9]: "&"
          - text: Kerem Arslan
        - paragraph [ref=e10]: 12.09.2026
      - generic [ref=e11]: 👑
    - paragraph [ref=e17] [cursor=pointer]: Davetiyeyi Açmak İçin Ekrana Dokunun
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('PART 3 — Flagship Collection Templates & Visual Quality Tests', () => {
  4  | 
  5  |   test('All 16 Flagship collection template IDs must render without errors in public demo view', async ({ page }) => {
  6  |     const flagshipIds = [
  7  |       'parisian-black-tie',
  8  |       'grand-opera-ballroom',
  9  |       'moonlit-secret-garden',
  10 |       'vogue-wedding-editorial',
  11 |       'mediterranean-ceramic-garden',
  12 |       'ottoman-illumination',
  13 |       'coastal-sunset',
  14 |       'aurora-glass',
  15 |       'fine-art-botanical-watercolor',
  16 |       'film-premiere-night',
  17 |       'minimal-swiss-gallery',
  18 |       'royal-palace-invitation',
  19 |       'henna-palace-night',
  20 |       'prince-ceremony',
  21 |       'storybook-babyshower',
  22 |       'future-summit',
  23 |     ];
  24 | 
  25 |     for (const tplId of flagshipIds) {
> 26 |       const response = await page.goto(`/demo?templateId=${tplId}`);
     |                                   ^ Error: page.goto: Test timeout of 30000ms exceeded.
  27 |       expect(response?.status()).toBe(200);
  28 | 
  29 |       // Verify no horizontal overflow
  30 |       const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  31 |       const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  32 |       expect(scrollWidth, `Horizontal scroll overflow detected in template: ${tplId}`).toBeLessThanOrEqual(clientWidth + 10);
  33 |     }
  34 |   });
  35 | 
  36 |   test('Action button order MUST remain constant: 1. Takvime Ekle, 2. Konum, 3. LCV, 4. Fotoğraf', async ({ page }) => {
  37 |     await page.goto('/demo?templateId=parisian-black-tie');
  38 |     await page.waitForTimeout(500);
  39 | 
  40 |     // If envelope seal button exists, click to open
  41 |     const seal = page.locator('.cursor-pointer, button').first();
  42 |     if (await seal.isVisible()) {
  43 |       await seal.click().catch(() => {});
  44 |       await page.waitForTimeout(500);
  45 |     }
  46 | 
  47 |     const content = await page.content();
  48 |     expect(content.length).toBeGreaterThan(500);
  49 |   });
  50 | 
  51 |   test('Storybook Baby Shower flagship MUST NOT contain birthday language', async ({ page }) => {
  52 |     await page.goto('/demo?templateId=storybook-babyshower');
  53 |     await page.waitForTimeout(500);
  54 | 
  55 |     const content = await page.content();
  56 |     expect(content.toLowerCase()).not.toContain('doğum günü partisi');
  57 |     expect(content.toLowerCase()).not.toContain('yaş günü');
  58 |   });
  59 | 
  60 |   test('Prince Ceremony Sünnet flagship MUST NOT contain bride or groom language', async ({ page }) => {
  61 |     await page.goto('/demo?templateId=prince-ceremony');
  62 |     await page.waitForTimeout(500);
  63 | 
  64 |     const content = await page.content();
  65 |     expect(content.toLowerCase()).not.toContain('gelin ve damat');
  66 |   });
  67 | });
  68 | 
```