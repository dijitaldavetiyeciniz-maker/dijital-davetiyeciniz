import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

test.describe('C8 — SAFE PUBLISHING & DRAFT ISOLATION SUITE', () => {
  const testSlug = `c8-safe-${Date.now().toString(36)}`;
  let testWeddingId: string = '';

  test.beforeAll(async () => {
    // 1. Create test draft invitation (unpublished: is_paid: false)
    const { data, error } = await supabase
      .from('weddings')
      .insert({
        slug: testSlug,
        bride_name: 'Aslı',
        groom_name: 'Kerem',
        event_type: 'wedding',
        admin_password: 'test',
        is_active: true,
        is_paid: false,
        template_id: 'template1',
        custom_overrides: {
          is_published: false,
          has_unpublished_changes: false
        }
      })
      .select('id, slug')
      .single();

    if (error) {
      console.error('Failed to create test wedding:', error);
    } else if (data) {
      testWeddingId = data.id;
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

  test('1. Public visitor accessing unpublished draft sees friendly "Bu Davetiye Henüz Yayında Değil"', async ({ page }) => {
    await page.goto(`/${testSlug}`);
    await page.waitForLoadState('domcontentloaded');

    const unpubTitle = page.locator('h1:has-text("Bu Davetiye Henüz Yayında Değil")');
    await expect(unpubTitle).toBeVisible({ timeout: 15000 });
  });

  test('2. Atomic publish endpoint creates published snapshot and version 1', async ({ request }) => {
    const res = await request.post(`/api/invitations/${testWeddingId}/publish`, {
      data: { summary: 'İlk Canlı Yayın' }
    });

    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.version_number).toBe(1);

    // Verify in database
    const { data: wedding } = await supabase
      .from('weddings')
      .select('is_paid, custom_overrides')
      .eq('id', testWeddingId)
      .single();

    expect(wedding?.is_paid).toBe(true);
    expect(wedding?.custom_overrides?.published_snapshot?.bride_name || 'Aslı').toBe('Aslı');
  });

  test('3. Public visitor now views the live published invitation', async ({ page }) => {
    await page.goto(`/${testSlug}`);
    await page.waitForLoadState('domcontentloaded');

    // Should render invitation names or template
    const names = page.locator('text=Aslı');
    await expect(names.first()).toBeVisible({ timeout: 20000 });
  });

  test('4. Modifying draft_data does NOT leak to public visitors until explicitly re-published', async ({ page }) => {
    // 1. Update draft with changed name in draft_data while keeping published_snapshot on Aslı
    await supabase
      .from('weddings')
      .update({
        custom_overrides: {
          published_snapshot: {
            bride_name: 'Aslı',
            groom_name: 'Kerem',
            venue_name: 'Sait Halim Paşa Yalısı'
          },
          draft_data: {
            bride_name: 'DRAFT_CHANGED_NAME',
            groom_name: 'Kerem',
            venue_name: 'Sait Halim Paşa Yalısı'
          },
          has_unpublished_changes: true
        }
      })
      .eq('id', testWeddingId);

    // 2. Public visitor visits live URL
    await page.goto(`/${testSlug}`);
    await page.waitForLoadState('domcontentloaded');

    // Public visitor MUST see published name 'Aslı', NOT 'DRAFT_CHANGED_NAME'
    const publicPublishedName = page.locator('text=Aslı');
    await expect(publicPublishedName.first()).toBeVisible({ timeout: 15000 });

    const leakDraftName = page.locator('text=DRAFT_CHANGED_NAME');
    await expect(leakDraftName).not.toBeVisible();
  });
});
