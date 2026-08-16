import { test, expect } from "@playwright/test";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Visual Regression Sets - Part 4/5", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(120000);

  let supabase: any;
  const runId = crypto.randomUUID();
  const SLUG = `test-visual-regression-${runId}`;

  const FLAGSHIPS = [
    { id: "parisian-black-tie", animation: "parisianBlackTie" },
    { id: "grand-opera-ballroom", animation: "grandOpera" },
    { id: "moonlit-secret-garden", animation: "moonlitGarden" },
    { id: "vogue-wedding-editorial", animation: "vogueEditorial" },
    { id: "ottoman-illumination", animation: "ottomanIllumination" },
    { id: "storybook-babyshower", animation: "storybook", eventType: "babyshower" },
    { id: "future-summit", animation: "futureSummit", eventType: "corporate" }
  ];

  test.beforeAll(async () => {
    supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);
    const record = {
      id: crypto.randomUUID(),
      slug: SLUG,
      event_type: "wedding",
      template_id: "royal-palace",
      is_paid: true,
      bride_name: "Visual Test",
      groom_name: "Regression",
      wedding_date: "2027-06-15T17:00:00.000Z",
      venue_name: "Test Venue",
      admin_password: "test",
      entrance_animation: "sealOnly"
    };

    const { error } = await supabase.from("weddings").insert([record]);
    if (error) throw new Error(`Insert failed: ${error.message}`);
  });

  test.afterAll(async () => {
    if (supabase) {
      await supabase.from("weddings").delete().eq("slug", SLUG);
    }
  });

  for (const flagship of FLAGSHIPS) {
    test(`Visual Regression: ${flagship.id}`, async ({ page }) => {
      // Update the record to the target flagship
      await supabase.from("weddings").update({
        template_id: flagship.id,
        entrance_animation: flagship.animation,
        event_type: flagship.eventType || "wedding"
      }).eq("slug", SLUG);

      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(`${BASE_URL}/${SLUG}`);
      
      const overlay = page.locator("[data-testid=\"opening-overlay\"]");
      await expect(overlay).toBeVisible();

      // first
      await page.screenshot({ path: `test-results/part45-${flagship.id}-desktop-first.png` });

      // mid (after 1.5s)
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `test-results/part45-${flagship.id}-desktop-mid.png` });

      // final (after 3.5s total)
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `test-results/part45-${flagship.id}-desktop-final.png` });

      // final-plus-5s
      await page.waitForTimeout(5000);
      await page.screenshot({ path: `test-results/part45-${flagship.id}-desktop-final-plus-5s.png` });

      // opened
      await overlay.click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(500);
      await page.screenshot({ path: `test-results/part45-${flagship.id}-desktop-opened.png` });

      if (flagship.id === "storybook-babyshower" || flagship.id === "future-summit") {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.reload();
        await expect(overlay).toBeVisible();
        await page.waitForTimeout(3500);
        await page.screenshot({ path: `test-results/part45-${flagship.id}-mobile-final.png` });
        await overlay.click({ position: { x: 10, y: 10 } });
        await page.waitForTimeout(500);
        await page.screenshot({ path: `test-results/part45-${flagship.id}-mobile-opened.png` });
      }
    });
  }
});
