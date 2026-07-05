import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function SssPage() {
  const faqs = [
    {
      q: "Ödemeyi ne zaman yapıyorum?",
      a: "Hayalinizdeki davetiyeyi oluşturup önizlemesini gördükten sonra, davetiyeyi aktif edip misafirlerinize göndermeye başlamak için tek seferlik ödeme yaparsınız. Önizleme tamamen ücretsizdir."
    },
    {
      q: "Yayınladıktan sonra değişiklik yapabilir miyim?",
      a: "Elbette! Dijital Davetiyeciniz'in en büyük avantajı budur. Davetiyeniz canlıdayken bile yönetim panelinize girip tarih, mekan, arkaplan fotoğrafı veya metinleri saniyeler içinde değiştirebilirsiniz. Linki alan herkes anında güncel halini görür."
    },
    {
      q: "Kağıt davetiye ile birlikte kullanabilir miyim?",
      a: "Kesinlikle. Satın alımdan sonra size özel verilen URL'nizi (örneğin: site.com/d/ayse-mehmet) QR koda dönüştürüp kağıt davetiyenizin üzerine bastırabilirsiniz."
    },
    {
      q: "Fotoğraflarım veya verilerim silinir mi?",
      a: "Hayır. Gelişmiş Telegram CDN altyapımız sayesinde verileriniz sınırsız ve güvenli bir şekilde saklanır. Etkinliğiniz bittikten sonra bile siteniz dijital bir hatıra olarak yayında kalmaya devam eder."
    },
    {
      q: "LCV (Katılım) bildirimleri nasıl çalışıyor?",
      a: "Yönetim panelinize Telegram bot bilgilerinizi girdiğinizde sistem otomatik olarak bağlanır. Misafirleriniz davetiyenizdeki 'Katılıyorum' formunu doldurduğu an, kendi cep telefonunuza anlık olarak isim ve kişi sayısı mesajı gelir."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 shadow-inner">
              <HelpCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-serif">
              Sıkça Sorulan Sorular
            </h1>
            <p className="text-slate-500">
              Aklınıza takılan tüm soruların cevaplarını bu sayfada bir araya getirdik.
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <details key={i} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-md">
                <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-slate-805 hover:bg-slate-50 transition-colors">
                  {item.q}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-slate-500 leading-relaxed text-sm">
                  {item.a}
                </div>
              </details>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
