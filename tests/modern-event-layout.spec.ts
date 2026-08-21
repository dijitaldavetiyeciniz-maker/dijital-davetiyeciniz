import { test, expect } from '@playwright/test';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { insertPublishedWedding } from './helpers/publishTestHelpers';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('ModernEventLayout Variant Tests', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(120000); // Allow 2 minutes per test for Next.js compilation delays

  let supabase: any;
  const runId = crypto.randomUUID();
  const SLUGS = {
    tech: 'test-tech-launch-' + runId,
    gala: 'test-gala-night-' + runId,
    graduation: 'test-graduation-' + runId,
    neon: 'test-neon-party-' + runId
  };

  test.beforeAll(async () => {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    const records = [
      {
        id: crypto.randomUUID(),
        slug: SLUGS.tech,
        event_type: 'corporate',
        template_id: 'future-summit',
        is_paid: true,
        bride_name: 'Tech Launch Name',
        groom_name: '',
        wedding_date: "2027-06-15T17:00:00.000Z",
        venue_name: 'Convention Center',
        admin_password: 'test',
        custom_overrides: {
          event_variant: 'tech-launch',
          speakers: [
            { name: 'Alice', role: 'CEO' },
            { name: 'Bob', role: 'CTO' }
          ]
        }
      },
      {
        id: crypto.randomUUID(),
        slug: SLUGS.gala,
        event_type: 'corporate',
        template_id: 'future-summit',
        is_paid: true,
        bride_name: 'Awards Gala Name',
        groom_name: '',
        wedding_date: "2027-06-15T17:00:00.000Z",
        venue_name: 'The Ritz',
        admin_password: 'test',
        custom_overrides: {
          event_variant: 'gala'
        }
      },
      {
        id: crypto.randomUUID(),
        slug: SLUGS.graduation,
        event_type: 'birthday',
        template_id: 'graduation-ceremony',
        is_paid: true,
        bride_name: 'Alice Graduation',
        groom_name: '',
        wedding_date: "2027-06-15T17:00:00.000Z",
        venue_name: 'University Hall',
        admin_password: 'test',
        custom_overrides: {
          event_variant: 'graduation'
        }
      },
      {
        id: crypto.randomUUID(),
        slug: SLUGS.neon,
        event_type: 'birthday',
        template_id: 'future-summit',
        is_paid: true,
        bride_name: 'Neon Party Name',
        groom_name: '',
        wedding_date: "2027-06-15T17:00:00.000Z",
        venue_name: 'Club Neon',
        admin_password: 'test',
        custom_overrides: {
          event_variant: 'neon-party'
        }
      }
    ];

    const { error } = await insertPublishedWedding(supabase, records);
    if (error) console.error("INSERT ERROR:", error);
  });

  test.afterAll(async () => {
    // Cleanup runs unconditionally
    if (supabase) {
      await supabase.from('weddings').delete().in('slug', Object.values(SLUGS));
    }
  });

  const checkViewportOverflow = async (page: any) => {
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);
  };

  const handleOverlay = async (page: any) => {
    const overlay = page.locator('[data-testid="opening-overlay"]');
    if (await overlay.isVisible()) {
      await overlay.click();
      await page.waitForTimeout(1000); // give time for overlay to fade out
    }
  };

  test('Tech Launch - Desktop Screenshot & Assertions', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/${SLUGS.tech}`);
    await handleOverlay(page);
    try {
      await page.waitForSelector('[data-testid="modern-event-tech-launch"]', { timeout: 15000 });
    } catch (e) {
      console.log('TECH LAUNCH HTML CONTENT:', await page.content());
      throw e;
    }
    // Assertions
    await checkViewportOverflow(page);
    const contentText = await page.locator('body').innerText();
    expect(contentText).not.toContain('bride_name');
    expect(contentText).not.toContain('groom_name');
    expect(contentText).toContain('Alice');
    expect(contentText).toContain('CEO');
    expect(await page.locator('button:has-text("LCV")').isVisible() || await page.locator('button[aria-label="Katılım Bildir"]').isVisible()).toBeTruthy();

    await page.screenshot({ path: `test-results/modern-event-tech-desktop.png`, fullPage: true });
  });

  test('Tech Launch - Mobile Screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/${SLUGS.tech}`);
    await handleOverlay(page);
    
    await page.waitForSelector('[data-testid="modern-event-tech-launch"]', { timeout: 15000 });
    await checkViewportOverflow(page);
    await page.screenshot({ path: `test-results/modern-event-tech-mobile.png`, fullPage: true });
  });

  test('Gala - Desktop Screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/${SLUGS.gala}`);
    await handleOverlay(page);
    
    await page.waitForSelector('[data-testid="modern-event-gala"]', { timeout: 15000 });
    await checkViewportOverflow(page);
    await page.screenshot({ path: `test-results/modern-event-gala-desktop.png`, fullPage: true });
  });

  test('Graduation - Desktop Screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/${SLUGS.graduation}`);
    await handleOverlay(page);
    
    await page.waitForSelector('[data-testid="modern-event-graduation"]', { timeout: 15000 });
    await checkViewportOverflow(page);
    await page.screenshot({ path: `test-results/modern-event-graduation-desktop.png`, fullPage: true });
  });

  test('Neon Party - Desktop Screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/${SLUGS.neon}`);
    await handleOverlay(page);
    
    await page.waitForSelector('[data-testid="modern-event-neon-party"]', { timeout: 15000 });
    await checkViewportOverflow(page);
    await page.screenshot({ path: `test-results/modern-event-neon-desktop.png`, fullPage: true });
  });
});
