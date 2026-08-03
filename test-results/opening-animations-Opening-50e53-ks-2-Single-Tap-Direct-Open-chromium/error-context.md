# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: opening-animations.spec.ts >> Opening Animations - Detailed Checks >> 2. Single Tap Direct Open
- Location: tests\opening-animations.spec.ts:80:7

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('[data-testid="opening-overlay"]')
Expected: "opened"
Received: "completed-awaiting-interaction"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('[data-testid="opening-overlay"]')
    9 × locator resolved to <div tabindex="0" role="button" data-opening-state="playing" data-testid="opening-overlay" aria-label="Davetiyeyi açmak için dokununuz" class="opening-stage-container overflow-hidden w-full h-full absolute inset-0 z-50 cursor-pointer transition-opacity duration-300 opacity-100">…</div>
      - unexpected value "playing"
    5 × locator resolved to <div tabindex="0" role="button" data-testid="opening-overlay" aria-label="Davetiyeyi açmak için dokununuz" data-opening-state="completed-awaiting-interaction" class="opening-stage-container overflow-hidden w-full h-full absolute inset-0 z-50 cursor-pointer transition-opacity duration-300 opacity-100">…</div>
      - unexpected value "completed-awaiting-interaction"

```

```yaml
- button "Davetiyeyi açmak için dokununuz":
  - heading "Long Corporate Name Co &" [level=1]
  - paragraph: Davetimize Davetlisiniz
  - paragraph: 13.08.2026
  - paragraph: ✨ DEVAM ETMEK İÇİN DOKUNUN ✨
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | import crypto from "crypto";
  3   | import { createClient } from "@supabase/supabase-js";
  4   | import dotenv from "dotenv";
  5   | dotenv.config({ path: ".env.local" });
  6   | 
  7   | const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  8   | const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  9   | 
  10  | if (!SUPABASE_URL || !SUPABASE_KEY) {
  11  |   throw new Error("Missing Supabase environment variables");
  12  | }
  13  | 
  14  | const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
  15  | 
  16  | test.describe("Opening Animations - Detailed Checks", () => {
  17  |   test.describe.configure({ mode: "serial" });
  18  |   test.setTimeout(120000);
  19  | 
  20  |   let supabase: any;
  21  |   const SLUG = "test-opening-animations-" + Date.now();
  22  | 
  23  |   test.beforeAll(async () => {
  24  |     supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  25  |     const records = [
  26  |       {
  27  |         id: crypto.randomUUID(),
  28  |         slug: SLUG,
  29  |         event_type: "corporate",
  30  |         template_id: "future-summit",
  31  |         is_paid: true,
  32  |         bride_name: "Long Corporate Name Co",
  33  |         groom_name: "",
  34  |         wedding_date: new Date(Date.now() + 864000000).toISOString(),
  35  |         venue_name: "Convention Center",
  36  |         admin_password: "test",
  37  |         entrance_animation: "parisianBlackTie",
  38  |         custom_overrides: {
  39  |           event_variant: "tech-launch"
  40  |         }
  41  |       }
  42  |     ];
  43  | 
  44  |     const { error } = await supabase.from("weddings").insert(records);
  45  |     if (error) console.error("INSERT ERROR:", error);
  46  |   });
  47  | 
  48  |   test.afterAll(async () => {
  49  |     if (supabase) {
  50  |       await supabase.from("weddings").delete().eq("slug", SLUG);
  51  |     }
  52  |   });
  53  | 
  54  |   test("1. No Auto Open & 5s idle & Final State persistence", async ({ page }) => {
  55  |     await page.setViewportSize({ width: 1280, height: 800 });
  56  |     await page.goto(`${BASE_URL}/d/${SLUG}`);
  57  |     
  58  |     const overlay = page.locator("[data-testid=\"opening-overlay\"]");
  59  |     await expect(overlay).toBeVisible();
  60  |     
  61  |     // Wait for animation to finish (e.g. 3s)
  62  |     await page.waitForTimeout(3500);
  63  |     
  64  |     // Ensure state is completed-awaiting-interaction
  65  |     await expect(overlay).toHaveAttribute("data-opening-state", "completed-awaiting-interaction");
  66  |     
  67  |     // Idle 5 seconds
  68  |     await page.waitForTimeout(5000);
  69  |     
  70  |     // Ensure still awaiting
  71  |     await expect(overlay).toHaveAttribute("data-opening-state", "completed-awaiting-interaction");
  72  |     
  73  |     // Ensure no blank screen
  74  |     const box = await overlay.boundingBox();
  75  |     expect(box?.height).toBeGreaterThan(0);
  76  |     
  77  |     await page.screenshot({ path: "test-results/opening-parisian-final-plus-5s.png" });
  78  |   });
  79  | 
  80  |   test("2. Single Tap Direct Open", async ({ page }) => {
  81  |     await page.setViewportSize({ width: 1280, height: 800 });
  82  |     await page.goto(`${BASE_URL}/d/${SLUG}`);
  83  |     
  84  |     const overlay = page.locator("[data-testid=\"opening-overlay\"]");
  85  |     await expect(overlay).toBeVisible();
  86  |     
  87  |     // Tap on top left corner (not a button)
  88  |     await page.mouse.click(10, 10);
  89  |     
  90  |     // Ensure state becomes opened
> 91  |     await expect(overlay).toHaveAttribute("data-opening-state", "opened");
      |                           ^ Error: expect(locator).toHaveAttribute(expected) failed
  92  |     
  93  |     // Wait for transition 300ms
  94  |     await page.waitForTimeout(400);
  95  |     
  96  |     // Ensure overlay is hidden or gone
  97  |     // Check if main content is visible
  98  |     await expect(page.locator("text=Long Corporate Name Co")).toBeVisible();
  99  |     await page.screenshot({ path: "test-results/opening-parisian-opened.png" });
  100 |   });
  101 | 
  102 |   test("3. Enter and Space to open", async ({ page }) => {
  103 |     await page.goto(`${BASE_URL}/d/${SLUG}`);
  104 |     const overlay = page.locator("[data-testid=\"opening-overlay\"]");
  105 |     await expect(overlay).toBeVisible();
  106 |     
  107 |     await overlay.focus();
  108 |     await page.keyboard.press("Enter");
  109 |     await expect(overlay).toHaveAttribute("data-opening-state", "opened");
  110 |   });
  111 | 
  112 |   test("4. Semantic Data check", async ({ page }) => {
  113 |     await page.goto(`${BASE_URL}/d/${SLUG}`);
  114 |     const overlay = page.locator("[data-testid=\"opening-overlay\"]");
  115 |     await expect(overlay.locator("text=Long Corporate Name Co")).toBeVisible();
  116 |   });
  117 | });
  118 | 
```