import { test, expect } from '@playwright/test';
import { setupPart5Fixture } from './helpers/part5Fixtures';

test.describe('PART 5B - Check-in Flow', () => {
  const isCI = process.env.CI === "true";
  let fixture: any;
  let secondGuestId: string;

  test.beforeAll(async () => {
    fixture = await setupPart5Fixture('checkin');

    // Mükerrer/revoke senaryoları için ikinci bir misafir - fixture.supabase
    // service-role client'tır, RLS'e takılmadan direkt insert yapabiliyoruz
    // (aynı desen part5-access-control.spec.ts'teki grup oluşturma ile).
    const { data: guest2, error } = await fixture.supabase
      .from('guests')
      .insert({ wedding_id: fixture.weddingId, first_name: 'Revoke', last_name: 'Test' })
      .select('id')
      .single();
    if (error || !guest2) throw new Error('İkinci test misafiri oluşturulamadı: ' + error?.message);
    secondGuestId = guest2.id;
  });

  test.afterAll(async () => {
    if (fixture) await fixture.cleanup();
  });

  test.beforeEach(async () => {
    if (isCI && !process.env.PART5_TEST_DATABASE_URL) {
      throw new Error("PART5_TEST_DATABASE_URL is required in CI");
    }
  });

  test('Yetkisiz check-in isteği 401 döner', async ({ page }) => {
    const anonRes = await page.request.post('/api/check-ins', {
      data: { guest_id: fixture.guestId }
    });
    expect(anonRes.status()).toBe(401);
  });

  test('Yetkili check-in: başarılı, mükerrer engelleme, revoke edilmiş misafir yine de girebilir', async ({ page }) => {
    // Gerçek, kanıtlanmış admin giriş akışı (part5-guest-management.spec.ts
    // ile aynı desen)
    await page.goto(`/d/${fixture.testSlug}/admin`);
    await page.fill('input[placeholder="Şifre"]', 'test');
    await page.click('button:has-text("Giriş Yap")');
    await page.waitForLoadState('networkidle');

    // 1. İlk check-in başarılı olmalı
    const res1 = await page.request.post('/api/check-ins', {
      data: { guest_id: fixture.guestId }
    });
    expect(res1.status()).toBe(200);
    const data1 = await res1.json();
    expect(data1.success).toBe(true);
    expect(data1.alreadyCheckedIn).toBe(false);

    // 2. Aynı misafir tekrar taranırsa hata değil, "zaten check-in yapıldı" dönmeli
    const res2 = await page.request.post('/api/check-ins', {
      data: { guest_id: fixture.guestId }
    });
    expect(res2.status()).toBe(200);
    const data2 = await res2.json();
    expect(data2.alreadyCheckedIn).toBe(true);

    // 3. GET ile sayaç gerçekten 1 dönmeli (placeholder değil, gerçek check-in sayısı)
    const countRes = await page.request.get(`/api/check-ins?wedding_id=${fixture.weddingId}`);
    expect(countRes.status()).toBe(200);
    const countData = await countRes.json();
    expect(countData.count).toBe(1);

    // 4. İptal edilmiş (revoke) misafir yine de fiziksel girebilmeli (İş Kararı: Seçenek C)
    const revokeRes = await page.request.post(`/api/guests/${secondGuestId}/revoke`);
    expect(revokeRes.status()).toBe(200);

    const checkinRevokedRes = await page.request.post('/api/check-ins', {
      data: { guest_id: secondGuestId }
    });
    expect(checkinRevokedRes.status()).toBe(200);
    const revokedData = await checkinRevokedRes.json();
    expect(revokedData.success).toBe(true);
    expect(revokedData.alreadyCheckedIn).toBe(false);
  });

  test('Yenilenmiş (artık geçersiz) eski QR token ile check-in reddedilir', async ({ page }) => {
    const isTestModeEnabled = process.env.PART5_TEST_MODE === 'true';
    test.skip(!isTestModeEnabled, 'Bu test /api/test/guest-tokens yardımcı route\'unu gerektirir (sadece PART5_TEST_MODE=true iken açık)');

    const apiUrl = '/api/test/guest-tokens';

    // Mevcut (eski) token'ı üret
    const genRes = await page.request.post(apiUrl, {
      data: {
        action: 'generate',
        payload: { publicId: fixture.guestPublicId, tokenVersion: fixture.guestTokenVersion }
      }
    });
    const { token: oldToken } = await genRes.json();

    // Misafirin linkini GERÇEK renewGuestToken fonksiyonuyla yenile
    // (token_version DB'de artar, eski token artık geçersiz olmalı)
    const renewRes = await page.request.post(apiUrl, {
      data: { action: 'renew', payload: { guestId: fixture.guestId } }
    });
    expect(renewRes.status()).toBe(200);

    // Admin girişi (check-in endpoint'i yetki gerektiriyor)
    await page.goto(`/d/${fixture.testSlug}/admin`);
    await page.fill('input[placeholder="Şifre"]', 'test');
    await page.click('button:has-text("Giriş Yap")');
    await page.waitForLoadState('networkidle');

    // Eski (artık geçersiz) token ile check-in denemesi reddedilmeli
    const res = await page.request.post('/api/check-ins', {
      data: { token: oldToken }
    });
    expect(res.status()).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('geçerli değil');
  });

  test('Hızlı Ekle akışı: yeni misafir oluşturur ve anında check-in yapar', async ({ page }) => {
    await page.goto(`/d/${fixture.testSlug}/admin`);
    await page.fill('input[placeholder="Şifre"]', 'test');
    await page.click('button:has-text("Giriş Yap")');
    await page.waitForLoadState('networkidle');

    const createRes = await page.request.post('/api/guests', {
      data: {
        wedding_id: fixture.weddingId,
        guests: [{ first_name: 'Hızlı', last_name: 'Eklenen' }]
      }
    });
    expect(createRes.status()).toBe(200);
    const createData = await createRes.json();
    const newGuestId = createData.guests?.[0]?.id ?? createData.guest?.id;
    expect(newGuestId).toBeTruthy();

    const checkinRes = await page.request.post('/api/check-ins', {
      data: { guest_id: newGuestId }
    });
    expect(checkinRes.status()).toBe(200);
    const checkinData = await checkinRes.json();
    expect(checkinData.success).toBe(true);
    expect(checkinData.guest.first_name).toBe('Hızlı');
  });
});
