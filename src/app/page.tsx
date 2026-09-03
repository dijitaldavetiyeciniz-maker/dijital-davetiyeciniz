import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CaseStudiesSection from '@/components/CaseStudiesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import { 
  ArrowRight, CheckCircle2, Paintbrush, Gift
} from 'lucide-react';
import { getPublicSiteSettings } from '@/lib/site-settings';
import { PRODUCT_STATS } from '@/lib/productStats';
import { 
  HeroClientSection, 
  TemplateShowcaseSection, 
  FeatureFloatingAnimation 
} from '@/components/home/HomeClientComponents';

export const revalidate = 60; // ISR cache 60 seconds

export default async function Home() {
  const siteConfig = await getPublicSiteSettings();
  const homepageConfig = siteConfig.homepage;

  // Order sections according to CMS configuration
  const sectionsMap = new Map((homepageConfig.sections || []).map(s => [s.id, s]));

  const isSectionVisible = (id: string, defaultVisible = true) => {
    const s = sectionsMap.get(id);
    return s ? s.isVisible : defaultVisible;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 font-sans selection:bg-rose-200 overflow-x-hidden relative">
      {/* Premium Ambient Background (Zero external texture network dependency) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-100/50 mix-blend-multiply blur-[100px] opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-100/50 mix-blend-multiply blur-[120px] opacity-60 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-pink-100/40 mix-blend-multiply blur-[90px] opacity-50 animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        {isSectionVisible('hero') && (
          <HeroClientSection homepageConfig={homepageConfig} />
        )}

        {/* Şablon ve Örnek Davetiye Vitrini */}
        {isSectionVisible('templates-showcase') && (
          <TemplateShowcaseSection />
        )}

        {/* Vaka Çalışmaları / Gerçek Örnekler */}
        {isSectionVisible('features') && (
          <CaseStudiesSection />
        )}

        {/* Canlı Test / Deneyim Section */}
        {isSectionVisible('how-it-works') && (
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

                <FeatureFloatingAnimation />
              </div>
            </div>
          </section>
        )}

        {/* Müşteri Yorumları */}
        {isSectionVisible('testimonials') && (
          <TestimonialsSection />
        )}

        {/* Fiyat Özeti */}
        {isSectionVisible('final-cta') && (
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
                    `${PRODUCT_STATS.templateCount}+ Premium Şablonun Tamamı`,
                    `${PRODUCT_STATS.openingCount} Zarf ve Sahne Açılış Animasyonu`,
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
                  href="/olustur" 
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-rose-500 text-white font-extrabold px-12 py-5 rounded-2xl shadow-xl shadow-slate-900/20 text-base hover:-translate-y-1 transition-all duration-300"
                >
                  Hemen Davetiyeni Oluştur <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* SSS Accordion */}
        {isSectionVisible('faq') && (
          <FAQSection />
        )}

        <Footer />
      </div>
    </div>
  );
}
