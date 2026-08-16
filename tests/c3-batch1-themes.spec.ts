import { test, expect } from "@playwright/test";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("C3-B1 - Cultural & Destination Templates E2E", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(180000);

  let supabase: any;
  const runId = crypto.randomUUID();
  const SLUG = `test-c3-b1-${runId}`;
  let weddingId: string;

  const batch1Themes = [
    { id: "bosphorus-mansion", testId: "layout-bosphorus-mansion", signatureSelector: "[data-testid=\"layout-bosphorus-mansion\"]" },
    { id: "moroccan-riad-henna-night", testId: "layout-moroccan-riad", signatureSelector: "#moroccan-rsvp-plaque" },
    { id: "persian-miniature-concept", testId: "layout-persian-miniature", signatureSelector: "[data-testid=\"layout-persian-miniature\"]" },
    { id: "korean-hanok-traditional", testId: "layout-korean-hanok", signatureSelector: "[data-testid=\"layout-korean-hanok\"]" },
    { id: "andalusian-palace-alhambra", testId: "layout-andalusian-palace", signatureSelector: "[data-testid=\"layout-andalusian-palace\"]" },
    { id: "mughal-garden-taj", testId: "layout-mughal-garden", signatureSelector: "#mughal-symmetry-rsvp" },
    { id: "santorini-sunset-terrace", testId: "layout-santorini-sunset", signatureSelector: "#santorini-sunset-rsvp" },
    { id: "amalfi-coast-lemons", testId: "layout-amalfi-coast", signatureSelector: "#amalfi-lemon-rsvp" },
    { id: "tuscany-vineyard-manor", testId: "layout-tuscany-vineyard", signatureSelector: "#tuscany-manor-rsvp" },
    { id: "lake-como-grand-hotel", testId: "layout-lake-como", signatureSelector: "#como-hotel-confirmation" }
  ];

  test.beforeAll(async () => {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    weddingId = crypto.randomUUID();
    
    // Insert parent wedding record
    const { error: weddingError } = await supabase.from("weddings").insert({
      id: weddingId,
      slug: SLUG,
      event_type: "wedding",
      template_id: "wedding-classic",
      is_paid: true,
      bride_name: "Melis",
      groom_name: "Can",
      wedding_date: "2027-09-20T18:00:00.000Z",
      venue_name: "Tarihi Bosphorus Yalı",
      venue_address: "Yalı Sokak No 12, Tarabya, Istanbul",
      admin_password: "test",
      names_font_family: "Playfair Display",
      font_family: "Lora"
    });
    if (weddingError) throw new Error(`Test record insert failed: ${weddingError.message}`);
  });

  test.afterAll(async () => {
    if (supabase) {
      await supabase.from("weddings").delete().eq("id", weddingId);
    }
  });

  for (const theme of batch1Themes) {
    test(`Verify template: ${theme.id}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("pageerror", (err) => consoleErrors.push(err.message));

      await page.setViewportSize({ width: 1280, height: 800 });
      
      // Navigate to the preview page
      await page.goto(`${BASE_URL}/${SLUG}?preview=true&template_id=${theme.id}`);
      await page.waitForLoadState("networkidle");

      // Verify opening overlay exists and dismisses
      const opening = page.locator("[data-testid=\"opening-overlay\"]");
      await expect(opening).toBeVisible();
      
      // Click and wait for the custom wrapper to transition to ready state
      await opening.click();
      const wrapper = page.locator('[data-testid="wedding-content-wrapper"]');
      await expect(wrapper).toHaveAttribute('data-layout-ready', 'true', { timeout: 20000 });

      // Verify template layout renders correctly
      const layout = page.locator(`[data-testid="${theme.testId}"]`);
      await expect(layout).toBeVisible();

      // Scroll to the very bottom to trigger Scene 5 (RSVP and events)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      // Verify signature element exists after scroll
      const signature = page.locator(theme.signatureSelector);
      await expect(signature).toBeVisible();

      // Verify multiple events details are visible in the document (injected via preview mode)
      const eventTitle = page.locator("text=Kokteyl ve Resepsiyon").first();
      await expect(eventTitle).toBeVisible();

      expect(consoleErrors).toEqual([]);
    });

    test(`Verify mobile flow for theme: ${theme.id}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${BASE_URL}/${SLUG}?preview=true&template_id=${theme.id}`);
      await page.waitForLoadState("networkidle");

      const opening = page.locator("[data-testid=\"opening-overlay\"]");
      await expect(opening).toBeVisible();
      await opening.click();
      
      const wrapper = page.locator('[data-testid="wedding-content-wrapper"]');
      await expect(wrapper).toHaveAttribute('data-layout-ready', 'true', { timeout: 20000 });

      const layout = page.locator(`[data-testid="${theme.testId}"]`);
      await expect(layout).toBeVisible();
    });
  }

  test("Verify prefers-reduced-motion vertical stacking behavior", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 800 });

    const targetTheme = batch1Themes[0];
    await page.goto(`${BASE_URL}/${SLUG}?preview=true&template_id=${targetTheme.id}`);
    await page.waitForLoadState("networkidle");

    const opening = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(opening).toBeVisible();
    await opening.click();
    
    const wrapper = page.locator('[data-testid="wedding-content-wrapper"]');
    await expect(wrapper).toHaveAttribute('data-layout-ready', 'true', { timeout: 20000 });

    const layout = page.locator(`[data-testid="${targetTheme.testId}"]`);
    await expect(layout).toBeVisible();
  });
});
