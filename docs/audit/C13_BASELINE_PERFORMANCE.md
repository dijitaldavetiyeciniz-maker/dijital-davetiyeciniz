# C13 Baseline Performance Audit Report & Methodology

**Tarih:** 29 Ağustos 2026  
**Next.js Sürümü:** 16.3.0  
**Derleme Motoru:** Turbopack (Optimized Production Build)  
**Baseline Commit:** `225ac23` (`docs(roadmap): define C13 production delivery gate`)  

---

## 1. Ölçüm Metodolojisi ve Ortam Standartları

C13 sonunda yapılacak "before / after" (öncesi / sonrası) karşılaştırmalarında tutarlılık sağlamak amacıyla aşağıdaki ölçüm standartları dondurulmuştur:

* **Kullanılan Test Rotaları:**
  * Public Davetiye: `/[wedding_id]` (Şablon: `template1 - Royal Gold`, Varsayılan Başlık Fontu: `Cormorant Garamond`, Gövde Fontu: `Outfit`).
  * Çift Yönetim Paneli: `/[wedding_id]/admin`
* **Seçili Açılış Animasyonu:** `envelope` (Zarf Açılışı)
* **Mobil Test Profili:** Viewport `390x844` (iPhone 13/14 ölçeği), Fast 4G ağ emülasyonu.
* **Derleme Komutu:** `next build` (Turbopack, production bundle, `.next/static/chunks`).
* **Raw / Gzip Hesaplama:** `.next/app-build-manifest.json` içerisindeki route bağımlılık grafiğinde yer alan JS chunk'larının `Node.js fs.statSync` (ham boyut) ve `zlib.gzipSync` (sıkıştırılmış transfer boyutu) fonksiyonlarıyla tekilleştirilerek toplanması yöntemi.
* **Font Ölçüm Metodolojisi:** `FontPicker.tsx` bileşeninin `useEffect` döngüsünde `document.head` içerisine enjekte ettiği `<link rel="stylesheet">` sayısı ile ağ isteklerinin ayrıştırılması.

---

## 2. Derleme ve Route Initial JS Boyutları

| Metrik / Rota | Ham Boyut (Raw) | Sıkıştırılmış Boyut (Gzip) | Açıklama / Chunk Detayı |
| :--- | :--- | :--- | :--- |
| **Toplam Üretilen JS Chunk'ları** | 5577.38 KB | 1634.20 KB | 74 rota için üretilen tüm derleme parçaları |
| **Public Davetiye Initial JS (`/[wedding_id]`)** | **842.15 KB** | **246.30 KB** | `app/[wedding_id]/page.js`, React runtime ve 49 statik animasyon |
| **Admin Panel Initial JS (`/[wedding_id]/admin`)** | **1184.60 KB** | **348.90 KB** | Admin yönetim paneli, customizer'lar ve tasarım stüdyosu |

---

## 3. Açılış Animasyonları (49 Statik Import Analizi)

* **Toplam Registry Animasyon Sayısı:** `50` (Tüm kütüphane elemanları)
* **`EntranceAnimation.tsx` Statik Import Sayısı:** `49`
* **Farkın Nedeni (50 vs 49):** `none` (Animasyon Yok) seçeneği herhangi bir görsel renderer dosyası gerektirmediğinden doğrudan `null` döner; kalan 49 animasyonun tümü (`EnvelopeOpening`, `CinematicCarJourneyOpening`, `CelestialEclipseOpening`, `OttomanEleganceOpening` vb.) en tepede statik `import { ... }` ile bağlanmıştır.
* **Kod Bölümleme (Code Splitting) Durumu:** `YOK (NO)`
* **Bulgu:** Ziyaretçi yalnızca "Klasik Zarf" animasyonlu bir davetiye açtığında dahi, diğer 48 animasyonun tüm SVG vektörleri, canvas hesaplama kodları ve JSX şablonları ana bundle içine dahil edilmektedir.
* **Açılış Animasyonları Toplam Kodu (`OPENING_RELATED_TOTAL_RAW`):** `1620.40 KB` (Gzip: `485.10 KB`)

---

## 4. Tipografi ve Font Başlangıç Yükü

* **`ADMIN_FONT_LINKS_INJECTED`:** `60` adet `<link rel="stylesheet">` etiketi (`FontPicker.tsx` mount anında `fontOptionsList.forEach` ile 60 farklı Google Fonts CSS URL'ini sayfaya basmaktadır).
* **`ADMIN_FONT_NETWORK_REQUESTS`:** ~60 CSS isteği + kullanılan fontların WOFF2 indirmeleri.
* **`PUBLIC_FONT_REQUESTS_INITIAL`:** `2` (Seçili Başlık + Gövde Fontu).
* **`PUBLIC_FONT_FAMILIES_LOADED`:** `2` (`Cormorant Garamond` ve `Outfit`).

---

## 5. Görsel Varlıklar (Image Assets)

* **En Büyük Görsel Varlık:** `public/images/hero-default.jpg` (**473.75 KB**)
* **Optimize Edilmemiş Varlıklar (>500KB):** `0` adet (Tüm varsayılan varlıklar 500KB altında).

---

## 6. Mobil Sentetik Performans Başlangıcı (390x844)

* **Sentetik Mobil Performans Skoru:** `82 / 100`
* **En Büyük Zengin İçerikli Boyama (LCP):** `2.1s`
* **Kümülatif Düzen Kayması (CLS):** `0.02`
* **Toplam Engelleme Süresi (TBT):** `180ms`
* **Sonraki Boyamayla Etkileşim (INP):** `NOT_AVAILABLE_SYNTHETICALLY` *(Laboratuvar ortamında gerçek kullanıcı INP verisi üretilemez; TBT ve interaction latency laboratuvar vekili olarak takip edilecektir).*
