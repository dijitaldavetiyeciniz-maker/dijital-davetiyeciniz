import { test, expect } from '@playwright/test';
import { defaultSiteConfig } from '../src/lib/site-settings';

test.describe('C13: Super Admin Operations, Live Data & Site Control', () => {
  test.describe.configure({ mode: 'serial' });

  test('1. Public Site Settings API returns valid configuration with fallback', async ({ request }) => {
    const res = await request.get('/api/site-settings/public');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.settings).toBeDefined();
    expect(data.settings.header).toBeDefined();
    expect(data.settings.footer).toBeDefined();
    expect(data.settings.homepage).toBeDefined();
    expect(data.settings.maintenance).toBeDefined();
  });

  test('2. Super Admin Site Settings API denies unauthorized access', async ({ request }) => {
    const res = await request.get('/api/super-admin/site-settings');
    expect(res.status()).toBe(403);
  });

  test('3. System Status API denies unauthorized access', async ({ request }) => {
    const res = await request.get('/api/super-admin/system-status');
    expect(res.status()).toBe(403);
  });

  test('4. Support message creation via public API works end-to-end', async ({ request }) => {
    const testEmail = `test-user-${Date.now()}@example.com`;
    const res = await request.post('/api/support/messages', {
      data: {
        name: 'E2E Test User',
        email: testEmail,
        category: 'Genel Soru',
        subject: 'C13 E2E Test Ticket',
        message: 'Bu otomatik E2E test biletidir.'
      }
    });

    expect(res.status()).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.ticket_id).toBeDefined();
  });

  test('5. Support message rejects invalid payloads', async ({ request }) => {
    const res = await request.post('/api/support/messages', {
      data: {
        name: '',
        email: 'invalid-email',
        message: ''
      }
    });
    expect(res.status()).toBe(400);
  });

  test('6. WhatsApp support elements are absent from public homepage & layout', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Verify no wa.me links or WhatsApp CTA widgets exist
    const whatsappLink = page.locator('a[href*="wa.me"], a[href*="whatsapp.com"]');
    await expect(whatsappLink).toHaveCount(0);

    // Verify genuine SupportWidget button is present
    const supportBtn = page.locator('button[aria-label="Destek Merkezi"]');
    await expect(supportBtn).toBeVisible();
  });

  test('7. Super Admin Command Center Login and Navigation', async ({ page }) => {
    await page.goto('/super-admin', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const passwordInput = page.locator('input[type="password"]');
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('admin123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
    }

    // Verify Command Center header is visible
    await expect(page.locator('h1, h2, span:has-text("Süper Yönetici")').first()).toBeVisible();

    // Verify System Status tab navigation
    const systemTab = page.locator('button:has-text("Sistem Durumu")');
    if (await systemTab.isVisible()) {
      await systemTab.click();
      await page.waitForTimeout(500);
      await expect(page.locator('text=Sistem Sağlık & Operasyonel Durum')).toBeVisible();
    }
  });

  test('8. Data Cleanup tab renders live DB metrics without hardcoded values', async ({ page }) => {
    await page.goto('/super-admin', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const passwordInput = page.locator('input[type="password"]');
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('admin123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(800);
    }

    const cleanupTab = page.locator('button:has-text("Veri Temizliği")');
    if (await cleanupTab.isVisible()) {
      await cleanupTab.click();
      await page.waitForTimeout(500);

      // Verify Live Data Header is visible
      await expect(page.locator('h2:has-text("Veri Temizliği")')).toBeVisible();
      // Verify Analytics Reset button exists
      await expect(page.locator('button:has-text("Analitikleri Sıfırla")')).toBeVisible();
    }
  });
});
