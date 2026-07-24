# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flagship-visual-audit-generator.spec.ts >> PART 3 — Flagship Visual Audit Generator & Pixel Stress Tests >> Capture mobile (390x844) & desktop (1440x900) screenshots for: parisian-black-tie
- Location: tests\flagship-visual-audit-generator.spec.ts:36:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/demo?templateId=parisian-black-tie", waiting until "load"

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
  2  | import fs from 'fs';
  3  | import path from 'path';
  4  | 
  5  | const AUDIT_DIR = path.join(__dirname, '../test-results/flagship-visual-audit');
  6  | 
  7  | const FLAGSHIP_IDS = [
  8  |   'parisian-black-tie',
  9  |   'grand-opera-ballroom',
  10 |   'moonlit-secret-garden',
  11 |   'vogue-wedding-editorial',
  12 |   'mediterranean-ceramic-garden',
  13 |   'ottoman-illumination',
  14 |   'coastal-sunset',
  15 |   'aurora-glass',
  16 |   'fine-art-botanical-watercolor',
  17 |   'film-premiere-night',
  18 |   'minimal-swiss-gallery',
  19 |   'royal-palace-invitation',
  20 |   'henna-palace-night',
  21 |   'prince-ceremony',
  22 |   'storybook-babyshower',
  23 |   'storybook-birthday',
  24 |   'future-summit',
  25 | ];
  26 | 
  27 | test.describe('PART 3 — Flagship Visual Audit Generator & Pixel Stress Tests', () => {
  28 | 
  29 |   test.beforeAll(() => {
  30 |     if (!fs.existsSync(AUDIT_DIR)) {
  31 |       fs.mkdirSync(AUDIT_DIR, { recursive: true });
  32 |     }
  33 |   });
  34 | 
  35 |   for (const tplId of FLAGSHIP_IDS) {
  36 |     test(`Capture mobile (390x844) & desktop (1440x900) screenshots for: ${tplId}`, async ({ page }) => {
  37 |       // 1. Mobile Capture (390x844)
  38 |       await page.setViewportSize({ width: 390, height: 844 });
  39 |       await page.goto(`/demo?templateId=${tplId}`);
  40 |       await page.waitForTimeout(500);
  41 | 
  42 |       // Open envelope if seal button exists
  43 |       const sealBtn = page.locator('button, .cursor-pointer').first();
  44 |       if (await sealBtn.isVisible()) {
  45 |         await sealBtn.click().catch(() => {});
  46 |         await page.waitForTimeout(500);
  47 |       }
  48 | 
  49 |       await page.screenshot({ path: path.join(AUDIT_DIR, `${tplId}-mobile-390x844.png`), fullPage: false });
  50 | 
  51 |       // 2. Desktop Capture (1440x900)
  52 |       await page.setViewportSize({ width: 1440, height: 900 });
> 53 |       await page.goto(`/demo?templateId=${tplId}`);
     |                  ^ Error: page.goto: Test timeout of 30000ms exceeded.
  54 |       await page.waitForTimeout(500);
  55 | 
  56 |       const desktopSealBtn = page.locator('button, .cursor-pointer').first();
  57 |       if (await desktopSealBtn.isVisible()) {
  58 |         await desktopSealBtn.click().catch(() => {});
  59 |         await page.waitForTimeout(500);
  60 |       }
  61 | 
  62 |       await page.screenshot({ path: path.join(AUDIT_DIR, `${tplId}-desktop-1440x900.png`), fullPage: false });
  63 | 
  64 |       // Verify no horizontal overflow without overflow-x: hidden hack
  65 |       const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  66 |       const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  67 |       expect(scrollWidth, `Horizontal overflow detected on template ${tplId}`).toBeLessThanOrEqual(clientWidth + 10);
  68 |     });
  69 |   }
  70 | 
  71 |   test('Pixel Stress Test: Long names & venues across all viewports', async ({ page }) => {
  72 |     const viewports = [
  73 |       { width: 320, height: 568 },
  74 |       { width: 390, height: 844 },
  75 |       { width: 430, height: 932 },
  76 |       { width: 768, height: 1024 },
  77 |       { width: 1440, height: 900 },
  78 |       { width: 1920, height: 1080 },
  79 |     ];
  80 | 
  81 |     for (const vp of viewports) {
  82 |       await page.setViewportSize(vp);
  83 |       await page.goto('/demo?templateId=parisian-black-tie');
  84 |       await page.waitForTimeout(300);
  85 | 
  86 |       const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  87 |       expect(scrollWidth).toBeLessThanOrEqual(vp.width + 10);
  88 |     }
  89 |   });
  90 | });
  91 | 
```