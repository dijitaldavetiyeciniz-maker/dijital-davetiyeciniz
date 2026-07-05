import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-serif text-slate-800 hover:opacity-90 transition-opacity">
          <Sparkles className="w-6 h-6 text-rose-500" />
          Dijital <span className="text-rose-500">Davetiyeciniz</span>
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
          <Link href="/nasil-calisir" className="hover:text-rose-500 transition-colors">Nasıl Çalışır?</Link>
          <Link href="/ozellikler" className="hover:text-rose-500 transition-colors">Özellikler</Link>
          <Link href="/sablonlar" className="hover:text-rose-500 transition-colors">Şablonlar</Link>
          <Link href="/fiyatlandirma" className="hover:text-rose-500 transition-colors">Fiyatlandırma</Link>
          <Link href="/sss" className="hover:text-rose-500 transition-colors">S.S.S.</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/giris-yap" className="text-sm font-bold text-slate-600 hover:text-rose-500 transition-colors">
            Giriş Yap
          </Link>
          <Link href="/kayit-ol" className="text-sm font-bold bg-rose-500 text-white px-6 py-2.5 rounded-full hover:bg-rose-600 transition-all hover:scale-105 shadow-lg shadow-rose-200">
            Üye Ol
          </Link>
        </div>
      </div>
    </nav>
  );
}
