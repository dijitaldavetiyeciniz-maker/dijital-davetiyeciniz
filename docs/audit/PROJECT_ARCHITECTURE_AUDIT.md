# 1. PROJE MİMARİSİ RAPORU (PROJECT_ARCHITECTURE_AUDIT)

**Tarih:** 24 Temmuz 2026  
**Sürüm:** 1.0  
**Proje Adı:** Dijital Davetiyeniz SaaS Altyapısı  

---

## 1. Framework ve Kütüphane Sürümleri
- **Core Framework:** Next.js `16.2.10` (App Router, Turbopack etkin)
- **UI & Runtime Library:** React `19.0.0`, React DOM `19.0.0`
- **Dil & Derleyici:** TypeScript `5.x`, Node.js (v18+)
- **Stil & Tasarım Sistemi:** Vanilla CSS3 + Tailwind CSS (`3.4.1`) + CSS Keyframe Animations
- **İkon Kütüphanesi:** Lucide React (`0.475.0`)
- **Backend / Veritabanı Servisleri:** Supabase JS SDK (`2.48.7`) (@supabase/supabase-js, @supabase/ssr)
- **E-posta & İletişim:** Resend (`4.1.2`), Telegram Bot API (Custom Proxy)
- **Test ve E2E Framework:** Playwright (`1.50.1`), Jest (`29.7.0`)
- **Container / Yardımcılar:** Canvas (`3.1.0`), Formidable (`3.5.3`), Sharp (`0.33.5`)

---

