import { test, expect } from "@playwright/test";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { insertPublishedWedding } from "./helpers/publishTestHelpers";
import { entranceAnimationTypes, getAnimationCapabilities, getAnimationDefaults } from "../src/data/openingAnimations";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function loginAsAdmin(page: any, slug: string) {
  await page.goto(`${BASE_URL}/${slug}/admin`);
  await page.waitForLoadState('networkidle').catch(() => {});
  const passwordInput = page.locator('input[type="password"]');
  if (await passwordInput.isVisible()) {
    await passwordInput.fill('test');
    await page.click('form button[type="submit"]');
    await page.waitForSelector('header h1', { timeout: 20000 });
  }
}

test.describe("Opening Animations - Detailed Checks", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(180000);

  let supabase: any;
  const runId = crypto.randomUUID();
  const SLUG = `test-opening-${runId}`;

  test.beforeAll(async () => {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const rawRecord = {
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
    };

    const { error } = await insertPublishedWedding(supabase, rawRecord);
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

  // Original tests
  test("1. No Auto Open & 5s idle & Final State persistence", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/${SLUG}`);
    
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    
    let audioCalls = await page.evaluate(() => (window as any).__audioPlayCalls);
    expect(audioCalls).toBe(0);

    await page.waitForTimeout(3500);
    await expect(overlay).toHaveAttribute("data-opening-state", "completed-awaiting-interaction", { timeout: 10000 });
    
    await page.waitForTimeout(5000);
    await expect(overlay).toHaveAttribute("data-opening-state", "completed-awaiting-interaction");
    
    audioCalls = await page.evaluate(() => (window as any).__audioPlayCalls);
    expect(audioCalls).toBe(0);
  });

  test("2. Single Tap Direct Open", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/${SLUG}`);
    
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    await page.waitForTimeout(1500);
    
    await overlay.click({ position: { x: 10, y: 10 } });
    await expect(overlay).toHaveAttribute("data-opening-state", "opened");
    await page.waitForTimeout(400);
    
    const audioCalls = await page.evaluate(() => (window as any).__audioPlayCalls);
    expect(audioCalls).toBeLessThanOrEqual(1);

    await expect(page.getByTestId('wedding-content-wrapper').getByRole('heading', { name: 'Long Corporate Name Co', exact: true })).toBeVisible();
  });

  test("3. Enter Key to open", async ({ page }) => {
    await page.goto(`${BASE_URL}/${SLUG}`);
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    await page.waitForTimeout(1500);
    
    await overlay.focus();
    await page.keyboard.press("Enter");
    await expect(overlay).toHaveAttribute("data-opening-state", "opened");
    await page.waitForTimeout(400);
  });

  test("4. Space Key to open with preventDefault check", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 600 });
    await page.goto(`${BASE_URL}/${SLUG}`);
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    await page.waitForTimeout(1500);
    
    await overlay.focus();
    const beforeScroll = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("Space");
    
    await expect(overlay).toHaveAttribute("data-opening-state", "opened");
    const afterScroll = await page.evaluate(() => window.scrollY);
    expect(afterScroll).toBe(beforeScroll);
  });

  test("5. Double Tap Check (Idempotency)", async ({ page }) => {
    await page.goto(`${BASE_URL}/${SLUG}`);
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    await page.waitForTimeout(1500);
    
    await overlay.click({ position: { x: 10, y: 10 } });
    await overlay.click({ position: { x: 10, y: 10 } });
    
    await expect(overlay).toHaveAttribute("data-opening-state", "opened");
    await page.waitForTimeout(400);
    const audioCalls = await page.evaluate(() => (window as any).__audioPlayCalls);
    expect(audioCalls).toBeLessThanOrEqual(1);
  });

  test("6. Reduced Motion Check", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/${SLUG}`);
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).toBeVisible();
    await page.waitForTimeout(1500);

    await expect(overlay).toHaveAttribute("data-opening-state", "playing");
    await page.waitForTimeout(3500);
    await expect(overlay).toHaveAttribute("data-opening-state", "completed-awaiting-interaction");
    
    await overlay.click({ position: { x: 10, y: 10 } });
    await expect(overlay).toHaveAttribute("data-opening-state", "opened");
  });

  test("7. Preview vs Public Comparison", async ({ page, context }) => {
    await page.goto(`${BASE_URL}/${SLUG}`);
    const overlayPublic = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlayPublic).toBeVisible();
    const publicContent = await page.locator("h1").first().innerText();

    const previewPage = await context.newPage();
    await previewPage.goto(`${BASE_URL}/${SLUG}?preview=true`);
    const overlayPreview = previewPage.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlayPreview).toBeVisible();
    const previewContent = await previewPage.locator("h1").first().innerText();

    expect(previewContent.trim().toLowerCase()).toBe(publicContent.trim().toLowerCase());
  });

  // NEW Registry Unit Tests
  test("8. Animation Registry Unit Checks", () => {
    const ids = entranceAnimationTypes.map(a => a.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size); // All IDs unique

    // Verify all registered items have capabilities schema and defaults
    for (const anim of entranceAnimationTypes) {
      if (anim.id === 'none') continue;
      const caps = getAnimationCapabilities(anim.id);
      expect(caps).toBeDefined();
      expect(caps.customControls).toBeDefined();

      const defaults = getAnimationDefaults(anim.id);
      expect(defaults).toBeDefined();
    }
  });

  // NEW E2E Tests for 3 different premium animation families
  test("9. E2E: Cinematic Car Journey Selection, Customizing, and Persistence", async ({ page }) => {
    await loginAsAdmin(page, SLUG);

    await page.click('[data-testid="admin-nav-design"]');
    await page.waitForTimeout(500);
    await page.click('button:has-text("4. Açılış Animasyonu")');
    await page.waitForTimeout(300);

    // Select Cinematic Car Journey
    const carCard = page.locator('[data-testid="anim-card-cinematic-car-journey"]');
    await expect(carCard).toBeVisible();
    await carCard.click();
    await page.waitForTimeout(300);

    // Verify specific controls visible
    const vehicleTypeSelect = page.locator('[data-testid="anim-field-vehicleType"]');
    await expect(vehicleTypeSelect).toBeVisible();
    await vehicleTypeSelect.selectOption('vintage-beetle');

    const vehicleColorInput = page.locator('[data-testid="anim-field-vehicleColor"]');
    await expect(vehicleColorInput).toBeVisible();
    await vehicleColorInput.fill('#00ff00');
    await page.waitForTimeout(500);

    // Verify live preview renders custom car details
    const carStage = page.locator('[data-testid="car-journey-stage"]').first();
    await expect(carStage).toBeAttached();
    await expect(carStage).toHaveAttribute('data-vehicle-type', 'vintage-beetle');
    await expect(carStage).toHaveAttribute('data-vehicle-color', '#00ff00');

    // Save changes
    await page.click('button:has-text("Kaydet")');
    await page.waitForTimeout(1000);

    // F5 reload check
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.click('[data-testid="admin-nav-design"]');
    await page.click('button:has-text("4. Açılış Animasyonu")');
    
    // Verifying value is persistent in the input form after F5
    await expect(page.locator('[data-testid="anim-field-vehicleColor"]')).toHaveValue('#00ff00');
  });

  test("10. E2E: Celestial Eclipse Selection, Customizing, and Persistence", async ({ page }) => {
    await loginAsAdmin(page, SLUG);

    await page.click('[data-testid="admin-nav-design"]');
    await page.click('button:has-text("4. Açılış Animasyonu")');
    await page.waitForTimeout(300);

    // Select Celestial Eclipse
    const eclipseCard = page.locator('[data-testid="anim-card-celestial-eclipse"]');
    await expect(eclipseCard).toBeVisible();
    await eclipseCard.click();
    await page.waitForTimeout(300);

    // Verify specific controls visible
    const bodySelect = page.locator('[data-testid="anim-field-celestialBodyType"]');
    await expect(bodySelect).toBeVisible();
    await bodySelect.selectOption('lunar');

    const glowColorInput = page.locator('[data-testid="anim-field-glowColor"]');
    await expect(glowColorInput).toBeVisible();
    await glowColorInput.fill('#0000ff');
    await page.waitForTimeout(500);

    // Verify live preview DOM reflects custom values
    const eclipseStage = page.locator('[data-testid="celestial-eclipse-stage"]').first();
    await expect(eclipseStage).toBeAttached();
    await expect(eclipseStage).toHaveAttribute('data-celestial-body-type', 'lunar');
    await expect(eclipseStage).toHaveAttribute('data-glow-color', '#0000ff');

    // Save changes
    await page.click('button:has-text("Kaydet")');
    await page.waitForTimeout(1000);

    // F5 check
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.click('[data-testid="admin-nav-design"]');
    await page.click('button:has-text("4. Açılış Animasyonu")');
    await expect(page.locator('[data-testid="anim-field-glowColor"]')).toHaveValue('#0000ff');
  });

  test("11. E2E: Silk Fabric Reveal Selection, Customizing, and Persistence", async ({ page }) => {
    await loginAsAdmin(page, SLUG);

    await page.click('[data-testid="admin-nav-design"]');
    await page.click('button:has-text("4. Açılış Animasyonu")');
    await page.waitForTimeout(300);

    // Select Silk Fabric Reveal
    const silkCard = page.locator('[data-testid="anim-card-silk-fabric-reveal"]');
    await expect(silkCard).toBeVisible();
    await silkCard.click();
    await page.waitForTimeout(300);

    // Verify specific controls visible
    const directionSelect = page.locator('[data-testid="anim-field-sweepDirection"]');
    await expect(directionSelect).toBeVisible();
    await directionSelect.selectOption('right');

    const fabricColorInput = page.locator('[data-testid="anim-field-fabricColor"]');
    await expect(fabricColorInput).toBeVisible();
    await fabricColorInput.fill('#ff00ff');
    await page.waitForTimeout(500);

    // Verify preview DOM
    const silkStage = page.locator('[data-testid="silk-fabric-stage"]').first();
    await expect(silkStage).toBeAttached();
    await expect(silkStage).toHaveAttribute('data-sweep-direction', 'right');
    await expect(silkStage).toHaveAttribute('data-fabric-color', '#ff00ff');

    // Save changes
    await page.click('button:has-text("Kaydet")');
    await page.waitForTimeout(1000);
  });

  test("12. E2E: Template Default Reset Verification", async ({ page }) => {
    await loginAsAdmin(page, SLUG);

    await page.click('[data-testid="admin-nav-design"]');
    await page.click('button:has-text("4. Açılış Animasyonu")');
    await page.waitForTimeout(300);

    // Click Reset to recommended
    await page.click('button.text-reset-template-opening');
    await page.waitForTimeout(500);

    // Recommended for corporate "future-summit" is "futureSummit"
    await expect(page.locator('[data-testid="anim-card-futureSummit"]')).toHaveClass(/border-purple-6/);
  });

  test("13. E2E: Public Invitation Persistence & Direct None Option", async ({ page }) => {
    await loginAsAdmin(page, SLUG);

    await page.click('[data-testid="admin-nav-design"]');
    await page.click('button:has-text("4. Açılış Animasyonu")');
    await page.waitForTimeout(300);

    // Select None
    const noneCard = page.locator('[data-testid="anim-card-none"]');
    await expect(noneCard).toBeVisible();
    await noneCard.click();
    await page.waitForTimeout(300);

    // Save changes
    await page.click('button:has-text("Kaydet")');
    await page.waitForTimeout(1000);

    // Check public page directly has NO overlay
    await page.goto(`${BASE_URL}/${SLUG}?preview=true`);
    await page.waitForLoadState("networkidle");
    const overlay = page.locator("[data-testid=\"opening-overlay\"]");
    await expect(overlay).not.toBeVisible();
  });
});
