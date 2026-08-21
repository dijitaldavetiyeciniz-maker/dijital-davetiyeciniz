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
    if (!fixture) {
      test.skip(!fixture, "Skipping token security test locally without service-role DB credentials");
      return;
    }
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

    const publicPage = await context.newPage();

    // 1. C8 ISOLATION CHECK: When invitation is in draft (unpublished), guest token does NOT bypass publication gate
    await fixture.supabase
      .from('weddings')
      .update({ is_published: false, published_snapshot: null })
      .eq('id', fixture.weddingId);

    await publicPage.goto(tokenLink);
    const draftContent = await publicPage.content();
    expect(draftContent).toContain('Taslak Aşamasında');
    expect(draftContent).toContain('Bu Davetiye Henüz Yayında Değil');
    expect(draftContent).not.toContain('Sayın Fixture Guest, davetimize hoş geldiniz.');

    // 2. C8 PUBLISHED ACCESS: Once explicitly published, guest token renders personalized greeting
    const snapshot = {
      template_id: "template1",
      event_type: "wedding",
      bride_name: "Test Bride",
      groom_name: "Test Groom",
      wedding_date: "2027-10-15T19:00:00.000Z",
      venue_name: "Çırağan Sarayı",
      venue_address: "İstanbul",
      primary_color: "#be123c",
      text_color: "#1e293b",
      published_at: new Date().toISOString()
    };

    await fixture.supabase
      .from('weddings')
      .update({
        is_published: true,
        published_version_number: 1,
        published_snapshot: snapshot,
        custom_overrides: { published_snapshot: snapshot, is_published: true }
      })
      .eq('id', fixture.weddingId);

    await publicPage.goto(tokenLink);

    // Doğru karşılama mesajını doğrula
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
