import Link from 'next/link';
import { Sparkles, Shield, ArrowLeft } from 'lucide-react';

interface LegalPageLayoutProps {
  title: string;
  category: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, category, lastUpdated = '24 Temmuz 2026', children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-slate-300 font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full mix-blend-screen filter blur-[150px] opacity-40 pointer-events-none" />
      
      {/* Navbar */}
      <nav className="bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-serif text-white hover:opacity-85 transition-opacity">
            <Sparkles className="w-6 h-6 text-rose-500" />
            Dijital <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Davetiyeciniz</span>
          </Link>
          <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 px-4 py-2 rounded-xl border border-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-14 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">
            <Shield className="w-4 h-4" /> {category}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 font-serif">{title}</h1>
          <p className="text-xs text-slate-500 mb-8 border-b border-white/10 pb-4">Son Güncelleme: {lastUpdated} | Hukuk İncelemesi Bekliyor</p>

          <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-slate-500 text-xs border-t border-white/10 mt-12 bg-[#0a0a12]">
        &copy; 2026 Dijital Davetiyeciniz. Tüm Hakları Saklıdır.
      </footer>
    </div>
  );
}
