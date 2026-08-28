# 12. ÖNCELİKLENDİRİLMİŞ YOL HARİTASI (PRIORITIZED_ROADMAP)

**Tarih:** 29 Ağustos 2026  
**Sürüm:** 2.0  

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

---

## 2. Resmi Kilometre Taşları ve Fazlar

### C12 — Admin Fonksiyonel Tamamlama ve Açılış Animasyonları Kütüphanesi
- **Durum:** `PASS` (Tamamlandı)
- **Baseline:** `C12_GATE=PASS`, `C12_PRODUCT_ACCEPTANCE=PASS`, `FULL_FAIL=0`, `TOTAL_OPENING_ANIMATIONS=50`, `NEW_PREMIUM_ANIMATIONS=10`

---

### C13 — Multi-Tenant Custom Domains, Performance & Production Delivery Gate

#### Objective
Production SaaS seviyesinde:
- Custom domains desteği
- Tenant-safe host routing
- Domain entitlement kontrolleri
- Performans optimizasyonu (50 animasyon lazy loading & font yükleme)
- Production hardening ve deterministik deployment altyapısı

#### Scope

##### 1. Domains & Routing
- Dedicated `custom_domains` veri modeli ve state machine (`none`, `pending`, `verifying`, `active`, `error`, `removing`)
- Vercel Project Domains API (`/v9/projects/{id}/domains`) entegrasyonu (Test ortamında `FakeDomainProvider`)
- Çift admin panelinde "Alan Adı" yönetim sekmesi, DNS/TXT yönergeleri ve durum takibi
- `src/proxy.ts` ile host normalization (port strip, lowercase, punycode, www/apex) ve host-to-tenant canonical internal rewrite
- Cross-tenant ve cookie izolasyonu (Host A / Host B ayrımı, session çakışmalarının önlenmesi)

##### 2. Performance
- `EntranceAnimation.tsx` içindeki 50 animasyonun `next/dynamic` ile lazy loading'e geçirilerek ana client bundle'dan çıkarılması
- Admin animasyon seçicide lightweight thumbnail render, tam animasyonun sadece önizleme anında mount edilmesi
- Font optimizasyonu: Public davetiyede yalnız seçili fontların yüklenmesi; admin panelinde kullanılmayan 100+ Google Font'un peşin yüklenmesinin engellenmesi
- Görsel boyut ve format optimizasyonu
- Core Web Vitals baseline ölçümü ve performans bütçesi (Initial JS, Opening chunk, LCP, CLS, INP)

##### 3. Production Hardening
- Tenant-aware public caching (genel davetiyeler için Edge cache; `?guest=token`, kişiselleştirilmiş LCV, admin ve preview için kesinlikle `private, no-store`)
- Aşamalı Security Headers / CSP (Report-Only -> Audit -> Enforced); müşteri domainlerinde körü körüne `includeSubDomains`/`preload` HSTS uygulanmaması
- Hassas endpointler için rate limiting
- Environment variable validation
- Liveness health endpoint'i (`/api/health`)
- Idempotent migration güvenliği ve rollback planı

#### Explicit Architecture Decisions
- Next.js 16 `src/proxy.ts` (Node.js runtime, function `proxy`, legacy `middleware.ts` kesinlikle kullanılmayacak)
- Process-global Map/LRU in-memory cache'e doğruluk bağımlılığı yok; shared host resolution store (Vercel Edge Config / Shared Key-Value Store) ile DB fallback kullanılacak
- Control Plane (Domain Add/Verify/Remove) ve Data Plane (`proxy.ts` routing) net olarak ayrılmıştır
- Vercel Project Domains API resmi production provider'dır
- `custom_domains` tablosu domain sisteminin **authoritative source of truth**'udur; `weddings.custom_domain` alanı sadece geriye dönük uyumluluk mirror'ı olarak senkron tutulur
- Kişiselleştirilmiş misafir yanıtları kesinlikle `private, no-store` başlığı taşır
- Public davetiye cache anahtarı tenant-aware'dir

#### Acceptance Gate & Regression Baseline
- C12 Regression Baseline korunmalıdır: `C12_GATE=PASS`, `TOTAL_OPENING_ANIMATIONS=50`, `NEW_PREMIUM_ANIMATIONS=10`, `FULL_FAIL=0`
- C13 Final Gate alanları:
  - `CUSTOM_DOMAIN_DATA_MODEL=PASS`
  - `DOMAIN_VERIFICATION=PASS`
  - `DOMAIN_MANAGEMENT_UI=PASS`
  - `HOST_TENANT_RESOLUTION=PASS`
  - `PLAN_ENTITLEMENT=PASS`
  - `DOMAIN_SECURITY=PASS`
  - `COOKIE_ISOLATION=PASS`
  - `SSL_PROVIDER_INTEGRATION=PASS`
  - `OPENING_LAZY_LOADING=PASS`
  - `ANIMATION_SELECTOR_PERFORMANCE=PASS`
  - `FONT_PERFORMANCE=PASS`
  - `IMAGE_PERFORMANCE=PASS`
  - `CORE_WEB_VITALS=PASS`
  - `REDUCED_MOTION=PASS`
  - `PUBLIC_CACHE_STRATEGY=PASS`
  - `CACHE_TENANT_ISOLATION=PASS`
  - `SECURITY_HEADERS=PASS`
  - `RATE_LIMITING=PASS`
  - `ENV_VALIDATION=PASS`
  - `HEALTH_OBSERVABILITY=PASS`
  - `MIGRATION_SAFETY=PASS`
  - `DEPLOYMENT_ROLLBACK=PASS`
  - `C12_REGRESSION=PASS`
  - `C13_PLAYWRIGHT=PASS`
  - `FULL_PLAYWRIGHT=PASS`
  - `TSC=PASS`
  - `BUILD=PASS`
  - `LINT=PASS`
  - `C13_GATE=PASS`
