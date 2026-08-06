import { createClient } from "@supabase/supabase-js";
import { expect } from "@playwright/test";
import crypto from "crypto";

// Not: .env.local yukleme cagrisi (@dotenvx/dotenvx) kaldirildi - bu paket
// package.json'da hic tanimli degildi (CI'da "Cannot find module" hatasi
// veriyordu) ve zaten gereksizdi: CI ortaminda .env.local dosyasi yok,
// ortam degiskenleri dogrudan GitHub Actions'in env bloklarindan geliyor,
// Playwright de kendi ic mekanizmasiyla bunlari zaten process.env'e
// enjekte ediyor (loglardaki "injected env" mesajlari bunu gosteriyor).

export async function setupPart5Fixture(testSlugPrefix: string = 'part5-fixture') {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Missing Supabase service-role environment variables for test fixture setup.");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const testSlug = `${testSlugPrefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // 1. Create Wedding Fixture
  const weddingInsert = await supabase
    .from("weddings")
    .insert({
      slug: testSlug,
      bride_name: "Test Bride",
      groom_name: "Test Groom",
      admin_password: "test",
      event_type: "wedding",
      is_active: true,
      is_paid: true
    })
    .select("id, slug")
    .single();

  expect(weddingInsert.error, `Wedding fixture insert failed: ${JSON.stringify(weddingInsert.error)}`).toBeNull();
  expect(weddingInsert.data).not.toBeNull();
  expect(weddingInsert.data!.slug).toBe(testSlug);

  const weddingId = weddingInsert.data!.id;

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
