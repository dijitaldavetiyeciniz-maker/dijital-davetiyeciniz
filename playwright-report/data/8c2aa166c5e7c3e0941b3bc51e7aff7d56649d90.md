# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: part5-guest-token-security.spec.ts >> PART 5A - Token Security E2E >> Token Security Flow
- Location: tests\part5-guest-token-security.spec.ts:22:7

# Error details

```
Error: Wedding fixture insert failed: {"message":"TypeError: fetch failed","details":"TypeError: fetch failed\n\nCaused by: Error: connect ECONNREFUSED 127.0.0.1:54321 (ECONNREFUSED)\nError: connect ECONNREFUSED 127.0.0.1:54321\n    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16)","hint":"","code":""}

expect(received).toBeNull()

Received: {"code": "", "details": "TypeError: fetch failed·
Caused by: Error: connect ECONNREFUSED 127.0.0.1:54321 (ECONNREFUSED)
Error: connect ECONNREFUSED 127.0.0.1:54321
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16)", "hint": "", "message": "TypeError: fetch failed"}
```

# Test source

```ts
  1  | import { createClient } from "@supabase/supabase-js";
  2  | import { expect } from "@playwright/test";
  3  | import crypto from "crypto";
  4  | import dotenv from "dotenv";
  5  | 
  6  | dotenv.config({ path: ".env.local" });
  7  | 
  8  | export async function setupPart5Fixture(testSlugPrefix: string = 'part5-fixture') {
  9  |   const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  10 |   const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  11 | 
  12 |   if (!SUPABASE_URL || !SUPABASE_KEY) {
  13 |     throw new Error("Missing Supabase service-role environment variables for test fixture setup.");
  14 |   }
  15 | 
  16 |   const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  17 | 
  18 |   const testSlug = `${testSlugPrefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  19 | 
  20 |   // 1. Create Wedding Fixture
  21 |   const weddingInsert = await supabase
  22 |     .from("weddings")
  23 |     .insert({
  24 |       slug: testSlug,
  25 |       bride_name: "Test Bride",
  26 |       groom_name: "Test Groom",
  27 |       admin_password: "test",
  28 |       event_type: "wedding",
  29 |       is_active: true
  30 |     })
  31 |     .select("id, slug")
  32 |     .single();
  33 | 
> 34 |   expect(weddingInsert.error, `Wedding fixture insert failed: ${JSON.stringify(weddingInsert.error)}`).toBeNull();
     |                                                                                                        ^ Error: Wedding fixture insert failed: {"message":"TypeError: fetch failed","details":"TypeError: fetch failed\n\nCaused by: Error: connect ECONNREFUSED 127.0.0.1:54321 (ECONNREFUSED)\nError: connect ECONNREFUSED 127.0.0.1:54321\n    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16)","hint":"","code":""}
  35 |   expect(weddingInsert.data).not.toBeNull();
  36 |   expect(weddingInsert.data!.slug).toBe(testSlug);
  37 | 
  38 |   const weddingId = weddingInsert.data!.id;
  39 | 
  40 |   // 2. Create Default Guest
  41 |   const guestInsert = await supabase
  42 |     .from("guests")
  43 |     .insert({
  44 |       wedding_id: weddingId,
  45 |       first_name: "Fixture",
  46 |       last_name: "Guest",
  47 |       phone: "+905554443322",
  48 |       email: "fixture@example.com",
  49 |     })
  50 |     .select("id, public_id, token_version")
  51 |     .single();
  52 | 
  53 |   expect(guestInsert.error, `Guest fixture insert failed: ${JSON.stringify(guestInsert.error)}`).toBeNull();
  54 |   expect(guestInsert.data).not.toBeNull();
  55 |   expect(guestInsert.data!.public_id).toBeTruthy();
  56 | 
  57 |   return {
  58 |     supabase,
  59 |     testSlug,
  60 |     weddingId,
  61 |     guestId: guestInsert.data!.id,
  62 |     guestPublicId: guestInsert.data!.public_id,
  63 |     guestTokenVersion: guestInsert.data!.token_version,
  64 |     cleanup: async () => {
  65 |       const { error } = await supabase.from("weddings").delete().eq("id", weddingId);
  66 |       if (error) {
  67 |         console.error(`Failed to cleanup test wedding ${testSlug}:`, error);
  68 |       }
  69 |     }
  70 |   };
  71 | }
  72 | 
```