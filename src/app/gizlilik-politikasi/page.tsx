import LegalPageLayout from '@/components/ui/LegalPageLayout';

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Gizlilik Politikası" category="Yasal ve Hukuki Sözleşmeler">
      <p>Dijital Davetiyeciniz gizliliğinize saygı duyar. Bu Gizlilik Politikası, platformumuzu kullandığınızda verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.</p>
      
      <h3 className="text-lg font-bold text-white font-serif mt-6">Veri Güvenliği</h3>
      <p>Tüm şifreler, erişim tokenları ve kullanıcı verileri endüstri standardı şifreleme ve güvenli sunucu altyapıları ile korunmaktadır. Üçüncü taraflarla asla izinsiz paylaşılmaz.</p>
    </LegalPageLayout>
  );
}
