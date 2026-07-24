import LegalPageLayout from '@/components/ui/LegalPageLayout';

export default function KvkkPage() {
  return (
    <LegalPageLayout title="KVKK Aydınlatma Metni" category="Yasal ve Hukuki Sözleşmeler">
      <p className="font-semibold text-white">6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") Uyarınca Aydınlatma Metni</p>
      <p>Dijital Davetiyeciniz platformu olarak, kullanıcılarımızın ve davetlilerimizin kişisel verilerinin güvenliğine ve gizliliğine büyük önem vermekteyiz. Bu aydınlatma metni, KVKK 10. maddesi uyarınca veri sorumlusu sıfatıyla tarafımızca yürütülen veri işleme faaliyetleri hakkında sizleri bilgilendirmek amacıyla hazırlanmıştır.</p>
      
      <h3 className="text-lg font-bold text-white font-serif mt-6">1. İşlenen Kişisel Veriler</h3>
      <p>Platformumuz üzerinden toplanan kişisel veriler şunları içerebilir: Ad-soyad, e-posta adresi, telefon numarası, etkinlik detayları, LCV yanıtları, tebrik mesajları ve yüklenen medya dosyaları.</p>

      <h3 className="text-lg font-bold text-white font-serif mt-6">2. Veri İşleme Amaçları</h3>
      <p>Kişisel verileriniz; dijital davetiye hizmetlerinin sunulması, LCV yönetiminin sağlanması, müşteri desteği sunulması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.</p>

      <h3 className="text-lg font-bold text-white font-serif mt-6">3. Haklarınız</h3>
      <p>KVKK'nın 11. maddesi uyarınca tarafımıza başvurarak kişisel verilerinizin işlenip işlenmediğini öğrenme, silinmesini veya düzeltilmesini talep etme hakkına sahipsiniz.</p>
    </LegalPageLayout>
  );
}
