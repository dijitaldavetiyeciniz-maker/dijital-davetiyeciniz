# Misafir Yönetimi: "Düzenle" ve "Sil" Özellikleri İmplementasyon Planı

Kullanıcıların misafirlerini sonradan düzenleyebilmeleri ve gereksiz kayıtları (veya iptalleri) silebilir olmaları için eksik olan CRUD işlemlerini sisteme entegre edeceğiz. Bu süreçte uygulamanın premium hissiyatını ve Antigravity tasarım dilini koruyacağız.

## Open Questions

- "Sil" işlemi için veritabanında tamamen yok etme (`DELETE FROM`) yerine `deleted_at` sütununu doldurarak soft-delete mi yapalım? (Mevcut `GET /api/guests` sorgunuzda `.is('deleted_at', null)` koşulu olduğu için soft-delete mantıklı görünüyor, ben plana soft-delete olarak ekledim. İtirazınız varsa belirtebilirsiniz.)

## Proposed Changes

---

### API Katmanı

`GET` ve `POST` uçlarımız mevcuttu ancak tekil misafir üzerinde işlem yapacak `PUT` ve `DELETE` metodlarımız eksikti. Bu metodları eklerken, bir önceki adımda çözdüğümüz "çerez ile yetkilendirme (admin_auth)" mimarisini birebir koruyacağız.

#### [NEW] `src/app/api/guests/[guest_id]/route.ts`
- **PUT Metodu:** 
  - İstemciden gelen verileri (ad, soyad, iletişim bilgileri vs.) Zod ile doğrulayacak.
  - `admin_auth` veya `session.user` ile yetkilendirme kontrolü yapacak.
  - `createServerServiceRoleClient()` (veya session varsa normal istemci) kullanarak misafir kaydını güncelleyecek.
- **DELETE Metodu:**
  - Belirtilen misafir ID'sini doğrulayıp `deleted_at = now()` şeklinde soft-delete uygulayacak.
  - RLS kurallarına takılmamak için cookie auth durumunda service role client kullanacak.

---

### UI / Komponent Katmanı

Antigravity estetiğine uygun olarak, tabloda uzun metinli butonlar yerine `lucide-react` ikonlarından faydalanarak daha temiz, şık ve anlaşılır bir Aksiyon menüsü tasarlayacağız.

#### [MODIFY] `src/components/admin/guests/GuestFormDialog.tsx`
- Yeni `initialData?: Guest` prop'u eklenecek.
- Form açıldığında eğer `initialData` varsa inputlar bu verilerle önceden doldurulacak (Edit Mode).
- Başlık "Yeni Misafir Ekle" yerine edit modunda "Misafiri Düzenle" olacak.
- Form submit edildiğinde, moduna göre `POST /api/guests` veya `PUT /api/guests/[guest_id]` isteği atacak.

#### [MODIFY] `src/components/admin/guests/GuestTokenActions.tsx` (İsim: `GuestActions.tsx` olarak değiştirilebilir)
- Sadece token butonlarını ("Yenile", "İptal Et") değil, "Düzenle" (`Edit2` ikonu) ve "Sil" (`Trash2` ikonu) işlemlerini de barındıracak.
- Hover animasyonları ve şık ikon butonlarla (tooltip destekli) dar alanda premium bir deneyim sunacak. Silme butonuna tıklandığında "Emin misiniz?" şeklinde şık bir onay mekanizması olacak.

#### [MODIFY] `src/components/admin/guests/GuestTable.tsx`
- Tablo içerisindeki `İşlemler` sütunu genişletilecek.
- Ebeveyn bileşene `onEdit(guest)` ve `onDelete(guest.id)` callback'leri iletecek.

#### [MODIFY] `src/components/admin/guests/GuestManagementTab.tsx`
- `editingGuest` state'i eklenecek.
- `GuestFormDialog` çağrılırken `editingGuest` varlığına göre `initialData` prop'u geçirilecek.
- `handleDelete` fonksiyonu yazılıp, başarılı silme durumunda tablo yenilenecek.

---

## Verification Plan

### Manual Verification
1. Admin paneline "test" şifresiyle giriş yapılacak.
2. Misafir eklenecek (Ahmet Yılmaz).
3. "Düzenle" ikonuna tıklanıp soyisim "Yılmaz Güncellendi" olarak değiştirilecek ve kaydedilecek.
4. Tabloda anlık olarak değişikliğin göründüğü teyit edilecek.
5. "Sil" ikonuna basılacak, onay verilecek ve kaydın tablodan tamamen kaybolduğu teyit edilecek.

### Automated Tests
1. Playwright CI workflow zaten başarıyla çalışıyordu. Düzenleme formunu da kapsayacak şekilde testin sağlam kalması izlenecek (Mevcut testte `Düzenle` adımı iptal edilmişti, eğer onaylarsanız o testi de yeni UI ile uyumlu bir şekilde tekrar ekleyebiliriz).