## 2. package.json Bağımlılık İncelemesi
```json
{
  "dependencies": {
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.48.7",
    "canvas": "^3.1.0",
    "formidable": "^3.5.3",
    "lucide-react": "^0.475.0",
    "next": "16.2.10",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "resend": "^4.1.2",
    "sharp": "^0.33.5"
  },
  "devDependencies": {
    "@playwright/test": "^1.50.1",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.10",
    "jest": "^29.7.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

---

## 3. Next.js Uygulama Yapısı & Rota İndeksi

### 3.1 Public Rotalar
- `/` - Ana Karşılama ve Pazarlama Sayfası (Landing Page)
- `/fiyatlandirma` - Paket Fiyatlandırma ve Özellik Karşılaştırması
- `/sablonlar` - Şablon Kataloğu ve Canlı Önizleme Galerisi
- `/nasil-calisir` - Kullanım Rehberi ve Adım Adım Anlatım
- `/ozellikler` - Platform Özellikleri Detay Sayfası
- `/sss` - Sıkça Sorulan Sorular
- `/giris-yap` - Kullanıcı Giriş Ekranı
- `/kayit-ol` - Yeni Üyelik Oluşturma Ekranı
- `/demo` - Ücretsiz Demo Deneyim Ekranı

### 3.2 Public Davetiye Rotası
- `/d/[wedding_id]` - Canlı Davetiye Yayın Sayfası (Misafirlerin eriştiği dinamik sayfa)
- `/demo/[wedding_id]` - İnteraktif Demo Davetiye Sayfası

### 3.3 Müşteri Yönetim & Admin Rotaları
- `/dashboard` - Müşteri Davetiye Listesi ve Yeni Davetiye Başlatma Ekranı
- `/olustur` - Yeni Davetiye Oluşturma Sihirbazı
- `/d/[wedding_id]/admin` - Davetiye Özelleştirme ve Admin Kontrol Paneli (Genel, Şablon, Animasyon, Modüller, Telegram)

### 3.4 Super Admin ve Sistem Rotası
- `/super-admin` - Platform Geneli Yönetim Ekranı (Tüm davetiyeler, ödeme onayları, silme, CSV dışa aktarım)
- `/admin/template-showcase` - Şablon Laboratuvarı ve Yan Yana Görsel Test Ekranı

### 3.5 API Endpoint’leri
- `POST /api/telegram/webhook` - Telegram bot mesajlarını ve fotoğraf yüklemelerini işleyen webhook
- `POST /api/telegram/notify` - Telegram üzerinden LCV veya mesaj bildirimi gönderimi
- `POST /api/telegram/upload` - Telegram API proxy üzerinden yüksek boyutlu dosya/fotoğraf yükleme
- `POST /api/telegram/uploadAudio` - Telegram API proxy üzerinden MP3 müzik yükleme
- `POST /api/email/notify` - Resend altyapısı ile LCV ve bildirim e-postası gönderimi
- `GET /api/image` - Görsel optimize edici ve proxy endpoint'i
- `GET /api/admin/snapshots` - Şablon anlık görüntülerini döndüren test endpoint'i

---

## 4. Sistem ve Servis Entegrasyonları

### 4.1 Authentication Altyapısı
- **Yöntem:** Supabase Auth (Email / Password authentication)
- **İstemci Yapısı:** `@/lib/supabase` ve `@/lib/supabaseClient` singleton yapıları
- **Session Saklama:** Browser localStorage + Supabase Auth Cookie (Session token saklama)

### 4.2 Supabase İstemcileri
- `src/lib/supabase.ts`: Standart istemci (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Admin Operasyonları: Super admin işlemlerinde service_role key gereksinimi veya RLS politikaları kontrol edilmektedir.

### 4.3 Storage Altyapısı
- **Servis:** Supabase Storage (`wedding-photos`, `backgrounds`)
- **Yedek / Alternatif Servis:** Telegram Bot API Proxy (`api/telegram/upload`, `api/telegram/uploadAudio`). Kullanıcıların harici depolama maliyetini sıfırlamak için Telegram sunucuları media CDN olarak kullanılabilmektedir.

### 4.4 İletişim & Bildirim Entegrasyonu
- **Telegram Bot API:** Çift yönlü bildirim (Davetiye sahibi Telegram Bot Token & Chat ID girer, misafir LCV verdiğinde veya anı defterine yazığında anlık Telegram bildirimi iletilir).
- **E-posta Altyapısı:** Resend API (`RESEND_API_KEY`) üzerinden transactional e-posta gönderimi.

### 4.5 Ödeme Altyapısı
- **Durum:** Manuel / Admin Onaylı ve İyzico Entegrasyon Altyapısı Hazırlığı (`is_paid` boolean alanı veritabanında tutulur, Super Admin panelinden tek tıkla onaylanabilir).

---

## 5. Davetiye Render ve Şablon Altyapısı

### 5.1 Ana Renderer Mimarisi (`PremiumTemplateRenderer.tsx`)
- **Görevi:** Tüm davetiye isteklerini (`mode="preview"` veya `mode="public"`) kabul eder.
- **Akış:**
  1. `wedding` verisini ve `template_id` değerini okur.
  2. `themes.ts` registry'den ilgili tema konseptini çeker.
  3. `custom_overrides.design` alanından kullanıcı özelleştirmelerini (Dış sahne rengi, kart zemin rengi, opaklık, blur) çözer.
  4. Sahne arka plan stilini belirler (Eğer `sceneBackgroundColor` seçilmişse dış sahneye doğrudan uygular).
  5. `cardSurfaceStyle` objesini (`backgroundColor: rgba(...)`, `backdropFilter: blur(...)`) oluşturur.
  6. `layoutStyle` değerine göre 52 adet özel layout bileşeninden doğru olanı dinamik olarak render eder.

### 5.2 Layout Yapısı (`src/components/templates/layouts/*.tsx`)
- Toplam **52 adet** benzersiz ve konsept bazlı layout bileşeni bulunmaktadır.
- Her layout, `InvitationContentSurface.tsx` ortak bileşeni üzerinden kart opaklığını metinlerden bağımsız olarak yönetir.

### 5.3 Animasyon Registry (`src/data/openingAnimations.ts`)
- **Açılış Animasyonu Ailesi:** Toplam 20 adet açılış animasyon tipi (Zarf, Perde, Kapı, Bahçe Kapısı, Kitap, Lüks Kutu, Hazine Sandığı, Cam, Ayna, Sinematik Zoom, Spot Işığı, Gece Gökyüzü, Asansör, Kraliyet Salonu, Bulut & Balon, Ayıcık Rozeti, Sinema Afişi, Kraliyet Parşömeni, Botanik Bahçe, Kına Gecesi Kadife Kapı, Nazar Kubbe).
- **Arka Plan Animasyonları (`BackgroundParticles.tsx`):** 19 adet CSS keyframe parçacık efekti (Kalpler, Kar, Kabarcıklar, Altın Toz, Gül Yaprakları, Sakura, Bokeh, Yıldız Kayması, İnci Parıltısı, vb.).

---

## 6. Deployment ve Çevre Değişkenleri

### Environment Değişken İsimleri:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

---

**Sonuç:** Proje mimarisi Next.js App Router ve Tailwind CSS üzerinde son derece modüler, performanslı ve genişletilebilir bir yapıda inşa edilmiştir.
