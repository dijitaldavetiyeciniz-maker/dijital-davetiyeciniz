import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

test.describe('Server Repository DB Integration', () => {
  const isCI = process.env.CI === "true";

  test.beforeEach(async () => {
    if (isCI && !process.env.PART5_TEST_DATABASE_URL) {
      throw new Error("PART5_TEST_DATABASE_URL is required in CI");
    }
    if (!isCI && !process.env.PART5_TEST_DATABASE_URL) {
      test.skip(true, 'Skipped locally because PART5_TEST_DATABASE_URL is missing');
    }
  });

  test('Guest Token Resolution and DB Boundary Checks', async ({ request }) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-key'
    );
    const apiUrl = '/api/test/guest-tokens';
    
    // 1. Wedding A oluştur
    const { data: weddingA, error: errA } = await supabase.from('weddings').insert({
      id: 'a0000000-0000-0000-0000-000000000001',
      slug: 'wedding-a-integration',
      is_active: true,
      bride_name: 'Bride A',
      groom_name: 'Groom A',
      admin_password: 'test'
    }).select().single();
    if (errA) throw errA;

    // 2. Wedding B oluştur
    const { data: weddingB, error: errB } = await supabase.from('weddings').insert({
      id: 'b0000000-0000-0000-0000-000000000002',
      slug: 'wedding-b-integration',
      is_active: true,
      bride_name: 'Bride B',
      groom_name: 'Groom B',
      admin_password: 'test'
    }).select().single();
    if (errB) throw errB;

    // 3. Guest A oluştur
    const { data: guestA } = await supabase.from('guests').insert({
      id: 'g0000000-0000-0000-0000-000000000001',
      wedding_id: weddingA.id,
      first_name: 'Guest',
      last_name: 'A',
      email: 'a@example.com',
      token_version: 1,
      allergy_notes: 'Peanut'
    }).select().single();

    // 4. Guest B oluştur
    const { data: guestB } = await supabase.from('guests').insert({
      id: 'g0000000-0000-0000-0000-000000000002',
      wedding_id: weddingB.id,
      first_name: 'Guest',
      last_name: 'B',
      email: 'b@example.com',
      token_version: 1,
      allergy_notes: 'Gluten'
    }).select().single();

    try {
      // 5. Guest A token oluştur
      const genARes = await request.post(apiUrl, { data: { action: 'generate', payload: { publicId: guestA.public_id, tokenVersion: 1 } } });
      const { token: tokenA } = await genARes.json();

      // 6. Guest A doğru slug’da çözülür
      let resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA, weddingId: 'wedding-a-integration' } } });
      const { resolved: resolvedA } = await resolveRes.json();
      expect(resolvedA).not.toBeNull();
      expect(resolvedA?.displayName).toBe('Guest A');

      // 7. Yanlış slug’da çözülmez
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA, weddingId: 'wedding-b-integration' } } });
      const { resolved: resolvedWrongSlug } = await resolveRes.json();
      expect(resolvedWrongSlug).toBeNull();

      // 8. Guest B verisi dönmez
      expect(JSON.stringify(resolvedA)).not.toContain('Guest B');

      // 9. token_version artırılır
      await supabase.from('guests').update({ token_version: 2 }).eq('id', guestA.id);

      // 10. Eski token çözülmez
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA, weddingId: 'wedding-a-integration' } } });
      const { resolved: resolvedA_old } = await resolveRes.json();
      expect(resolvedA_old).toBeNull();

      // 11. Yeni token çözülür
      const genANewRes = await request.post(apiUrl, { data: { action: 'generate', payload: { publicId: guestA.public_id, tokenVersion: 2 } } });
      const { token: tokenA_new } = await genANewRes.json();
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA_new, weddingId: 'wedding-a-integration' } } });
      const { resolved: resolvedA_new } = await resolveRes.json();
      expect(resolvedA_new).not.toBeNull();

      // 12. Revoke sonrası çözülmez
      await request.post(apiUrl, { data: { action: 'revoke', payload: { guestId: guestA.id } } });
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA_new, weddingId: 'wedding-a-integration' } } });
      const { resolved: resolvedA_revoked } = await resolveRes.json();
      expect(resolvedA_revoked).toBeNull();

      // 13. Reactivate sonrası eski token çözülmez
      await request.post(apiUrl, { data: { action: 'renew', payload: { guestId: guestA.id } } });
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA_new, weddingId: 'wedding-a-integration' } } });
      const { resolved: resolvedA_reactivated_old } = await resolveRes.json();
      expect(resolvedA_reactivated_old).toBeNull();

      // 14. Yeni token çözülür
      const { data: reactivatedGuestA } = await supabase.from('guests').select('token_version').eq('id', guestA.id).single();
      const genAReactivatedRes = await request.post(apiUrl, { data: { action: 'generate', payload: { publicId: guestA.public_id, tokenVersion: reactivatedGuestA!.token_version } } });
      const { token: tokenA_reactivated } = await genAReactivatedRes.json();
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA_reactivated, weddingId: 'wedding-a-integration' } } });
      const { resolved: resolvedA_reactivated } = await resolveRes.json();
      expect(resolvedA_reactivated).not.toBeNull();

      // 15. Expiry sonrası çözülmez
      const genExpiredRes = await request.post(apiUrl, { data: { action: 'generate', payload: { publicId: guestA.public_id, tokenVersion: reactivatedGuestA!.token_version, expiresAt: -1000 } } });
      const { token: expiredToken } = await genExpiredRes.json();
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: expiredToken, weddingId: 'wedding-a-integration' } } });
      const { resolved: resolvedA_expired } = await resolveRes.json();
      expect(resolvedA_expired).toBeNull();

      // 16. Soft delete sonrası çözülmez
      await supabase.from('guests').update({ deleted_at: new Date().toISOString() }).eq('id', guestA.id);
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA_reactivated, weddingId: 'wedding-a-integration' } } });
      const { resolved: resolvedA_deleted } = await resolveRes.json();
      expect(resolvedA_deleted).toBeNull();

      // 17. Public DTO yalnızca allowlist alanlarını taşır
      expect(Object.keys(resolvedA_reactivated!).sort()).toEqual(
        [
          "allowedChildren",
          "allowedPlusOnes",
          "displayName",
          "groupDisplayName",
          "rsvpStatus",
          "tableLabel",
        ].sort()
      );

      const resolvedAny = resolvedA_reactivated as any;
      expect(resolvedAny.id).toBeUndefined();
      expect(resolvedAny.public_id).toBeUndefined();
      expect(resolvedAny.email).toBeUndefined();
      expect(resolvedAny.phone).toBeUndefined();
      expect(resolvedAny.allergy_notes).toBeUndefined();
      expect(resolvedAny.special_needs).toBeUndefined();
      expect(resolvedAny.notes).toBeUndefined();
      expect(resolvedAny.token_version).toBeUndefined();
      expect(resolvedAny.token_revoked_at).toBeUndefined();
      
    } finally {
      // 18. Cleanup
      await supabase.from('guests').delete().eq('wedding_id', weddingA.id);
      await supabase.from('guests').delete().eq('wedding_id', weddingB.id);
      await supabase.from('weddings').delete().eq('id', weddingA.id);
      await supabase.from('weddings').delete().eq('id', weddingB.id);
    }
  });
});
