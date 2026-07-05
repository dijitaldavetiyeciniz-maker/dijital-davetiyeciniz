import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function FiyatlandirmaPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-serif">
              Şeffaf Fiyatlandırma
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Gizli veya sürpriz ücretler yok. İhtiyacınız olan her şey tek bir pakette birleşti.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
            
            <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                  Tüm Özellikler Dahil Paketi
                </div>
                <h3 className="text-4xl font-bold mb-2">Her Şey Dahil Tek Ücret</h3>
                <p className="text-slate-500 mb-8">Etkinlik gününüze kadar ve sonrasında sınırsız kullanım hakkı. Yüzlerce kişiye tek tıkla gönderin.</p>
                
                <div className="flex items-baseline justify-center md:justify-start gap-2 mb-8">
                  <span className="text-6xl font-black text-slate-800">₺499</span>
                  <span className="text-slate-400 font-medium">/ Tek Seferlik</span>
                </div>

                <Link href="/kayit-ol" className="block w-full text-center bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                  Hemen Tasarımını Yap
                </Link>
                <p className="text-xs text-center text-slate-400 mt-4">Tasarımınızı tamamen ücretsiz oluşturup önizleyebilirsiniz. Sadece yayınlarken ödeme yaparsınız.</p>
              </div>

              <div className="flex-1 w-full bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <ul className="space-y-4">
                  {[
                    "Tüm Premium Şablonlara Erişim",
                    "Zarf Açılış Animasyonu",
                    "Mobil ve Masaüstü Kusursuz Görünüm",
                    "Telegram ile Anında LCV Bildirimleri",
                    "Sınırsız Fotoğraf Barındırma",
                    "Google Maps Yönlendirmesi",
                    "Canlı Geri Sayım Aracı",
                    "Ömür Boyu Kalıcı URL",
                    "Dilediğiniz An Bilgi Güncelleme"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
