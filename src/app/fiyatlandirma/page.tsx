import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Şeffaf Fiyatlandırma | Dijital Davetiyeciniz',
  description: 'Aylık aidat yok, sürpriz yok. 120+ şablon, müzik, zarf animasyonu, LCV ve oturma planı dahil tek seferlik şeffaf paket fiyatı.',
  alternates: {
    canonical: '/fiyatlandirma',
  },
};

export default function FiyatlandirmaPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200 flex flex-col">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-4xl mx-auto w-full flex-grow">
        <Breadcrumbs items={[{ name: 'Fiyatlandırma', url: '/fiyatlandirma' }]} />

        {/* Header */}
        <div className="text-center my-12">
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-500 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tek Seferlik Ödeme • Ömür Boyu Yayında</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-serif">
            Şeffaf Fiyatlandırma
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Gizli veya sürpriz ücretler yok. İhtiyacınız olan tüm özellikler tek bir premium pakette birleşti.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/80 p-8 md:p-12 shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
          
          <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                Tüm Özellikler Dahil Premium Paket
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2 font-serif text-slate-900">Her Şey Dahil Tek Ücret</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Aylık ödeme yok. Davetiyenizi hemen oluşturun, canlı önizleyin, yalnızca yayınlamak istediğinizde ödeme yapın.
              </p>
              
              <div className="flex items-baseline justify-center md:justify-start gap-2 mb-8">
                <span className="text-5xl md:text-6xl font-black text-slate-900">₺1.999</span>
                <span className="text-slate-400 font-semibold text-sm">/ Tek Seferlik</span>
              </div>

              <Link 
                href="/olustur" 
                className="inline-flex items-center justify-center gap-2 w-full text-center bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-4 px-6 rounded-2xl font-bold text-base transition-all shadow-lg shadow-rose-500/25 hover:scale-[1.02]"
              >
                <span>Hemen Davetiyeni Oluştur</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-center text-slate-400 mt-4">
                Davetiyenizi oluşturmak ve önizlemek tamamen ücretsizdir.
              </p>
            </div>

            <div className="flex-1 w-full bg-slate-50/80 rounded-3xl p-8 border border-slate-100">
              <ul className="space-y-4">
                {[
                  "120+ Premium Şablon ve Renk Paletleri",
                  "Zarf Açılış ve Arka Plan Animasyonları",
                  "Anlık LCV Katılım Takibi & Telegram Bildirimi",
                  "Google Harita ve Canlı Navigasyon",
                  "Masa Oturma Planı ve QR Check-in",
                  "Sınırsız Fotoğraf Galerisi ve Müzik Çalar",
                  "Canlı Anı Defteri ve Tebrik Mesajları",
                  "Ömür Boyu Kalıcı Davetiye Bağlantısı",
                  "İstediğiniz An Bilgileri Güncelleme"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
