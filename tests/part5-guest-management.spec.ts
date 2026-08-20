import { test, expect } from '@playwright/test';
import { setupPart5Fixture } from './helpers/part5Fixtures';

test.describe('PART 5A - Guest Management E2E', () => {
  const isCI = process.env.CI === "true";
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasServiceKey) {
    test('Skipping Part 5 Guest Management E2E locally due to missing database credentials', () => {
      console.log("LOCAL RUN: Skipping Part 5 Guest Management E2E tests since SUPABASE_SERVICE_ROLE_KEY is not defined.");
    });
    return;
  }

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

  test('C6 - Guest Management Removed From Admin Navigation', async ({ page }) => {
    // 1. Visit admin dashboard and login
    await page.goto(`/${fixture.testSlug}/admin`);
    await page.fill('input[placeholder="Şifre"]', 'test');
    await page.click('button:has-text("Giriş Yap")');

    // 2. Wait for page load
    await expect(page.locator('text=Davetiye Hazırlama Stüdyosu')).toBeVisible();

    // 3. Assert Guest/RSVP/Seating entries are completely absent in admin navigation
    await expect(page.locator('text="Misafir Yönetimi"')).not.toBeVisible();
    await expect(page.locator('text="Misafir Listesi"')).not.toBeVisible();
    await expect(page.locator('text="RSVP Yönetimi"')).not.toBeVisible();
    await expect(page.locator('text="Oturma Planı"')).not.toBeVisible();

    // 4. Verify C6 guided step navigation is present with correct terminology
    await expect(page.locator('nav button:has-text("Bilgiler")')).toBeVisible();
    await expect(page.locator('nav button:has-text("Etkinlik")')).toBeVisible();
    await expect(page.locator('nav button:has-text("Tasarım")')).toBeVisible();
    await expect(page.locator('nav button:has-text("İçerik")')).toBeVisible();
    await expect(page.locator('nav button:has-text("Özel İçerikler")')).toBeVisible();
    await expect(page.locator('nav button:has-text("Önizleme")')).toBeVisible();
    await expect(page.locator('nav button:has-text("Paylaşım")')).toBeVisible();
  });

  test('PART 5A - Guest Backend Preservation', async ({ page }) => {
    // 1. Authenticate session by logging in
    await page.goto(`/${fixture.testSlug}/admin`);
    await page.fill('input[placeholder="Şifre"]', 'test');
    await page.click('button:has-text("Giriş Yap")');
    await expect(page.locator('text=Davetiye Hazırlama Stüdyosu')).toBeVisible();

    // 2. Add Guest (POST /api/guests) using Zod-compliant payload shape
    const addRes = await page.request.post('/api/guests', {
      data: {
        wedding_id: fixture.weddingId,
        guests: [{
          first_name: 'Ahmet',
          last_name: 'Yılmaz',
          phone: '+905554443322',
          email: 'ahmet@example.com',
          plus_ones_allowed: 0,
          children_count: 0
        }]
      }
    });
    
    // Log response if status is not 200
    if (addRes.status() !== 200) {
      const responseText = await addRes.text();
      console.error(`GUEST POST FAILED - STATUS: ${addRes.status()} - BODY: ${responseText}`);
    }
    
    expect(addRes.status()).toBe(200);
    const postBody = await addRes.json();
    const addedGuest = postBody.guests[0];
    expect(addedGuest.first_name).toBe('Ahmet');
    expect(addedGuest.last_name).toBe('Yılmaz');
    const guestId = addedGuest.id;

    // 3. Query Guest List (GET /api/guests) and parse wrapper key
    const getRes = await page.request.get(`/api/guests?wedding_id=${fixture.weddingId}`);
    expect(getRes.status()).toBe(200);
    const getBody = await getRes.json();
    const guestsList = getBody.guests;
    expect(Array.isArray(guestsList)).toBe(true);
    const found = guestsList.find((g: any) => g.id === guestId);
    expect(found).toBeDefined();

    // 4. Update Guest Info (PUT /api/guests/[id]) and parse wrapper key
    const updateRes = await page.request.put(`/api/guests/${guestId}`, {
      data: {
        first_name: 'Ahmet',
        last_name: 'Yılmaz Güncellendi',
        phone: '+905554443322',
        email: 'ahmet@example.com'
      }
    });
    expect(updateRes.status()).toBe(200);
    const updateBody = await updateRes.json();
    const updated = updateBody.guest;
    expect(updated.last_name).toBe('Yılmaz Güncellendi');

    // 5. Delete Guest (DELETE /api/guests/[id])
    const deleteRes = await page.request.delete(`/api/guests/${guestId}`);
    expect(deleteRes.status()).toBe(200);

    // Verify deletion
    const verifyRes = await page.request.get(`/api/guests?wedding_id=${fixture.weddingId}`);
    const verifyBody = await verifyRes.json();
    const verifyList = verifyBody.guests;
    const stillExists = verifyList.some((g: any) => g.id === guestId);
    expect(stillExists).toBe(false);
  });
});
