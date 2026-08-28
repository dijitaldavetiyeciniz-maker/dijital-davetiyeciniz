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

test.describe('C6: Product UX Redesign and Event-Aware Journeys', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(120000);

  let supabase: any;
  const runId = crypto.randomUUID().slice(0, 8);
  const SLUG_WEDDING = `ux-wed-${runId}`;
  const SLUG_HENNA = `ux-henna-${runId}`;
  const SLUG_BABY = `ux-baby-${runId}`;
  const SLUG_CORP = `ux-corp-${runId}`;
  const SLUG_SPECIAL = `ux-spec-${runId}`;
  const SLUG_ENG = `ux-eng-${runId}`;
  const SLUG_CIRCUM = `ux-circum-${runId}`;
  const SLUG_BDAY = `ux-bday-${runId}`;
  const SLUG_GRAD = `ux-grad-${runId}`;

  const weddingIds: Record<string, string> = {};

  test.beforeAll(async () => {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // 1. Create a Wedding Event
    weddingIds.wedding = crypto.randomUUID();
    await supabase.from('weddings').insert({
      id: weddingIds.wedding,
      slug: SLUG_WEDDING,
      bride_name: "Elif",
      groom_name: "Kerem",
      wedding_date: "2027-10-15T19:00:00.000Z",
      venue_name: "Swissôtel",
      event_type: "wedding",
      admin_password: "adminpassword",
      template_id: "royal-letter",
      is_paid: true,
      is_published: true
    });

    // Insert 3 sub-events for the wedding event (Only if we have database service role keys/access)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const nikahId = crypto.randomUUID();
      const hennaId = crypto.randomUUID();
      const afterId = crypto.randomUUID();
      await supabase.from('invitation_events').insert([
        {
          id: nikahId,
          wedding_id: weddingIds.wedding,
          type: "düğün",
          title: "Nikah Töreni",
          start_time: "2027-10-15T19:00:00.000Z",
          venue_name: "Swissôtel Salon",
          is_primary: true
        },
        {
          id: hennaId,
          wedding_id: weddingIds.wedding,
          type: "kına",
          title: "Gelin Kınası",
          start_time: "2027-10-14T19:00:00.000Z",
          venue_name: "Çırağan Sarayı",
          is_primary: false
        },
        {
          id: afterId,
          wedding_id: weddingIds.wedding,
          type: "after_party",
          title: "After Party",
          start_time: "2027-10-15T22:00:00.000Z",
          venue_name: "Swissôtel Club",
          is_primary: false
        }
      ]);
    }

    // 2. Create a Henna Event
    weddingIds.henna = crypto.randomUUID();
    await supabase.from('weddings').insert({
      id: weddingIds.henna,
      slug: SLUG_HENNA,
      bride_name: "Selin",
      groom_name: "",
      wedding_date: "2027-10-14T19:00:00.000Z",
      venue_name: "Çırağan Kına Salonu",
      event_type: "henna",
      admin_password: "adminpassword",
      template_id: "henna-velvet",
      is_paid: true,
      is_published: true
    });
    
    // Create Kına primary event (Only if we have database service role keys/access)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await supabase.from('invitation_events').insert({
        id: crypto.randomUUID(),
        wedding_id: weddingIds.henna,
        type: "kına",
        title: "Selin Kınası",
        start_time: "2027-10-14T19:00:00.000Z",
        venue_name: "Çırağan Kına Salonu",
        is_primary: true
      });
    }

    // 3. Create a Baby Shower Event
    weddingIds.babyshower = crypto.randomUUID();
    await supabase.from('weddings').insert({
      id: weddingIds.babyshower,
      slug: SLUG_BABY,
      bride_name: "Defne Bebek",
      groom_name: "",
      bride_parents: "Merve Kaya",
      wedding_date: "2027-11-20T14:00:00.000Z",
      venue_name: "Joy Garden",
      event_type: "babyshower",
      admin_password: "adminpassword",
      template_id: "kids-safari",
      is_paid: true,
      is_published: true
    });

    // 4. Create a Corporate Event
    weddingIds.corporate = crypto.randomUUID();
    await supabase.from('weddings').insert({
      id: weddingIds.corporate,
      slug: SLUG_CORP,
      bride_name: "Teknoloji Zirvesi",
      groom_name: "Antigravity",
      wedding_date: "2027-12-05T09:00:00.000Z",
      venue_name: "Wyndham Grand",
      event_type: "corporate",
      admin_password: "adminpassword",
      template_id: "minimal-paper",
      is_paid: true,
      is_published: true
    });

    // 5. Create a Special Event
    weddingIds.special = crypto.randomUUID();
    await supabase.from('weddings').insert({
      id: weddingIds.special,
      slug: SLUG_SPECIAL,
      bride_name: "Gala Yemeği",
      groom_name: "",
      wedding_date: "2027-12-25T20:00:00.000Z",
      venue_name: "Bosphorus Palace",
      event_type: "special",
      admin_password: "adminpassword",
      template_id: "minimal-paper",
      is_paid: true,
      is_published: true
    });

    // 6. Create Engagement Event
    weddingIds.engagement = crypto.randomUUID();
    await supabase.from('weddings').insert({
      id: weddingIds.engagement,
      slug: SLUG_ENG,
      bride_name: "Gizem",
      groom_name: "Deniz",
      wedding_date: "2027-09-10T18:00:00.000Z",
      venue_name: "Sheraton",
      event_type: "engagement",
      admin_password: "adminpassword",
      template_id: "royal-letter",
      is_paid: true,
      is_published: true
    });

    // 7. Create Circumcision Event
    weddingIds.circumcision = crypto.randomUUID();
    await supabase.from('weddings').insert({
      id: weddingIds.circumcision,
      slug: SLUG_CIRCUM,
      bride_name: "Yiğit",
      groom_name: "",
      wedding_date: "2027-08-20T17:00:00.000Z",
      venue_name: "Hilton Grand",
      event_type: "circumcision",
      admin_password: "adminpassword",
      template_id: "kids-safari",
      is_paid: true,
      is_published: true
    });

    // 8. Create Birthday Event
    weddingIds.birthday = crypto.randomUUID();
    await supabase.from('weddings').insert({
      id: weddingIds.birthday,
      slug: SLUG_BDAY,
      bride_name: "Can",
      groom_name: "",
      wedding_date: "2027-07-15T15:00:00.000Z",
      venue_name: "Happy Kids Cafe",
      event_type: "birthday",
      admin_password: "adminpassword",
      template_id: "kids-safari",
      is_paid: true,
      is_published: true
    });

    // 9. Create Graduation Event
    weddingIds.graduation = crypto.randomUUID();
    await supabase.from('weddings').insert({
      id: weddingIds.graduation,
      slug: SLUG_GRAD,
      bride_name: "ODTÜ Mezunları",
      groom_name: "Mühendislik Fakültesi",
      wedding_date: "2027-06-30T10:00:00.000Z",
      venue_name: "ODTÜ Stadyumu",
      event_type: "graduation",
      admin_password: "adminpassword",
      template_id: "minimal-paper",
      is_paid: true,
      is_published: true
    });
  });

  test.afterAll(async () => {
    if (supabase) {
      await supabase.from('weddings').delete().in('id', Object.values(weddingIds));
    }
  });

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.stack || err.message));

    // If local test environment (no database service role key), mock events API at browser level
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await page.route('**/api/events*', async (route) => {
        const url = route.request().url();
        const method = route.request().method();
        
        if (method === 'GET') {
          let mockEvents: any[] = [];
          if (url.includes(SLUG_WEDDING)) {
            mockEvents = [
              {
                id: 'event-nikah-id',
                wedding_id: weddingIds.wedding,
                type: 'düğün',
                title: 'Nikah Töreni',
                start_time: '2027-10-15T19:00:00.000Z',
                venue_name: 'Swissôtel Salon',
                is_primary: true,
                description: ''
              },
              {
                id: 'event-kına-id',
                wedding_id: weddingIds.wedding,
                type: 'kına',
                title: 'Gelin Kınası',
                start_time: '2027-10-14T19:00:00.000Z',
                venue_name: 'Çırağan Sarayı',
                is_primary: false,
                description: 'Kına gecemiz kadınlara özeldir.'
              },
              {
                id: 'event-after-id',
                wedding_id: weddingIds.wedding,
                type: 'after_party',
                title: 'After Party',
                start_time: '2027-10-15T22:00:00.000Z',
                venue_name: 'Swissôtel Club',
                is_primary: false,
                description: 'Etkinliğimiz 18 yaş ve üzeridir.'
              }
            ];
          } else if (url.includes(SLUG_HENNA)) {
            mockEvents = [
              {
                id: 'event-henna-id',
                wedding_id: weddingIds.henna,
                type: 'kına',
                title: 'Selin Kınası',
                start_time: '2027-10-14T19:00:00.000Z',
                venue_name: 'Çırağan Kına Salonu',
                is_primary: true,
                description: ''
              }
            ];
          }
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockEvents)
          });
        } else {
          await route.continue();
        }
      });
    }
  });

  test('Guided stepper navigation and event-aware layout rendering', async ({ page }) => {
    await page.goto(`${BASE_URL}/${SLUG_WEDDING}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');

    // Confirm admin dashboard renders
    await expect(page.locator('text=Davetiye Hazırlama Stüdyosu')).toBeVisible();

    // Verify stepper sidebar items
    await expect(page.locator('text=Bilgiler').first()).toBeVisible();
    await expect(page.locator('text=Etkinlik').first()).toBeVisible();
    await expect(page.locator('text=Tasarım').first()).toBeVisible();
    await expect(page.locator('text=İçerik').first()).toBeVisible();
    await expect(page.locator('text=Özel İçerikler').first()).toBeVisible();

    // Verify Wedding couple terminology
    await expect(page.locator('label:has-text("Gelin Adı")')).toBeVisible();
    await expect(page.locator('label:has-text("Damat Adı")')).toBeVisible();
  });

  test('Kına flow and women-only suggestion rendering', async ({ page }) => {
    await page.goto(`${BASE_URL}/${SLUG_HENNA}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');

    // Terminology check
    await expect(page.locator('label:has-text("Gelin Adayı")')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('label:has-text("Damat Adayı (İsteğe Bağlı)")')).toBeVisible();

    // Women-only toggle is in the Info tab (Dynamic Question Inputs for henna event type)
    // Scroll to make it visible if needed
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(300);

    // Women-only toggle visibility
    const isWomenOnlyContainer = page.locator('div:has-text("Kına gecesi yalnızca kadınlara mı özel?")').last();
    await expect(isWomenOnlyContainer).toBeVisible({ timeout: 10000 });

    // Click Yes
    await page.click('button[role="radio"]:has-text("Evet")');

    // Suggested note verification
    const suggestionNoteTextarea = page.locator('textarea[placeholder*="kadınlara özeldir"]');
    await expect(suggestionNoteTextarea).toBeVisible();

    // Modify the suggested note
    await suggestionNoteTextarea.fill("Kına gecemiz tamamen kadınlara özel eğlencelidir.");

    // Save
    await page.click('button:has-text("Kaydet")');
    await page.waitForTimeout(1000);

    // Refresh and check persistence
    await page.reload();
    const pwInput = page.locator('input[type="password"]');
    if (await pwInput.isVisible()) {
      await pwInput.fill('adminpassword');
      await page.click('button[type="submit"]');
    }
    await expect(page.locator('textarea[placeholder*="kadınlara özeldir"]')).toHaveValue("Kına gecemiz tamamen kadınlara özel eğlencelidir.");
  });

  test('Corporate flow terminology and no wedding assumptions', async ({ page }) => {
    await page.goto(`${BASE_URL}/${SLUG_CORP}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');

    // Terminology check
    await expect(page.locator('label:has-text("Etkinlik Adı / Başlığı")')).toBeVisible();
    await expect(page.locator('label:has-text("Düzenleyen Şirket / Kurum")')).toBeVisible();

    // No wedding assumptions
    await expect(page.locator('text=Gelin Adı')).not.toBeVisible();
    await expect(page.locator('text=Damat Adı')).not.toBeVisible();
  });

  test('Special event custom note and dynamic questions flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/${SLUG_SPECIAL}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');

    // Terminology check
    await expect(page.locator('label:has-text("Etkinlik Adı / Başlığı")')).toBeVisible();
    await expect(page.locator('label:has-text("Kimin İçin / Konusu")')).toBeVisible();
  });

  test('Multi-event notes isolation (Nikah, Kına, After Party)', async ({ page }) => {
    // If the database service role key is missing, skip the database integration check locally
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("LOCAL RUN: Skipping real database Multi-event notes isolation test due to missing service role credentials.");
      return;
    }

    const events = await supabase.from('invitation_events').select('*').eq('wedding_id', weddingIds.wedding);
    
    let kınaEv = (events.data || []).find((e: any) => e.type === 'kına');
    let afterEv = (events.data || []).find((e: any) => e.type === 'after_party');
    let nikahEv = (events.data || []).find((e: any) => e.type === 'düğün');

    if (!kınaEv || !afterEv || !nikahEv) {
      console.warn("Could not find invitation events in DB (RLS active). Using test fallback mocks.");
      kınaEv = { id: 'event-kına-id', type: 'kına' };
      afterEv = { id: 'event-after-id', type: 'after_party' };
      nikahEv = { id: 'event-nikah-id', type: 'düğün' };
    } else {
      // Update their descriptions in DB (will run in CI environments where service role key is set)
      await supabase.from('invitation_events').update({ description: "Kına gecemiz kadınlara özeldir." }).eq('id', kınaEv.id);
      await supabase.from('invitation_events').update({ description: "Etkinliğimiz 18 yaş ve üzeridir." }).eq('id', afterEv.id);
      await supabase.from('invitation_events').update({ description: "" }).eq('id', nikahEv.id);
    }

    // Visit public invitation page
    await page.goto(`${BASE_URL}/${SLUG_WEDDING}`);

    // Verify Kına event card contains Kına note only
    const kınaCard = page.locator('h4:has-text("Gelin Kınası")').locator('xpath=../..');
    await expect(kınaCard).toBeVisible();
    await expect(kınaCard).toContainText("Kına gecemiz kadınlara özeldir.");
    await expect(kınaCard).not.toContainText("18 yaş ve üzeridir.");

    // Verify After Party card contains After Party note only
    const afterCard = page.locator('h4:has-text("After Party")').locator('xpath=../..');
    await expect(afterCard).toBeVisible();
    await expect(afterCard).toContainText("Etkinliğimiz 18 yaş ve üzeridir.");
    await expect(afterCard).not.toContainText("kadınlara özeldir.");

    // Verify Nikah card contains no note
    const nikahCard = page.locator('h4:has-text("Nikah Töreni")').locator('xpath=../..');
    await expect(nikahCard).toBeVisible();
    await expect(nikahCard).not.toContainText("Kına gecemiz kadınlara özeldir.");
    await expect(nikahCard).not.toContainText("18 yaş ve üzeridir.");
  });

  test('All 9 event categories terminology checks and fallbacks', async ({ page }) => {
    // 1. Wedding
    await page.goto(`${BASE_URL}/${SLUG_WEDDING}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('label:has-text("Gelin Adı")')).toBeVisible();

    // 2. Engagement
    await page.goto(`${BASE_URL}/${SLUG_ENG}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('label:has-text("Gelin / Birinci Kişi")')).toBeVisible();

    // 3. Henna
    await page.goto(`${BASE_URL}/${SLUG_HENNA}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('label:has-text("Gelin Adayı")')).toBeVisible();

    // 4. Circumcision
    await page.goto(`${BASE_URL}/${SLUG_CIRCUM}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('label:has-text("Çocuğun Adı")')).toBeVisible();

    // 5. Baby Shower
    await page.goto(`${BASE_URL}/${SLUG_BABY}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('label:has-text("Bebeğin Adı / Hitap")')).toBeVisible();

    // 6. Birthday
    await page.goto(`${BASE_URL}/${SLUG_BDAY}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('label:has-text("Doğum Günü Sahibi Adı")')).toBeVisible();

    // 7. Corporate
    await page.goto(`${BASE_URL}/${SLUG_CORP}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('label:has-text("Etkinlik Adı / Başlığı")')).toBeVisible();

    // 8. Graduation
    await page.goto(`${BASE_URL}/${SLUG_GRAD}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('label:has-text("Mezun Adı / Sınıf Adı")')).toBeVisible();

    // 9. Special
    await page.goto(`${BASE_URL}/${SLUG_SPECIAL}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('label:has-text("Etkinlik Adı / Başlığı")')).toBeVisible();
  });

  test('Cross-event terminology validation', async ({ page }) => {
    // 1. Baby shower checks (no wedding/corporate keys)
    await page.goto(`${BASE_URL}/${SLUG_BABY}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Damat Adı')).not.toBeVisible();
    await expect(page.locator('text=Düzenleyen Şirket')).not.toBeVisible();

    // 2. Corporate checks (no bride/groom/henna keys)
    await page.goto(`${BASE_URL}/${SLUG_CORP}/admin`);
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Gelin Adı')).not.toBeVisible();
    await expect(page.locator('text=Damat Ailesi')).not.toBeVisible();
    await expect(page.locator('text=Kına gecesi')).not.toBeVisible();
  });
});
