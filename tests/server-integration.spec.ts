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
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    expect(url).toBeTruthy();
    expect(key).toBeTruthy();

    const supabase = createClient(url!, key!);
    const apiUrl = '/api/test/guest-tokens';
    
    // 1. Wedding A oluştur
    let weddingA: any = null;
    let weddingB: any = null;
    let guestA: any = null;
    let guestB: any = null;

    try {
      const weddingAInsert = await supabase.from('weddings').insert({
        id: '00000000-0000-0000-0000-000000000001',
        slug: 'wedding-a-integration',
        is_active: true,
        bride_name: 'Bride A',
        groom_name: 'Groom A',
        admin_password: 'test'
      }).select('id, slug').single();
      expect(weddingAInsert.error, JSON.stringify(weddingAInsert.error)).toBeNull();
      expect(weddingAInsert.data).not.toBeNull();
      weddingA = weddingAInsert.data!;

      // 2. Wedding B oluştur
      const weddingBInsert = await supabase.from('weddings').insert({
        id: '00000000-0000-0000-0000-000000000002',
        slug: 'wedding-b-integration',
        is_active: true,
        bride_name: 'Bride B',
        groom_name: 'Groom B',
        admin_password: 'test'
      }).select('id, slug').single();
      expect(weddingBInsert.error, JSON.stringify(weddingBInsert.error)).toBeNull();
      expect(weddingBInsert.data).not.toBeNull();
      weddingB = weddingBInsert.data!;

      // 3. Guest A oluştur
      const guestAInsert = await supabase.from('guests').insert({
        id: '11111111-0000-0000-0000-000000000001',
        wedding_id: weddingA.id,
        first_name: 'Guest',
        last_name: 'A',
        email: 'a@example.com',
        token_version: 1,
        allergy_notes: 'Peanut'
      }).select('id, public_id, token_version').single();
      expect(guestAInsert.error, JSON.stringify(guestAInsert.error)).toBeNull();
      expect(guestAInsert.data).not.toBeNull();
      expect(guestAInsert.data?.public_id).toBeTruthy();
      guestA = guestAInsert.data!;

      // 4. Guest B oluştur
      const guestBInsert = await supabase.from('guests').insert({
        id: '11111111-0000-0000-0000-000000000002',
        wedding_id: weddingB.id,
        first_name: 'Guest',
        last_name: 'B',
        email: 'b@example.com',
        token_version: 1,
        allergy_notes: 'Gluten'
      }).select('id, public_id, token_version').single();
      expect(guestBInsert.error, JSON.stringify(guestBInsert.error)).toBeNull();
      expect(guestBInsert.data).not.toBeNull();
      expect(guestBInsert.data?.public_id).toBeTruthy();
      guestB = guestBInsert.data!;

      // 4.5. Strict DB Assertions BEFORE generation
      expect(guestA.public_id).toBeTruthy();
      expect(guestA.token_version).toBe(1);

      const guestBeforeGenerate = await supabase
        .from('guests')
        .select('id, public_id, wedding_id, token_version')
        .eq('public_id', guestA.public_id)
        .single();

      expect(guestBeforeGenerate.error, JSON.stringify(guestBeforeGenerate.error)).toBeNull();
      expect(guestBeforeGenerate.data?.public_id).toBe(guestA.public_id);

      // 5. Guest A token oluştur
      const genARes = await request.post(apiUrl, { data: { action: 'generate', payload: { publicId: guestA.public_id, tokenVersion: guestA.token_version } } });
      const { token: tokenA } = await genARes.json();

      // 5.1 Verify Token Payload
      const verifyRes = await request.post(apiUrl, { data: { action: 'verify', payload: { token: tokenA } } });
      const verifyBody = await verifyRes.json();
      expect(verifyRes.ok(), `Verify failed: ${JSON.stringify(verifyBody)}`).toBeTruthy();
      const verifiedPayload = verifyBody.payload;
      expect(verifiedPayload.publicId).toBe(guestA.public_id);
      expect(verifiedPayload.tokenVersion).toBe(guestA.token_version);

      const guestLookup = await supabase
        .from('guests')
        .select(`
          public_id,
          wedding_id,
          token_version,
          token_revoked_at,
          token_expires_at,
          deleted_at
        `)
        .eq('public_id', guestA.public_id)
        .single();

      expect(guestLookup.error, JSON.stringify(guestLookup.error)).toBeNull();
      expect(guestLookup.data?.public_id).toBe(guestA.public_id);
      expect(guestLookup.data?.token_version).toBe(guestA.token_version);
      expect(guestLookup.data?.token_revoked_at).toBeNull();
      expect(guestLookup.data?.deleted_at).toBeNull();

      const weddingLookup = await supabase
        .from('weddings')
        .select('id, slug')
        .eq('id', guestLookup.data!.wedding_id)
        .single();

      expect(weddingLookup.error, JSON.stringify(weddingLookup.error)).toBeNull();
      expect(weddingLookup.data?.slug).toBe('wedding-a-integration');

      // 6. Guest A doğru slug’da çözülür
      let resolveRes = await request.post(apiUrl, { 
        data: { 
          action: 'resolve', 
          payload: { 
            token: tokenA, 
            weddingSlug: 'wedding-a-integration' 
          } 
        } 
      });
      const resolveBody = await resolveRes.json();

      expect(
        resolveBody.resolved,
        `Resolve returned null: ${JSON.stringify(resolveBody.diagnostic)}`
      ).not.toBeNull();

      const resolvedA = resolveBody.resolved;
      expect(resolvedA?.displayName).toBe('Guest A');

      // 7. Redaction Assertions
      expect(resolvedA).not.toHaveProperty('email');
      expect(resolvedA).not.toHaveProperty('phone');
      expect(resolvedA).not.toHaveProperty('allergy_notes');
      expect(resolvedA).not.toHaveProperty('token_version');
      expect(resolvedA).not.toHaveProperty('public_id');
      expect(resolvedA).not.toHaveProperty('id');

      // 8. Yanlış slug’da çözülmez
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA, weddingSlug: 'wedding-b-integration' } } });
      const { resolved: resolvedWrongSlug } = await resolveRes.json();
      expect(resolvedWrongSlug).toBeNull();

      // 9. Guest B verisi dönmez
      expect(JSON.stringify(resolvedA)).not.toContain('Guest B');

      // 10. token_version artırılır
      await supabase.from('guests').update({ token_version: 2 }).eq('id', guestA.id);

      // 11. Eski token çözülmez
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA, weddingSlug: 'wedding-a-integration' } } });
      const { resolved: resolvedA_old } = await resolveRes.json();
      expect(resolvedA_old).toBeNull();

      // 12. Yeni token çözülür
      const genANewRes = await request.post(apiUrl, { data: { action: 'generate', payload: { publicId: guestA.public_id, tokenVersion: 2 } } });
      const { token: tokenA_new } = await genANewRes.json();
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA_new, weddingSlug: 'wedding-a-integration' } } });
      expect(resolveRes.ok()).toBeTruthy();
      const { resolved: resolvedA_new } = await resolveRes.json();
      expect(resolvedA_new).not.toBeNull();

      // 12. Revoke sonrası çözülmez
      await request.post(apiUrl, { data: { action: 'revoke', payload: { guestId: guestA.id } } });
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA_new, weddingSlug: 'wedding-a-integration' } } });
      const { resolved: resolvedA_revoked } = await resolveRes.json();
      expect(resolvedA_revoked).toBeNull();

      // 13. Reactivate sonrası eski token çözülmez
      await request.post(apiUrl, { data: { action: 'renew', payload: { guestId: guestA.id } } });
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA_new, weddingSlug: 'wedding-a-integration' } } });
      const { resolved: resolvedA_reactivated_old } = await resolveRes.json();
      expect(resolvedA_reactivated_old).toBeNull();

      // 14. Yeni token çözülür
      const { data: reactivatedGuestA } = await supabase.from('guests').select('token_version').eq('id', guestA.id).single();
      const genAReactivatedRes = await request.post(apiUrl, { data: { action: 'generate', payload: { publicId: guestA.public_id, tokenVersion: reactivatedGuestA!.token_version } } });
      const { token: tokenA_reactivated } = await genAReactivatedRes.json();
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA_reactivated, weddingSlug: 'wedding-a-integration' } } });
      const { resolved: resolvedA_reactivated } = await resolveRes.json();
      expect(resolvedA_reactivated).not.toBeNull();

      // 15. Expiry sonrası çözülmez
      const genExpiredRes = await request.post(apiUrl, { data: { action: 'generate', payload: { publicId: guestA.public_id, tokenVersion: reactivatedGuestA!.token_version, expiresAt: -1000 } } });
      const { token: expiredToken } = await genExpiredRes.json();
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: expiredToken, weddingSlug: 'wedding-a-integration' } } });
      const { resolved: resolvedA_expired } = await resolveRes.json();
      expect(resolvedA_expired).toBeNull();

      // 16. Soft delete sonrası çözülmez
      await supabase.from('guests').update({ deleted_at: new Date().toISOString() }).eq('id', guestA.id);
      resolveRes = await request.post(apiUrl, { data: { action: 'resolve', payload: { token: tokenA_reactivated, weddingSlug: 'wedding-a-integration' } } });
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
      if (weddingA?.id) await supabase.from('guests').delete().eq('wedding_id', weddingA.id);
      if (weddingB?.id) await supabase.from('guests').delete().eq('wedding_id', weddingB.id);
      if (weddingA?.id) await supabase.from('weddings').delete().eq('id', weddingA.id);
      if (weddingB?.id) await supabase.from('weddings').delete().eq('id', weddingB.id);
    }
  });
});
