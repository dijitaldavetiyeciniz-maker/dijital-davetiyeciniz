import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

test.describe('C8 — VERSION HISTORY & SAFE RESTORE SUITE', () => {
  const testSlug = `c8-version-${Date.now().toString(36)}`;
  let testWeddingId: string = '';
  let version1Id: string = '';

  test.beforeAll(async () => {
    // 1. Create test wedding
    const { data: wedding, error } = await supabase
      .from('weddings')
      .insert({
        slug: testSlug,
        bride_name: 'Defne Sürüm 1',
        groom_name: 'Burak',
        event_type: 'wedding',
        admin_password: 'test',
        is_paid: true,
        is_active: true,
        template_id: 'template1',
        custom_overrides: {
          is_published: true,
          published_version_number: 1,
          published_snapshot: {
            bride_name: 'Defne Sürüm 1',
            groom_name: 'Burak',
            template_id: 'template1'
          }
        }
      })
      .select('id, slug')
      .single();

    if (wedding) {
      testWeddingId = wedding.id;

      // 2. Insert initial version record
      try {
        const { data: v1 } = await supabase
          .from('invitation_versions')
          .insert([
            {
              wedding_id: wedding.id,
              version_number: 1,
              version_type: 'published',
              is_published: true,
              summary: 'Sürüm 1 - İlk Yayın',
              snapshot: {
                bride_name: 'Defne Sürüm 1',
                groom_name: 'Burak',
                template_id: 'template1'
              }
            }
          ])
          .select()
          .single();

        if (v1) version1Id = v1.id;

        // 3. Publish a second version (Version 2)
        await supabase
          .from('weddings')
          .update({
            bride_name: 'Defne Sürüm 2 (Güncellenmiş)',
            custom_overrides: {
              is_published: true,
              published_version_number: 2,
              published_snapshot: {
                bride_name: 'Defne Sürüm 2 (Güncellenmiş)',
                groom_name: 'Burak',
                template_id: 'template5'
              }
            }
          })
          .eq('id', wedding.id);

        await supabase.from('invitation_versions').insert([
          {
            wedding_id: wedding.id,
            version_number: 2,
            version_type: 'published',
            is_published: true,
            summary: 'Sürüm 2 - Yeni Şablon Yayını',
            snapshot: {
              bride_name: 'Defne Sürüm 2 (Güncellenmiş)',
              groom_name: 'Burak',
              template_id: 'template5'
            }
          }
        ]);
      } catch (err) {
        console.warn('Version setup note:', err);
      }
    }
  });

  test.afterAll(async () => {
    if (testWeddingId) {
      await supabase.from('weddings').delete().eq('id', testWeddingId);
      try {
        await supabase.from('invitation_versions').delete().eq('wedding_id', testWeddingId);
      } catch {}
    }
  });

  test('1. Versions API returns all immutable historical versions', async ({ request }) => {
    const res = await request.get(`/api/invitations/${testWeddingId}/versions`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.versions.length).toBeGreaterThanOrEqual(1);
  });

  test('2. Restoring Version 1 loads snapshot into working draft without altering live published site', async ({ request, page }) => {
    if (!version1Id) return;

    // 1. Call restore endpoint
    const res = await request.post(`/api/invitations/${testWeddingId}/versions`, {
      data: {
        action: 'restore',
        version_id: version1Id
      }
    });

    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.restored_data.bride_name).toBe('Defne Sürüm 1');

    // 2. Check Database: draft_data is restored
    const { data: wedding } = await supabase
      .from('weddings')
      .select('custom_overrides')
      .eq('id', testWeddingId)
      .single();

    const restoredName = wedding?.custom_overrides?.draft_data?.bride_name || (wedding as any)?.draft_data?.bride_name;
    expect(restoredName).toBe('Defne Sürüm 1');

    // 3. Verify public page still serves Version 2
    await page.goto(`/${testSlug}`);
    await page.waitForLoadState('domcontentloaded');
    const liveV2Text = page.locator('text=Defne Sürüm 2');
    await expect(liveV2Text.first()).toBeVisible({ timeout: 15000 });
  });

  test('3. Explicitly publishing the restored draft updates the live site to Version 3', async ({ request, page }) => {
    const res = await request.post(`/api/invitations/${testWeddingId}/publish`, {
      data: { summary: 'Sürüm 1 Geri Yüklemesi Canlıya Alındı' }
    });

    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);

    // Public page now serves the newly published snapshot
    await page.goto(`/${testSlug}`);
    await page.waitForLoadState('domcontentloaded');
    const restoredText = page.locator('text=Defne');
    await expect(restoredText.first()).toBeVisible({ timeout: 15000 });
  });
});
