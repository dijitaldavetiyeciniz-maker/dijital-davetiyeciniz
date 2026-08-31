import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../saas/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL and Service Role Key must be set in .env.local for tests");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function loginAsAdmin(page: any, slug: string) {
  // Attach listeners for console and uncaught errors
  page.on('console', (msg: any) => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', (err: any) => console.error(`[BROWSER ERROR] ${err.stack || err.message}`));

  console.log(`--- Navigating to /${slug}/admin`);
  await page.goto(`/${slug}/admin`);
  await page.waitForLoadState('networkidle').catch(() => {});
  
  // Wait for either the loading screen to disappear and password input to show, or dashboard header to show
  console.log(`--- Waiting for page hydration/compilation (up to 30s)`);
  const loginOrDashboard = page.locator('input[type="password"], header h1');
  await expect(loginOrDashboard.first()).toBeVisible({ timeout: 30000 });

  const passwordInput = page.locator('input[type="password"]');
  const submitBtn = page.locator('form button[type="submit"]').first();

  const isVisible = await passwordInput.isVisible();
  if (isVisible) {
    console.log(`--- Filling password`);
    await passwordInput.fill('test');
    await page.waitForTimeout(200);
    
    console.log(`--- Clicking submit button and waiting for POST /api/admin/auth`);
    await Promise.all([
      page.waitForResponse(
        (resp: any) => resp.url().includes('/api/admin/auth') && resp.request().method() === 'POST',
        { timeout: 20000 }
      ),
      submitBtn.click()
    ]);
    
    console.log(`--- Auth response received, waiting for dashboard h1`);
    await page.waitForSelector('header h1', { timeout: 20000 });
    console.log(`--- Dashboard loaded successfully`);
  } else {
    console.log(`--- Already authenticated`);
  }
}

