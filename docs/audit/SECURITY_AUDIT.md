# 6. GÜVENLİK DENETİMİ (SECURITY_AUDIT)

**Tarih:** 24 Temmuz 2026  
**Sürüm:** 1.0  

---

## 1. Güvenlik Denetim Özeti

| Kategori | Durum | Risk Seviyesi | Açıklama |
|---|---|---|---|
| Supabase RLS | ✅ Aktif | LOW | `weddings` tablosunda güncellemeler `auth.uid() = user_id` kuralına tabidir. |
| Admin Yetkilendirmesi | ✅ Aktif | LOW | Admin sayfalarına yetkisiz erişim kontrol edilmektedir. |
| API Route Güvenliği | ✅ Aktif | LOW | Service role anahtarı client bundle'a sızdırılmamıştır. |
| Dosya Yükleme Güvenliği | ✅ Aktif | MEDIUM | Yalnızca `image/*` ve `audio/mpeg` MIME türlerine izin verilmektedir. |
| XSS ve HTML Enjeksiyonu | ✅ Güvenli | LOW | React otomatik JSX escaping kullanır; HTML sanitization aktiftir. |
| Rate Limiting | ⚠️ Kısmi | MEDIUM | Telegram Webhook ve LCV formlarında spam koruması artırılmalıdır. |

---

## 2. Risk Seviyelerine Göre Bulgular

### 2.1 CRITICAL / HIGH Bulgular
- **Yok:** Sistemde kritik veri sızıntısına veya yetkisiz sistem erişimine yol açacak ihlal tespit edilmemiştir.

### 2.2 MEDIUM Bulgular
1. **Public LCV Rate Limiting:** Public davetiye sayfasında botların ardı ardına LCV formu doldurmasını engellemek için IP bazlı basit rate limiting (örneğin Upstash Redis veya Supabase Edge Function rate-limiter) eklenmesi önerilir.
2. **Fotoğraf Yükleme Boyut Sınırı:** Telegram proxy veya Supabase storage yüklemelerinde maksimum 10MB dosya boyutu sınırı client ve server tarafında kontrol edilmektedir.

### 2.3 LOW Bulgular
1. Client bundle tarafında yalnızca `NEXT_PUBLIC_` önekli değişkenlerin yer aldığı doğrulanmıştır. `SUPABASE_SERVICE_ROLE_KEY` kesinlikle gizli tutulmaktadır.
