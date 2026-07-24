# 12. ÖNCELİKLENDİRİLMİŞ YOL HARİTASI (PRIORITIZED_ROADMAP)

**Tarih:** 24 Temmuz 2026  
**Sürüm:** 1.0  

---

## 1. Görev Grupları ve Öncelik Matrisi

### P0 — Satışı veya Veri Güvenliğini Engelleyen (Acil)
1. **Playwright QA Seçicilerinin Güncellenmesi:**
   - **Sorun:** Eski E2E testleri kaldırılan `#faz0-test-panel` QA elemanını aradığı için başarısız oluyor.
   - **Teknik Etki:** CI/CD test hattı kırmızı görünüyor.
   - **İlgili Dosyalar:** `tests/*.spec.ts`
   - **Kapsam:** S

2. **Otomatik Ödeme Entegrasyonu (İyzico / Stripe Direct Callback):**
   - **Sorun:** Ödemeler şu an admin onaylı çalışmaktadır; iyzico webhook bağlantısı canlıya alınmalıdır.
   - **Kapsam:** M

---

### P1 — Yayın Öncesi Tamamlanması Gerekenler
1. **Yasal Metinler ve KVKK Bağlantıları:**
   - **Sorun:** Footer alanındaki Mesafeli Satış Sözleşmesi ve KVKK sayfalarının son hukuki metinlerinin eklenmesi.
   - **Kapsam:** S

2. **Public LCV Rate Limiting:**
   - **Sorun:** Botların LCV formuna spam istek atmasını engellemek için IP bazlı sınırlama.
   - **Kapsam:** S

---

### P2 — Ürün Kalitesini Artıracak Özellikler
1. **Sosyal Medya (Google / Apple) ile Giriş:**
   - **Kapsam:** M

2. **Sayfa Ziyaretçi Analitiği (Analytics Dashboard):**
   - **Kapsam:** M

---

### P3 — İleri Sürüm Özellikleri
1. **Çoklu Dil Desteği (i18n - İngilizce, Almanca, Arapça):**
   - **Kapsam:** L
