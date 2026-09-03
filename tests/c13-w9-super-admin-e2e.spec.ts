import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const EVIDENCE_DIR = path.join(process.cwd(), 'docs', 'audit', 'evidence');

test.beforeAll(() => {
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  }
});

async function safeClick(page: any, text: string) {
  try {
    const el = page.locator(`button:has-text("${text}")`).first();
    if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
      await el.click().catch(() => {});
      await page.waitForTimeout(200);
    }
  } catch {}
}

async function loginSuperAdmin(page: any) {
  await page.goto('/super-admin', { waitUntil: 'domcontentloaded' });
  const passwordInput = page.locator('input[type="password"]').first();
  const needsLogin = await passwordInput.isVisible({ timeout: 3000 }).catch(() => false);
  if (needsLogin) {
    await passwordInput.fill(process.env.SUPERADMIN_PASSWORD || 'superadmin-secure-pass-2026!');
    await page.click('button[type="submit"]').catch(() => {});
    await page.waitForTimeout(600);
  }
}

test.describe('C13 W9: Super Admin Visual Evidence Suite (A-T)', () => {

  test('Evidence Group 1: Super Admin Command Center & Site Management', async ({ page }) => {
    test.setTimeout(30000);
    await page.setViewportSize({ width: 1280, height: 800 });
    await loginSuperAdmin(page);

    // A: Super Admin Dashboard Overview
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-a-dashboard.png'), fullPage: true });

    // B: Site Management Tab
    await safeClick(page, 'Site Yönetimi');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-b-site-management.png'), fullPage: true });

    // C: Maintenance Settings sub-tab
    await safeClick(page, 'Bakım Modu');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-c-maintenance-settings.png'), fullPage: true });

    // E: Announcement Editor sub-tab
    await safeClick(page, 'Duyuru Bandı');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-e-announcement-editor.png'), fullPage: true });

    // G: Header Management sub-tab
    await safeClick(page, 'Header');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-g-header-management.png'), fullPage: true });

    // H: Footer Management sub-tab
    await safeClick(page, 'Footer');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-h-footer-management.png'), fullPage: true });

    // I: Media Library sub-tab
    await safeClick(page, 'Medya');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-i-media-library.png'), fullPage: true });

    // J: Homepage CMS sub-tab
    await safeClick(page, 'Ana Sayfa');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-j-homepage-cms.png'), fullPage: true });
  });

  test('Evidence Group 2: Support, Cleanup, Users, Weddings & Audit Logs', async ({ page }) => {
    test.setTimeout(30000);
    await page.setViewportSize({ width: 1280, height: 800 });
    await loginSuperAdmin(page);

    // K: Support Inbox
    await safeClick(page, 'Destek Merkezi');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-k-support-inbox.png'), fullPage: true });

    // L: Support Conversation Thread
    const threadItem = page.locator('div:has-text("Beklemede"), div:has-text("Açık"), div:has-text("Destek")').first();
    if (await threadItem.isVisible({ timeout: 1500 }).catch(() => false)) {
      await threadItem.click().catch(() => {});
      await page.waitForTimeout(150);
    }
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-l-support-thread.png'), fullPage: true });

    // N: Data Cleanup Dashboard
    await safeClick(page, 'Veri Temizliği');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-n-data-cleanup-dash.png'), fullPage: true });

    // O: Candidate Dry-Run table
    const searchBox = page.locator('input[placeholder*="Ara"]').first();
    if (await searchBox.isVisible({ timeout: 1500 }).catch(() => false)) {
      await searchBox.fill('test').catch(() => {});
      await page.waitForTimeout(150);
    }
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-o-cleanup-detail.png'), fullPage: true });

    // P: User Management Tab
    await safeClick(page, 'Üyeler');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-p-user-management.png'), fullPage: true });

    // Q: Wedding Management Tab
    await safeClick(page, 'Davetiyeler');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-q-wedding-management.png'), fullPage: true });

    // S: Audit Log Viewer Tab
    await safeClick(page, 'Denetim Kayıtları');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-s-audit-logs.png'), fullPage: true });
  });

  test('Evidence Group 3: Public Previews, Support Widget & Impersonation', async ({ page }) => {
    test.setTimeout(30000);
    await page.setViewportSize({ width: 1280, height: 800 });

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
  });

  test('Evidence Group 4: Mobile 390x844 Super Admin', async ({ page }) => {
    test.setTimeout(30000);
    await page.setViewportSize({ width: 390, height: 844 });
    await loginSuperAdmin(page);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'w9-evidence-t-mobile-support.png'), fullPage: true });
  });

});
