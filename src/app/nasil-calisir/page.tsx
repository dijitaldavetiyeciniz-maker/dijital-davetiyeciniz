import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Sparkles, Paintbrush, Share2 } from 'lucide-react';

export default function NasilCalisirPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-serif">
              Nasıl Çalışır?
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Dijital Davetiyeciniz ile hayalinizdeki davetiyeyi dakikalar içinde oluşturup sevdiklerinizle paylaşmak son derece kolaydır.
            </p>
          </div>

          {/* Steps Detail */}
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-10">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl shrink-0 flex items-center justify-center text-3xl font-extrabold shadow-inner">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-500" /> Şablon & Tema Seçin
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  50 adet premium şablonumuzdan tarzınıza en uygun olanı belirleyin. Her şablonun kendine has renk uyumları, zarf mühür tasarımları ve müzik önerileri mevcuttur. Dilediğiniz şablonu tek tıklamayla panelden değiştirebilirsiniz.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-10">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl shrink-0 flex items-center justify-center text-3xl font-extrabold shadow-inner">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <Paintbrush className="w-5 h-5 text-rose-500" /> Bilgilerinizi & Tasarımınızı Özelleştirin
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Tasarım stüdyosu panelinden isimlerinizi, tarih ve saat bilgilerini yazın. Arka plana kendi fotoğrafınızı yükleyip, en beğendiğiniz arka plan şarkısını seçin. Canlı telefon önizlemesi sayesinde yaptığınız her değişikliği anlık olarak görün.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-10">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl shrink-0 flex items-center justify-center text-3xl font-extrabold shadow-inner">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-rose-500" /> Ödeyin & Yayına Alın
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Tasarımınızı tamamen ücretsiz şekilde hazırlayıp test ettikten sonra, tek seferlik sabit ücreti ödeyerek davetiyenizi kalıcı olarak yayına alın. Size özel verilen `/d/davetiye-linkiniz` adresini WhatsApp, SMS veya sosyal medyadan tüm sevdiklerinizle paylaşın.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
            <h3 className="text-2xl font-bold mb-3 relative z-10 font-serif">Kendi Davetiyenizi Tasarlamaya Başlayın</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto relative z-10">
              Hiçbir ön ödeme yapmadan tasarımınızı oluşturun ve önizlemesini hemen cep telefonunuzda test edin.
            </p>
            <Link 
              href="/kayit-ol" 
              className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all relative z-10 hover:-translate-y-0.5 text-sm"
            >
              Hemen Başla <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
