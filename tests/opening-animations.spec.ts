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
  const runId = crypto.randomUUID();
  const SLUG = `test-opening-${runId}`;

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
        wedding_date: "2027-06-15T17:00:00.000Z",
        venue_name: "Convention Center",
        admin_password: "test",
        entrance_animation: "parisianBlackTie",
        custom_overrides: {
          event_variant: "tech-launch"
        }
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

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "__audioPlayCalls", {
        value: 0,
        writable: true
      });
      Object.defineProperty(window, "__openCalls", {
        value: 0,
        writable: true
      });

      (HTMLMediaElement.prototype as any).play = function () {
        (window as any).__audioPlayCalls += 1;
        return Promise.resolve();
      };
    });
  });

  test("1. No Auto Open & 5s idle & Final State persistence", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/${SLUG}`);
    
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    
    // Check audio play count before interaction
    let audioCalls = await page.evaluate(() => (window as any).__audioPlayCalls);
    expect(audioCalls).toBe(0);

    // Wait for animation to finish (e.g. 3s)
    await page.waitForTimeout(3500);
    await expect(overlay).toHaveAttribute("data-opening-state", "completed-awaiting-interaction", { timeout: 10000 });
    
    // Idle 5 seconds
    await page.waitForTimeout(5000);
    await expect(overlay).toHaveAttribute("data-opening-state", "completed-awaiting-interaction");
    
    // Audio still 0
    audioCalls = await page.evaluate(() => (window as any).__audioPlayCalls);
    expect(audioCalls).toBe(0);

    await page.screenshot({ path: "test-results/opening-parisian-final-plus-5s.png" });
  });

  test("2. Single Tap Direct Open", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/${SLUG}`);
    
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    
    // Tap on top left corner
    await overlay.click({ position: { x: 10, y: 10 } });
    
    // Ensure state becomes opened
    await expect(overlay).toHaveAttribute("data-opening-state", "opened");
    
    // Wait for transition 300ms
    await page.waitForTimeout(400);
    
    const audioCalls = await page.evaluate(() => (window as any).__audioPlayCalls);
    expect(audioCalls).toBeLessThanOrEqual(1); // 1 if music is enabled for this template, 0 if not

    await expect(page.locator("text=Long Corporate Name Co")).toBeVisible();
    await page.screenshot({ path: "test-results/opening-parisian-opened.png" });
  });

  test("3. Enter Key to open", async ({ page }) => {
    await page.goto(`${BASE_URL}/${SLUG}`);
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    
    await overlay.focus();
    await page.keyboard.press("Enter");
    await expect(overlay).toHaveAttribute("data-opening-state", "opened");
    await page.waitForTimeout(400);
    const audioCalls = await page.evaluate(() => (window as any).__audioPlayCalls);
    expect(audioCalls).toBeLessThanOrEqual(1);
  });

  test("4. Space Key to open with preventDefault check", async ({ page }) => {
    // Add enough content to ensure page is scrollable, or just test scrollY
    await page.setViewportSize({ width: 1280, height: 600 });
    await page.goto(`${BASE_URL}/${SLUG}`);
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    
    await overlay.focus();
    const beforeScroll = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("Space");
    
    await expect(overlay).toHaveAttribute("data-opening-state", "opened");
    const afterScroll = await page.evaluate(() => window.scrollY);
    
    // Space should not have scrolled the page
    expect(afterScroll).toBe(beforeScroll);

    const audioCalls = await page.evaluate(() => (window as any).__audioPlayCalls);
    expect(audioCalls).toBeLessThanOrEqual(1);
  });

  test("5. Double Tap Check (Idempotency)", async ({ page }) => {
    await page.goto(`${BASE_URL}/${SLUG}`);
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    
    // Tap rapidly twice
    await overlay.click({ position: { x: 10, y: 10 } });
    await overlay.click({ position: { x: 10, y: 10 } });
    
    await expect(overlay).toHaveAttribute("data-opening-state", "opened");
    await page.waitForTimeout(400);

    const audioCalls = await page.evaluate(() => (window as any).__audioPlayCalls);
    expect(audioCalls).toBeLessThanOrEqual(1); // Should definitely not be 2!
  });

  test("6. Reduced Motion Check", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/${SLUG}`);
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();

    // It should still start in 'playing' and go to 'completed-awaiting-interaction' quickly or normally, 
    // but without auto open. 
    await expect(overlay).toHaveAttribute("data-opening-state", "playing");
    await page.waitForTimeout(3500);
    await expect(overlay).toHaveAttribute("data-opening-state", "completed-awaiting-interaction");
    
    // Tap should open it directly
    await overlay.click({ position: { x: 10, y: 10 } });
    await expect(overlay).toHaveAttribute("data-opening-state", "opened");
  });

  test("7. Preview vs Public Comparison", async ({ page, context }) => {
    // Check Public
    await page.goto(`${BASE_URL}/${SLUG}`);
    const overlayPublic = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlayPublic).toBeVisible();
    const publicContent = await page.locator("h1").first().innerText(); // Assuming primaryName is in first h1

    // Check Preview
    const previewPage = await context.newPage();
    await previewPage.goto(`${BASE_URL}/${SLUG}?preview=true`);
    const overlayPreview = previewPage.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlayPreview).toBeVisible();
    const previewContent = await previewPage.locator("h1").first().innerText();

    expect(previewContent).toBe(publicContent);
  });
});
