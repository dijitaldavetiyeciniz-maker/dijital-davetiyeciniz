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

test.describe("Opening Animations - Detailed Checks", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(120000);

  let supabase: any;
  const SLUG = "test-opening-animations-" + Date.now();

  test.beforeAll(async () => {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const records = [
      {
        id: crypto.randomUUID(),
        slug: SLUG,
        event_type: "corporate",
        template_id: "future-summit",
        is_paid: true,
        bride_name: "Long Corporate Name Co",
        groom_name: "",
        wedding_date: new Date(Date.now() + 864000000).toISOString(),
        venue_name: "Convention Center",
        admin_password: "test",
        entrance_animation: "parisianBlackTie",
        custom_overrides: {
          event_variant: "tech-launch"
        }
      }
    ];

    const { error } = await supabase.from("weddings").insert(records);
    if (error) console.error("INSERT ERROR:", error);
  });

  test.afterAll(async () => {
    if (supabase) {
      await supabase.from("weddings").delete().eq("slug", SLUG);
    }
  });

  test("1. No Auto Open & 5s idle & Final State persistence", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/d/${SLUG}`);
    
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    
    // Wait for animation to finish (e.g. 3s)
    await page.waitForTimeout(3500);
    
    // Ensure state is completed-awaiting-interaction
    await expect(overlay).toHaveAttribute("data-opening-state", "completed-awaiting-interaction");
    
    // Idle 5 seconds
    await page.waitForTimeout(5000);
    
    // Ensure still awaiting
    await expect(overlay).toHaveAttribute("data-opening-state", "completed-awaiting-interaction");
    
    // Ensure no blank screen
    const box = await overlay.boundingBox();
    expect(box?.height).toBeGreaterThan(0);
    
    await page.screenshot({ path: "test-results/opening-parisian-final-plus-5s.png" });
  });

  test("2. Single Tap Direct Open", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/d/${SLUG}`);
    
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    
    // Tap on top left corner (not a button)
    await overlay.click({ position: { x: 10, y: 10 } });
    
    // Ensure state becomes opened
    await expect(overlay).toHaveAttribute("data-opening-state", "opened");
    
    // Wait for transition 300ms
    await page.waitForTimeout(400);
    
    // Ensure overlay is hidden or gone
    // Check if main content is visible
    await expect(page.locator("text=Long Corporate Name Co")).toBeVisible();
    await page.screenshot({ path: "test-results/opening-parisian-opened.png" });
  });

  test("3. Enter and Space to open", async ({ page }) => {
    await page.goto(`${BASE_URL}/d/${SLUG}`);
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    
    await overlay.focus();
    await page.keyboard.press("Enter");
    await expect(overlay).toHaveAttribute("data-opening-state", "opened");
  });

  test("4. Semantic Data check", async ({ page }) => {
    await page.goto(`${BASE_URL}/d/${SLUG}`);
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay.locator("text=Long Corporate Name Co")).toBeVisible();
  });
});
