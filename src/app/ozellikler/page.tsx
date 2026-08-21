import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  Smartphone, MapPin, MessageCircle, ImageIcon, 
  Clock, Heart, ShieldCheck, HelpCircle, ArrowRight, Sparkles, Users, QrCode
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Özellikler | Dijital Davetiyeciniz',
  description: 'Zarf açılış animasyonları, müzik çalar, Telegram LCV bildirimleri, Google Harita navigasyonu, masa oturma planı ve sınırsız fotoğraf galerisi.',
  alternates: {
    canonical: '/ozellikler',
  },
};

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
      title: "Anlık LCV Katılım Bildirimi & Telegram",
      description: "Misafirleriniz katılım formunu doldurduğunda katılım durumları, mesajları ve kişi sayıları anında yönetim panelinize ve bağlı Telegram grubunuza bildirim olarak düşer."
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      title: "Masa Oturma Planı & QR Check-in",
      description: "Düğün ve etkinlik salonundaki masaları düzenleyin, misafirlerinize özel masa ataması yapın ve kapıda QR kod ile hızlı karşılama gerçekleştirin."
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
      title: "Kişiselleştirilmiş Tasarım & Müzik",
      description: "Özel kaligrafi fontları, zengin renk paletleri, fon müziği çaları ve romantik alıntılarla davetiyenizi eşsiz kılın."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
      title: "Güvenli Yönetim Şifresi",
      description: "Kendi belirlediğiniz şifreniz ile yönetim paneline dilediğiniz an erişip bilgileri güncelleyebilir, LCV yanıtlarını Excel/CSV olarak indirebilirsiniz."
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-slate-600" />,
      title: "Ömür Boyu Kalıcı Davetiye Linki",
      description: "Düğününüz geçse dahi davetiyeniz kalıcı olarak yayında kalır. Sevdiklerinizle paylaştığınız bu link ömür boyu dijital hatıra olarak korunur."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200 flex flex-col">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto w-full flex-grow">
        <Breadcrumbs items={[{ name: 'Özellikler', url: '/ozellikler' }]} />

        {/* Header */}
        <div className="text-center my-12">
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-500 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Teknoloji & Eksiksiz Modüller</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-serif">
            Gelişmiş Platform Özellikleri
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Davetiyenizi sadece bir duyuru değil, misafirleriniz için interaktif ve unutulmaz bir deneyim haline getiren tüm özellikler.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold font-serif mb-4">
              Tüm Bu Özellikleri Kendi Davetiyenizde Deneyin
            </h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              2 dakikada ücretsiz davetiyenizi hazırlayın, canlı önizleyin ve en özel gününüzü geleceğin teknolojisiyle paylaşın.
            </p>
            <Link
              href="/olustur"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg shadow-rose-500/25 transition-all hover:scale-105 text-sm"
            >
              <span>Ücretsiz Davetiye Oluştur</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
