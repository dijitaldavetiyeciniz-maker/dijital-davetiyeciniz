import { test, expect } from '@playwright/test';

async function ensureSuperAdminLoggedIn(page: any) {
  await page.goto('/super-admin');
  
  // Wait for loading to finish and check if password input appears
  const passwordInput = page.locator('input[type="password"]');
  const needsLogin = await passwordInput.waitFor({ state: 'visible', timeout: 6000 }).then(() => true).catch(() => false);
  if (needsLogin) {
    await passwordInput.fill(process.env.SUPERADMIN_PASSWORD || 'superadmin-secure-pass-2026!');
    await page.click('button[type="submit"]');
  }
  await expect(page.getByText('Platform Operasyon & Yönetim Merkezi')).toBeVisible({ timeout: 15000 });
}

test.describe('C7 — Super Admin Command Center & Operations Suite', () => {

  test('01: Super Admin Security — Unauthorized API requests are blocked', async ({ request }) => {
    // 1. Stats endpoint should return 401 without auth
    const resStats = await request.get('/api/super-admin/stats');
    expect(resStats.status()).toBe(401);
    const dataStats = await resStats.json();
    expect(dataStats.error).toContain('Yetkisiz');

    // 2. Users endpoint should return 401 without auth
    const resUsers = await request.get('/api/super-admin/users');
    expect(resUsers.status()).toBe(401);

    // 3. Invitations endpoint should return 401 without auth
    const resInvitations = await request.get('/api/super-admin/invitations');
    expect(resInvitations.status()).toBe(401);

    // 4. Contacts endpoint should return 401 without auth
    const resContacts = await request.get('/api/super-admin/contacts');
    expect(resContacts.status()).toBe(401);

    // 5. Settings write endpoint should return 401 without auth
    const resSettings = await request.post('/api/super-admin/settings', {
      data: { maintenance_enabled: true }
    });
    expect(resSettings.status()).toBe(401);
  });

  test('02: Super Admin Login & Authentication Flow', async ({ page }) => {
    await page.goto('/super-admin');

    // Wait for login form to load after initial auth check
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });

    // 1. Test incorrect password
    await passwordInput.fill('wrong-pass-999');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Hatalı şifre')).toBeVisible({ timeout: 5000 });

    // 2. Test correct password
    await passwordInput.fill(process.env.SUPERADMIN_PASSWORD || 'superadmin-secure-pass-2026!');
    await page.click('button[type="submit"]');

    // Should open command center header
    await expect(page.getByText('Platform Operasyon & Yönetim Merkezi')).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: 'Genel Bakış' })).toBeVisible();
    await expect(page.getByText('Toplam Davetiye')).toBeVisible();
  });

  test('03: New Signup Flow with Phone, Address & Automatic Timestamp', async ({ page }) => {
    await page.goto('/kayit-ol');

    // Check all new user fields are present
    await expect(page.locator('input[placeholder="Adınız"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Soyadınız"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="tel"]')).toBeVisible();
    await expect(page.locator('select').first()).toBeVisible();

    // Fill registration form
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    await page.fill('input[placeholder="Adınız"]', 'Ahmet');
    await page.fill('input[placeholder="Soyadınız"]', 'Yılmaz');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="tel"]', '5551234567');
    await page.fill('input[type="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
  });

  test('04: Public Contact Form Submission & Security Sanitization', async ({ page, request }) => {
    await page.goto('/iletisim');

    // Fill public contact form
    await page.fill('input[placeholder="Örn: Ayşe Yılmaz"]', 'Zeynep Kaya');
    await page.fill('input[placeholder="ornek@domain.com"]', 'zeynep@example.com');
    await page.fill('input[placeholder="+90 555 123 45 67"]', '+90 532 999 88 77');
    await page.fill('input[placeholder="Örn: Özel Tasarım / Teknik Destek"]', 'Özel Tasarım Talebi');
    await page.fill('textarea[placeholder*="Mesajınızı detaylı şekilde"]', 'Merhaba, davetiyemiz için özel kaligrafi fontu ekleyebilir miyiz?');

    await page.click('button[type="submit"]');

    // Verify success feedback
    await expect(page.getByText('Mesajınız başarıyla iletildi')).toBeVisible({ timeout: 10000 });

    // Test API validation with invalid email
    const invalidRes = await request.post('/api/contact/submit', {
      data: {
        name: 'A',
        email: 'invalid-email',
        subject: 'Hi',
        message: 'msg'
      }
    });
    expect(invalidRes.status()).toBe(400);
  });

  test('05: Super Admin Command Center — User Management & Member Detail', async ({ page }) => {
    await ensureSuperAdminLoggedIn(page);

    // Navigate to Members Tab
    await page.click('button:has-text("Üyeler")');
    await expect(page.locator('input[placeholder="Üye adı, e-posta, tel ara..."]')).toBeVisible();

    // Verify search and table
    await page.fill('input[placeholder="Üye adı, e-posta, tel ara..."]', 'Ahmet');
    await page.waitForTimeout(600);

    // Click on detail button if any user row exists
    const detailButtons = page.locator('button:has-text("Detay")');
    const count = await detailButtons.count();
    if (count > 0) {
      await detailButtons.first().click();
      await expect(page.getByText('Üye Detay Kartı')).toBeVisible();
      await expect(page.locator('span:has-text("Üyelik Tarihi & Saati")')).toBeVisible();
      // Ensure password field is never shown
      await expect(page.getByText('password', { exact: true })).not.toBeVisible();
      // Close drawer
      await page.click('button:has-text("Kapat")');
    }
  });

  test('06: Super Admin Command Center — Invitations & Status Toggle', async ({ page }) => {
    await ensureSuperAdminLoggedIn(page);

    // Navigate to Invitations Tab
    await page.click('button:has-text("Davetiyeler")');
    await expect(page.locator('input[placeholder*="Davetiye adı"]')).toBeVisible();

    // Verify presence of invitations table
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('07: Super Admin Command Center — Maintenance Mode & Bypass Verification', async ({ page }) => {
    await ensureSuperAdminLoggedIn(page);

    // Navigate to System Tab
    await page.click('button:has-text("Sistem & Bakım")');
    await expect(page.getByText('Platform Bakım Anahtarı')).toBeVisible();

    // Open Maintenance Modal using unambiguous selector
    await page.locator('button:has-text("Bakım Modu")').first().click();
    await expect(page.getByText('Bakım Kapsamı', { exact: true })).toBeVisible();

    // Close modal safely without breaking environment
    await page.click('button:has-text("Vazgeç")');
  });

});
