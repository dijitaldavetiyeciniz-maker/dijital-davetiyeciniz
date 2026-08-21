import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-2xl font-bold font-serif text-slate-900 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>
            Dijital <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Davetiyeciniz</span>
          </span>
        </Link>

        {/* Navigation Links (Internal Linking) */}
        <nav aria-label="Ana Menü" className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
          <Link href="/sablonlar" className="hover:text-rose-500 transition-colors">
            Şablonlar
          </Link>
          <Link href="/ozellikler" className="hover:text-rose-500 transition-colors">
            Özellikler
          </Link>
          <Link href="/nasil-calisir" className="hover:text-rose-500 transition-colors">
            Nasıl Çalışır?
          </Link>
          <Link href="/fiyatlandirma" className="hover:text-rose-500 transition-colors">
            Fiyatlandırma
          </Link>
          <Link href="/sss" className="hover:text-rose-500 transition-colors">
            S.S.S.
          </Link>
        </nav>

        {/* CTA Actions */}
        <div className="flex items-center gap-3">
          <Link 
            href="/giris-yap" 
            className="hidden sm:inline-flex text-xs font-bold text-slate-700 hover:text-rose-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all"
          >
            Giriş Yap
          </Link>
          <Link 
            href="/olustur" 
            className="inline-flex items-center gap-2 text-xs md:text-sm font-extrabold bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:shadow-lg hover:shadow-rose-500/25 transition-all hover:scale-105"
          >
            <span>Davetiyeni Oluştur</span>
            <ArrowRight className="w-4 h-4 hidden sm:inline" />
          </Link>
        </div>
      </div>
    </header>
  );
}
