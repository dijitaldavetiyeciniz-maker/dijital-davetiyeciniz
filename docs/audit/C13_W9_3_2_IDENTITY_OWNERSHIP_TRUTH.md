# C13 W9.3.2 — IDENTITY & WEDDING OWNERSHIP TRUTH REPORT

**Denetim Tarihi**: 2026-09-01  
**Sürüm**: v2.4.0-c13-production-ready  
**Kapsam**: Gerçek Kayıtlı Kullanıcı Sayımı (`auth.users`), Davetiye Aidiyeti (Ownership Join), Legacy Üyeliksiz Kayıt Ayrıştırması ve 369/490 vs 855/6 Mutabakatı.

---

## 1. Yönetici Özeti & Kök Neden Analizi (Executive Summary & Root Cause)

### 1.1 "0 Auth User" Sorununun Çözümü
Önceki raporda auth kullanıcı sayısının 0 görünmesinin nedeni, sorgunun PostgreSQL `auth.users` tablosu yerine henüz doldurulmamış olan `profiles` tablosuna ve anon client üzerinden yönlendirilmiş olmasıydı. `getSupabaseAdmin().auth.admin.listUsers()` yetkili sunucu ucu üzerinden yapılan canlı sayımda **146 gerçek kayıtlı kullanıcı (`auth.users`)** doğrulanmıştır.

### 1.2 "855 Real vs 12 Registered User Owned" Ayrımı
Platformda toplam **855 davetiye** mevcuttur. Ancak bunların tamamı kayıtlı kullanıcı davetiyesi değildir:
- **12 Davetiye**: Doğrulanmış kayıtlı auth kullanıcılarına aittir (`REGISTERED_USER_OWNED`).
- **841 Davetiye**: Platformun ilk dönemlerinde üyelik zorunluluğu olmadan oluşturulmuş eski sistem davetiyeleridir (`LEGACY_UNAUTHENTICATED`).
- **2 Davetiye**: Sistem tanıtım demo davetiyesidir (`DEMO`).
- **0 Davetiye**: Test fixture (Tüm 6 yüksek güvenilirlikli test davetiyesi W9.3.1'de silinmiştir).

### 1.3 369/490 vs 855/6 Discrepancy Analizi
- **Eski 369 / 490 Snapshot'ı**: W9 başındaki ilk kaba sınıflandırma kuralları (içeriksiz veya legacy slug'ları test varsayan geniş heuristik) 488 kaydı test adayı göstermişti.
- **W9.3 Temizliği**: Kullanıcı ve ödeme güvenliği kuralı gereğince yalnızca kesin test prefix'li (`test-`, `c12-`, `e2e-`, `playwright-`) ve ödenmemiş 6 test kaydı hedeflenerek silindi.
- **Sonuç**: Geriye kalan 841 kayıt silinmemiştir; bunlar sahipsiz test fixture değil, kullanıcı riski olan legacy üyeliksiz davetiyelerdir.

---

## 2. Kesin Mutabakat Tablosu (Mutually Exclusive Primary Classification)

| Birincil Kategori | Sayı | Yüzde | Açıklama |
| :--- | :--- | :--- | :--- |
| **REGISTERED_USER_OWNED** | **12** | %1.4 | Auth kullanıcısı mevcut ve doğrulanmış aidiyet. |
| **LEGACY_UNAUTHENTICATED** | **841** | %98.4 | Eski üyeliksiz dönemden kalma içerikli davetiyeler. |
| **DEMO** | **2** | %0.2 | Şablon tanıtım demo kayıtları. |
| **TEST_FIXTURE** | **0** | %0.0 | Aktif test artığı kalmadı (6 adet silindi). |
| **ORPHAN** | **0** | %0.0 | Kullanıcısı silinmiş yetim kayıt yok. |
| **SYSTEM_INTERNAL** | **0** | %0.0 | Dahili sistem kaydı yok. |
| **UNKNOWN_REVIEW** | **0** | %0.0 | Belirsiz kayıt yok. |
| **TOPLAM (PRIMARY_TOTAL)** | **855** | **%100.0** | **$12 + 841 + 2 + 0 = 855$ (Tam Eşleşme)** |

---

## 3. Kayıtlı Kullanıcı & Dağılım İstatistikleri

- **Toplam Kayıtlı Auth Kullanıcısı (`auth.users`)**: **146**
  - E-postası Doğrulanmış: **146**
  - Doğrulanmamış: **0**
  - Askıya Alınmış / Banned: **0**
- **Kullanıcı Başına Davetiye Dağılımı**:
  - 0 Davetiyesi Olan Kayıtlı Kullanıcı: **141**
  - 1 Davetiyesi Olan Kayıtlı Kullanıcı: **4**
  - 2+ Davetiyesi Olan Kayıtlı Kullanıcı: **1** (Toplam: 12 davetiye)

---

## 4. Silinen 6 Test Kaydının Güvenlik Denetimi (Post-Audit)

- **Doğrulanan Test Fixture**: 6/6 (%100)
- **Geçerli Auth Sahibi Olan**: 0
- **Gerçek Ödemesi Bulunan**: 0
- **Aktif Aboneliği Bulunan**: 0
- **Veri Güvenliği İhlali (DATA_SAFETY_INCIDENT)**: **NO**

---

## 5. Sıfır Yıkıcı Eylem Taahhüdü (Non-Destructive Gate)

- `NEW_PRODUCTION_WEDDINGS_DELETED`: **0**
- `NEW_PRODUCTION_USERS_DELETED`: **0**
- `NEW_PRODUCTION_ANALYTICS_DELETED`: **0**
