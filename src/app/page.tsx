import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle, Smartphone, Globe, Camera } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-rose-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-rose-500" />
            <span className="font-bold text-xl tracking-tight">Dijital<span className="text-rose-500">Davetiyeciniz</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <Link href="#features" className="hover:text-white transition-colors">Özellikler</Link>
            <Link href="#templates" className="hover:text-white transition-colors">Şablonlar</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Fiyatlandırma</Link>
          </div>
          <Link href="/admin" className="px-5 py-2.5 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-200 transition-colors">
            Yönetim Paneli
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative text-center max-w-4xl mx-auto mt-20">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/20 blur-[120px] rounded-full pointer-events-none" />
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 relative z-10 leading-tight">
              Düğün Davetiyenizi <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                Dijitale Taşıyın
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto relative z-10">
              Yüzlerce şablon arasından seçim yapın, saniyeler içinde kendi özel sitenizi oluşturun. LCV takibi, fotoğraf paylaşımı ve çok daha fazlası tek bir platformda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link href="#templates" className="px-8 py-4 bg-rose-500 text-white font-semibold rounded-full hover:bg-rose-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25">
                Şablonları İncele
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/demo" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 transition-all flex items-center justify-center">
                Canlı Demo Gör
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto mt-40">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Neden Bizi Seçmelisiniz?</h2>
            <p className="text-slate-400">Yeni nesil düğün davetiyesi deneyimi ile tanışın.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-blue-400" />}
              title="Size Özel Web Sitesi"
              desc="dijitaldavetiyeciniz.com/ayse-mehmet gibi tamamen size özel ve ömür boyu saklayabileceğiniz dijital bir anı."
            />
            <FeatureCard 
              icon={<CheckCircle className="w-8 h-8 text-emerald-400" />}
              title="Kolay LCV (RSVP) Takibi"
              desc="Misafirleriniz kimlerin geleceğini onaylasın, siz kendi şifreli panelinizden tek tıkla takip edin."
            />
            <FeatureCard 
              icon={<Camera className="w-8 h-8 text-purple-400" />}
              title="Sınırsız Fotoğraf Paylaşımı"
              desc="Düğün anında çekilen tüm fotoğraflar misafirleriniz tarafından yüklensin, anında özel Telegram grubunuza gelsin."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
