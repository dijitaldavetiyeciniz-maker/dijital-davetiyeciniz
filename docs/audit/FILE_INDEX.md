# 13. PROJE DOSYA İNDEKSİ (FILE_INDEX)

**Tarih:** 24 Temmuz 2026  
**Sürüm:** 1.0  

---

## Ana Özellikler ve İlgili Dosya Eşleme Tablosu

| Özellik | Ana Dosya | Yardımcı Dosyalar | DB Alanı | Test Dosyası |
|---|---|---|---|---|
| Davetiye Renderer | `src/components/templates/PremiumTemplateRenderer.tsx` | `src/lib/themes.ts` | `weddings.template_id` | `tests/template-persistence.integration.spec.ts` |
| Kart Yüzey Katmanı | `src/components/templates/InvitationContentSurface.tsx` | `src/components/templates/layouts/*.tsx` | `custom_overrides.design.cardSurface` | `tests/template-persistence.integration.spec.ts` |
| Admin Yönetim Paneli | `src/app/d/[wedding_id]/admin/page.tsx` | `src/components/BackgroundMusic.tsx` | `weddings.*` | `tests/admin-background.spec.ts` |
| Giriş Animasyonları | `src/components/invitation/EntranceAnimation.tsx` | `src/data/openingAnimations.ts`, `src/components/invitation/openings/*.tsx` | `weddings.entrance_animation` | `tests/template-selection.spec.ts` |
| Arka Plan Parçacıkları | `src/components/BackgroundParticles.tsx` | `src/components/BackgroundAnimation.tsx` | `weddings.background_animation` | `tests/admin-background.spec.ts` |
| Super Admin Ekranı | `src/app/super-admin/page.tsx` | `src/lib/supabase.ts` | `weddings.*` | `tests/template-persistence.spec.ts` |
| Telegram Webhook & Proxy | `src/app/api/telegram/webhook/route.ts` | `src/app/api/telegram/upload/route.ts` | `telegram_bot_token`, `telegram_chat_id` | N/A |
| LCV Yanıt Sistemi | `src/components/invitation/RsvpModal.tsx` | `src/app/d/[wedding_id]/page.tsx` | `rsvps` | `tests/template-persistence.integration.spec.ts` |
