import Link from 'next/link';
import { Sparkles, CheckCircle2, Heart, ArrowRight, Home } from 'lucide-react';

export const metadata = {
  title: 'Teşekkürler | Dijital Davetiyeciniz',
  description: 'Katılım bildiriminiz veya davetiye işleminiz başarıyla tamamlandı.',
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 md:p-10 rounded-3xl backdrop-blur-2xl text-center relative z-10 shadow-2xl">
        <div className="w-20 h-20 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-rose-500/30 animate-bounce">
          <Heart className="w-10 h-10 fill-current" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
          <CheckCircle2 className="w-3.5 h-3.5" /> İşlem Başarıyla Tamamlandı
        </div>

        <h1 className="text-3xl font-extrabold font-serif text-white mb-3">
          Teşekkür Ederiz!
        </h1>

        <p className="text-slate-300 text-sm leading-relaxed mb-8">
          Yanıtınız organizasyon sahibine iletildi. En özel anları birlikte paylaşmak için sabırsızlanıyoruz.
        </p>

        <div className="space-y-3">
          <Link
            href="/olustur"
            className="w-full py-3.5 px-6 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4" /> Kendi Dijital Davetiyeni Oluştur
          </Link>
          <Link
            href="/"
            className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm border border-white/10"
          >
            <Home className="w-4 h-4" /> Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
