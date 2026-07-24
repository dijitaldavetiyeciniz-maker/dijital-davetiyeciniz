# 8. MOBİL VE ERİŞİLEBİLİRLİK DENETİMİ (MOBILE_ACCESSIBILITY_AUDIT)

**Tarih:** 24 Temmuz 2026  
**Sürüm:** 1.0  

---

## 1. Test Edilen Viewport Sınırları
- `320 px` (iPhone SE / Küçük Ekran)
- `375 px` (Standart Mobil)
- `390 px` (iPhone 12/13/14 Pro)
- `430 px` (iPhone Pro Max / Büyük Mobil)
- `768 px` (Tablet Portrait)
- `1440 px` (Masaüstü HD)

---

## 2. Erişilebilirlik (a11y) İnceleme Bulguları

### 2.1 Klavye Navigasyonu ve Odaklanma (Focus State)
- Giriş açılış animasyonu ekranı (`EntranceAnimation.tsx`) `role="button"`, `tabIndex={0}` ve Klavye `Enter` / `Space` tuş dinleyicilerine sahiptir. Kullanıcı klavye ile açılış animasyonunu tetikleyebilir.
- Tüm butonlarda minimum `44x44 px` dokunma alanı (Touch Target Size) kuralı uygulanmıştır.

### 2.2 Renk Kontrastı ve Okunabilirlik
- `getReadableTextColor` ve `getContrastRatio` yardımcı fonksiyonları (`src/lib/colorUtils.ts`) üzerinden WCAG 2.1 AA kontrast oranı (Minimum 4.5:1) denetlenmektedir.
- Kullanıcı düşük opaklık seçse dahi metin katmanları `InvitationContentSurface` bileşeninde `relative z-10` olarak `%100` opak kalmakta ve metin okunabilirliği korunmaktadır.

### 2.3 Taşıma (Overflow) Kontrolü
- Tüm layout'larda `overflowX: 'clip'` ve `max-w-full` kuralları ile 320px viewport dâhil hiçbir ekran boyutunda yatay kayma (horizontal scrollbar) oluşmamaktadır.
