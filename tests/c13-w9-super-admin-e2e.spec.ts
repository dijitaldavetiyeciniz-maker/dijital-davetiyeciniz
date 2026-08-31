import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const EVIDENCE_DIR = path.join(process.cwd(), 'docs', 'audit', 'evidence');

test.beforeAll(() => {
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  }
});

test.describe('C13 W9: Super Admin & Production Hardening Visual Evidence', () => {
  test('Capture Evidence Screenshots A through T', async ({ page }) => {
    // 1. Super Admin Login
    await page.goto('/super-admin');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-super-admin-login.png'), fullPage: true });

    // Authenticate Super Admin
    const passwordInput = page.locator('input[type="password"]');
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('admin123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
    }

    // 2. Super Admin Dashboard (Overview)
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-super-admin-dashboard.png'), fullPage: true });

    // 3. Site Management Tab
    const siteMgmtTab = page.locator('button:has-text("Site Yönetimi")').first();
    if (await siteMgmtTab.isVisible()) {
      await siteMgmtTab.click();
      await page.waitForTimeout(500);

      // C: General & Branding
      await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-site-management-general.png'), fullPage: true });

      // D: Announcement Bar
      const announcementSub = page.locator('button:has-text("Duyuru Bandı")').first();
      if (await announcementSub.isVisible()) {
        await announcementSub.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-site-management-announcement.png'), fullPage: true });
      }

      // E: Header Management
      const headerSub = page.locator('button:has-text("Header")').first();
      if (await headerSub.isVisible()) {
        await headerSub.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-site-management-header.png'), fullPage: true });
      }

      // F: Homepage CMS
      const homepageSub = page.locator('button:has-text("Ana Sayfa CMS")').first();
      if (await homepageSub.isVisible()) {
        await homepageSub.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-site-management-homepage-cms.png'), fullPage: true });
      }

      // G: Footer Management
      const footerSub = page.locator('button:has-text("Footer")').first();
      if (await footerSub.isVisible()) {
        await footerSub.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-site-management-footer.png'), fullPage: true });
      }

      // H: Media Library
      const mediaSub = page.locator('button:has-text("Medya Kütüphanesi")').first();
      if (await mediaSub.isVisible()) {
        await mediaSub.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-site-management-media.png'), fullPage: true });
      }

      // I: Maintenance Settings
      const maintSub = page.locator('button:has-text("Bakım Modu")').first();
      if (await maintSub.isVisible()) {
        await maintSub.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-site-management-maintenance.png'), fullPage: true });
      }
    }

    // 4. Support Inbox Tab
    const supportTab = page.locator('button:has-text("Destek Merkezi")').first();
    if (await supportTab.isVisible()) {
      await supportTab.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-support-inbox.png'), fullPage: true });
    }

    // 5. Data Cleanup Tab
    const cleanupTab = page.locator('button:has-text("Veri Temizliği")').first();
    if (await cleanupTab.isVisible()) {
      await cleanupTab.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-data-cleanup-dry-run.png'), fullPage: true });
    }

    // 6. Audit Logs Tab
    const auditTab = page.locator('button:has-text("Denetim Kayıtları")').first();
    if (await auditTab.isVisible()) {
      await auditTab.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-audit-logs-viewer.png'), fullPage: true });
    }

    // 7. Public Maintenance Page
    await page.goto('/bakim?preview=true');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-maintenance-public-page.png'), fullPage: true });

    // 8. Mobile 390x844 Responsive Verification
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/super-admin');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-mobile-390-super-admin.png'), fullPage: true });
  });
});
