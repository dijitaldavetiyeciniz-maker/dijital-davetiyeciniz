import { createClient } from "@supabase/supabase-js";
import { expect } from "@playwright/test";
import { insertPublishedWedding, makePublishedSnapshot } from "./publishTestHelpers";
import crypto from "crypto";

// Not: .env.local yukleme cagrisi (@dotenvx/dotenvx) kaldirildi - bu paket
// package.json'da hic tanimli degildi (CI'da "Cannot find module" hatasi
// veriyordu) ve zaten gereksizdi: CI ortaminda .env.local dosyasi yok,
// ortam degiskenleri dogrudan GitHub Actions'in env bloklarindan geliyor,
// Playwright de kendi ic mekanizmasiyla bunlari zaten process.env'e
// enjekte ediyor (loglardaki "injected env" mesajlari bunu gosteriyor).

export async function setupPart5Fixture(testSlugPrefix: string = 'part5-fixture', options: { published?: boolean } = { published: true }) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    if (process.env.CI !== "true") {
      console.warn("LOCAL RUN: Skipping setupPart5Fixture due to missing Supabase credentials.");
      return null;
    }
    throw new Error("Missing Supabase service-role environment variables for test fixture setup.");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const normalizedPrefix = testSlugPrefix.startsWith('test-') ? testSlugPrefix : `test-${testSlugPrefix}`;
  const testSlug = `${normalizedPrefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const isPublished = options.published !== false;

  // 1. Create Wedding Fixture (respects C8 safe publishing & draft/published isolation)
  let weddingInsert: any;

  if (isPublished) {
    weddingInsert = await insertPublishedWedding(supabase, {
      slug: testSlug,
      bride_name: "Test Bride",
      groom_name: "Test Groom",
      admin_password: "test",
      event_type: "wedding",
      is_active: true,
      is_paid: true,
      venue_name: "Çırağan Sarayı",
      venue_address: "İstanbul",
      primary_color: "#be123c",
      text_color: "#1e293b"
    });
  } else {
    weddingInsert = await supabase
      .from("weddings")
      .insert({
        slug: testSlug,
        bride_name: "Test Bride",
        groom_name: "Test Groom",
        admin_password: "test",
        event_type: "wedding",
        is_active: true,
        is_paid: false,
        custom_overrides: {
          is_published: false,
          has_unpublished_changes: false
        }
      });
  }

  if (weddingInsert.error) {
    if (process.env.CI !== "true" && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("LOCAL RUN: Skipping fixture setup due to missing service-role credentials (RLS active):", weddingInsert.error.message);
      return null;
    }
  }

  // Fetch created wedding id & slug
  const { data: createdWedding, error: fetchErr } = await supabase
    .from("weddings")
    .select("id, slug")
    .eq("slug", testSlug)
    .single();

  if (fetchErr || !createdWedding) {
    if (process.env.CI !== "true" && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("LOCAL RUN: Skipping fixture setup due to missing service-role credentials.");
      return null;
    }
    throw new Error(`Failed to fetch created wedding fixture: ${fetchErr?.message}`);
  }

  const weddingId = createdWedding.id;

  // 2. Create Default Guest
  const guestInsert = await supabase
    .from("guests")
    .insert({
      wedding_id: weddingId,
      first_name: "Fixture",
      last_name: "Guest",
      phone: "+905554443322",
      email: "fixture@example.com",
    })
    .select("id, public_id, token_version")
    .single();

  if (guestInsert.error) {
    if (process.env.CI !== "true" && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("LOCAL RUN: Skipping guest fixture insert due to missing service-role credentials:", guestInsert.error.message);
      return null;
    }
  }

  expect(guestInsert.error, `Guest fixture insert failed: ${JSON.stringify(guestInsert.error)}`).toBeNull();
  expect(guestInsert.data).not.toBeNull();
  expect(guestInsert.data!.public_id).toBeTruthy();

  return {
    supabase,
    testSlug,
    weddingId,
    guestId: guestInsert.data!.id,
    guestPublicId: guestInsert.data!.public_id,
    guestTokenVersion: guestInsert.data!.token_version,
    cleanup: async () => {
      const { error } = await supabase.from("weddings").delete().eq("id", weddingId);
      if (error) {
        console.error(`Failed to cleanup test wedding ${testSlug}:`, error);
      }
    }
  };
}
