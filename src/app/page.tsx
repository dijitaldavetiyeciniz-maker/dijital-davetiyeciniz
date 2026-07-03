import Link from 'next/link';
import { Sparkles, Heart, Star, Baby, Music, CalendarHeart } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-rose-500" />
            Özel Gün <span className="text-rose-500">Davetiyesi</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#nasil-calisir" className="hover:text-rose-500 transition-colors">Nasıl Çalışır?</a>
            <a href="#etkinlikler" className="hover:text-rose-500 transition-colors">Etkinlikler</a>
            <a href="#demo" className="hover:text-rose-500 transition-colors">Örnek (Demo)</a>
          </div>
          <Link href="/super-admin" className="text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
            Yönetim Paneli
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-bold mb-8">
            <Star className="w-4 h-4" /> Türkiye'nin En Gelişmiş Davetiye Platformu
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            En Özel Gününüzü <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">
              Dijitale Taşıyın.
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Düğün, Nişan, Kına veya Baby Shower. Sadece 5 dakikada, dilediğiniz renk ve tasarımla büyüleyici bir davetiye oluşturun. LCV'leri cebinizden takip edin.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/ahmet-nesrin" className="bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-rose-600 hover:-translate-y-1 transition-all shadow-xl shadow-rose-200 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" /> Demo Zarfı Aç
            </Link>
            <Link href="#etkinlikler" className="bg-white text-slate-800 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:-translate-y-1 transition-all flex items-center justify-center">
              Etkinlik Türlerini İncele
            </Link>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section id="etkinlikler" className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Her Anınıza Özel Bir Konsept</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Gelişmiş Tasarım Stüdyosu sayesinde sitenizi anında hayalinizdeki renklere büründürün.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-rose-500">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Düğün & Nişan</h3>
              <p className="text-slate-500 leading-relaxed">Zarif serif fontlar, romantik renkler ve aşkınızı yansıtan harika bir açılış zarfı.</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-fuchsia-500">
                <Music className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Kına Gecesi</h3>
              <p className="text-slate-500 leading-relaxed">Geleneksel dokunuşlar, canlı renkler ve misafirlerinizin LCV bırakabileceği interaktif formlar.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-blue-500">
                <Baby className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Baby Shower</h3>
              <p className="text-slate-500 leading-relaxed">Soft mavi veya pembe tonları. Eğlenceli tasarımlar ve mekana direkt yol tarifi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlight (Zarf Efekti) */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Zarfı Açtıklarında <br/> <span className="text-rose-400">"Wow"</span> Diyecekler</h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Misafirlerinize sadece bir link göndermiyorsunuz. Tıkladıkları an ekranda beliren, 
              mührü kırdıklarında animasyonla açılan efsanevi bir deneyim sunuyorsunuz. 
              Sıradan bir kağıttan çok daha ötesi.
            </p>
            <Link href="/ahmet-nesrin" className="inline-flex items-center gap-2 text-rose-400 font-bold hover:text-rose-300 hover:underline text-lg">
              Canlı Demoyu İncele &rarr;
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            {/* Zarf illüstrasyonu CSS */}
            <div className="w-64 h-48 bg-[#e6d5c3] rounded-sm relative shadow-2xl rotate-[-5deg] hover:rotate-0 transition-all duration-500 cursor-pointer">
              <div className="absolute inset-0 bg-[#f4ebd8] z-10 shadow-lg" style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0)' }}></div>
              <div className="absolute inset-0 bg-[#ebd9c8]" style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }}></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] w-16 h-16 bg-rose-800 rounded-full z-20 flex items-center justify-center shadow-lg border border-rose-900">
                <Sparkles className="w-5 h-5 text-rose-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
