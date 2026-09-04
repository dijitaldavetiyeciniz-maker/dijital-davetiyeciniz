'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, ArrowRight, CheckCircle2, ExternalLink,
  Crown, Leaf, Heart, Palette, Baby, MailOpen, Music, CalendarHeart
} from 'lucide-react';
import { SiteHomepageConfig } from '@/lib/site-settings';
import { PRODUCT_STATS } from '@/lib/productStats';

export function HeroClientSection({ homepageConfig }: { homepageConfig: SiteHomepageConfig }) {
  return (
    <section className="pt-32 pb-24 md:pt-48 md:pb-32 px-6 relative">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl mx-auto text-center relative"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md text-rose-600 px-5 py-2.5 rounded-full text-xs font-bold mb-8 shadow-[0_4px_20px_-4px_rgba(225,29,72,0.15)] border border-rose-100"
        >
          <Sparkles className="w-4 h-4 animate-pulse" /> Yeni Nesil Dijital Davetiye Platformu
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.1] font-serif text-slate-900">
          {homepageConfig.heroHeadline ? (
            <span>{homepageConfig.heroHeadline}</span>
          ) : (
            <>
              Davetiyenizi <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 relative inline-block">
                Dijitale Taşıyın.
                <svg className="absolute w-full h-4 -bottom-1 left-0 text-orange-400/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
            </>
          )}
        </h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          {homepageConfig.heroSubtitle || 'Kağıt masrafına son! Etkinliğiniz için dakikalar içinde göz alıcı zarf açılış animasyonlu bir web sitesi oluşturun ve sevdiklerinize tek tıkla gönderin.'}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-5 items-center"
        >
          <Link href={homepageConfig.heroCtaUrl || '/olustur'} className="group relative bg-gradient-to-r from-rose-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:-translate-y-1 transition-all shadow-[0_8px_30px_-4px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2 w-full sm:w-auto overflow-hidden">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10 flex items-center gap-2">{homepageConfig.heroCtaText || 'Davetiyeni Oluştur'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
          </Link>
          <Link href="/sablonlar" className="bg-white/80 backdrop-blur-md text-slate-800 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:border-slate-300 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 w-full sm:w-auto">
            <ExternalLink className="w-5 h-5 text-slate-400" /> Şablonları Keşfet
          </Link>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-sm text-slate-500 font-medium flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Kredi kartı gerekmez. Denemek tamamen ücretsizdir.
        </motion.div>
      </motion.div>
    </section>
  );
}

