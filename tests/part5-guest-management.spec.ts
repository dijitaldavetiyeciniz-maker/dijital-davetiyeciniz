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
    await page.goto(`/${fixture.testSlug}/admin`);

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
    const dialog = page.locator('.fixed.inset-0').filter({
      has: page.getByRole('button', { name: 'Ekle', exact: true }),
    });

    await dialog.locator('input').nth(0).fill('Ahmet');
    await dialog.locator('input').nth(1).fill('Yılmaz');
    await dialog.getByRole('button', { name: 'Ekle', exact: true }).click();
    await expect(page.locator('table')).toContainText('Ahmet Yılmaz');

    // Ara
    await page.fill('input[placeholder="İsim veya soyisim ile ara..."]', 'Ahmet');
    await expect(page.locator('table')).toContainText('Ahmet Yılmaz');
    await page.fill('input[placeholder="İsim veya soyisim ile ara..."]', '');

    // Dışa aktar: CSV
    await page.click('text="Dışa Aktar"');
    const exportDialog = page.locator('.fixed.inset-0').filter({
      has: page.getByRole('button', { name: 'İndir', exact: true }),
    });
    await exportDialog.locator('select').selectOption('csv');
    const [csvDownload] = await Promise.all([
      page.waitForEvent('download'),
      exportDialog.getByRole('button', { name: 'İndir', exact: true }).click()
    ]);
    expect(csvDownload.suggestedFilename()).toContain('.csv');

    // Dışa aktar: XLSX (varsayılan format)
    await page.click('text="Dışa Aktar"');
    const exportDialogXlsx = page.locator('.fixed.inset-0').filter({
      has: page.getByRole('button', { name: 'İndir', exact: true }),
    });
    const [xlsxDownload] = await Promise.all([
      page.waitForEvent('download'),
      exportDialogXlsx.getByRole('button', { name: 'İndir', exact: true }).click()
    ]);
    expect(xlsxDownload.suggestedFilename()).toContain('.xlsx');

    // Mobil overflow kontrol et
    await page.setViewportSize({ width: 375, height: 812 });
    const hasHorizontalScroll = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(hasHorizontalScroll).toBe(false);
  });
});
