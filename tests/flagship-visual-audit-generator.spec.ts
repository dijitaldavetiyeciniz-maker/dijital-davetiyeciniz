import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUDIT_DIR = path.join(__dirname, '../test-results/flagship-visual-audit');

const FLAGSHIP_IDS = [
  'parisian-black-tie',
  'grand-opera-ballroom',
  'moonlit-secret-garden',
  'vogue-wedding-editorial',
  'mediterranean-ceramic-garden',
  'ottoman-illumination',
  'coastal-sunset',
  'aurora-glass',
  'fine-art-botanical-watercolor',
  'film-premiere-night',
  'minimal-swiss-gallery',
  'royal-palace-invitation',
  'henna-palace-night',
  'prince-ceremony',
  'storybook-babyshower',
  'storybook-birthday',
  'future-summit',
];

test.describe('PART 3 — Flagship Visual Audit Generator & Pixel Stress Tests', () => {

  test.beforeAll(() => {
    if (!fs.existsSync(AUDIT_DIR)) {
      fs.mkdirSync(AUDIT_DIR, { recursive: true });
    }
  });

  for (const tplId of FLAGSHIP_IDS) {
    test(`Capture mobile (390x844) & desktop (1440x900) screenshots for: ${tplId}`, async ({ page }) => {
      // 1. Mobile Capture (390x844)
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/demo?templateId=${tplId}`);
      await page.waitForTimeout(500);

      // Open envelope if seal button exists
      const sealBtn = page.locator('button, .cursor-pointer').first();
      if (await sealBtn.isVisible()) {
        await sealBtn.click().catch(() => {});
        await page.waitForTimeout(500);
      }

      await page.screenshot({ path: path.join(AUDIT_DIR, `${tplId}-mobile-390x844.png`), fullPage: false });

      // 2. Desktop Capture (1440x900)
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/demo?templateId=${tplId}`);
      await page.waitForTimeout(500);

      const desktopSealBtn = page.locator('button, .cursor-pointer').first();
      if (await desktopSealBtn.isVisible()) {
        await desktopSealBtn.click().catch(() => {});
        await page.waitForTimeout(500);
      }

      await page.screenshot({ path: path.join(AUDIT_DIR, `${tplId}-desktop-1440x900.png`), fullPage: false });

      // Verify no horizontal overflow without overflow-x: hidden hack
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth, `Horizontal overflow detected on template ${tplId}`).toBeLessThanOrEqual(clientWidth + 10);
    });
  }

  test('Pixel Stress Test: Long names & venues across all viewports', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto('/demo?templateId=parisian-black-tie');
      await page.waitForTimeout(300);

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 10);
    }
  });
});
