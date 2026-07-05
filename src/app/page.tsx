import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Sparkles, ArrowRight, CheckCircle2, Paintbrush, 
  Palette, Crown, Leaf, Moon, Heart, Baby, ExternalLink
} from 'lucide-react';

export default function Home() {
  const showcaseTemplates = [
    {
      id: 'template1',
      name: 'Elif Yılmaz & Kerem Arslan',
      description: 'Lüks Düğün: Altın detaylı beyaz mermer lüks tasarım. Çırağan Palace Kempinski.',
      icon: <Crown className="w-8 h-8 text-amber-500" />,
      colors: ['#dfc384', '#064e3b', '#ffffff'],
      badge: 'Lüks Düğün',
      slug: 'elif-kerem'
    },
    {
      id: 'template3',
      name: 'Zeynep Kaya & Mert Demir',
      description: 'Bohem Kır Düğünü: Doğal tonlar, çiçek detayları, yumuşak animasyonlar. Polonezköy Garden.',
      icon: <Leaf className="w-8 h-8 text-emerald-500" />,
      colors: ['#0f766e', '#fef3c7', '#111827'],
      badge: 'Kır Düğünü',
      slug: 'zeynep-mert'
    },
    {
      id: 'template42',
      name: 'Derya & Can',
      description: 'Nişan Davetiyesi: Modern pembe, rose gold, zarif tipografi. The Marmara Taksim.',
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      colors: ['#db2777', '#fce7f3', '#1e293b'],
      badge: 'Nişan',
      slug: 'derya-can'
    },
    {
      id: 'template27',
      name: "Aslı'nın Kına Gecesi",
      description: 'Kına Gecesi: Bordo, altın, geleneksel ama modern esintiler. Grand Cevahir Hotel.',
      icon: <Palette className="w-8 h-8 text-red-500" />,
      colors: ['#991b1b', '#fef08a', '#fef3c7'],
      badge: 'Kına Gecesi',
      slug: 'asli-kina'
    },
    {
      id: 'template42-baby',
      name: 'Asya Bebek Geliyor',
      description: 'Baby Shower: Pastel pembe, bulut, yıldız, yumuşak geçişler. Divan İstanbul.',
      icon: <Baby className="w-8 h-8 text-rose-400" />,
      colors: ['#f43f5e', '#ffe4e6', '#334155'],
      badge: 'Baby Shower',
      slug: 'asya-bebek'
    },
    {
      id: 'template2',
      name: 'Atlas Innovation Night',
      description: 'Kurumsal Lansman: Koyu lacivert, neon gradient, kurumsal premium görünüm. İstanbul.',
      icon: <Sparkles className="w-8 h-8 text-indigo-500" />,
      colors: ['#6366f1', '#0f172a', '#ffffff'],
      badge: 'Lansman',
      slug: 'atlas-lansman'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28 px-6 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-100/60 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-rose-100/80 backdrop-blur-sm text-rose-600 px-5 py-2 rounded-full text-xs font-bold mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 animate-pulse" /> Yeni Nesil Dijital Davetiye Platformu
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] font-serif">
            Davetiyenizi <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400">
              Dijitale Taşıyın.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-3xl mx-auto leading-relaxed">
            Kağıt masrafına son! Etkinliğiniz için <strong>dakikalar içinde</strong> göz alıcı zarf açılış animasyonlu bir web sitesi oluşturun ve sevdiklerinize tek tıkla gönderin.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/kayit-ol" className="bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-rose-600 hover:-translate-y-1 transition-all shadow-xl shadow-rose-200/50 flex items-center justify-center gap-2">
              Davetiyeni Oluştur <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/demo/elif-kerem" className="bg-white text-slate-800 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Demo Siteyi İncele
            </Link>
          </div>
          <div className="mt-6 text-sm text-slate-400 font-medium">Kredi kartı gerekmez. Önizlemek ve denemek tamamen ücretsizdir.</div>
        </div>
      </section>

      {/* Şablon ve Örnek Davetiye Vitrini */}
      <section className="py-24 bg-white px-6 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Öne Çıkan Efsane Tasarımlar</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">
              50 adet premium konseptimiz arasından en popüler ve beğenilen şablonlardan bazılarını inceleyin.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showcaseTemplates.map((tpl) => (
              <div key={tpl.id} className="bg-slate-50/50 rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all relative group flex flex-col h-full hover:bg-white">
                {/* Event Type Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-rose-50 text-rose-600 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    {tpl.badge}
                  </span>
                  <div className="flex gap-1.5">
                    {tpl.colors.map((color, idx) => (
                      <div key={idx} className="w-4 h-4 rounded-full border border-white shadow-inner" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>

                {/* Mini Preview Visual Placeholder (Very Premium CSS Card) */}
                <div className="h-40 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center bg-slate-900 border border-slate-100 shadow-inner group-hover:scale-[1.02] transition-transform">
                  {/* Visual Background Theme Previews */}
                  {tpl.slug === 'elif-kerem' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 opacity-90 flex flex-col items-center justify-center p-4">
                      <div className="border border-amber-300/40 p-4 rounded-lg text-center max-w-[180px] bg-emerald-950/20 backdrop-blur-sm">
                        <p className="text-[10px] text-amber-200/90 font-serif tracking-widest uppercase mb-1">DÜĞÜN DAVETİYESİ</p>
                        <p className="text-xs font-serif text-white font-bold leading-tight">Elif & Kerem</p>
                        <div className="w-8 h-0.5 bg-amber-300 mx-auto my-1.5"></div>
                        <p className="text-[9px] text-amber-200/80 font-mono">12.09.2026</p>
                      </div>
                    </div>
                  )}
                  {tpl.slug === 'zeynep-mert' && (
                    <div className="absolute inset-0 bg-[#fefdfa] opacity-90 flex flex-col items-center justify-center p-4">
                      <div className="border-2 border-dashed border-emerald-800/20 p-4 rounded-full text-center w-28 h-28 flex flex-col items-center justify-center bg-white/40">
                        <p className="text-[8px] text-emerald-800/80 uppercase tracking-widest font-semibold">KIR DÜĞÜNÜ</p>
                        <p className="text-xs font-serif text-slate-800 font-bold leading-none my-0.5">Zeynep & Mert</p>
                        <p className="text-[8px] text-slate-400 font-mono mt-1">20 EYLÜL 2026</p>
                      </div>
                    </div>
                  )}
                  {tpl.slug === 'derya-can' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-100/30 to-pink-50 opacity-90 flex flex-col items-center justify-center p-4">
                      <div className="text-center p-4 bg-white rounded-2xl shadow-sm max-w-[180px] border border-pink-100">
                        <p className="text-[9px] text-pink-500 font-bold tracking-widest uppercase mb-1">NİŞAN GÜNÜ</p>
                        <p className="text-xs font-bold text-slate-800">Derya & Can</p>
                        <p className="text-[8px] text-slate-400 font-mono mt-1">18.10.2026</p>
                      </div>
                    </div>
                  )}
                  {tpl.slug === 'asli-kina' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-950 to-red-900 opacity-95 flex flex-col items-center justify-center p-4">
                      <div className="border border-yellow-300/40 p-4 rounded-xl text-center max-w-[180px] bg-red-950/40">
                        <p className="text-[9px] text-yellow-300/90 tracking-widest uppercase mb-1">KINA GECESİ</p>
                        <p className="text-xs text-white font-bold">Aslı'nın Kınası</p>
                        <p className="text-[8px] text-yellow-300/80 font-mono mt-1">22 AĞUSTOS 2026</p>
                      </div>
                    </div>
                  )}
                  {tpl.slug === 'asya-bebek' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-sky-50 to-pink-100 opacity-90 flex flex-col items-center justify-center p-4">
                      <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-3xl max-w-[180px] border border-slate-100">
                        <p className="text-[9px] text-slate-400 tracking-widest uppercase mb-0.5">BABY SHOWER</p>
                        <p className="text-xs font-bold text-slate-700">Asya Bebek Geliyor</p>
                        <p className="text-[8px] text-slate-400 font-mono mt-1">15.11.2026</p>
                      </div>
                    </div>
                  )}
                  {tpl.slug === 'atlas-lansman' && (
                    <div className="absolute inset-0 bg-[#0b0f19] opacity-95 flex flex-col items-center justify-center p-4">
                      <div className="border border-indigo-500/30 p-4 rounded-lg text-center max-w-[185px] bg-[#0c1222] shadow-lg shadow-indigo-950/20">
                        <p className="text-[8px] text-indigo-400 font-mono tracking-widest uppercase mb-1">INNOVATION NIGHT</p>
                        <p className="text-xs text-white font-bold leading-tight">Atlas Innovation</p>
                        <p className="text-[8px] text-slate-400 font-mono mt-1">25.09.2026</p>
                      </div>
                    </div>
                  )}
                  {/* Floating Template Icon */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
                    {tpl.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-bold mb-2 text-slate-800 font-serif leading-tight">{tpl.name}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-grow">{tpl.description}</p>

                {/* Double CTA Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <a 
                    href={`/d/${tpl.slug}`}
                    target="_blank"
                    className="py-2.5 rounded-xl font-bold text-[11px] text-center border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                  >
                    Önizle <ExternalLink className="w-3 h-3" />
                  </a>
                  <Link 
                    href={`/olustur?templateId=${tpl.id.replace('-baby', '')}`}
                    className="py-2.5 rounded-xl font-bold text-[11px] text-center bg-slate-900 text-white hover:bg-rose-500 transition-colors"
                  >
                    Bu Şablonla Başla
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Site Butonu */}
      <section className="py-20 px-6 bg-gradient-to-br from-rose-50 to-orange-50/50 text-center">
        <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 border border-rose-100 shadow-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-full mb-6">
            <Paintbrush className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-800 font-serif">Canlı Davetiyeyi Test Edin</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Müzik çaları, 3D zarf açılış animasyonunu, canlı geri sayım sayacını ve LCV katılım formunu canlı olarak inceleyin.
          </p>
          <Link 
            href="/demo/elif-kerem" 
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-102 text-sm"
          >
            Demo Davetiyeyi Aç <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Fiyat Özeti */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500 rounded-full mix-blend-screen filter blur-[120px] opacity-10" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Her Şey Dahil Fiyat</h2>
            <p className="text-slate-400 text-sm">Aylık aidat yok, sürpriz yok. Sadece tek seferlik ödeme.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-md shadow-2xl flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-3 font-serif">Tüm Özellikler Aktif</h3>
              <p className="text-slate-300 text-xs mb-6 leading-relaxed">
                Aylık ödeme yok. Davetiyenizi oluşturun, ücretsiz önizleyin, yalnızca yayına almak istediğinizde ödeme yapın.
              </p>
              
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-5xl font-black text-rose-400">₺1.999</span>
                <span className="text-slate-400 text-sm font-semibold">/ Tek Seferlik</span>
              </div>
            </div>

            <div className="flex-1 w-full bg-white/5 rounded-2xl p-6 border border-white/10 space-y-3">
              {[
                "50 Premium Şablonun Tamamı",
                "Zarf Açılış Animasyonları",
                "Telegram LCV Anlık Bildirimleri",
                "Harita Navigasyon Entegrasyonu",
                "Ömür Boyu Kalıcı Davetiye Linki"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/kayit-ol" 
              className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-extrabold px-10 py-5 rounded-2xl shadow-xl shadow-rose-900/20 text-sm hover:-translate-y-0.5 transition-all"
            >
              Hemen Davetiyeni Oluştur <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
