import { test, expect } from '@playwright/test';

test.describe('PART 5A - Guest Management E2E', () => {
  const isCI = process.env.CI === "true";

  test.beforeEach(async () => {
    if (isCI && !process.env.PART5_TEST_DATABASE_URL) {
      throw new Error("PART5_TEST_DATABASE_URL is required in CI");
    }
    if (!isCI && !process.env.PART5_TEST_DATABASE_URL) {
      test.skip(true, 'Skipped locally because PART5_TEST_DATABASE_URL is missing');
    }
  });

  test('Guest Management E2E Flow', async ({ page }) => {
    // Admin misafir sekmesi açılır
    await page.goto('/d/test-wedding/admin');
    await page.click('text="Misafirler"');

    // Misafir eklenir
    await page.click('text="Yeni Misafir Ekle"');
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