export function TemplateShowcaseSection() {
  const showcaseTemplates = [
    {
      id: 'template1',
      name: 'Elif Yılmaz & Kerem Arslan',
      description: 'Lüks Düğün: Altın detaylı beyaz mermer lüks tasarım. Örnek Düğün Alanı.',
      icon: <Crown className="w-8 h-8 text-amber-500" />,
      colors: ['#dfc384', '#064e3b', '#ffffff'],
      badge: 'Lüks Düğün',
      slug: 'elif-kerem',
      animation: 'royal-seal-premium',
      bgDesign: 'white-gold-marble'
    },
    {
      id: 'template3',
      name: 'Zeynep Kaya & Mert Demir',
      description: 'Bohem Kır Düğünü: Doğal tonlar, çiçek detayları, yumuşak animasyonlar. Kır Bahçesi.',
      icon: <Leaf className="w-8 h-8 text-emerald-500" />,
      colors: ['#0f766e', '#fef3c7', '#111827'],
      badge: 'Kır Düğünü',
      slug: 'zeynep-mert',
      animation: 'floral-wreath',
      bgDesign: 'bohemian-kraft'
    },
    {
      id: 'template42',
      name: 'Derya & Can',
      description: 'Nişan Davetiyesi: Modern pembe, rose gold, zarif tipografi.',
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      colors: ['#db2777', '#fce7f3', '#1e293b'],
      badge: 'Nişan',
      slug: 'derya-can',
      animation: 'modern-slide',
      bgDesign: 'glass-blur-modern'
    },
    {
      id: 'template27',
      name: "Aslı'nın Kına Gecesi",
      description: 'Kına Gecesi: Bordo, altın, geleneksel ama modern esintiler.',
      icon: <Palette className="w-8 h-8 text-red-500" />,
      colors: ['#991b1b', '#fef08a', '#fef3c7'],
      badge: 'Kına Gecesi',
      slug: 'asli-kina',
      animation: 'royal-seal-premium',
      bgDesign: 'black-gold-velvet'
    },
    {
      id: 'template42-baby',
      name: 'Asya Bebek Geliyor',
      description: 'Baby Shower: Pastel pembe, bulut, yıldız, yumuşak geçişler.',
      icon: <Baby className="w-8 h-8 text-rose-400" />,
      colors: ['#f43f5e', '#ffe4e6', '#334155'],
      badge: 'Baby Shower',
      slug: 'asya-bebek',
      animation: 'heart-pop',
      bgDesign: 'pastel-floral'
    },
    {
      id: 'template2',
      name: 'Atlas Innovation Night',
      description: 'Kurumsal Lansman: Koyu lacivert, neon gradient, kurumsal premium görünüm.',
      icon: <Sparkles className="w-8 h-8 text-indigo-500" />,
      colors: ['#6366f1', '#0f172a', '#ffffff'],
      badge: 'Lansman',
      slug: 'atlas-lansman',
      animation: 'fade-up',
      bgDesign: 'navy-gold-night'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="py-24 bg-white/60 backdrop-blur-xl border-y border-slate-200/50 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif text-slate-900">Öne Çıkan Efsane Tasarımlar</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base">
            {PRODUCT_STATS.templateCount}+ seçkin tasarım şablonumuz arasından en popüler konseptleri inceleyin. Kendi tarzınızı saniyeler içinde yansıtın.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {showcaseTemplates.map((tpl) => (
            <motion.div 
              key={tpl.id} 
              variants={itemVariants}
              className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(225,29,72,0.15)] transition-all duration-500 relative group flex flex-col h-full hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-5 relative z-10">
                <span className="bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  {tpl.badge}
                </span>
                <div className="flex gap-1.5 bg-white px-2 py-1.5 rounded-full shadow-sm border border-slate-50">
                  {tpl.colors.map((color, idx) => (
                    <div key={idx} className="w-3.5 h-3.5 rounded-full shadow-inner" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>

              <div className="h-48 rounded-[1.5rem] mb-6 relative overflow-hidden flex items-center justify-center bg-slate-900 shadow-inner group-hover:scale-[1.03] transition-transform duration-700 ease-out">
                {tpl.slug === 'elif-kerem' && (
                  <div className="absolute inset-0 bg-[#0f172a] opacity-100 flex flex-col items-center justify-center p-4 overflow-hidden">
                    <div className="relative border border-amber-500/30 p-5 rounded-sm text-center w-[85%] bg-gradient-to-br from-[#1e293b] to-[#0f172a] shadow-[0_0_50px_rgba(217,119,6,0.15)] z-10">
                      <p className="text-[8px] text-amber-200/80 font-serif tracking-[0.3em] uppercase mb-2">Düğün Töreni</p>
                      <p className="text-lg font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 font-bold leading-tight">Elif & Kerem</p>
                    </div>
                  </div>
                )}
                {tpl.slug === 'zeynep-mert' && (
                  <div className="absolute inset-0 bg-[#f8f5f0] opacity-100 flex flex-col items-center justify-center p-4">
                    <div className="relative border border-[#8b7355]/20 p-5 rounded-t-full rounded-b-xl text-center w-[75%] bg-white shadow-xl z-10">
                      <p className="text-[7px] text-[#8b7355] uppercase tracking-[0.2em] font-bold mb-1">Kır Düğünü</p>
                      <p className="text-base font-serif text-[#2c3e2e] italic font-medium leading-tight my-2">Zeynep & Mert</p>
                    </div>
                  </div>
                )}
                {tpl.slug === 'derya-can' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-100 opacity-100 flex flex-col items-center justify-center p-4 overflow-hidden">
                    <div className="text-center p-5 bg-white/50 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(251,113,133,0.15)] w-[85%] border border-white z-10">
                      <p className="text-[8px] text-rose-500 font-bold tracking-[0.2em] uppercase mb-1">Nişan Töreni</p>
                      <p className="text-lg font-bold text-slate-800 tracking-tight">Derya & Can</p>
                    </div>
                  </div>
                )}
                {tpl.slug === 'asli-kina' && (
                  <div className="absolute inset-0 bg-[#4a0404] opacity-100 flex flex-col items-center justify-center p-4 overflow-hidden">
                    <div className="border border-[#d4af37]/40 p-1 rounded-sm w-[80%] z-10">
                      <div className="border border-[#d4af37]/20 p-5 rounded-sm text-center bg-[#2a0202]/80 backdrop-blur-sm">
                        <p className="text-[7px] text-[#d4af37]/90 tracking-[0.3em] uppercase mb-1 font-bold">Kına Gecesi</p>
                        <p className="text-base text-[#fdfbf7] font-serif italic mb-1">Aslı'nın Kınası</p>
                      </div>
                    </div>
                  </div>
                )}
                {tpl.slug === 'asya-bebek' && (
                  <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbfb] to-[#ebedee] opacity-100 flex flex-col items-center justify-center p-4 overflow-hidden">
                    <div className="text-center px-4 py-5 bg-white rounded-t-full rounded-b-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] w-[75%] border-[3px] border-slate-50 z-10">
                      <p className="text-[8px] text-pink-400 font-bold tracking-[0.2em] uppercase mb-1">Baby Shower</p>
                      <p className="text-sm font-bold text-slate-700 leading-tight mb-2">Asya Bebek Geliyor</p>
                    </div>
                  </div>
                )}
                {tpl.slug === 'atlas-lansman' && (
                  <div className="absolute inset-0 bg-[#050505] opacity-100 flex flex-col items-center justify-center p-4 overflow-hidden">
                    <div className="border border-indigo-500/40 p-5 rounded-xl text-center w-[85%] bg-gradient-to-b from-[#0a0f1d] to-[#050505] z-10">
                      <p className="text-[7px] text-indigo-400 font-mono font-bold tracking-[0.3em] uppercase mb-2">Innovation Night</p>
                      <p className="text-lg text-white font-extrabold tracking-tight mb-1">ATLAS</p>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-slate-100/50">
                  {tpl.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-slate-800 font-serif leading-tight group-hover:text-rose-600 transition-colors">{tpl.name}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-8 flex-grow">{tpl.description}</p>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <Link 
                  href={`/${tpl.slug}?preview=true&entrance_animation=${tpl.animation}&background_design=${tpl.bgDesign}`}
                  className="py-3 rounded-xl font-bold text-xs text-center border-2 border-slate-100 text-slate-600 bg-white hover:border-slate-300 hover:text-slate-800 transition-all flex items-center justify-center gap-1.5"
                >
                  Önizle <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link 
                  href={`/olustur?templateId=${tpl.id.replace('-baby', '')}`}
                  className="py-3 rounded-xl font-bold text-xs text-center bg-slate-900 text-white hover:bg-rose-500 transition-colors shadow-md hover:shadow-rose-500/30"
                >
                  Bu Şablonla Başla
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function FeatureFloatingAnimation() {
  return (
    <div className="flex-1 w-full relative h-[300px] hidden md:block">
      <motion.div 
        animate={{ y: [0, -20, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-3xl rotate-12 shadow-2xl flex items-center justify-center border border-white/20"
      >
        <MailOpen className="w-8 h-8 text-white" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-32 right-10 w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full -rotate-12 shadow-2xl flex items-center justify-center border border-white/20"
      >
        <Music className="w-10 h-10 text-white" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -15, 0] }} 
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-10 left-32 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl rotate-45 shadow-2xl flex items-center justify-center border border-white/20"
      >
        <CalendarHeart className="w-6 h-6 text-white -rotate-45" />
      </motion.div>
    </div>
  );
}
