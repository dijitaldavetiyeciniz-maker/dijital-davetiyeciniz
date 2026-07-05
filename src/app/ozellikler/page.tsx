import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Smartphone, MapPin, MessageCircle, ImageIcon, 
  Clock, Heart, ShieldCheck, HelpCircle, ArrowRight
} from 'lucide-react';

export default function OzelliklerPage() {
  const features = [
    {
      icon: <Smartphone className="w-8 h-8 text-rose-500" />,
      title: "Zarf Açılış Animasyonu & Mobil Uyum",
      description: "Siteye girildiğinde 3D mühürlü zarf açılış animasyonu misafirlerinizi karşılar. Tüm telefon, tablet ve masaüstü bilgisayarlarda kusursuz ve hızlı yüklenir."
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-500" />,
      title: "Tek Tıkla Yol Tarifi (Navigasyon)",
      description: "Google Maps entegrasyonu sayesinde misafirleriniz mekanı aramak zorunda kalmaz. Haritaya tıklayarak anında telefonlarında yol tarifi alabilirler."
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-emerald-500" />,
      title: "Telegram LCV Bildirimi & Yönetim",
      description: "Misafirleriniz katılım formunu doldurduğunda katılım durumları, mesajları ve kişi sayıları anında kendi Telegram sohbet grubunuza bildirim olarak düşer."
    },
    {
      icon: <ImageIcon className="w-8 h-8 text-purple-500" />,
      title: "Sınırsız Fotoğraf Albümü Yükleme",
      description: "Misafirlerinizin sizinle paylaşmak istediği tüm fotoğrafları yükleyebilecekleri ve albümünüzü zenginleştirebilecekleri doğrudan fotoğraf yükleme butonu."
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-500" />,
      title: "Dinamik Geri Sayım Sayacı",
      description: "Büyük güne ne kadar kaldığını saniye saniye gösteren, seçtiğiniz yazı tipine göre otomatik tasarlanan şık geri sayım sayacı."
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Kişiselleştirilmiş Tasarım",
      description: "Gelin & Damat isimleri için farklı el yazısı (kaligrafi) fontu, genel detaylar için okunabilir klasik fontlar ve arkaplan müzikleri."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />,
      title: "Güvenli Yönetim Şifresi",
      description: "Kendi belirlediğiniz şifreniz ile yönetim paneline dilediğiniz an erişip bilgileri güncelleyebilir, LCV yanıtlarını Excel/CSV olarak indirebilirsiniz."
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-slate-600" />,
      title: "Ömür Boyu Kalıcı Link",
      description: "Düğününüz geçse dahi davetiyeniz kalıcı olarak yayında kalır. Sevdiklerinizle paylaştığınız bu link ömür boyu dijital hatıra olarak korunur."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-serif">
              Tüm Özellikler
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Dijital davetiyenizi sadece bir duyuru kartı olmaktan çıkarıp, tüm süreci yönetebileceğiniz akıllı bir asistana dönüştürdük.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow">{feat.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 text-center shadow-xl max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-2 font-serif">Hemen Deneyin</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              Saniyeler içinde kayıt oluşturup tasarım stüdyosuna erişin. Beğenirseniz yayınlarsınız.
            </p>
            <Link 
              href="/kayit-ol" 
              className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-102 text-sm"
            >
              Ücretsiz Tasarıma Başla <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
