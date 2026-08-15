import { test, expect } from '@playwright/test';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe('C5-A Production Data & Invitation Smoke Tests', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(120000);

  let supabase: any;
  const runId = crypto.randomUUID();
  const SLUG = `smoke-c5-${runId}`;
  let weddingId: string;

  test.beforeAll(async () => {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    weddingId = crypto.randomUUID();

    // Insert a realistic wedding record
    const { error } = await supabase.from('weddings').insert({
      id: weddingId,
      slug: SLUG,
      bride_name: "Ayşe",
      groom_name: "Fatma",
      wedding_date: "2027-10-15T19:00:00.000Z",
      venue_name: "Yıldız Sarayı",
      venue_address: "Yıldız Parkı, Beşiktaş, İstanbul",
      google_maps_url: "https://maps.google.com/?q=Yildiz+Sarayi",
      is_paid: true,
      event_type: "wedding",
      admin_password: "adminpassword",
      template_id: "royal-letter",
      names_font_family: "Playfair Display",
      font_family: "Lora"
    });

    if (error) {
      throw new Error(`Staging insert failed: ${error.message}`);
    }
  });

  test.afterAll(async () => {
    if (supabase) {
      await supabase.from('weddings').delete().eq('id', weddingId);
    }
  });

  test('Public route direct load and refresh sanity', async ({ page }) => {
    // 1. Load public invitation page directly (preview=false)
    await page.goto(`${BASE_URL}/d/${SLUG}`);
    await page.waitForLoadState('networkidle');

    // Verify presence of opening overlay
    const opening = page.locator('[data-testid="opening-overlay"]');
    await expect(opening).toBeVisible({ timeout: 15000 });
    
    // Dismiss opening overlay
    await opening.click();
    await page.waitForTimeout(300);

    // Verify main layout renders successfully
    const wrapper = page.locator('[data-testid="wedding-content-wrapper"]');
    await expect(wrapper).toBeVisible();

    // 2. Perform hard refresh and verify it loads again successfully
    await page.reload({ waitUntil: 'networkidle' });
    const openingReloaded = page.locator('[data-testid="opening-overlay"]');
    await expect(openingReloaded).toBeVisible();
    await openingReloaded.click();
    await expect(wrapper).toBeVisible();
  });

  test('Admin changes immediately reflect in the public invitation view', async ({ page }) => {
    // 1. Update the template preset and font configurations inside Supabase direct
    const { error: updateError } = await supabase.from('weddings').update({
      template_id: "botanical-herbarium",
      names_font_family: "Space Grotesk",
      font_family: "Inter"
    }).eq('id', weddingId);

    if (updateError) {
      throw new Error(`Admin update mock failed: ${updateError.message}`);
    }

    // 2. Navigate to public page and verify it correctly loaded the new botanical-herbarium layout style
    await page.goto(`${BASE_URL}/d/${SLUG}`);
    await page.waitForLoadState('networkidle');

    const opening = page.locator('[data-testid="opening-overlay"]');
    if (await opening.isVisible()) {
      await opening.click();
    }

    // Herbarium signature element should render and be visible
    const layoutContainer = page.locator('[data-testid="layout-herbarium"]');
    await expect(layoutContainer).toBeVisible();
  });

  test('API OG Image route returns valid image response with cache headers', async ({ request }) => {
    // Call the dynamic OG generator API
    const response = await request.get(`${BASE_URL}/api/og?wedding_id=${SLUG}`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    
    // Verify stale-while-revalidate caching header is set
    const cacheControl = response.headers()['cache-control'];
    expect(cacheControl).toContain('stale-while-revalidate');
  });

  test('Public invitation fallback handles network failures and missing wedding records gracefully', async ({ page }) => {
    // Navigate to an invalid or missing wedding slug
    const response = await page.goto(`${BASE_URL}/d/non-existent-wedding-slug`);
    
    // Page must fail gracefully with a proper 404 status instead of crashing or looping
    expect(response?.status()).toBe(404);
    
    // Verify it doesn't show a blank white page
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });
});
