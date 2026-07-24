# 2. VERİTABANI VE SUPABASE DENETİMİ (DATABASE_AUDIT)

**Tarih:** 24 Temmuz 2026  
**Sürüm:** 1.0  

---

## 1. Veritabanı Tablo Yapısı ve Şema Analizi

### 1.1 `weddings` Tablosu (Ana Davetiye Tablosu)
- **`id`** (`uuid`, Primary Key, default: `gen_random_uuid()`)
- **`user_id`** (`uuid`, Foreign Key -> `auth.users.id`)
- **`user_email`** (`text`, varsayılan bildirim e-postası)
- **`slug`** (`text`, Unique Index, davetiye URL adı: `/d/[slug]`)
- **`title`** (`text`, davetiye başlığı)
- **`event_type`** (`text`, 'wedding' | 'engagement' | 'henna' | 'circumcision' | 'babyshower' | 'birthday' | 'corporate')
- **`bride_name`** (`text`, gelin / ev sahibi / çocuk adı)
- **`groom_name`** (`text`, damat / ikinci isim)
- **`bride_parents`** (`text`, gelin ailesi bilgisi)
- **`groom_parents`** (`text`, damat ailesi bilgisi)
- **`wedding_date`** (`timestamp with time zone` / `text`)
- **`venue_name`** (`text`, mekan adı)
- **`venue_address`** (`text`, açık adres)
- **`google_maps_url`** (`text`, harita yönlendirme bağlantısı)
- **`custom_message`** (`text`, özel davet mesajı / şiir / ayet)
- **`template_id`** (`text`, seçilen şablon preset kimliği)
- **`primary_color`** (`text`, ana vurgu hex rengi)
- **`text_color`** (`text`, ana metin hex rengi)
- **`envelope_color`** (`text`, zarf hex rengi)
- **`envelope_flap_type`** (`text`, zarf kapak tipi)
- **`seal_type`** (`text`, mühür ikonu/tipi)
- **`seal_color`** (`text`, mühür rengi)
- **`entrance_type`** (`text`, giriş animasyon ailesi)
- **`effect_type`** (`text`, arka plan parçacık efekti)
- **`font_family`** (`text`, gövde yazı tipi)
- **`names_font_family`** (`text`, başlık/isim yazı tipi)
- **`background_image_url`** (`text`, özel yüklenen arka plan görseli)
- **`bride_photo_url`** (`text`, kapak/çift fotoğrafı URL)
- **`groom_photo_url`** (`text`, ikincil fotoğraf URL)
- **`music_url`** (`text`, arka plan müzik MP3 bağlantısı)
- **`music_autoplay`** (`boolean`, varsayılan `true`)
- **`show_photos`** (`boolean`, galeri modülü aktif mi)
- **`show_rsvp`** (`boolean`, LCV katılım anketi aktif mi)
- **`show_comments`** (`boolean`, anı defteri aktif mi)
- **`show_countdown`** (`boolean`, geri sayım sayacı aktif mi)
- **`is_paid`** (`boolean`, varsayılan `false`, ödeme ve yayın durumu)
- **`is_active`** (`boolean`, varsayılan `true`)
- **`telegram_bot_token`** (`text`, özel Telegram Bot Token)
- **`telegram_chat_id`** (`text`, özel Telegram Chat ID)
- **`custom_overrides`** (`jsonb`, tüm gelişmiş tasarım, renk, opaklık, blur ve modül ayarları)
- **`created_at`** (`timestamp with time zone`, default: `now()`)
- **`updated_at`** (`timestamp with time zone`, default: `now()`)

### 1.2 `rsvps` Tablosu (LCV Misafir Yanıtları)
- **`id`** (`uuid`, Primary Key)
- **`wedding_id`** (`uuid`, Foreign Key -> `weddings.id` ON DELETE CASCADE)
- **`guest_name`** (`text`, misafir adı soyadı)
- **`attendance_status`** (`text`, 'attending' | 'declined' | 'maybe')
- **`guest_count`** (`integer`, kişi sayısı)
- **`note`** (`text`, mesaj / tebrik / beslenme notu)
- **`created_at`** (`timestamp with time zone`)

### 1.3 `guestbook_entries` Tablosu (Anı Defteri Mesajları)
- **`id`** (`uuid`, Primary Key)
- **`wedding_id`** (`uuid`, Foreign Key -> `weddings.id` ON DELETE CASCADE)
- **`author_name`** (`text`, mesaj yazan kişi)
- **`message`** (`text`, anı mesajı)
- **`is_approved`** (`boolean`, varsayılan `true`)
- **`created_at`** (`timestamp with time zone`)

---

## 2. `custom_overrides` JSONB Veri Modeli

`custom_overrides` alanı esnek ve geriye dönük uyumlu şu JSONB şemasına sahiptir:

```json
{
  "design": {
    "sceneBackgroundColor": "#f8fafc",
    "cardBgColor": "#ffffff",
    "cardOpacity": 90,
    "cardBlur": 4,
    "cardSurface": {
      "color": "#ffffff",
      "opacity": 90,
      "blur": 4,
      "borderColor": "#e2e8f0",
      "borderOpacity": 20,
      "shadowIntensity": 10
    }
  },
  "split_ratio": "50-50",
  "split_photo_side": "left",
  "split_mobile_order": "photo-first",
  "gallery_images": [
    "https://...",
    "https://..."
  ],
  "timeline_events": [
    { "time": "19:00", "title": "Karşılama Kokteyli" },
    { "time": "20:00", "title": "Nikah Töreni" }
  ]
}
```

---

## 3. Migration, Legacy ve Veri Uyumlaştırma Durumu

### 3.1 Tek Veri Kaynağına Geçiş (Single Source of Truth)
- **Dış Sahne Arka Plan Rengi (`sceneBackgroundColor`):**
  - Eski Durum: Hem `scene_background_color` hem `custom_overrides.design.sceneBackgroundColor` paralel olarak güncelleniyordu.
  - Mevcut Durum: Yeni kayıt esnasında veri yalnızca `custom_overrides.design.sceneBackgroundColor` altına yazılır. Okunurken geriye dönük uyumluluk için `custom_overrides.design.sceneBackgroundColor ?? legacy_column` mantığı çalışır.
- **Kart Yüzey Özellikleri (`cardSurface`):**
  - Tüm kart zemin özellikleri `custom_overrides.design.cardSurface` nesnesinde merkezileştirilmiştir.

---

## 4. Güvenlik, RLS ve Performans Risk Değerlendirmesi

### 4.1 Row Level Security (RLS) Durumu
- `weddings` tablosu üzerinde `SELECT` tüm kullanıcılara açıktır (`auth.uid() = user_id` veya `slug` ile sorgulama).
- `UPDATE` ve `DELETE` işlemleri `auth.uid() = user_id` şartına bağlıdır.
- **Risk:** Anonim kullanıcılar public davetiyeleri okuyabilir ancak sahiplik doğrulaması olmadan `custom_overrides` veya içerik değiştiremez.

### 4.2 Önerilen Index İyileştirmeleri
1. `CREATE INDEX IF NOT EXISTS idx_weddings_slug ON weddings(slug);` (Hız: O(1) slug arama)
2. `CREATE INDEX IF NOT EXISTS idx_rsvps_wedding_id ON rsvps(wedding_id);`
3. `CREATE INDEX IF NOT EXISTS idx_guestbook_wedding_id ON guestbook_entries(wedding_id);`
