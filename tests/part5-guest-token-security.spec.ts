import { test, expect } from '@playwright/test';
import { setupPart5Fixture } from './helpers/part5Fixtures';

test.describe('PART 5A - Token Security E2E', () => {
  const isCI = process.env.CI === "true";
  let fixture: any;

  test.beforeAll(async () => {
    fixture = await setupPart5Fixture('token-sec');
  });

  test.afterAll(async () => {
    if (fixture) await fixture.cleanup();
  });

  test.beforeEach(async () => {
    if (isCI && !process.env.PART5_TEST_DATABASE_URL) {
      throw new Error("PART5_TEST_DATABASE_URL is required in CI");
    }
  });

  test('Token Security Flow', async ({ request, context }) => {
    const apiUrl = 'http://127.0.0.1:3000/api/test/guest-tokens';
    const baseUrl = 'http://127.0.0.1:3000';

    // Generate Token via Test API
    const genRes = await request.post(apiUrl, {
      data: {
        action: 'generate',
        payload: {
          publicId: fixture.guestPublicId,
          tokenVersion: fixture.guestTokenVersion,
        }
      }
    });
    
    expect(genRes.ok()).toBeTruthy();
    const { token } = await genRes.json();
    expect(token).toBeTruthy();

    const tokenLink = `${baseUrl}/${fixture.testSlug}?guest=${token}`;

    // Yeni browser context’te aç
    const publicPage = await context.newPage();
    await publicPage.goto(tokenLink);

    // Doğru karşılama mesajını doğrula (spesifik banner metniyle - genel 'div' seçici
    // gerçek sayfada onlarca div olduğu için Playwright strict-mode hatası veriyordu)
    const content = await publicPage.content();
    expect(content).toContain('Sayın Fixture Guest, davetimize hoş geldiniz.');

    // Hassas DTO alanlarının olmadığını doğrula
    expect(content).not.toContain('fixture@example.com');
    expect(content).not.toContain('+905554443322');

    // Revoke token via DB Update (or API if supported, here DB is easiest)
    await fixture.supabase
      .from('guests')
      .update({ token_revoked_at: new Date().toISOString() })
      .eq('id', fixture.guestId);

    // Link reddedilir: kişisel davet artık geçersiz, genel davetiyeye düşülür
    await publicPage.goto(tokenLink);
    await expect(publicPage.locator('text="Kişisel davet bağlantısı doğrulanamadı. Genel davetiyeyi görüntülüyorsunuz."')).toBeVisible();

    // Tampered token reddedilir
    await publicPage.goto(`${baseUrl}/${fixture.testSlug}?guest=${token}_tampered`);
    await expect(publicPage.locator('text="Kişisel davet bağlantısı doğrulanamadı. Genel davetiyeyi görüntülüyorsunuz."')).toBeVisible();
  });
});
