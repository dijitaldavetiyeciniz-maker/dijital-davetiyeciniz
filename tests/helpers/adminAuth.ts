import { expect, Page } from '@playwright/test';

/**
 * Canonical Admin Login Helper for Playwright E2E Suites
 * Standardized across C12, C13, and Part5 tests.
 */
export async function loginAsAdmin(page: Page, slugOrId: string, password: string = 'test') {
  // Attach listeners for browser diagnostics
  page.on('console', (msg) => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', (err) => console.error(`[BROWSER ERROR] ${err.stack || err.message}`));

  console.log(`--- [adminAuth] Navigating to /${slugOrId}/admin`);
  const response = await page.goto(`/${slugOrId}/admin`);
  expect(response?.status()).toBeLessThan(500);

  await page.waitForLoadState('networkidle').catch(() => {});

  // Wait for either the login form (password input) or dashboard header/nav
  const loginOrDashboard = page.locator('input[type="password"], input[placeholder="Şifre"], header h1, nav button');
  await expect(loginOrDashboard.first()).toBeVisible({ timeout: 20000 });

  const passwordInput = page.locator('input[type="password"], input[placeholder="Şifre"]').first();
  const isVisible = await passwordInput.isVisible();

  if (isVisible) {
    console.log(`--- [adminAuth] Filling admin password`);
    await passwordInput.fill(password);
    await page.waitForTimeout(200);

    const submitBtn = page.locator('form button[type="submit"], button:has-text("Giriş Yap")').first();

    console.log(`--- [adminAuth] Submitting login and waiting for /api/admin/auth`);
    await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes('/api/admin/auth') && resp.request().method() === 'POST',
        { timeout: 20000 }
      ),
      submitBtn.click()
    ]);

    await page.waitForSelector('header h1, nav button', { timeout: 20000 });
    console.log(`--- [adminAuth] Dashboard loaded successfully`);
  } else {
    console.log(`--- [adminAuth] Already authenticated`);
  }
}
