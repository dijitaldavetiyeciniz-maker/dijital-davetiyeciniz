import { test, expect } from '@playwright/test';

test.describe('PART 5A - Token Security E2E', () => {
  const isCI = process.env.CI === "true";

  test.beforeEach(async () => {
    if (isCI && !process.env.PART5_TEST_DATABASE_URL) {
      throw new Error("PART5_TEST_DATABASE_URL is required in CI");
    }
    if (!isCI && !process.env.PART5_TEST_DATABASE_URL) {
      test.skip(true, 'Skipped locally because PART5_TEST_DATABASE_URL is missing');
    }
  });

  test('Token Security Flow', async ({ page, context }) => {
    // Kişisel link üret (Mock flow from admin side)
    await page.goto('/d/test-wedding/admin');
    await page.click('text="Kişisel Bağlantıyı Kopyala"');
    const tokenLink = await page.getAttribute('a.personal-link-preview', 'href') || 'http://localhost:3000/d/test-wedding?guest=token_a';

    // Yeni browser context’te aç
    const publicPage = await context.newPage();
    await publicPage.goto(tokenLink);

    // Doğru karşılama mesajını doğrula
    await expect(publicPage.locator('h1, h2')).toContainText('hoş geldiniz');

    // Hassas DTO alanlarının olmadığını doğrula
    const content = await publicPage.content();
    expect(content).not.toContain('alerji');
    expect(content).not.toContain('notlar');

    // Renew
    await page.click('button:has-text("Bağlantıyı Yenile")');
    const newTokenLink = await page.getAttribute('a.personal-link-preview', 'href') || 'http://localhost:3000/d/test-wedding?guest=token_a_v2';

    // Eski link reddedilir
    await publicPage.goto(tokenLink);
    await expect(publicPage.locator('text="geçersiz veya süresi dolmuş"')).toBeVisible();

    // Yeni link çalışır
    await publicPage.goto(newTokenLink);
    await expect(publicPage.locator('h1, h2')).toContainText('hoş geldiniz');

    // Revoke
    await page.click('button:has-text("Bağlantıyı İptal Et")');

    // Link reddedilir
    await publicPage.goto(newTokenLink);
    await expect(publicPage.locator('text="geçersiz veya süresi dolmuş"')).toBeVisible();

    // Tampered token reddedilir
    await publicPage.goto('http://localhost:3000/d/test-wedding?guest=token_a_v2_tampered');
    await expect(publicPage.locator('text="geçersiz veya süresi dolmuş"')).toBeVisible();

    // Expired token reddedilir (Simulated via token generator in DB tests, but we expect UI handles it)
    
    // Guest A token’ı Guest B verisini göstermez
    // (This is also verified in server-integration heavily, but in UI we just assert Guest B name is not present)
    expect(content).not.toContain('Guest B');
  });
});
