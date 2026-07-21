'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Sparkles, ArrowRight, CheckCircle2, Paintbrush, 
  Palette, Crown, Leaf, Heart, Baby, ExternalLink,
  Music, MailOpen, CalendarHeart, Gift
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const showcaseTemplates = [
    {
      id: 'template1',
      name: 'Elif Yılmaz & Kerem Arslan',
      description: 'Lüks Düğün: Altın detaylı beyaz mermer lüks tasarım. Çırağan Palace Kempinski.',
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
      description: 'Bohem Kır Düğünü: Doğal tonlar, çiçek detayları, yumuşak animasyonlar. Polonezköy Garden.',
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
      description: 'Nişan Davetiyesi: Modern pembe, rose gold, zarif tipografi. The Marmara Taksim.',
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
      description: 'Kına Gecesi: Bordo, altın, geleneksel ama modern esintiler. Grand Cevahir Hotel.',
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
      description: 'Baby Shower: Pastel pembe, bulut, yıldız, yumuşak geçişler. Divan İstanbul.',
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
      description: 'Kurumsal Lansman: Koyu lacivert, neon gradient, kurumsal premium görünüm. İstanbul.',
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
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 font-sans selection:bg-rose-200 overflow-x-hidden relative">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-100/50 mix-blend-multiply blur-[100px] opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-100/50 mix-blend-multiply blur-[120px] opacity-60 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-pink-100/40 mix-blend-multiply blur-[90px] opacity-50 animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
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
              Davetiyenizi <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 relative inline-block">
                Dijitale Taşıyın.
                <svg className="absolute w-full h-4 -bottom-1 left-0 text-orange-400/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Kağıt masrafına son! Etkinliğiniz için <strong className="text-slate-800">dakikalar içinde</strong> göz alıcı zarf açılış animasyonlu bir web sitesi oluşturun ve sevdiklerinize tek tıkla gönderin.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-5 items-center"
            >
              <Link href="/kayit-ol" className="group relative bg-gradient-to-r from-rose-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:-translate-y-1 transition-all shadow-[0_8px_30px_-4px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2 w-full sm:w-auto overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 flex items-center gap-2">Davetiyeni Oluştur <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
              </Link>
              <Link href="/demo/elif-kerem" className="bg-white/80 backdrop-blur-md text-slate-800 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:border-slate-300 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 w-full sm:w-auto">
                <ExternalLink className="w-5 h-5 text-slate-400" /> Demo Siteyi İncele
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

        {/* Şablon ve Örnek Davetiye Vitrini */}
        <section className="py-24 bg-white/60 backdrop-blur-xl border-y border-slate-200/50 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif text-slate-900">Öne Çıkan Efsane Tasarımlar</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-base">
                50 adet ultra-premium konseptimiz arasından en popüler ve beğenilen şablonları inceleyin. Kendi tarzınızı saniyeler içinde yansıtın.
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
                  
                  {/* Event Type Badge */}
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

                  {/* Mini Preview Visual Placeholder */}
                  <div className="h-48 rounded-[1.5rem] mb-6 relative overflow-hidden flex items-center justify-center bg-slate-900 shadow-inner group-hover:scale-[1.03] transition-transform duration-700 ease-out">
                    {/* Visual Background Theme Previews */}
                    {tpl.slug === 'elif-kerem' && (
                      <div className="absolute inset-0 bg-[#0f172a] opacity-100 flex flex-col items-center justify-center p-4 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-[#0f172a] to-[#0f172a]"></div>
                        <div className="relative border border-amber-500/30 p-5 rounded-sm text-center w-[85%] bg-gradient-to-br from-[#1e293b] to-[#0f172a] shadow-[0_0_50px_rgba(217,119,6,0.15)] group-hover:scale-105 transition-transform duration-700 ease-out z-10 before:absolute before:inset-1 before:border before:border-amber-500/10 before:rounded-sm">
                          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 p-[1px] shadow-lg">
                            <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                              <span className="text-amber-400 font-serif text-sm">EK</span>
                            </div>
                          </div>
                          <p className="text-[8px] text-amber-200/80 font-serif tracking-[0.3em] uppercase mb-2">Düğün Töreni</p>
                          <p className="text-lg font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 font-bold leading-tight">Elif & Kerem</p>
                          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto my-3"></div>
                          <p className="text-[9px] text-amber-200/60 font-mono tracking-widest">12.09.2026</p>
                        </div>
                      </div>
                    )}
                    {tpl.slug === 'zeynep-mert' && (
                      <div className="absolute inset-0 bg-[#f8f5f0] opacity-100 flex flex-col items-center justify-center p-4">
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/linen.png')]"></div>
                        <div className="relative border border-[#8b7355]/20 p-5 rounded-t-full rounded-b-xl text-center w-[75%] bg-white shadow-xl group-hover:-translate-y-2 group-hover:rotate-2 transition-all duration-700 z-10">
                          <div className="text-emerald-700/60 text-xl mb-1 mt-2">🌿</div>
                          <p className="text-[7px] text-[#8b7355] uppercase tracking-[0.2em] font-bold mb-1">Kır Düğünü</p>
                          <p className="text-base font-serif text-[#2c3e2e] italic font-medium leading-tight my-2">Zeynep <br/> <span className="text-xs text-[#8b7355] font-sans">&</span> <br/> Mert</p>
                          <p className="text-[7px] text-slate-400 font-sans tracking-widest mt-2 mb-2">20 EYLÜL 2026</p>
                        </div>
                      </div>
                    )}
                    {tpl.slug === 'derya-can' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-100 opacity-100 flex flex-col items-center justify-center p-4 overflow-hidden">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
                        
                        <div className="text-center p-5 bg-white/50 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(251,113,133,0.15)] w-[85%] border border-white z-10 group-hover:scale-105 transition-transform duration-500">
                          <div className="w-8 h-8 mx-auto bg-gradient-to-tr from-rose-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg mb-2">
                            <Heart className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-[8px] text-rose-500 font-bold tracking-[0.2em] uppercase mb-1">Nişan Töreni</p>
                          <p className="text-lg font-bold text-slate-800 tracking-tight">Derya & Can</p>
                          <p className="text-[8px] text-slate-500 font-medium tracking-widest mt-2">18 EKİM 2026</p>
                        </div>
                      </div>
                    )}
                    {tpl.slug === 'asli-kina' && (
                      <div className="absolute inset-0 bg-[#4a0404] opacity-100 flex flex-col items-center justify-center p-4 overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%),url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
                        <div className="border border-[#d4af37]/40 p-1 rounded-sm w-[80%] z-10 group-hover:rotate-[-2deg] group-hover:scale-105 transition-all duration-700">
                          <div className="border border-[#d4af37]/20 p-5 rounded-sm text-center bg-[#2a0202]/80 backdrop-blur-sm">
                            <Crown className="w-6 h-6 text-[#d4af37] mx-auto mb-2 opacity-90 drop-shadow-md" />
                            <p className="text-[7px] text-[#d4af37]/90 tracking-[0.3em] uppercase mb-1 font-bold">Kına Gecesi</p>
                            <p className="text-base text-[#fdfbf7] font-serif italic mb-1">Aslı'nın Kınası</p>
                            <div className="w-8 h-[1px] bg-[#d4af37]/40 mx-auto my-2"></div>
                            <p className="text-[7px] text-[#d4af37]/70 font-mono tracking-widest">22 AĞUSTOS 2026</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {tpl.slug === 'asya-bebek' && (
                      <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbfb] to-[#ebedee] opacity-100 flex flex-col items-center justify-center p-4 overflow-hidden">
                        <div className="absolute top-2 left-2 w-16 h-16 bg-pink-200 rounded-full mix-blend-multiply blur-xl opacity-60"></div>
                        <div className="absolute bottom-2 right-2 w-20 h-20 bg-sky-200 rounded-full mix-blend-multiply blur-xl opacity-60"></div>
                        
                        <div className="text-center px-4 py-5 bg-white rounded-t-full rounded-b-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] w-[75%] border-[3px] border-slate-50 z-10 group-hover:translate-y-[-5px] transition-transform duration-500">
                          <Baby className="w-8 h-8 text-sky-400 mx-auto mb-2 drop-shadow-sm" />
                          <p className="text-[8px] text-pink-400 font-bold tracking-[0.2em] uppercase mb-1">Baby Shower</p>
                          <p className="text-sm font-bold text-slate-700 leading-tight mb-2">Asya Bebek <br/>Geliyor</p>
                          <div className="w-10 h-1 bg-gradient-to-r from-sky-200 to-pink-200 mx-auto rounded-full"></div>
                        </div>
                      </div>
                    )}
                    {tpl.slug === 'atlas-lansman' && (
                      <div className="absolute inset-0 bg-[#050505] opacity-100 flex flex-col items-center justify-center p-4 overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:12px_12px] opacity-30"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
                        
                        <div className="border border-indigo-500/40 p-5 rounded-xl text-center w-[85%] bg-gradient-to-b from-[#0a0f1d] to-[#050505] shadow-[0_0_30px_rgba(99,102,241,0.15)] z-10 group-hover:border-indigo-400/80 transition-colors duration-300 relative overflow-hidden backdrop-blur-md">
                          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-70"></div>
                          <p className="text-[7px] text-indigo-400 font-mono font-bold tracking-[0.3em] uppercase mb-2">Innovation Night</p>
                          <p className="text-lg text-white font-extrabold tracking-tight mb-1">ATLAS<span className="text-indigo-500">.</span></p>
                          <div className="flex items-center justify-center gap-1.5 mt-3">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
                            <p className="text-[7px] text-slate-400 font-mono tracking-[0.2em]">25.09.2026 // VIP PASS</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Floating Template Icon */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-slate-100/50 group-hover:-translate-y-1 transition-transform">
                      {tpl.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-serif leading-tight group-hover:text-rose-600 transition-colors">{tpl.name}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-8 flex-grow">{tpl.description}</p>

                  {/* Double CTA Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <a 
                      href={`/d/${tpl.slug}?preview=true&entrance_animation=${tpl.animation}&background_design=${tpl.bgDesign}`}
                      target="_blank"
                      className="py-3 rounded-xl font-bold text-xs text-center border-2 border-slate-100 text-slate-600 bg-white hover:border-slate-300 hover:text-slate-800 transition-all flex items-center justify-center gap-1.5"
                    >
                      Önizle <ExternalLink className="w-3.5 h-3.5" />
                    </a>
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

        {/* Canlı Test Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-900 -z-10"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 pointer-events-none -z-10" />

          <div className="max-w-5xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 md:p-16 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 shadow-inner border border-white/10">
                  <Paintbrush className="w-8 h-8 text-rose-400" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white font-serif">Ayrıcalığı <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Test Edin</span></h2>
                <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed font-light">
                  Müzik çaları, 3D zarf açılış animasyonunu, canlı geri sayım sayacını ve LCV katılım formunu canlı olarak inceleyin. Misafirlerinizin yaşayacağı deneyimi önceden görün.
                </p>
                <Link 
                  href="/demo/elif-kerem" 
                  className="inline-flex items-center gap-3 bg-white text-slate-900 font-extrabold px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:bg-rose-50"
                >
                  Demo Davetiyeyi Aç <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Floating feature icons */}
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
            </div>
          </div>
        </section>

        {/* Fiyat Özeti */}
        <section className="py-24 px-6 bg-white relative">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-rose-500 font-bold tracking-widest uppercase text-xs mb-2 block">Şeffaf Fiyatlandırma</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-serif text-slate-900">Her Şey Dahil Fiyat</h2>
              <p className="text-slate-500 text-base">Aylık aidat yok, sürpriz yok. Sadece tek seferlik ödeme ile ömür boyu kullanım.</p>
            </div>

            <div className="bg-white border-2 border-rose-100 rounded-[3rem] p-8 md:p-14 shadow-[0_20px_60px_-15px_rgba(225,29,72,0.1)] flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-100 to-orange-50 rounded-bl-full -z-10 opacity-50"></div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center justify-center p-3 bg-rose-50 rounded-2xl mb-6 text-rose-500">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4 font-serif text-slate-900">Tüm Özellikler Aktif</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                  Aylık ödeme yok. Davetiyenizi oluşturun, ücretsiz önizleyin, tasarımınızı mükemmelleştirin. Sadece yayına almak istediğinizde ödeme yapın.
                </p>
                
                <div className="flex items-baseline justify-center md:justify-start gap-3">
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">₺1.999</span>
                  <span className="text-slate-400 text-base font-semibold">/ Tek Seferlik</span>
                </div>
              </div>

              <div className="flex-1 w-full bg-slate-50/80 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-100 space-y-4">
                {[
                  "50 Premium Şablonun Tamamı",
                  "Zarf Açılış Animasyonları",
                  "Telegram LCV Anlık Bildirimleri",
                  "Harita Navigasyon Entegrasyonu",
                  "Ömür Boyu Kalıcı Davetiye Linki",
                  "Sınırsız Fotoğraf Galerisi",
                  "Arka Plan Müzik Çalar"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-16">
              <Link 
                href="/kayit-ol" 
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-rose-500 text-white font-extrabold px-12 py-5 rounded-2xl shadow-xl shadow-slate-900/20 text-base hover:-translate-y-1 transition-all duration-300"
              >
                Hemen Davetiyeni Oluştur <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
