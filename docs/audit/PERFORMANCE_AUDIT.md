# 7. PERFORMANS DENETİMİ (PERFORMANCE_AUDIT)

**Tarih:** 24 Temmuz 2026  
**Sürüm:** 1.0  

---

## 1. Performans İstatistikleri ve Derleme Özeti

- **Next.js Derleme Süresi:** ~6.6 saniye (Turbopack)
- **Static Page Generation:** 24/24 sayfa ortalama ~970ms sürede derlenmektedir.
- **TypeScript Derleme Hızı:** `npx tsc --noEmit` ~4 saniye (0 hata).

---

## 2. Optimizasyonlar ve İnceleme Sonuçları

### 2.1 CSS & Animasyon Performansı
- Tüm parçacık efektleri (`BackgroundParticles.tsx`) CSS keyframe animasyonları ile yazılmıştır.
- Heavy JavaScript canvas veya ağır 3D kütüphaneleri kullanılmadığı için mobil cihazlarda GPU ivmelendirmesi ile 60 FPS akıcılık sağlanmaktadır.

### 2.2 Görsel Optimizasyonu
- Next.js `Image` ve projeye özel `SafeImage` bileşeni kullanılmaktadır.
- Yüklenen fotoğraflar lazy loading ve responsive srcset boyutlandırması ile sunulmaktadır.

### 2.3 Layout & Render Performansı
- `InvitationContentSurface` bileşeninde `backdrop-filter: blur(...)` kullanımı mobil cihazlarda aşırı performans kaybı yaratmayacak optimize piksel değerleriyle sınırlanmıştır.
- Admin panelindeki şablon listesi sekmeli yapı sayesinde DOM eleman sayısını minimal düzeyde tutmaktadır.
