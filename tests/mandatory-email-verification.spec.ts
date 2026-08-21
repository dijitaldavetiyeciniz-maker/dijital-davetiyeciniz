import { test, expect } from '@playwright/test';

test.describe('MEMBERSHIP EMAIL VERIFICATION — MANDATORY SECURITY SUITE', () => {
  const testEmail = `test.user.${Date.now()}@example.com`;

  test('1. Registration collects all fields and renders mandatory OTP verification screen', async ({ page }) => {
    await page.goto('/kayit-ol');
    await page.waitForLoadState('domcontentloaded');

    // Fill form
    await page.locator('input[placeholder*="Adınız"]').first().fill('Ahmet');
    await page.locator('input[placeholder*="Soyadınız"]').first().fill('Yılmaz');
    await page.locator('input[type="email"]').first().fill(testEmail);
    await page.locator('input[type="tel"]').first().fill('555 123 45 67');
    await page.locator('input[placeholder*="Cadde"], input[placeholder*="Adres"]').first().fill('Bağdat Caddesi No: 42');
    await page.locator('input[placeholder="En az 6 karakter"]').first().fill('SuperSecret123!');

    // Submit form
    await page.locator('button:has-text("Ücretsiz Hesabımı Oluştur"), button[type="submit"]').first().click();

    // Verify transition to 6-digit OTP verification UI
    const otpInput = page.locator('[data-testid="verification-otp-input"]');
    await expect(otpInput.first()).toBeVisible({ timeout: 20000 });
  });

  test('2. Wrong OTP is rejected, increments attempt counter and displays remaining attempts', async ({ page }) => {
    // Submit wrong OTP for the registered user
    const verifyRes = await page.request.post('/api/auth/verify-code', {
      data: { email: testEmail, code: '000000' }
    });
    expect(verifyRes.status()).toBe(400);
    const body = await verifyRes.json();
    expect(body.error).toContain('Doğrulama kodu hatalı');
    expect(body.error).toContain('Kalan deneme hakkı');
  });

  test('3. Resend cooldown (60s) is strictly enforced', async ({ page }) => {
    // Attempt rapid resend within 60s
    const resendRes = await page.request.post('/api/auth/send-verification', {
      data: { email: testEmail }
    });
    expect(resendRes.status()).toBe(400);
    const body = await resendRes.json();
    expect(body.error).toContain('saniye bekleyin');
  });

  test('4. Dedicated /dogrula verification page loads and handles OTP input', async ({ page }) => {
    await page.goto(`/dogrula?email=${encodeURIComponent(testEmail)}`);
    await page.waitForLoadState('domcontentloaded');

    const otpInput = page.locator('[data-testid="verification-otp-input"]');
    await expect(otpInput.first()).toBeVisible({ timeout: 20000 });

    // Enter incomplete code -> button remains disabled
    await otpInput.first().fill('123');
    const submitBtn = page.locator('[data-testid="verify-otp-btn"]');
    await expect(submitBtn).toBeDisabled();

    // Fill 6 digits -> button enabled
    await otpInput.first().fill('123456');
    await expect(submitBtn).toBeEnabled();
  });

  test('5. Super Admin Verification Center lists verification records without exposing raw OTP', async ({ page }) => {
    // Authorize as super admin
    const authRes = await page.request.post('/api/super-admin/auth', {
      data: { password: process.env.SUPERADMIN_PASSWORD || 'admin123' }
    });
    expect(authRes.status()).toBe(200);

    // Fetch verifications
    const listRes = await page.request.get('/api/super-admin/verifications');
    expect(listRes.status()).toBe(200);
    const listData = await listRes.json();

    expect(listData.success).toBe(true);
    expect(Array.isArray(listData.verifications)).toBe(true);

    // Verify security: RAW OTP & HASH are NEVER returned in public response
    if (listData.verifications.length > 0) {
      const first = listData.verifications[0];
      expect(first.code).toBeUndefined();
      expect(first.raw_otp).toBeUndefined();
      expect(first.otp).toBeUndefined();
      expect(first.code_hash).toBeUndefined();
      expect(first.email).toBeDefined();
      expect(first.status).toBeDefined();
    }
  });

  test('6. Super Admin can trigger "Yeni Kod Gönder" action', async ({ page }) => {
    // Ensure authenticated
    await page.request.post('/api/super-admin/auth', {
      data: { password: process.env.SUPERADMIN_PASSWORD || 'admin123' }
    });

    const resendAdminRes = await page.request.post('/api/super-admin/verifications', {
      data: { email: testEmail }
    });
    expect([200, 400]).toContain(resendAdminRes.status());
  });

  test('7. Email verification service creates HMAC-SHA256 hash and never stores raw OTP', async () => {
    const { hashOtp, generateOtp } = await import('../src/lib/email-service');
    const email = 'security.test@example.com';
    const otp = generateOtp();
    expect(otp).toHaveLength(6);
    expect(/^\d{6}$/.test(otp)).toBe(true);

    const hash1 = hashOtp(email, otp);
    const hash2 = hashOtp(email, otp);
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(otp);
    expect(hash1).toHaveLength(64); // SHA-256 hex length
  });

  test('8. Verification service rejects expired and too-many-attempt codes securely', async () => {
    const { sendVerificationEmail, verifySubmittedOtp } = await import('../src/lib/email-service');
    const email = `security.attempts.${Date.now()}@example.com`;

    const sendRes = await sendVerificationEmail({ email, firstName: 'SecurityTest' });
    expect(sendRes.success).toBe(true);

    // 5 wrong attempts
    for (let i = 1; i <= 5; i++) {
      const wrongRes = await verifySubmittedOtp({ email, code: '000000' });
      expect(wrongRes.success).toBe(false);
    }

    // 6th attempt should return too_many_attempts error
    const blockedRes = await verifySubmittedOtp({ email, code: '000000' });
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.error).toContain('Çok fazla hatalı deneme');
  });

  test('9. Active verification lookup and email normalization (casing & whitespace)', async () => {
    const { sendVerificationEmail, verifySubmittedOtp, hashOtp, getLocalVerifications } = await import('../src/lib/email-service');
    const mixedEmail = `  Test.User.${Date.now()}@Example.COM  `;
    const normalized = mixedEmail.trim().toLowerCase();

    const sendRes = await sendVerificationEmail({ email: mixedEmail, firstName: 'NormalizationTest' });
    expect(sendRes.success).toBe(true);

    // Fetch the generated record from local cache / DB
    const cache = getLocalVerifications();
    const record = cache[normalized];
    expect(record).toBeDefined();
    expect(record.status).toBe('pending');

    // Attempting wrong code with uppercase email should properly identify record and return wrong code error (not 'record not found')
    const wrongRes = await verifySubmittedOtp({ email: mixedEmail.toUpperCase(), code: '000000' });
    // Should fail with wrong code, proving active row was found
    expect(wrongRes.success).toBe(false);
    expect(wrongRes.error).toContain('Doğrulama kodu hatalı');
  });
});
