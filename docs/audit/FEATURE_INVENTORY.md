# 3. ÖZELLİK ENVANTERİ (FEATURE_INVENTORY)

**Tarih:** 24 Temmuz 2026  
**Sürüm:** 1.0  

---

## Tüm Platform Özelliklerinin Durum Tablosu

| Özellik | Admin UI | Preview | Public | DB Kaydı | Test | Durum | Bilinen Sorun |
|---|---|---|---|---|---|---|---|
| Kayıt ve Giriş | ✅ Var | ➖ N/A | ✅ Var | ✅ Supabase Auth | ❌ Eksik | ✅ Çalışıyor | Sosyal medya ile giriş (OAuth) henüz eklenmedi. |
| Davetiye Oluşturma | ✅ Var | ✅ Var | ✅ Var | ✅ weddings | ✅ Var | ✅ Çalışıyor | Başlangıçta 1. Adımda zorunlu alan uyarısı. |
| Şablon Seçimi | ✅ Var | ✅ Var | ✅ Var | ✅ template_id | ✅ Var | ✅ Çalışıyor | 52 benzersiz şablon ve canlı anlık önizleme aktif. |
| Renk Paleti | ✅ Var | ✅ Var | ✅ Var | ✅ primary_color | ✅ Var | ✅ Çalışıyor | Hazır paletler ve özel renk seçici aktif. |
| Font Seçimi | ✅ Var | ✅ Var | ✅ Var | ✅ font_family | ✅ Var | ✅ Çalışıyor | Google Fonts entegre edildi. |
| Arka Plan Seçimi | ✅ Var | ✅ Var | ✅ Var | ✅ effect_type | ✅ Var | ✅ Çalışıyor | 19 parçacık efekti aktif. |
| Dış Sahne Rengi | ✅ Var | ✅ Var | ✅ Var | ✅ custom_overrides | ✅ Var | ✅ Çalışıyor | `sceneBackgroundColor` tek kaynak olarak eşitlendi. |
| Kart Rengi ve Opaklığı | ✅ Var | ✅ Var | ✅ Var | ✅ cardSurface | ✅ Var | ✅ Çalışıyor | `InvitationContentSurface` ile 52 layout'ta bağımsız şeffaflık. |
| Giriş Animasyonu | ✅ Var | ✅ Var | ✅ Var | ✅ entrance_animation | ✅ Var | ✅ Çalışıyor | 20 açılış ailesi ve akıllı tema eşleme aktif. |
| Müzik | ✅ Var | ✅ Var | ✅ Var | ✅ music_url | ✅ Var | ✅ Çalışıyor | MP3 yükleme + Telegram Proxy + Otomatik oynatma aktif. |
| LCV | ✅ Var | ✅ Var | ✅ Var | ✅ rsvps | ✅ Var | ✅ Çalışıyor | Misafir kişi sayısı, mesajı ve Telegram bildirimi. |
| Konum / Harita | ✅ Var | ✅ Var | ✅ Var | ✅ google_maps_url | ✅ Var | ✅ Çalışıyor | Haritaya git yönlendirmesi aktif. |
| Takvime Ekle | ✅ Var | ✅ Var | ✅ Var | ✅ wedding_date | ✅ Var | ✅ Çalışıyor | iCal / Google Calendar `.ics` oluşturma. |
| Fotoğraf Yükleme | ✅ Var | ✅ Var | ✅ Var | ✅ bride_photo_url | ✅ Var | ✅ Çalışıyor | Telegram proxy & Supabase Storage. |
| Galeri | ✅ Var | ✅ Var | ✅ Var | ✅ custom_overrides | ✅ Var | ✅ Çalışıyor | Çoklu görsel galerisi. |
| Program Akışı | ✅ Var | ✅ Var | ✅ Var | ✅ custom_overrides | ✅ Var | ✅ Çalışıyor | Zaman tüneli etkinlik akışı. |
| Konuşmacılar | ✅ Var | ✅ Var | ✅ Var | ✅ custom_overrides | ❌ Eksik | ⚠️ Kısmi | Kurumsal etkinlikler için modül şablonu mevcut. |
| Sponsorlar | ✅ Var | ✅ Var | ✅ Var | ✅ custom_overrides | ❌ Eksik | ⚠️ Kısmi | Kurumsal şablonlarda logo ızgarası. |
| Ödeme | ✅ Var | ✅ Var | ✅ Var | ✅ is_paid | ❌ Eksik | ⚠️ Kısmi | Admin onaylı ödeme ve İyzico altyapı hazırlığı. |
| Yayınlama | ✅ Var | ✅ Var | ✅ Var | ✅ is_paid | ✅ Var | ✅ Çalışıyor | Slug üzerinden canlı yayın. |
| Ön İzleme | ✅ Var | ✅ Var | ➖ N/A | ✅ Anlık State | ✅ Var | ✅ Çalışıyor | Mobil iframe & Masaüstü canlı önizleme. |
| Public Sayfa | ➖ N/A | ➖ N/A | ✅ Var | ✅ weddings | ✅ Var | ✅ Çalışıyor | SEO dostu public davetiye linki. |
| Telegram Entegrasyonu | ✅ Var | ✅ Var | ✅ Var | ✅ telegram_bot_token | ✅ Var | ✅ Çalışıyor | Anlık LCV ve dosya yükleme bildirimi. |
| Mobil Görünüm | ✅ Var | ✅ Var | ✅ Var | ➖ N/A | ✅ Var | ✅ Çalışıyor | Mobil Bottom Sheet Önizleme & Çentik Koruması. |
| Çoklu Dil | ⚠️ Kısmi | ⚠️ Kısmi | ⚠️ Kısmi | ❌ Yok | ❌ Yok | ⚠️ Geliştirilmeli | Varsayılan Türkçe, İngilizce içerik girilebilir. |
| Paylaşım | ✅ Var | ✅ Var | ✅ Var | ➖ N/A | ✅ Var | ✅ Çalışıyor | WhatsApp & QR Kod paylaşım bağlantıları. |
| Analytics | ❌ Yok | ❌ Yok | ❌ Yok | ❌ Yok | ❌ Yok | ❌ Yok | Sayfa görüntülenme sayacı henüz eklenmedi. |
| E-posta Bildirimleri | ✅ Var | ➖ N/A | ✅ Var | ➖ N/A | ✅ Var | ✅ Çalışıyor | Resend altyapısı ile bildirim e-postası. |
