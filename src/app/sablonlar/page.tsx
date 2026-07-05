import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, Palette, Crown, Leaf, Moon } from 'lucide-react';

export default function TemplatesGallery() {
  const templates = [
    {
      id: 'template1',
      name: 'Zarif & Romantik',
      description: 'Soft pembe tonları, şık serif fontlar. Tamamen sevgi dolu.',
      icon: <Sparkles className="w-8 h-8 text-rose-500" />,
      colors: ['bg-rose-100', 'bg-rose-300', 'bg-rose-500'],
      popular: true
    },
    {
      id: 'template2',
      name: 'Modern & Gece',
      description: 'Koyu tema sevenler için. Neon parıltılar ve ince yazılar.',
      icon: <Moon className="w-8 h-8 text-indigo-500" />,
      colors: ['bg-slate-900', 'bg-indigo-500', 'bg-purple-500'],
      popular: false
    },
    {
      id: 'template3',
      name: 'Rustik & Doğal',
      description: 'Toprak tonları ve doğal bir hava. Kır düğünleri için ideal.',
      icon: <Leaf className="w-8 h-8 text-emerald-500" />,
      colors: ['bg-emerald-100', 'bg-emerald-600', 'bg-amber-700'],
      popular: false
    },
    {
      id: 'template4',
      name: 'Klasik & Kraliyet',
      description: 'Salon davetleri için altın sarısı ve geleneksel ağır duruş.',
      icon: <Crown className="w-8 h-8 text-amber-500" />,
      colors: ['bg-slate-50', 'bg-amber-300', 'bg-amber-600'],
      popular: false
    },
    {
      id: 'template5',
      name: 'Minimalist',
      description: 'Sade, bol boşluklu. Sadece en önemli detaylar.',
      icon: <Palette className="w-8 h-8 text-slate-700" />,
      colors: ['bg-white', 'bg-slate-200', 'bg-slate-800'],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-serif">Şablonunuzu Seçin</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Davetiyenizin temelini oluşturacak konsepti seçin. Merak etmeyin, seçtikten sonra renkleri ve yazıları tamamen değiştirebileceksiniz.
            </p>
          </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all relative group flex flex-col h-full">
              {tpl.popular && (
                <div className="absolute -top-4 right-8 bg-rose-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                  En Çok Tercih Edilen
                </div>
              )}
              
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {tpl.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{tpl.name}</h3>
              <p className="text-slate-500 mb-6 flex-grow">{tpl.description}</p>
              
              <div className="flex gap-2 mb-8">
                {tpl.colors.map((color, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border border-slate-200 shadow-inner ${color}`} />
                ))}
              </div>

              <Link 
                href={`/olustur?templateId=${tpl.id}`}
                className="block w-full text-center py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-rose-500 hover:text-white transition-colors"
              >
                Bu Şablonla Başla
              </Link>
            </div>
          ))}
        </div>
      </div>
      </main>
      
      <Footer />
    </div>
  );
}
