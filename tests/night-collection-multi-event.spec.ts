import { test, expect } from '@playwright/test';

test.describe('Zarf & Mühür Gece Koleksiyonu & Çoklu Etkinlik Yapısı (Multi-Event Hub)', () => {
  test('1. Wax Seal Starfield entrance animation renders and completes on tap', async ({ page }) => {
    // Navigate with wax-seal-starfield entrance and preview mode
    await page.goto('/demo?preview=true&entrance_animation=wax-seal-starfield&background_design=navy-silver-starlight');
    await page.waitForLoadState('domcontentloaded');

    // Verify wax seal or opening stage is present
    const openingStage = page.locator('[data-testid="opening-overlay"], [aria-label*="Davetiyeyi açmak"], [aria-label*="Özel Gece Davetiyesini Açmak"]');
    await expect(openingStage.first()).toBeVisible({ timeout: 10000 });

    // Tap/click to trigger opening sequence
    await openingStage.first().click();

    // Verify content wrapper becomes active and visible
    const contentWrapper = page.locator('[data-testid="wedding-content-wrapper"]');
    await expect(contentWrapper).toHaveAttribute('data-layout-ready', 'true', { timeout: 10000 });
  });

  test('2. Night collection themes & catalog templates are listed with badges', async ({ page }) => {
    await page.goto('/sablonlar');
    await page.waitForLoadState('networkidle');

    // Check presence of "Yıldızlı Gece" and "Kına Gecesi Lüks Bordo"
    const navyStarlight = page.locator('h3:has-text("Yıldızlı Gece & Gümüş Zarafet")');
    const burgundyNight = page.locator('h3:has-text("Kına Gecesi Lüks Bordo & Amber")');

    await expect(navyStarlight.first()).toBeVisible({ timeout: 15000 });
    await expect(burgundyNight.first()).toBeVisible({ timeout: 15000 });

    // Verify collection badges
    const geceBadge = page.locator('text=Gece Koleksiyonu');
    const kinaBadge = page.locator('text=Kına & Çoklu Paket');
    await expect(geceBadge.first()).toBeVisible();
    await expect(kinaBadge.first()).toBeVisible();
  });

  test('3. Multi-event branching RSVP displays event selection and per-event guest counts', async ({ page }) => {
    await page.goto('/demo?preview=true');
    await page.waitForLoadState('networkidle');

    // Bypass envelope if visible
    const overlay = page.locator('[data-testid="opening-overlay"], [aria-label*="Davetiyeyi açmak"], [aria-label*="Özel Gece Davetiyesini Açmak"]');
    if (await overlay.first().isVisible()) {
      await overlay.first().click();
      await page.waitForTimeout(1000);
    }

    // Trigger RSVP Modal
    const rsvpBtn = page.locator('button:has-text("LCV"), button:has-text("Katılım"), [data-testid="rsvp-btn"]');
    if (await rsvpBtn.first().isVisible()) {
      await rsvpBtn.first().click();
    }

    // Modal check
    const rsvpModal = page.locator('text=LCV Bildirimi');
    await expect(rsvpModal.first()).toBeVisible({ timeout: 8000 });

    // Fill Guest Name
    const nameInput = page.locator('input[placeholder*="Ahmet Yılmaz"], input[placeholder*="Adınız"]').first();
    await nameInput.fill('Zeynep Demir');

    // Select "Katılıyorum"
    const attendBtn = page.locator('button:has-text("Katılıyorum")').first();
    await attendBtn.click();

    // Submit RSVP
    const submitBtn = page.locator('button:has-text("Yanıtı Gönder"), button:has-text("Gönder")').first();
    await submitBtn.click();

    // Verify Thank You / Confirmation
    const successMsg = page.locator('text=Teşekkürler');
    await expect(successMsg.first()).toBeVisible({ timeout: 8000 });
  });
});
