import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ArrowRight, Sparkles, Paintbrush, Share2, Eye, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nasıl Çalışır? | Dijital Davetiyeciniz',
  description: '3 basit adımda dijital davetiye oluşturma rehberi: Şablon seçin, bilgilerinizi girin ve sevdiklerinizle tek tıkla paylaşın.',
  alternates: {
    canonical: '/nasil-calisir',
  },
};

export default function NasilCalisirPage() {
  const steps = [
    {
      num: '1',
      icon: <Sparkles className="w-5 h-5 text-rose-500" />,
      title: 'Şablon ve Temanızı Seçin',
      description: '120+ ultra-premium şablonumuz arasından etkinliğinize (Düğün, Nişan, Kına, Baby Shower, Kurumsal vb.) en uygun olanı belirleyin. Canlı önizleme ile tasarımları test edin.'
    },
    {
      num: '2',
      icon: <Paintbrush className="w-5 h-5 text-rose-500" />,
      title: 'Detayları ve Tasarımı Özelleştirin',
      description: 'İsimler, tarih, mekan adresi, Google Maps navigasyon linki, fon müziği ve arka plan görsellerinizi kolay yönetim panelinden dakikalar içinde ekleyin.'
    },
    {
      num: '3',
      icon: <Share2 className="w-5 h-5 text-rose-500" />,
      title: 'WhatsApp ile Tek Tıkla Paylaşın',
      description: 'Size özel üretilen bağlantı linkini WhatsApp, SMS veya sosyal medyadan misafirlerinize gönderin. Katılım yanıtlarını (LCV) anlık olarak takip edin.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200 flex flex-col">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-4xl mx-auto w-full flex-grow">
        <Breadcrumbs items={[{ name: 'Nasıl Çalışır?', url: '/nasil-calisir' }]} />

        {/* Header */}
        <div className="text-center my-12">
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-500 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3 Kolay Adımda Hazır</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-serif">
            Nasıl Çalışır?
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Dijital Davetiyeciniz ile hayalinizdeki davetiyeyi dakikalar içinde hazırlayıp sevdiklerinizle paylaşmak son derece kolaydır.
          </p>
        </div>

        {/* Steps Detail */}
        <div className="space-y-8 mb-16">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center gap-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl shrink-0 flex items-center justify-center text-2xl font-extrabold shadow-md shadow-rose-500/20">
                {step.num}
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-2 font-serif text-slate-900">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 rounded-3xl p-8 md:p-12 text-white text-center shadow-xl shadow-rose-500/25">
          <h3 className="text-2xl md:text-3xl font-bold font-serif mb-3">
            Hemen Davetiyenizi Tasarlamaya Başlayın
          </h3>
          <p className="text-white/90 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Ücretsiz hesapla başlayın, beğendiğiniz şablonu anında canlı önizleyin.
          </p>
          <Link
            href="/olustur"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-extrabold rounded-2xl hover:bg-rose-50 hover:scale-105 transition-all shadow-lg text-sm"
          >
            <span>Davetiyeni Şimdi Oluştur</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
