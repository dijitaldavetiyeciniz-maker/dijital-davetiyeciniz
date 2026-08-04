import { test, expect } from '@playwright/test';
import { resolveGuestToken, generateGuestToken, revokeGuestToken, renewGuestToken } from '../src/server/guestTokens';
import { createAdminClient } from '../src/server/supabaseClient';

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

  test('Guest Token Resolution and DB Boundary Checks', async () => {
    const supabase = await createAdminClient();
    
    // 1. Wedding A oluştur
    const { data: weddingA } = await supabase.from('weddings').insert({
      id: 'a0000000-0000-0000-0000-000000000001',
      slug: 'wedding-a-integration',
      is_active: true
    }).select().single();

    // 2. Wedding B oluştur
    const { data: weddingB } = await supabase.from('weddings').insert({
      id: 'b0000000-0000-0000-0000-000000000002',
      slug: 'wedding-b-integration',
      is_active: true
    }).select().single();

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
      const tokenA = generateGuestToken(guestA.public_id, 1);

      // 6. Guest A doğru slug’da çözülür
      const resolvedA = await resolveGuestToken(tokenA, 'wedding-a-integration');
      expect(resolvedA).not.toBeNull();
      expect(resolvedA?.displayName).toBe('Guest A');

      // 7. Yanlış slug’da çözülmez
      const resolvedWrongSlug = await resolveGuestToken(tokenA, 'wedding-b-integration');
      expect(resolvedWrongSlug).toBeNull();

      // 8. Guest B verisi dönmez
      expect(JSON.stringify(resolvedA)).not.toContain('Guest B');

      // 9. token_version artırılır
      await supabase.from('guests').update({ token_version: 2 }).eq('id', guestA.id);

      // 10. Eski token çözülmez
      const resolvedA_old = await resolveGuestToken(tokenA, 'wedding-a-integration');
      expect(resolvedA_old).toBeNull();

      // 11. Yeni token çözülür
      const tokenA_new = generateGuestToken(guestA.public_id, 2);
      const resolvedA_new = await resolveGuestToken(tokenA_new, 'wedding-a-integration');
      expect(resolvedA_new).not.toBeNull();

      // 12. Revoke sonrası çözülmez
      await revokeGuestToken(guestA.id);
      const resolvedA_revoked = await resolveGuestToken(tokenA_new, 'wedding-a-integration');
      expect(resolvedA_revoked).toBeNull();

      // 13. Reactivate sonrası eski token çözülmez
      await renewGuestToken(guestA.id);
      const resolvedA_reactivated_old = await resolveGuestToken(tokenA_new, 'wedding-a-integration');
      expect(resolvedA_reactivated_old).toBeNull();

      // 14. Yeni token çözülür
      // Get the updated token version from db
      const { data: reactivatedGuestA } = await supabase.from('guests').select('token_version').eq('id', guestA.id).single();
      if (!reactivatedGuestA) throw new Error('Guest not found');
      const tokenA_reactivated = generateGuestToken(guestA.public_id, reactivatedGuestA.token_version);
      const resolvedA_reactivated = await resolveGuestToken(tokenA_reactivated, 'wedding-a-integration');
      expect(resolvedA_reactivated).not.toBeNull();

      // 15. Expiry sonrası çözülmez (simulating via token payload hack or DB update)
      // Wait, token expiration is embedded in the token if we pass expiry to generate.
      const expiredToken = generateGuestToken(guestA.public_id, reactivatedGuestA!.token_version, -1000); // Expiry in the past
      const resolvedA_expired = await resolveGuestToken(expiredToken, 'wedding-a-integration');
      expect(resolvedA_expired).toBeNull();

      // 16. Soft delete sonrası çözülmez
      await supabase.from('guests').update({ deleted_at: new Date().toISOString() }).eq('id', guestA.id);
      const resolvedA_deleted = await resolveGuestToken(tokenA_reactivated, 'wedding-a-integration');
      expect(resolvedA_deleted).toBeNull();

      // 17. Public DTO yalnızca allowlist alanlarını taşır
      // Check the last successful resolve (resolvedA_reactivated)
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
