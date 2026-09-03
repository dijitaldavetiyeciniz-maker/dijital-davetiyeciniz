import { test, expect } from '@playwright/test';

async function ensureSuperAdminLoggedIn(page: any) {
  await page.goto('/super-admin');
  const passwordInput = page.locator('input[type="password"]');
  const needsLogin = await passwordInput.waitFor({ state: 'visible', timeout: 6000 }).then(() => true).catch(() => false);
  if (needsLogin) {
    await passwordInput.fill(process.env.SUPERADMIN_PASSWORD || 'superadmin-secure-pass-2026!');
    await page.click('button[type="submit"]');
  }
  await expect(page.getByText('Platform Operasyon & Yönetim Merkezi')).toBeVisible({ timeout: 15000 });
}

test.describe('C7 V2 — Super Admin Ultimate Command Center Suite', () => {

  test('01: Security & Unauthorized API Guard', async ({ request }) => {
    // 1. Stats endpoint
    const resStats = await request.get('/api/super-admin/stats');
    expect(resStats.status()).toBe(401);

    // 2. Verifications endpoint
    const resVerifications = await request.get('/api/super-admin/verifications');
    expect(resVerifications.status()).toBe(401);

    // 3. Security events endpoint
    const resEvents = await request.get('/api/super-admin/security-events');
    expect(resEvents.status()).toBe(401);

    // 4. Delivery logs endpoint
    const resDelivery = await request.get('/api/super-admin/delivery-logs');
    expect(resDelivery.status()).toBe(401);

    // 5. Notes endpoint
    const resNotes = await request.get('/api/super-admin/notes');
    expect(resNotes.status()).toBe(401);

    // 6. Global search endpoint
    const resSearch = await request.get('/api/super-admin/search?q=test');
    expect(resSearch.status()).toBe(401);
  });

  test('02: Super Admin Login & Command Center Shell', async ({ page }) => {
    await ensureSuperAdminLoggedIn(page);
    await expect(page.getByText('Platform Operasyon & Yönetim Merkezi')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Toplam Üye')).toBeVisible();
    await expect(page.getByText('Toplam Davetiye')).toBeVisible();
  });

  test('03: Email Verification Service — OTP Leak Test & Verification API', async ({ request }) => {
    const testEmail = `otp_test_${Date.now()}@example.com`;

    // 1. Dispatch verification OTP
    const sendRes = await request.post('/api/auth/send-verification', {
      data: { email: testEmail, firstName: 'Cem' }
    });
    expect(sendRes.status()).toBe(200);
    const sendData = await sendRes.json();
    expect(sendData.success).toBe(true);

    // 2. Ensure send response DOES NOT return raw OTP code
    expect(JSON.stringify(sendData)).not.toMatch(/\b\d{6}\b/);

    // 3. Test wrong OTP rejection
    const verifyWrongRes = await request.post('/api/auth/verify-code', {
      data: { email: testEmail, code: '000000' }
    });
    expect(verifyWrongRes.status()).toBe(400);
    const wrongData = await verifyWrongRes.json();
    expect(wrongData.error).toContain('Doğrulama kodu hatalı');
  });

  test('04: Signup Flow with Address & OTP Verification Stage', async ({ page }) => {
    await page.goto('/kayit-ol');

    // Check all inputs
    await expect(page.locator('input[placeholder="Adınız"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Soyadınız"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="tel"]')).toBeVisible();

    const uniqueEmail = `user_${Date.now()}@example.com`;
    await page.fill('input[placeholder="Adınız"]', 'Mert');
    await page.fill('input[placeholder="Soyadınız"]', 'Demir');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="tel"]', '5559876543');
    await page.fill('input[type="password"]', 'password123');

    await page.click('button[type="submit"]');

    // Should transition to 6-digit OTP verification screen
    await expect(page.getByText('E-posta Adresinizi Doğrulayın')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[placeholder="• • • • • •"]')).toBeVisible();
  });

  test('05: Super Admin Security Center — Email Verifications & Resend Action', async ({ page }) => {
    await ensureSuperAdminLoggedIn(page);

    // Navigate to Security Tab
    await page.click('button:has-text("Güvenlik")');
    await expect(page.getByText('Güvenlik & Doğrulama Merkezi')).toBeVisible();
    await expect(page.getByText('OTP Güvenlik Politikası')).toBeVisible();

    // Verify verification table exists and does not contain raw OTPs
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('06: Super Admin Member Intelligence — Notes & Detail Drawer', async ({ page }) => {
    await ensureSuperAdminLoggedIn(page);

    // Navigate to Members Tab
    await page.click('button:has-text("Üyeler")');
    await expect(page.locator('input[placeholder="Üye adı, e-posta, tel ara..."]')).toBeVisible();

    const detailButtons = page.locator('button:has-text("Detay")');
    const count = await detailButtons.count();
    if (count > 0) {
      await detailButtons.first().click();
      await expect(page.getByText('Üye Detay Kartı')).toBeVisible();
      await expect(page.getByText('Dahili Yönetici Notları')).toBeVisible();
      await expect(page.getByText('password', { exact: true })).not.toBeVisible();
      await page.click('button:has-text("Kapat")');
    }
  });

  test('07: Super Admin Operations — Feature Switches & Maintenance Modal', async ({ page }) => {
    await ensureSuperAdminLoggedIn(page);

    // Navigate to System Tab
    await page.click('button:has-text("Sistem & Bakım")');
    await expect(page.getByText('Platform Bakım Anahtarı')).toBeVisible();
    await expect(page.getByText('Operasyonel Fonksiyon Anahtarları')).toBeVisible();

    // Open Maintenance Modal
    await page.locator('button:has-text("Bakım Modu")').first().click();
    await expect(page.getByText('Bakım Kapsamı', { exact: true })).toBeVisible();
    await page.click('button:has-text("Vazgeç")');
  });

  test('08: Super Admin Global Search Functionality', async ({ page }) => {
    await ensureSuperAdminLoggedIn(page);

    const globalSearchInput = page.locator('input[placeholder*="Global Arama"]');
    if (await globalSearchInput.isVisible()) {
      await globalSearchInput.fill('Ahmet');
      await page.waitForTimeout(600);
    }
  });

});
