import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Sparkles, ArrowRight, CheckCircle2, Paintbrush, 
  Palette, Crown, Leaf, Moon 
} from 'lucide-react';

export default function Home() {
  const showcaseTemplates = [
    {
      id: 'template1',
      name: 'Altın Saray (Royal Gold)',
      description: 'Asil altın varaklar ve saray zarafetinde ince süslemeler içeren en gözde şablon.',
      icon: <Crown className="w-8 h-8 text-amber-500" />,
      colors: ['#dfc384', '#064e3b', '#ffffff'],
      badge: 'Popüler'
    },
    {
      id: 'template2',
      name: 'Neon Gece (Karanlık Tema)',
      description: 'Modern çizgiler, karanlık zemin ve neon parıltılarla fark yaratmak isteyenlere özel.',
      icon: <Moon className="w-8 h-8 text-indigo-500" />,
      colors: ['#be123c', '#0f172a', '#6366f1'],
      badge: 'Trend'
    },
    {
      id: 'template3',
      name: 'Organik Keten (Doğal Kağıt)',
      description: 'Krem tonlarında premium keten dokusu ve minimal çizgilerle kır düğünlerinin favorisi.',
      icon: <Leaf className="w-8 h-8 text-emerald-500" />,
      colors: ['#0f766e', '#fef3c7', '#111827'],
      badge: 'Doğal'
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
            <Link href="/d/demo-cift" className="bg-white text-slate-800 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
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

          <div className="grid md:grid-cols-3 gap-8">
            {showcaseTemplates.map((tpl) => (
              <div key={tpl.id} className="bg-slate-50 rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all relative group flex flex-col h-full">
                <span className="absolute top-4 right-6 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {tpl.badge}
                </span>
                
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
                  {tpl.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-slate-800">{tpl.name}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-grow">{tpl.description}</p>
                
                <div className="flex gap-2 mb-6">
                  {tpl.colors.map((color, idx) => (
                    <div key={idx} className="w-6 h-6 rounded-full border border-white shadow-md shrink-0" style={{ backgroundColor: color }} />
                  ))}
                </div>

                <Link 
                  href={`/olustur?templateId=${tpl.id}`}
                  className="block w-full text-center py-3 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-rose-500 transition-colors"
                >
                  Bu Tasarımla Başla
                </Link>
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
            href="/d/demo-cift" 
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
              <p className="text-slate-300 text-xs mb-8 leading-relaxed">
                Şablon değiştirme, sınırsız fotoğraf albümü yükleme, Telegram LCV bildirimleri, Google Maps entegrasyonu ve ömür boyu kalıcı link.
              </p>
              
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-5xl font-black text-rose-400">₺499</span>
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
