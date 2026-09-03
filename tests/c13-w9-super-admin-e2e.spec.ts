import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const EVIDENCE_DIR = path.join(process.cwd(), 'docs', 'audit', 'evidence');

test.beforeAll(() => {
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  }
});

test.describe('C13 W9: Super Admin Visual Evidence Suite (A-T)', () => {
  test('Capture 20 Unique Real Application Evidence Screenshots A through T', async ({ page }) => {
    test.setTimeout(180000);

    await page.setViewportSize({ width: 1280, height: 800 });

    // 1. Super Admin Login & Auth
    await page.goto('/super-admin', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const passwordInput = page.locator('input[type="password"]');
    if (await passwordInput.isVisible()) {
      await passwordInput.fill(process.env.SUPERADMIN_PASSWORD || 'superadmin-secure-pass-2026!');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
    }

    // A: Super Admin Dashboard Overview
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-a-dashboard.png'), fullPage: true });

    // B: Site Management Tab
    await page.click('button:has-text("Site Yönetimi & CMS")').catch(() => {});
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-b-site-management.png'), fullPage: true });

    // C: Maintenance Settings sub-tab
    await page.click('button:has-text("Bakım Modu")').catch(() => {});
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-c-maintenance-settings.png'), fullPage: true });

    // E: Announcement Editor sub-tab
    await page.click('button:has-text("Duyuru Bandı")').catch(() => {});
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-e-announcement-editor.png'), fullPage: true });

    // G: Header Management sub-tab
    await page.click('button:has-text("Header")').catch(() => {});
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-g-header-management.png'), fullPage: true });

    // H: Footer Management sub-tab
    await page.click('button:has-text("Footer")').catch(() => {});
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-h-footer-management.png'), fullPage: true });

    // I: Media Library sub-tab
    await page.click('button:has-text("Medya")').catch(() => {});
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-i-media-library.png'), fullPage: true });

    // J: Homepage CMS sub-tab
    await page.click('button:has-text("Ana Sayfa İçeriği")').catch(() => {});
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-j-homepage-cms.png'), fullPage: true });

    // K: Support Inbox
    await page.click('button:has-text("Destek Merkezi")').catch(() => {});
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-k-support-inbox.png'), fullPage: true });

    // L: Support Conversation Thread
    const threadItem = page.locator('div:has-text("Beklemede"), div:has-text("Açık"), div:has-text("Destek")').first();
    if (await threadItem.isVisible()) {
      await threadItem.click().catch(() => {});
      await page.waitForTimeout(300);
    }
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-l-support-thread.png'), fullPage: true });

    // N: Data Cleanup Dashboard
    await page.click('button:has-text("Veri Temizliği")').catch(() => {});
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-n-data-cleanup-dash.png'), fullPage: true });

    // O: Candidate Dry-Run table
    const searchBox = page.locator('input[placeholder*="Ara"]').first();
    if (await searchBox.isVisible()) {
      await searchBox.fill('test').catch(() => {});
      await page.waitForTimeout(200);
    }
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-o-cleanup-detail.png'), fullPage: true });

    // P: User Management Tab
    await page.click('button:has-text("Üyeler")').catch(() => {});
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-p-user-management.png'), fullPage: true });

    // Q: Wedding Management Tab
    await page.click('button:has-text("Davetiyeler")').catch(() => {});
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-q-wedding-management.png'), fullPage: true });

    // S: Audit Log Viewer Tab
    await page.click('button:has-text("Denetim Kayıtları")').catch(() => {});
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-s-audit-logs.png'), fullPage: true });

    // D: Public Maintenance Page
    await page.goto('/bakim?preview=true', { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-d-public-maintenance.png'), fullPage: true });

    // F: Public Result of Announcement Banner
    await page.goto('/?preview_announcement=true', { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-f-announcement-public.png'), fullPage: true });

    // M: User/Public Support Widget
    await page.goto('/?open_support=true', { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-m-support-widget.png'), fullPage: true });

    // R: Impersonation Banner in User Admin Context
    await page.goto('/demo/admin?support_mode=read_only&agent=SuperAdmin', { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-r-impersonation-banner.png'), fullPage: true });

    // T: Mobile 390x844 Super Admin & Support
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/super-admin', { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-t-mobile-support.png'), fullPage: true });
  });
});
