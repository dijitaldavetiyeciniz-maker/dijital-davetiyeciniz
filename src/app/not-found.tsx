import Link from 'next/link';
import { Sparkles, Home, Palette, HelpCircle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '404 - Sayfa Bulunamadı | Dijital Davetiyeciniz',
  description: 'Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Glow Orbs */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10">
        {/* Animated 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold mb-6 animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span>Hata Kodu 404</span>
        </div>

        <h1 className="text-7xl md:text-9xl font-black font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-indigo-400 mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
          Aradığınız Sayfaya Ulaşılamadı
        </h2>

        <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md mx-auto">
          Aradığınız davetiye veya sayfa kaldırılmış, taşınmış ya da bağlantı adresi yanlış yazılmış olabilir.
        </p>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
          <Link
            href="/"
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/50 hover:bg-white/10 transition-all group"
          >
            <Home className="w-5 h-5 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-bold text-white">Ana Sayfa</div>
            <div className="text-xs text-slate-400">Platforma dönün</div>
          </Link>

          <Link
            href="/sablonlar"
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/50 hover:bg-white/10 transition-all group"
          >
            <Palette className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-bold text-white">Şablonlar</div>
            <div className="text-xs text-slate-400">120+ tasarımı keşfedin</div>
          </Link>

          <Link
            href="/sss"
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/50 hover:bg-white/10 transition-all group"
          >
            <HelpCircle className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-bold text-white">Yardım & SSS</div>
            <div className="text-xs text-slate-400">Sıkça sorulanlar</div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/olustur"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/25 hover:opacity-95 transition-all text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Yeni Davetiye Oluştur
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
