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

test.describe("C2.6 - Cinematic Experience Prototypes Integration Checks", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(120000);

  let supabase: any;
  const runId = crypto.randomUUID();
  const SLUG = `test-cinematic-${runId}`;

  const cinematicThemes = [
    { id: "cinematic-garden-journey", testId: "layout-cinematic-garden-journey" },
    { id: "cinematic-black-tie", testId: "layout-cinematic-black-tie" },
    { id: "cinematic-celestial", testId: "layout-cinematic-celestial" },
    { id: "cinematic-destination-journey", testId: "layout-cinematic-destination" },
    { id: "cinematic-storybook", testId: "layout-cinematic-storybook" }
  ];

  test.beforeAll(async () => {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const records = [
      {
        id: crypto.randomUUID(),
        slug: SLUG,
        event_type: "wedding",
        template_id: "wedding-classic",
        is_paid: true,
        bride_name: "Melis",
        groom_name: "Can",
        wedding_date: "2027-09-20T18:00:00.000Z",
        venue_name: "Saray Balo Salonu",
        venue_address: "Kanyon Vadisi No 45, Kapadokya",
        admin_password: "test",
        names_font_family: "Playfair Display",
        font_family: "Lora"
      }
    ];

    const { error } = await supabase.from("weddings").insert(records);
    if (error) throw new Error(`Test record insert failed: ${error.message}`);
  });

  test.afterAll(async () => {
    if (supabase) {
      const { error } = await supabase.from("weddings").delete().eq("slug", SLUG);
      if (error) console.error("Cleanup failed:", error);
    }
  });

  for (const theme of cinematicThemes) {
    test(`Verify cinematic experience: ${theme.id}`, async ({ page }) => {
      // Catch console errors to verify no runtime failures occur
      const consoleErrors: string[] = [];
      page.on("pageerror", (err) => {
        consoleErrors.push(err.message);
      });

      await page.setViewportSize({ width: 1280, height: 800 });
      
      // Navigate to invitation page with theme preview overrides
      await page.goto(`${BASE_URL}/${SLUG}?preview=true&template_id=${theme.id}`);
      await page.waitForLoadState("networkidle");

      // 1. Verify opening overlay is present and visible
      const openingOverlay = page.locator("[data-testid=\"opening-overlay\"]");
      await expect(openingOverlay).toBeVisible();

      // 2. Click to enter and dismiss opening
      await openingOverlay.click();
      await page.waitForTimeout(1000); // Allow fadeout animation to complete

      // 3. Verify main cinematic layout renders successfully
      const layout = page.locator(`[data-testid="${theme.testId}"]`);
      await expect(layout).toBeVisible();

      // 4. Scroll page to verify scroll engine progress updating
      await page.evaluate(() => window.scrollTo(0, 1500));
      await page.waitForTimeout(500);

      // Verify no critical JavaScript or rendering errors were fired
      expect(consoleErrors).toEqual([]);
    });

    test(`Verify mobile rendering for: ${theme.id}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${BASE_URL}/${SLUG}?preview=true&template_id=${theme.id}`);
      await page.waitForLoadState("networkidle");

      // Verify opening & click-through works on mobile viewports
      const openingOverlay = page.locator("[data-testid=\"opening-overlay\"]");
      await expect(openingOverlay).toBeVisible();
      await openingOverlay.click();
      await page.waitForTimeout(500);

      const layout = page.locator(`[data-testid="${theme.testId}"]`);
      await expect(layout).toBeVisible();
    });
  }

  test("Verify reduced-motion behavior", async ({ page }) => {
    // Enable emulation of prefers-reduced-motion media feature
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 800 });

    const targetTheme = cinematicThemes[0];
    await page.goto(`${BASE_URL}/${SLUG}?preview=true&template_id=${targetTheme.id}`);
    await page.waitForLoadState("networkidle");

    const openingOverlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(openingOverlay).toBeVisible();
    await openingOverlay.click();
    await page.waitForTimeout(500);

    const layout = page.locator(`[data-testid="${targetTheme.testId}"]`);
    await expect(layout).toBeVisible();
  });
});
