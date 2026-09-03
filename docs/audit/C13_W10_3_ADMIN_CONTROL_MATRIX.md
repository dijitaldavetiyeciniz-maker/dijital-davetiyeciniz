# C13 W10.3 Admin Panel Interactive Control & Persistence Matrix

| Control ID | Tab / Section | UI Element | Validation | Database Field | Persistence Guarantee | Public Renderer Consumer |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ctrl-couple-names` | İçerik | input | ✅ Schema Validated | `bride_name, groom_name` | ✅ Verified on Reload/Relogin | Hero & Invitation Canvas |
| `ctrl-event-date` | İçerik | input[datetime] | ✅ Schema Validated | `wedding_date` | ✅ Verified on Reload/Relogin | Countdown & Calendar |
| `ctrl-venue-address` | İçerik | textarea | ✅ Schema Validated | `venue_name, venue_address` | ✅ Verified on Reload/Relogin | Venue Card & Maps |
| `ctrl-program-builder` | Program | builder / sortable | ✅ Schema Validated | `custom_overrides.program_items` | ✅ Verified on Reload/Relogin | Timeline / Program Section |
| `ctrl-custom-sections` | Özel Bölümler | dynamic manager | ✅ Schema Validated | `custom_sections (table)` | ✅ Verified on Reload/Relogin | Custom Content Section |
| `ctrl-template-selector` | Tasarım Stüdyosu | grid selector | ✅ Schema Validated | `template_id` | ✅ Verified on Reload/Relogin | 272 Dynamic Layout Renderers |
| `ctrl-opening-selector` | Açılış Animasyonu | opening catalog | ✅ Schema Validated | `entrance_animation` | ✅ Verified on Reload/Relogin | 50 Opening Animations |
| `ctrl-font-picker` | Tipografi | font selector | ✅ Schema Validated | `font_family, names_font_family` | ✅ Verified on Reload/Relogin | 95 Curated Web Fonts |
| `ctrl-bg-customizer` | Arka Plan | color & gradient picker | ✅ Schema Validated | `custom_overrides.background` | ✅ Verified on Reload/Relogin | Invitation Canvas Backdrop |
| `ctrl-guest-table` | Misafir & LCV | datagrid / import | ✅ Schema Validated | `guests (table)` | ✅ Verified on Reload/Relogin | Guest Token / Check-in QR |
| `ctrl-domain-manager` | Özel Alan Adı | domain input / verify | ✅ Schema Validated | `custom_domains (table)` | ✅ Verified on Reload/Relogin | Edge Config Data-Plane Proxy |
