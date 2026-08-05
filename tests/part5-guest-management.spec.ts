import { test, expect } from '@playwright/test';
import { setupPart5Fixture } from './helpers/part5Fixtures';

test.describe('PART 5A - Guest Management E2E', () => {
  const isCI = process.env.CI === "true";

  let fixture: any;

  test.beforeAll(async () => {
    fixture = await setupPart5Fixture('guest-mgmt');
  });

  test.afterAll(async () => {
    if (fixture) await fixture.cleanup();
  });

  test.beforeEach(async () => {
    if (isCI && !process.env.PART5_TEST_DATABASE_URL) {
      throw new Error("PART5_TEST_DATABASE_URL is required in CI");
    }
  });

  test('Guest Management E2E Flow', async ({ page }) => {
    // Admin sayfasına git
    await page.goto(`/d/${fixture.testSlug}/admin`);

    // Şifre ile giriş yap
    await page.fill('input[placeholder="Şifre"]', 'test');
    await page.click('button:has-text("Giriş Yap")');

    // Sayfa yükleninceye kadar bekle
    await expect(page.locator('text="Misafir Yönetimi"')).toBeVisible();

    await page.click('text="Misafir Yönetimi"');

    // Misafir eklenir
    await page.screenshot({
      path: "test-results/guest-management-before-add-button.png",
      fullPage: true
    });

    try {
      await page.getByRole('button', { name: '+ Yeni Misafir' }).click({ timeout: 5000 });
    } catch (error) {
      const html = await page.locator("body").evaluate(el => el.innerHTML);
      console.log(html);
      throw error;
    }
    await page.fill('input[name="first_name"]', 'Ahmet');
    await page.fill('input[name="last_name"]', 'Yılmaz');
    await page.click('button[type="submit"]');
    await expect(page.locator('table')).toContainText('Ahmet Yılmaz');

    // Düzenlenir
    await page.click('text="Düzenle"');
    await page.fill('input[name="allergy_notes"]', 'Gluten');
    await page.click('button:has-text("Kaydet")');

    // Ara
    await page.fill('input[placeholder="Misafir Ara..."]', 'Ahmet');
    await expect(page.locator('table')).toContainText('Ahmet Yılmaz');

    // RSVP filtrele
    await page.click('text="Filtrele"');
    await page.click('text="Sadece LCV Onaylayanlar"');

    // Grup filtrele
    await page.click('text="Grup Seç"');
    await page.click('text="Aile"');

    // Plus-one ve çocuk değerlerini güncelle
    await page.click('text="Düzenle"');
    await page.fill('input[name="plus_ones_allowed"]', '1');
    await page.fill('input[name="children_count"]', '2');
    await page.click('button:has-text("Kaydet")');

    // Soft delete
    await page.click('text="Sil"');
    await expect(page.locator('table')).not.toContainText('Ahmet Yılmaz');

    // CSV export indir
    const [csvDownload] = await Promise.all([
      page.waitForEvent('download'),
      page.click('text="CSV İndir"')
    ]);
    expect(csvDownload.suggestedFilename()).toContain('.csv');

    // XLSX export indir
    const [xlsxDownload] = await Promise.all([
      page.waitForEvent('download'),
      page.click('text="Excel İndir"')
    ]);
    expect(xlsxDownload.suggestedFilename()).toContain('.xlsx');

    // Mobil overflow kontrol et
    await page.setViewportSize({ width: 375, height: 812 });
    const hasHorizontalScroll = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(hasHorizontalScroll).toBe(false);
  });
});
