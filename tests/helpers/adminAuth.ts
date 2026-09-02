import { expect, Page } from '@playwright/test';

/**
 * Canonical Admin Login Helper for Playwright E2E Suites
 * Standardized across C12, C13, and Part5 tests.
 */
export async function loginAsAdmin(page: Page, slugOrId: string, password: string = 'test') {
  const failedRequests: string[] = [];
  const api4xx: string[] = [];
  const api5xx: string[] = [];
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on('console', (msg) => {
    const text = `[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`;
    console.log(text);
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    const text = `[BROWSER ERROR] ${err.stack || err.message}`;
    console.error(text);
    pageErrors.push(err.message);
  });
  page.on('requestfailed', (req) => {
    const failure = req.failure();
    const text = `${req.method()} ${req.url()} - ${failure?.errorText || 'failed'}`;
    console.warn(`[REQUEST FAILED] ${text}`);
    failedRequests.push(text);
  });
  page.on('response', (res) => {
    const status = res.status();
    const url = res.url();
    if (status >= 400 && status < 500) {
      api4xx.push(`${res.request().method()} ${url} -> ${status}`);
    } else if (status >= 500) {
      api5xx.push(`${res.request().method()} ${url} -> ${status}`);
    }
  });

  console.log(`--- [adminAuth] Navigating to /${slugOrId}/admin`);
  const initialUrl = `/${slugOrId}/admin`;
  const response = await page.goto(initialUrl);
  const gotoStatus = response?.status() ?? 'NO_RESPONSE';
  console.log(`--- [adminAuth] GOTO_STATUS=${gotoStatus} GOTO_URL=${initialUrl} FINAL_PAGE_URL=${page.url()}`);

  await page.waitForLoadState('domcontentloaded').catch(() => {});

  const loginOrDashboard = page.locator('input[type="password"], input[placeholder="Şifre"], header h1, nav button');
  try {
    await expect(loginOrDashboard.first()).toBeVisible({ timeout: 20000 });
  } catch (err) {
    const finalUrl = page.url();
    const pageTitle = await page.title().catch(() => 'UNKNOWN');
    const bodyText = (await page.locator('body').innerText().catch(() => '')).slice(0, 500).replace(/\s+/g, ' ').trim();
    const headings = await page.locator('h1, h2, h3').allInnerTexts().catch(() => []);
    const buttons = await page.locator('button').allInnerTexts().catch(() => []);
    const inputs = await page.locator('input').evaluateAll((els) => els.map((e) => `${(e as HTMLInputElement).type}:${(e as HTMLInputElement).placeholder || (e as HTMLInputElement).name}`)).catch(() => []);
    const html = await page.content().catch(() => '');

    console.error(`\n================== ADMIN AUTH DIAGNOSTIC REPORT ==================`);
    console.error(`INITIAL_REQUEST_URL=${initialUrl}`);
    console.error(`INITIAL_RESPONSE_STATUS=${gotoStatus}`);
    console.error(`FINAL_URL=${finalUrl}`);
    console.error(`PAGE_TITLE=${pageTitle}`);
    console.error(`BODY_TEXT_FIRST_500=${bodyText}`);
    console.error(`VISIBLE_HEADINGS=${JSON.stringify(headings)}`);
    console.error(`VISIBLE_BUTTONS=${JSON.stringify(buttons)}`);
    console.error(`VISIBLE_INPUTS=${JSON.stringify(inputs)}`);
    console.error(`HTML_LENGTH=${html.length}`);
    console.error(`FAILED_REQUESTS=${JSON.stringify(failedRequests)}`);
    console.error(`API_4XX=${JSON.stringify(api4xx)}`);
    console.error(`API_5XX=${JSON.stringify(api5xx)}`);
    console.error(`PAGE_ERRORS=${JSON.stringify(pageErrors)}`);
    console.error(`CONSOLE_ERRORS=${JSON.stringify(consoleErrors)}`);
    console.error(`=================================================================\n`);
    throw err;
  }

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
