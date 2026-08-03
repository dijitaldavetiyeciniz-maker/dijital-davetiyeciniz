# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flagship-visual-audit-generator.spec.ts >> PART 3 — 20-Step Flagship Visual Audit >> Flagship End-to-End Persistence and DOM Check: grand-opera-ballroom
- Location: tests\flagship-visual-audit-generator.spec.ts:81:9

# Error details

```
Error: page.reload: net::ERR_CONNECTION_REFUSED
Call log:
  - waiting for navigation until "load"

```

# Test source

```ts
  55  |     
  56  |     await supabase.from('weddings').insert([{
  57  |       slug: TEST_SLUG,
  58  |       bride_name: 'Zeynep Su Nazlıcan',
  59  |       groom_name: 'Muhammed Emirhan Alparslan',
  60  |       wedding_date: '2026-09-12T19:30:00.000Z',
  61  |       venue_name: 'İstanbul Boğazı Uluslararası Davet ve Organizasyon Merkezi',
  62  |       event_type: 'Düğün',
  63  |       template_id: 'template1',
  64  |       admin_password: 'demo',
  65  |       is_paid: true,
  66  |       custom_overrides: {
  67  |         content: {
  68  |           brideName: 'Zeynep Su Nazlıcan',
  69  |           groomName: 'Muhammed Emirhan Alparslan',
  70  |           venueName: 'İstanbul Boğazı Uluslararası Davet ve Organizasyon Merkezi'
  71  |         }
  72  |       }
  73  |     }]);
  74  |   });
  75  | 
  76  |   test.afterAll(async () => {
  77  |     await supabase.from('weddings').delete().eq('slug', TEST_SLUG);
  78  |   });
  79  | 
  80  |   for (const tplId of FLAGSHIP_IDS) {
  81  |     test(`Flagship End-to-End Persistence and DOM Check: ${tplId}`, async ({ page, browser }) => {
  82  |       test.setTimeout(120000); // Give enough time for persistence and loading
  83  | 
  84  |       // Targeted dialog management
  85  |       page.on('dialog', async dialog => {
  86  |         const msg = dialog.message();
  87  |         if (msg.includes('Bu şablonu uygulamak istediğinize emin misiniz')) {
  88  |           await dialog.accept();
  89  |         } else if (msg.includes('başarıyla kaydedildi')) {
  90  |           await dialog.accept();
  91  |         } else {
  92  |           console.error('Unexpected dialog:', msg);
  93  |           try { await dialog.dismiss(); } catch (e) {}
  94  |           throw new Error('Unexpected dialog: ' + msg);
  95  |         }
  96  |       });
  97  | 
  98  |       // Step 2: /d/[wedding_id]/admin rotasını aç
  99  |       await page.goto(`/d/${TEST_SLUG}/admin`);
  100 |       await page.waitForLoadState('networkidle');
  101 | 
  102 |       // Login or Dashboard step
  103 |       const pwdInput = page.locator('input[type="password"]');
  104 |       const studioBtn = page.locator('button:has-text("Tasarım Stüdyosu")').first();
  105 |       
  106 |       // Wait for either login input or the studio button
  107 |       await Promise.any([
  108 |         pwdInput.waitFor({ state: 'visible', timeout: 15000 }),
  109 |         studioBtn.waitFor({ state: 'visible', timeout: 15000 })
  110 |       ]).catch(() => {});
  111 | 
  112 |       if (await pwdInput.isVisible()) {
  113 |         await pwdInput.fill('demo');
  114 |         await page.click('button:has-text("Giriş Yap")');
  115 |       }
  116 |       
  117 |       await studioBtn.waitFor({ state: 'visible', timeout: 15000 });
  118 | 
  119 |       // Step 3: Şablonu gerçek portal kataloğundan seç
  120 |       await studioBtn.click();
  121 |       
  122 |       // Click the 'Şablon & Tema' tab to reveal the gallery
  123 |       await page.click('button:has-text("Şablon & Tema")');
  124 |       
  125 |       try {
  126 |         await page.waitForSelector(`[data-testid="template-${tplId}"]`, { state: 'visible', timeout: 5000 });
  127 |       } catch (e) {
  128 |         console.error(`Could not find [data-testid="template-${tplId}"]. Printing available testids:`);
  129 |         const availableTemplates = await page.evaluate(() => {
  130 |           return Array.from(document.querySelectorAll('[data-testid^="template-"]'))
  131 |             .map(el => el.getAttribute('data-testid'));
  132 |         });
  133 |         console.error(availableTemplates);
  134 |         throw e;
  135 |       }
  136 |       
  137 |       await page.click(`[data-testid="template-${tplId}"]`);
  138 |       
  139 |       // Wait for actual DOM state update (No timeouts!)
  140 |       await page.waitForSelector(`[data-testid="template-${tplId}"]:has-text("Uygulandı")`, { state: 'visible', timeout: 5000 });
  141 |       
  142 |       // Step 6: Save isteğini gerçekleştir
  143 |       await page.click('button:has-text("Değişiklikleri Kaydet & Önizlemeyi Yenile")');
  144 |       
  145 |       // Wait for networkidle
  146 |       await page.waitForLoadState('networkidle');
  147 | 
  148 |       // Verify persistence in DB (Poll to avoid arbitrary timeouts)
  149 |       await expect(async () => {
  150 |         const { data } = await supabase.from('weddings').select('template_id').eq('slug', TEST_SLUG).single();
  151 |         expect(data?.template_id).toBe(tplId);
  152 |       }).toPass({ timeout: 15000 });
  153 | 
  154 |       // Step 11: Admin dashboard'ın kendisinin de seçilen template ile senkron kalıp kalmadığına bak (Reload ile)
> 155 |       await page.reload();
      |                  ^ Error: page.reload: net::ERR_CONNECTION_REFUSED
  156 |       await page.waitForLoadState('networkidle');
  157 |       
  158 |       // Assert session is NOT lost on reload
  159 |       const pwdInputAfterReload = page.locator('input[type="password"]');
  160 |       expect(await pwdInputAfterReload.isVisible(), 'Session was lost on reload!').toBe(false);
  161 | 
  162 |       const studioBtnReload = page.locator('button:has-text("Tasarım Stüdyosu")').first();
  163 |       await Promise.any([
  164 |         studioBtnReload.waitFor({ state: 'visible', timeout: 15000 })
  165 |       ]).catch(() => {});
  166 |       
  167 |       if (await studioBtnReload.isVisible()) {
  168 |         await studioBtnReload.click();
  169 |       }
  170 | 
  171 |       // Step 12: Yeni ve temiz browser context oluştur
  172 |       const publicContext = await browser.newContext();
  173 |       const publicPage = await publicContext.newPage();
  174 |       
  175 |       // Step 13: /d/[slug] public rotasını aç
  176 |       await publicPage.goto(`/d/${TEST_SLUG}`);
  177 |       await publicPage.waitForLoadState('networkidle');
  178 |       
  179 |       // Hydration check
  180 |       const errors: string[] = [];
  181 |       publicPage.on('console', msg => {
  182 |         if (msg.type() === 'error' && (msg.text().includes('Hydration') || msg.text().includes('Minified React error'))) {
  183 |           errors.push(msg.text());
  184 |         }
  185 |       });
  186 | 
  187 |       // Opening overlay test without bypass
  188 |       const overlay = publicPage.locator('[data-testid="opening-overlay"]');
  189 |       await overlay.waitFor({ state: 'attached', timeout: 15000 });
  190 |       
  191 |       // Robustly click until the overlay detaches (handles hydration race conditions)
  192 |       await expect(async () => {
  193 |         if (await overlay.isVisible()) {
  194 |           await overlay.evaluate(n => { if (n instanceof HTMLElement) n.click(); });
  195 |         }
  196 |         await expect(overlay).toBeHidden({ timeout: 3000 });
  197 |       }).toPass({ timeout: 30000 });
  198 |       
  199 |       expect(errors.length, `Hydration errors detected: ${errors.join(', ')}`).toBe(0);
  200 | 
  201 |       // Step 15: Public renderer'ın beklenen layout componentini kullandığını doğrula
  202 |       const expectedTheme = predefinedThemes.find(t => t.id === tplId);
  203 |       expect(expectedTheme).toBeTruthy();
  204 |       const expectedLayoutStyle = expectedTheme!.layoutStyle;
  205 | 
  206 |       const root = publicPage.locator('[data-template-id]').first();
  207 |       await root.waitFor({ state: 'attached', timeout: 5000 });
  208 |       
  209 |       const actualTplId = await root.getAttribute('data-template-id');
  210 |       const actualLayoutId = await root.getAttribute('data-layout-id');
  211 |       
  212 |       expect(actualTplId, `Template ID mismatch on Public route! Expected: ${tplId}, got: ${actualTplId}`).toBe(tplId);
  213 |       expect(actualLayoutId, `Layout ID is missing or invalid on Public route!`).toBeTruthy();
  214 |       expect(actualLayoutId, `Template fell back to default-fallback instead of ${expectedLayoutStyle}`).not.toBe('default-fallback');
  215 |       expect(actualLayoutId, `Mapping error! Expected layoutStyle ${expectedLayoutStyle} but got ${actualLayoutId}`).toBe(expectedLayoutStyle);
  216 | 
  217 |       // Step 20: Bundan sonra screenshot al (Mobil)
  218 |       await publicPage.setViewportSize({ width: 390, height: 844 });
  219 |       await publicPage.screenshot({ path: path.join(AUDIT_DIR, `${tplId}-mobile-390x844.png`), fullPage: false });
  220 | 
  221 |       // Desktop screenshot
  222 |       await publicPage.setViewportSize({ width: 1440, height: 900 });
  223 |       await publicPage.screenshot({ path: path.join(AUDIT_DIR, `${tplId}-desktop-1440x900.png`), fullPage: false });
  224 | 
  225 |       // Step 14: Gerçek Uzun İçerik ve Piksel Testi (Check for horizontal overflow)
  226 |       const scrollWidth = await publicPage.evaluate(() => document.documentElement.scrollWidth);
  227 |       const clientWidth = await publicPage.evaluate(() => document.documentElement.clientWidth);
  228 |       expect(scrollWidth, `Horizontal overflow detected on template ${tplId}`).toBeLessThanOrEqual(clientWidth + 5);
  229 | 
  230 |       await publicContext.close();
  231 |     });
  232 |   }
  233 | 
  234 |   test('Verify zero exact duplicate screenshots across all generated audit PNGs', () => {
  235 |     const files = fs.readdirSync(AUDIT_DIR).filter(f => f.endsWith('.png'));
  236 |     // We expect 34 files (17 mobile, 17 desktop)
  237 |     expect(files.length).toBe(34);
  238 | 
  239 |     const hashes = new Set<string>();
  240 | 
  241 |     for (const f of files) {
  242 |       const buf = fs.readFileSync(path.join(AUDIT_DIR, f));
  243 |       const hash = crypto.createHash('sha256').update(buf).digest('hex');
  244 | 
  245 |       expect(hashes.has(hash), `Duplicate screenshot detected for file: ${f}`).toBe(false);
  246 |       hashes.add(hash);
  247 |     }
  248 |   });
  249 | 
  250 |   test('Şablon kaydetme race condition (Hızlı Seçim C)', async ({ page, browser }) => {
  251 |     test.setTimeout(60000);
  252 |     page.on('dialog', async dialog => {
  253 |       const msg = dialog.message();
  254 |       if (msg.includes('Bu şablonu uygulamak istediğinize emin misiniz')) {
  255 |         await dialog.accept();
```