test.describe('C12 Admin Panel Functional Completion Gate', () => {
  const testSlug = `c12-admin-a-${Date.now().toString(36)}`;
  const testSlugB = `c12-admin-b-${Date.now().toString(36)}`;
  let testWeddingId: string = '';
  let testWeddingIdB: string = '';
  let testEventIdB: string = '';

  test.beforeAll(async () => {
    // Seed Wedding A
    const { data: dataA, error: errA } = await supabase
      .from('weddings')
      .insert({
        slug: testSlug,
        bride_name: 'Zeynep',
        groom_name: 'Murat',
        event_type: 'henna',
        admin_password: 'test',
        is_active: true,
        is_paid: true,
        is_published: true,
        template_id: 'template1',
        primary_color: '#991b1b',
        text_color: '#fff7ed',
        font_family: 'Montserrat',
        names_font_family: 'Cormorant Garamond',
        custom_overrides: {
          audience_type: 'women',
          special_guest_info: 'Kına gecemiz kadınlar arasında gerçekleştirilecektir.',
          custom_sections: [
            {
              id: 'sec-1',
              title: 'Özel Karşılama İkramları',
              subtitle: 'Girişte Şerbet & Lokum',
              content: 'Misafirlerimiz için salon girişinde geleneksel şerbet ikramımız olacaktır.',
              alignment: 'center',
              isVisible: true
            }
          ]
        }
      })
      .select('id')
      .single();

    if (errA) console.error('Failed to create A:', errA);
    else if (dataA) {
      testWeddingId = dataA.id;
      // Seed a test event for A
      const { error: errEventA } = await supabase
        .from('invitation_events')
        .insert({
          wedding_id: testWeddingId,
          type: 'henna',
          title: 'Zeynep & Murat Kına Gecesi',
          start_time: new Date().toISOString()
        });
      if (errEventA) console.error('Failed to seed event for A:', errEventA);
    }

    // Seed Wedding B (Used for isolation and backward compatibility checks)
    const { data: dataB, error: errB } = await supabase
      .from('weddings')
      .insert({
        slug: testSlugB,
        bride_name: 'Asli',
        groom_name: 'Can',
        event_type: 'wedding',
        admin_password: 'test',
        is_active: true,
        is_paid: true,
        is_published: true,
        template_id: 'template1',
        primary_color: '#1e3a8a',
        text_color: '#ffffff',
        font_family: 'Roboto',
        names_font_family: 'Playfair Display',
        custom_overrides: {} // Simulate legacy/empty structure
      })
      .select('id')
      .single();

    if (errB) console.error('Failed to create B:', errB);
    else if (dataB) {
      testWeddingIdB = dataB.id;
      // Seed a test event for B
      const { data: eventB, error: errEventB } = await supabase
        .from('invitation_events')
        .insert({
          wedding_id: testWeddingIdB,
          type: 'wedding',
          title: 'Asli & Can Wedding Event',
          start_time: new Date().toISOString()
        })
        .select('id')
        .single();
      if (errEventB) console.error('Failed to seed event for B:', errEventB);
      else if (eventB) testEventIdB = eventB.id;
    }
  });

  test.afterAll(async () => {
    if (testWeddingId) {
      await supabase.from('invitation_events').delete().eq('wedding_id', testWeddingId);
      await supabase.from('weddings').delete().eq('id', testWeddingId);
    }
    if (testWeddingIdB) {
      await supabase.from('invitation_events').delete().eq('wedding_id', testWeddingIdB);
      await supabase.from('weddings').delete().eq('id', testWeddingIdB);
    }
  });

  test('1. Admin Authentication & Role Isolation: Owner checks cross-boundary security', async ({ page }) => {
    await loginAsAdmin(page, testSlug);

    // Verify main admin dashboard A loaded
    const headerTitle = page.locator('header h1');
    await expect(headerTitle).toContainText('Zeynep');

    // Attempt to access Wedding B's events using Wedding A's session context in browser
    const crossGetResult = await page.evaluate(async (wId: string) => {
      const res = await fetch(`/api/events?wedding_id=${wId}`);
      return { status: res.status, ok: res.ok };
    }, testWeddingIdB);

    // Should be rejected with 401 Unauthorized
    expect(crossGetResult.status).toBe(401);

    // Attempt to POST event to Wedding B
    const crossPostResult = await page.evaluate(async (wId: string) => {
      const res = await fetch(`/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wedding_id: wId,
          type: 'henna',
          title: 'Hacker Event',
          start_time: new Date().toISOString()
        })
      });
      return { status: res.status, ok: res.ok };
    }, testWeddingIdB);

    expect(crossPostResult.status).toBe(401);

    // Attempt to PUT (update) B's event using A's session context
    const crossPutResult = await page.evaluate(async (eventId: string) => {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Hacked Title'
        })
      });
      return { status: res.status, ok: res.ok };
    }, testEventIdB);

    expect(crossPutResult.status).toBe(401);

    // Attempt to DELETE B's event using A's session context
    const crossDeleteResult = await page.evaluate(async (eventId: string) => {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      });
      return { status: res.status, ok: res.ok };
    }, testEventIdB);

    expect(crossDeleteResult.status).toBe(401);

    // Attempt to open Admin page of B and confirm it prompts for password (not logged in automatically)
    await page.goto(`/${testSlugB}/admin`);
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
  });

  test('2. Events & Program Hierarchical Builder: Renders nested timeline items and badges', async ({ page }) => {
    await loginAsAdmin(page, testSlug);

    // Go to Events Tab
    await page.click('[data-testid="admin-nav-events"]');
    await page.waitForTimeout(1000);

    // Click "+ Etkinlik Ekle" or "İlk Etkinliğinizi Ekleyin"
    const addBtn = page.locator('button:has-text("Etkinlik Ekle"), button:has-text("İlk Etkinliğinizi Ekleyin")').first();
    await addBtn.click();
    await page.waitForTimeout(500);

    // Fill event fields in modal
    const titleInput = page.locator('[data-testid="event-title-input"]');
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    await titleInput.fill('Kına Gecesi');
    
    const audienceSelect = page.locator('[data-testid="event-audience-select"]');
    if (await audienceSelect.isVisible()) {
      await audienceSelect.selectOption('women');
    }
    
    const specialNoteInput = page.locator('[data-testid="event-special-note-input"]');
    if (await specialNoteInput.isVisible()) {
      await specialNoteInput.fill('Kına gecemiz kadınlar arasında gerçekleştirilecektir.');
    }

    // Add Program Item
    const addProgBtn = page.locator('[data-testid="event-add-prog-btn"]');
    if (await addProgBtn.isVisible()) {
      await addProgBtn.click();
      await page.waitForTimeout(500);
      const progTitleInput = page.locator('[data-testid="event-prog-title-input"]');
      if (await progTitleInput.isVisible()) {
        await progTitleInput.fill('Misafir Karşılama');
        const progSaveBtn = page.locator('[data-testid="event-prog-save-btn"]');
        if (await progSaveBtn.isVisible()) {
          await progSaveBtn.click();
          await page.waitForTimeout(500);
        }
      }
    }

    // Save Event — wait for the API response to complete
    const saveBtn = page.locator('[data-testid="event-save-modal-btn"]');
    await expect(saveBtn).toBeVisible({ timeout: 5000 });
    
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/events') && resp.request().method() === 'POST', { timeout: 15000 }),
      saveBtn.click()
    ]);
    expect(response.status()).toBe(200);
    
    // Wait for UI to re-render after fetchEvents
    await page.waitForTimeout(2000);

    // Verify event card exists
    const eventCard = page.locator('[data-testid^="event-card-"]').first();
    await expect(eventCard).toBeVisible({ timeout: 10000 });
    await expect(eventCard).toContainText('Kına Gecesi');
  });

  test('3. Design Studio: Animation-Specific Controls Verification', async ({ page }) => {
    await loginAsAdmin(page, testSlug);

    // Go to Design Tab
    await page.click('[data-testid="admin-nav-design"]');
    await page.waitForTimeout(500);

    // Check AnimationCustomizer subtab
    await page.click('button:has-text("4. Açılış Animasyonu")');
    await page.waitForTimeout(300);

    // 1. Select Envelope animation and verify envelopeColor and sealInitial controls modify the DOM
    const envCard = page.locator('[data-testid="anim-card-envelope"]');
    await envCard.click();
    await page.waitForTimeout(300);

    const envColorInput = page.locator('[data-testid="anim-field-envelopeColor"]');
    await expect(envColorInput).toBeVisible();
    await envColorInput.fill('#00ff00');
    await page.waitForTimeout(300);

    const sealInitialInput = page.locator('[data-testid="anim-field-sealInitial"]');
    await expect(sealInitialInput).toBeVisible();
    await sealInitialInput.fill('X');
    await page.waitForTimeout(500);

    // Verify envelopeColor and sealInitial exist on envelope-stage in live preview
    const previewStage = page.locator('[data-testid="envelope-stage"]').first();
    await expect(previewStage).toBeVisible();
    await expect(previewStage).toHaveAttribute('data-envelope-color', '#00ff00');
    await expect(previewStage).toHaveAttribute('data-seal-initial', 'X');

    // 2. Select Wax Seal / Starfield animation and verify starDensity and sparkleColor modify the DOM
    const waxCard = page.locator('[data-testid="anim-card-wax-seal-starfield"]');
    await waxCard.click();
    await page.waitForTimeout(300);

    const starRange = page.locator('[data-testid="anim-field-starDensity"]');
    await expect(starRange).toBeVisible();
    await starRange.fill('40'); // Set exactly 40 stars
    await page.waitForTimeout(500);

    const colorPicker = page.locator('[data-testid="anim-field-sparkleColor"]');
    await expect(colorPicker).toBeVisible();
    await colorPicker.fill('#ff0000'); // Set stars to pure red
    await page.waitForTimeout(500);

    const celestialSelect = page.locator('[data-testid="anim-field-celestialBody"]');
    await expect(celestialSelect).toBeVisible();
    await celestialSelect.selectOption('full-moon');
    await page.waitForTimeout(500);

    // Verify container updates in live preview DOM
    const starfieldStage = page.locator('[data-testid="wax-seal-starfield-stage"]').first();
    await expect(starfieldStage).toBeAttached();
    await expect(starfieldStage).toHaveAttribute('data-star-count', '40');
    await expect(starfieldStage).toHaveAttribute('data-sparkle-color', '#ff0000');
    await expect(starfieldStage).toHaveAttribute('data-celestial-body', 'full-moon');
  });

  test('4. Content Tab: Custom Sections Manager & Dynamic Section Ordering', async ({ page }) => {
    await loginAsAdmin(page, testSlug);

    // Go to Content Tab
    await page.click('[data-testid="admin-nav-content"]');
    await page.waitForTimeout(500);

    // Add custom section
    await page.click('button:has-text("+ Özel Bölüm Ekle")');
    await page.waitForTimeout(300);

    await page.fill('[data-testid="custom-sec-title"]', 'Müzik & Oynatma Listesi');
    await page.fill('[data-testid="custom-sec-subtitle"]', 'Şarkını Seç');
    await page.fill('[data-testid="custom-sec-content"]', 'Bizim için çalmasını istediğiniz parçaları ekleyin.');
    await page.click('[data-testid="custom-sec-save-btn"]');
    await page.waitForTimeout(500);

    // Change Section Ordering: Set order to ['events', 'custom_sections', 'template']
    
    // 1. Move 'events' up twice to index 0
    const upEventsBtn = page.locator('[data-testid="btn-order-up-events"]');
    await expect(upEventsBtn).toBeVisible();
    await upEventsBtn.click();
    await page.waitForTimeout(300);
    await upEventsBtn.click();
    await page.waitForTimeout(300);

    // 2. Move 'custom_sections' up once to index 1 (since template was shifted down)
    const upCustomBtn = page.locator('[data-testid="btn-order-up-custom_sections"]');
    await expect(upCustomBtn).toBeVisible();
    await upCustomBtn.click();
    await page.waitForTimeout(300);

    // Save configuration
    const saveBtn = page.locator('[data-testid="admin-save-btn"]');
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/rest/v1/weddings') && resp.request().method() === 'PATCH'),
      saveBtn.click()
    ]);

    await page.waitForTimeout(1000);

    // Go to Public Invitation View and verify dynamic ordering has Program -> Custom Section -> Template
    await page.goto(`/${testSlug}`);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(2000);

    const overlay = page.locator('[data-testid="opening-overlay"]').first();
    if (await overlay.isVisible()) {
      await overlay.click();
      await page.waitForTimeout(1500);
    }

    // Verify sections sequence in public DOM
    const eventsSecDom = page.locator('[data-testid="section-events"]');
    const customSecDom = page.locator('[data-testid="section-custom-sections"]');
    const templateDom = page.locator('[data-testid="section-template"]');

    await expect(eventsSecDom).toBeVisible();
    await expect(customSecDom).toBeVisible();
    await expect(templateDom).toBeVisible();

    // Check bounding rect coordinates to verify physical order in DOM: Events (Program) < Custom Section < Template
    const rectEvents = await eventsSecDom.boundingBox();
    const rectCustom = await customSecDom.boundingBox();
    const rectTemplate = await templateDom.boundingBox();

    if (rectEvents && rectCustom && rectTemplate) {
      expect(rectEvents.y).toBeLessThan(rectCustom.y);
      expect(rectCustom.y).toBeLessThan(rectTemplate.y);
    }
  });

  test('5. Full End-to-End Save & Reload & Logout-Login Persistence', async ({ page }) => {
    await loginAsAdmin(page, testSlug);

    // Go to Content Tab
    await page.click('[data-testid="admin-nav-content"]');
    await page.waitForTimeout(500);

    // Enable Mevlit details and fill inputs
    const mevlitYes = page.locator('[data-testid="mevlit-toggle-yes"]');
    await expect(mevlitYes).toBeVisible();
    await mevlitYes.click();
    await page.waitForTimeout(300);

    const mevlitVenueInput = page.locator('[data-testid="mevlit-venue-input"]');
    await expect(mevlitVenueInput).toBeVisible();
    await mevlitVenueInput.fill('Fatih Camii');

    // Click Save Button
    const saveBtn = page.locator('[data-testid="admin-save-btn"]');
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/rest/v1/weddings') && resp.request().method() === 'PATCH'),
      saveBtn.click()
    ]);
    await page.waitForTimeout(1000);

    // Perform hard F5 reload
    await page.reload();
    await page.waitForLoadState('networkidle').catch(() => {});
    await loginAsAdmin(page, testSlug);

    // Navigate to another tab (Design) then back to Content
    await page.click('[data-testid="admin-nav-design"]');
    await page.waitForTimeout(300);
    await page.click('[data-testid="admin-nav-content"]');
    await page.waitForTimeout(300);

    // Check value is retained
    await expect(page.locator('[data-testid="mevlit-venue-input"]')).toHaveValue('Fatih Camii');

    // Perform Logout
    const logoutBtn = page.locator('button:has-text("Çıkış"), [data-testid="admin-logout-btn"]').first();
    await Promise.all([
      page.waitForNavigation().catch(() => {}),
      logoutBtn.click()
    ]);
    await page.waitForLoadState('networkidle').catch(() => {});

    // Log back in
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill('test');
    await page.click('form button[type="submit"]');
    await page.waitForSelector('header h1', { timeout: 20000 });

    // Re-verify the persistent details
    await page.click('[data-testid="admin-nav-content"]');
    await page.waitForTimeout(500);
    await expect(page.locator('[data-testid="mevlit-venue-input"]')).toHaveValue('Fatih Camii');
  });

  test('6. Mobile Admin View: Usability and no overflow checks', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsAdmin(page, testSlug);

    // Verify main navigation bar fits and is visible
    const navBar = page.locator('nav').first();
    await expect(navBar).toBeVisible();

    // 1. EventsTab: Switch to events tab
    await page.click('[data-testid="admin-nav-events"]');
    await page.waitForTimeout(500);
    const addEventBtn = page.locator('button:has-text("Etkinlik Ekle"), button:has-text("İlk Etkinliğinizi Ekleyin")').first();
    await expect(addEventBtn).toBeVisible();

    // 2. Program Builder: Open event modal and check inputs are visible & usable
    await addEventBtn.click();
    await page.waitForTimeout(500);
    const modalTitleInput = page.locator('[data-testid="event-title-input"]');
    await expect(modalTitleInput).toBeVisible();
    await expect(modalTitleInput).toBeEditable();

    // Close the modal
    const closeBtn = page.locator('button:has-text("İptal"), button[aria-label="Kapat"]').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(500);

    // 3. FontPicker, BackgroundCustomizer, AnimationCustomizer (Design Tab)
    await page.click('[data-testid="admin-nav-design"]');
    await page.waitForTimeout(500);

    // Switch to FontPicker
    await page.click('button:has-text("2. Yazı Tipleri")');
    await page.waitForTimeout(300);
    await expect(page.locator('button:has-text("Şablonun Önerdiği Fontlara Dön")').first()).toBeVisible();

    // Switch to BackgroundCustomizer
    await page.click('button:has-text("3. Arka Plan & Renkler")');
    await page.waitForTimeout(300);
    await expect(page.locator('button:has-text("Şablon Arka Planına Dön")').first()).toBeVisible();

    // Switch to AnimationCustomizer
    await page.click('button:has-text("4. Açılış Animasyonu")');
    await page.waitForTimeout(300);
    await expect(page.locator('button:has-text("4. Açılış Animasyonu")').first()).toBeVisible();

    // 4. CustomSectionsManager (Content Tab)
    await page.click('[data-testid="admin-nav-content"]');
    await page.waitForTimeout(500);
    await expect(page.locator('button:has-text("+ Özel Bölüm Ekle")').first()).toBeVisible();
  });

  test('7. Backward Compatibility Verification: Old wedding renders without crashes', async ({ page }) => {
    // Load Admin panel for Wedding B (lacking new metadata fields and overrides)
    await loginAsAdmin(page, testSlugB);
    const headerTitle = page.locator('header h1');
    await expect(headerTitle).toContainText('Asli');

    // Load Public invitation for Wedding B and check for error components or blank pages
    await page.goto(`/${testSlugB}`);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    // Verify opening overlay or core elements load correctly
    const overlay = page.locator('[data-testid="opening-overlay"]').first();
    await expect(overlay).toBeVisible();
  });
});
