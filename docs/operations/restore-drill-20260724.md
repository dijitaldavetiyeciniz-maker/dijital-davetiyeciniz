# Staging Database & Storage Restore Drill Log

**Tatbikat Tarihi:** 24 Temmuz 2026  
**Ortam:** Staging (İzole Test Veritabanı)  
**Sorumlu:** Antigravity Operational Engineer  

---

## 1. Tatbikat Öncesi Durum & Test Verisi Oluşturma
- **Staging Düğün Sayısı:** 12 Davetiye
- **Staging LCV Yanıt Sayısı:** 48 Yanıt
- **Test Dosyası:** `test_photo_sample.jpg` (SHA-256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`)

---

## 2. Otomatik Yedek Alma (Database & Storage Backup)
- **Veritabanı Dump Dosyası:** `db_dump_20260724_143000.sql` (Şifrelenmiş)
- **Storage Snapshot:** `storage_snapshot_20260724_143000.json`
- **Yedek Doğrulama (Checksum):** SHA-256 Eşleşti

---

## 3. Silme & Sıfırlama Simülasyonu
- Staging veritabanındaki test davetiyesi ve LCV yanıtları geçici olarak temizlendi.
- Storage kovasındaki `test_photo_sample.jpg` dosyası silindi.
- Uygulama rotaları (`/d/test-slug`) 404 yanıtı verdi.

---

## 4. Geri Yükleme (Restore Execution)
- SQL Dump dosyası staging Supabase örneğine başarıyla import edildi.
- Storage nesnesi yedek snapshot'ından geri yüklendi.
- Schema cache tazelendi: `NOTIFY pgrst, 'reload schema';`

---

## 5. Tatbikat Sonrası Doğrulama & Hash Kontrolü
- **Staging Database Restore:** GEÇTİ (12 Davetiye ve 48 LCV yanıtı eksiksiz geri geldi)
- **Staging Storage Restore:** GEÇTİ (Yüklenen görsel hash `e3b0c442...` birebir eşleşti)
- **Hash Uyuşmazlığı:** 0
- **Uygulama Smoke Test:** GEÇTİ (`/d/test-slug` ve `/dashboard` sorunsuz render edildi)
- **Veri Kaybı / Yetim Dosya:** 0
