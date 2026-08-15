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

test.describe('C4-D Global QA & Production Hardening', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(180000);

  let supabase: any;
  const runId = crypto.randomUUID();
  const SLUG = `qa-c4-${runId}`;
  let weddingId: string;

  // Representative sample of template categories and styles (20 templates)
  const templatesToTest = [
    "folded-seal", "giant-monogram", "magazine-editorial", "cinematic-poster",
    "royal-letter", "polaroid-story", "constellation-night", "luxury-hotel",
    "cocktail-menu", "velvet-curtain", "fairy-tale-palace", "hot-air-balloon",
    "architectural-white-space", "typographic-monument", "gallery-catalogue",
    "paper-fold-editorial", "botanical-herbarium", "ceramic-studio",
    "perfume-atelier", "desert-night-camp"
  ];

  test.beforeAll(async () => {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    weddingId = crypto.randomUUID();

    // Create a mock wedding object with minimal metadata (tests direct production fallback safety)
    const { error } = await supabase.from('weddings').insert({
      id: weddingId,
      slug: SLUG,
      bride_name: "Test Bride",
      groom_name: "Test Groom",
      wedding_date: null, // Test missing date fallback
      venue_name: "QA Palace",
      venue_address: null, // Test missing address fallback
      google_maps_url: null,
      is_paid: true,
      event_type: "wedding",
      admin_password: "test",
      template_id: "wedding-classic",
      names_font_family: "Playfair Display",
      font_family: "Lora"
    });

    if (error) {
      throw new Error(`Could not insert mock wedding: ${error.message}`);
    }
  });

  test.afterAll(async () => {
    if (supabase) {
      await supabase.from('weddings').delete().eq('id', weddingId);
    }
  });

  for (const templateId of templatesToTest) {
    test(`Validate template safety & mobile responsive layout for: ${templateId}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('pageerror', err => consoleErrors.push(err.message));

      await page.setViewportSize({ width: 1280, height: 800 });

      // View preview mode with the test ID
      await page.goto(`${BASE_URL}/d/${SLUG}?preview=true&template_id=${templateId}`);
      await page.waitForLoadState('networkidle');

      // Dismiss the opening sequence if active
      const opening = page.locator('[data-testid="opening-overlay"]');
      if (await opening.isVisible()) {
        await opening.click();
        await page.waitForTimeout(300);
      }

      // Test Desktop basic layout integrity
      const wrapper = page.locator('[data-testid="wedding-content-wrapper"]');
      await expect(wrapper).toBeVisible({ timeout: 15000 });

      // Test Mobile 390px overflow layout safety
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(300);

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const viewportWidth = 390;
      // Allow minor 5px layout tolerance for browsers
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 5);

      // Verify no critical errors
      expect(consoleErrors).toEqual([]);
    });
  }
});
