'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Sparkles, Palette, Crown, Leaf, Moon, Star, Filter, Check, Wand2, 
  X, Camera, Heart, Shield, Music, Layers, ArrowRight, Eye
} from 'lucide-react';
import { eventTypeConfigs } from '@/data/eventTypeConfig';

export interface CatalogTemplate {
  id: string;
  name: string;
  category: 'Lüks' | 'Modern' | 'Minimal' | 'Doğal' | 'Kültürel' | 'Çocuk' | 'Kurumsal';
  eventType: 'wedding' | 'henna' | 'circumcision' | 'babyshower' | 'birthday' | 'corporate';
  description: string;
  colors: string[];
  gradient: string;
  isFlagship?: boolean;
  popular?: boolean;
  isNew?: boolean;
  thumbnailBadge: string;
}

export const FLAGSHIP_TEMPLATES: CatalogTemplate[] = [
  {
    id: 'parisian-black-tie',
    name: 'Parisian Black Tie',
    category: 'Lüks',
    eventType: 'wedding',
    description: 'Fransız haute couture estetiği. Siyah-fildişi kontrast, ince altın varaklar ve editoryal tipografi.',
    colors: ['bg-slate-950', 'bg-[#f5e6d3]', 'bg-[#dfc384]'],
    gradient: 'from-slate-950 via-slate-900 to-amber-950',
    isFlagship: true,
    popular: true,
    thumbnailBadge: 'Flagship Collection',
  },
  {
    id: 'grand-opera-ballroom',
    name: 'Grand Opera Ballroom',
    category: 'Lüks',
    eventType: 'wedding',
    description: 'Bordo kadife ve opera afişi konsepti. Bilet biçimli tarih sunumu ve tiyatral görkem.',
    colors: ['bg-rose-950', 'bg-amber-600', 'bg-amber-100'],
    gradient: 'from-rose-950 via-rose-900 to-amber-900',
    isFlagship: true,
    popular: true,
    thumbnailBadge: 'Flagship Collection',
  },
  {
    id: 'moonlit-secret-garden',
    name: 'Moonlit Secret Garden',
    category: 'Doğal',
    eventType: 'wedding',
    description: 'Gece bahçesi, ay ışığı süzülmeleri ve yasemin sarmaşıkları. Derin gümüş ve zümrüt tonları.',
    colors: ['bg-slate-900', 'bg-emerald-900', 'bg-slate-300'],
    gradient: 'from-slate-900 via-emerald-950 to-slate-950',
    isFlagship: true,
    thumbnailBadge: 'Flagship Collection',
  },
  {
    id: 'vogue-wedding-editorial',
    name: 'Vogue Wedding Editorial',
    category: 'Modern',
    eventType: 'wedding',
    description: 'Moda dergisi kapağı konsepti. Dev masthead başlığı ve asimetrik fotoğraf blokları.',
    colors: ['bg-stone-900', 'bg-stone-200', 'bg-amber-500'],
    gradient: 'from-stone-900 via-stone-800 to-neutral-900',
    isFlagship: true,
    thumbnailBadge: 'Flagship Collection',
  },
  {
    id: 'mediterranean-ceramic-garden',
    name: 'Mediterranean Ceramic',
    category: 'Doğal',
    eventType: 'wedding',
    description: 'İznik ve Akdeniz seramik bordürleri. Limon ve zeytin dalı illüstrasyonları ile kemerli yüzey.',
    colors: ['bg-blue-950', 'bg-amber-100', 'bg-emerald-800'],
    gradient: 'from-blue-950 via-sky-950 to-amber-900',
    isFlagship: true,
    thumbnailBadge: 'Flagship Collection',
  },
  {
    id: 'ottoman-illumination',
    name: 'Ottoman Illumination Tezhip',
    category: 'Kültürel',
    eventType: 'wedding',
    description: 'Saray tezhip sanatı. Altın yaprak detayları, lacivert fon ve geleneksel motifler.',
    colors: ['bg-indigo-950', 'bg-amber-500', 'bg-amber-100'],
    gradient: 'from-indigo-950 via-slate-900 to-amber-900',
    isFlagship: true,
    thumbnailBadge: 'Flagship Collection',
  },
  {
    id: 'coastal-sunset',
    name: 'Coastal Sunset',
    category: 'Doğal',
    eventType: 'wedding',
    description: 'Tam ekran gün batımı ve okyanus arka planı. Şeftali ve pudra cam içerik panelleri.',
    colors: ['bg-rose-900', 'bg-amber-700', 'bg-sky-900'],
    gradient: 'from-rose-900 via-amber-900 to-sky-950',
    isFlagship: true,
    thumbnailBadge: 'Flagship Collection',
  },
  {
    id: 'aurora-glass',
    name: 'Aurora Glass',
    category: 'Modern',
    eventType: 'wedding',
    description: 'Gelişmiş aurora glassmorphism efekti. Düğün ve kurumsal etkinlikler için çağdaş kompozisyon.',
    colors: ['bg-slate-950', 'bg-pink-900', 'bg-indigo-900'],
    gradient: 'from-slate-950 via-purple-950 to-pink-950',
    isFlagship: true,
    isNew: true,
    thumbnailBadge: 'Flagship Collection',
  },
  {
    id: 'fine-art-botanical-watercolor',
    name: 'Fine Art Botanical',
    category: 'Doğal',
    eventType: 'wedding',
    description: 'Özgün suluboya kâğıdı dokusu ve el çizimi çiçek çelenkleri. İnce kaligrafi tipografisi.',
    colors: ['bg-[#fdfbf7]', 'bg-emerald-800', 'bg-rose-400'],
    gradient: 'from-[#fdfbf7] via-[#f7f3ec] to-[#eee8dd]',
    isFlagship: true,
    thumbnailBadge: 'Flagship Collection',
  },
  {
    id: 'film-premiere-night',
    name: 'Film Premiere Night',
    category: 'Modern',
    eventType: 'wedding',
    description: 'Kırmızı halı ve sinema afişi tasarımı. Film künyesi ve jeneriği biçiminde etkinlik detayları.',
    colors: ['bg-black', 'bg-rose-950', 'bg-amber-400'],
    gradient: 'from-black via-rose-950 to-neutral-950',
    isFlagship: true,
    thumbnailBadge: 'Flagship Collection',
  },
  {
    id: 'minimal-swiss-gallery',
    name: 'Minimal Swiss Gallery',
    category: 'Minimal',
    eventType: 'wedding',
    description: 'Swiss typography grid sistemi. Dev rakamlı tarih ve sanat galerisi boşluk kullanımı.',
    colors: ['bg-white', 'bg-slate-900', 'bg-rose-500'],
    gradient: 'from-slate-100 via-white to-slate-200',
    isFlagship: true,
    thumbnailBadge: 'Flagship Collection',
  },
  {
    id: 'royal-palace-invitation',
    name: 'Royal Palace Invitation',
    category: 'Lüks',
    eventType: 'wedding',
    description: 'Saray kemerleri ve altın monogram armada. Zümrüt, bordo ve lacivert lüks kadife varyantları.',
    colors: ['bg-emerald-950', 'bg-amber-400', 'bg-[#f4efe6]'],
    gradient: 'from-emerald-950 via-emerald-900 to-amber-950',
    isFlagship: true,
    thumbnailBadge: 'Flagship Collection',
  },
  {
    id: 'henna-palace-night',
    name: 'Henna Palace Night',
    category: 'Kültürel',
    eventType: 'henna',
    description: 'Kına gecesine özel dikey kadife tepsisi, altın nakış ve fener simülasyonu.',
    colors: ['bg-rose-950', 'bg-amber-500', 'bg-red-900'],
    gradient: 'from-rose-950 via-red-950 to-amber-950',
    isFlagship: true,
    thumbnailBadge: 'Kına Özel Flagship',
  },
  {
    id: 'prince-ceremony',
    name: 'Prince Ceremony (Sünnet)',
    category: 'Çocuk',
    eventType: 'circumcision',
    description: 'Sünnet düğününe özel Osmanlı şehzade kubbesi ve nazar nakışı. Düğün dili tamamen temizlenmiştir.',
    colors: ['bg-sky-950', 'bg-amber-400', 'bg-blue-900'],
    gradient: 'from-sky-950 via-blue-950 to-amber-950',
    isFlagship: true,
    thumbnailBadge: 'Sünnet Özel Flagship',
  },
  {
    id: 'storybook-babyshower',
    name: 'Storybook Baby Shower',
    category: 'Çocuk',
    eventType: 'babyshower',
    description: 'Baby Shower özel masal kapağı. Bebeğin adı öncelikli, sıfır doğum günü dili ve özgün SVG ayıcıklar.',
    colors: ['bg-pink-100', 'bg-sky-100', 'bg-amber-200'],
    gradient: 'from-pink-50 via-amber-50 to-sky-50',
    isFlagship: true,
    thumbnailBadge: 'Baby Shower Flagship',
  },
  {
    id: 'future-summit',
    name: 'Future Summit Corporate',
    category: 'Kurumsal',
    eventType: 'corporate',
    description: 'Kurumsal konferans ve lansman grid yapısı. Konuşmacı, sponsor ve program akışı desteği.',
    colors: ['bg-slate-950', 'bg-indigo-600', 'bg-cyan-400'],
    gradient: 'from-slate-950 via-indigo-950 to-slate-900',
    isFlagship: true,
    thumbnailBadge: 'Kurumsal Flagship',
  },
];

export default function TemplatesGallery() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardAnswers, setWizardAnswers] = useState({
    eventType: 'wedding',
    style: 'Lüks',
    color: 'Karanlık',
    photo: 'yes',
  });

  const filteredTemplates = FLAGSHIP_TEMPLATES.filter((tpl) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'wedding') return tpl.eventType === 'wedding';
    if (selectedFilter === 'henna') return tpl.eventType === 'henna';
    if (selectedFilter === 'circumcision') return tpl.eventType === 'circumcision';
    if (selectedFilter === 'babyshower') return tpl.eventType === 'babyshower';
    if (selectedFilter === 'corporate') return tpl.eventType === 'corporate';
    if (selectedFilter === 'luxury') return tpl.category === 'Lüks';
    if (selectedFilter === 'modern') return tpl.category === 'Modern';
    if (selectedFilter === 'minimal') return tpl.category === 'Minimal';
    return true;
  });

  // Recommended wizard results
  const wizardResults = FLAGSHIP_TEMPLATES.filter(
    (t) => t.eventType === wizardAnswers.eventType || t.category === wizardAnswers.style
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-slate-300 font-sans selection:bg-rose-500/30">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        {/* Hero Banner */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Crown className="w-4 h-4" /> Flagship Collection 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif">
            Şablon Stüdyosu & Katalog
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Her biri benzersiz editoryal kompozisyona, özel tipografiye ve dinamik modül yapısına sahip 16 lüks Flagship şablonumuzu inceleyin.
          </p>

          {/* Smart Wizard Trigger Button */}
          <button
            onClick={() => {
              setWizardOpen(true);
              setWizardStep(1);
            }}
            className="bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-all inline-flex items-center gap-3 shadow-[0_0_30px_rgba(244,63,94,0.4)] cursor-pointer"
          >
            <Wand2 className="w-5 h-5 animate-spin-slow" />
            Bana Uygun Şablonu Bul (Akıllı Sihirbaz)
          </button>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex overflow-x-auto gap-2 mb-10 pb-2 hide-scrollbar justify-start md:justify-center border-b border-white/10">
          {[
            { id: 'all', label: 'Tüm Şablonlar (16)' },
            { id: 'wedding', label: '💍 Düğün & Nişan' },
            { id: 'henna', label: '💃 Kına Gecesi' },
            { id: 'circumcision', label: '👑 Sünnet Töreni' },
            { id: 'babyshower', label: '👶 Baby Shower' },
            { id: 'corporate', label: '🏛️ Kurumsal' },
            { id: 'luxury', label: '✨ Lüks Konsept' },
            { id: 'modern', label: '⚡ Modern Grid' },
            { id: 'minimal', label: '📜 Minimalist' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedFilter(btn.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === btn.id
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl hover:border-rose-500/50 transition-all flex flex-col justify-between group relative"
            >
              {/* Top Banner Gradient Preview */}
              <div className={`h-48 bg-gradient-to-br ${tpl.gradient} p-6 flex flex-col justify-between relative overflow-hidden`}>
                <div className="flex justify-between items-start">
                  <span className="bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-400/30 uppercase tracking-widest">
                    {tpl.thumbnailBadge}
                  </span>
                  <div className="flex gap-1.5">
                    {tpl.colors.map((c, i) => (
                      <span key={i} className={`w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm ${c}`} />
                    ))}
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white font-serif">{tpl.name}</h3>
                  <span className="text-xs text-slate-300 font-mono opacity-80">{tpl.category} Katman</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{tpl.description}</p>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <Link
                    href={`/olustur?templateId=${tpl.id}`}
                    className="block w-full text-center py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg shadow-rose-500/20"
                  >
                    Bu Şablonla Başla
                  </Link>

                  <Link
                    href={`/demo?templateId=${tpl.id}`}
                    className="block w-full text-center py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Canlı Demo İncele
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* WIZARD MODAL */}
      {wizardOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#12131c] border border-white/10 rounded-3xl max-w-xl w-full p-8 shadow-2xl relative text-left">
            <button onClick={() => setWizardOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Wand2 className="w-4 h-4" /> Akıllı Şablon Sihirbazı (Adım {wizardStep}/3)
            </div>
            <h2 className="text-2xl font-bold text-white mb-6 font-serif">
              {wizardStep === 1 && 'Etkinlik türünüz nedir?'}
              {wizardStep === 2 && 'Aradığınız tasarım tarzı hangisi?'}
              {wizardStep === 3 && 'Sizin İçin Önerilen Şablonlar'}
            </h2>

            {/* STEP 1 */}
            {wizardStep === 1 && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { id: 'wedding', label: '💍 Düğün & Nişan' },
                  { id: 'henna', label: '💃 Kına Gecesi' },
                  { id: 'circumcision', label: '👑 Sünnet Töreni' },
                  { id: 'babyshower', label: '👶 Baby Shower' },
                  { id: 'birthday', label: '🎂 Doğum Günü' },
                  { id: 'corporate', label: '🏛️ Kurumsal' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setWizardAnswers({ ...wizardAnswers, eventType: item.id });
                      setWizardStep(2);
                    }}
                    className="p-4 bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/50 rounded-2xl text-left font-bold text-sm text-white transition-all cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* STEP 2 */}
            {wizardStep === 2 && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { id: 'Lüks', label: '✨ Lüks & Görkemli' },
                  { id: 'Modern', label: '⚡ Modern & Editoryal' },
                  { id: 'Doğal', label: '🌿 Doğal & Botanik' },
                  { id: 'Minimal', label: '📜 Minimalist & Sade' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setWizardAnswers({ ...wizardAnswers, style: item.id });
                      setWizardStep(3);
                    }}
                    className="p-4 bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/50 rounded-2xl text-left font-bold text-sm text-white transition-all cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* STEP 3 (RESULTS) */}
            {wizardStep === 3 && (
              <div className="space-y-4 mb-8">
                {wizardResults.map((result) => (
                  <div key={result.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white font-serif text-lg">{result.name}</h4>
                      <p className="text-xs text-slate-400">{result.category} Katman | {result.thumbnailBadge}</p>
                    </div>
                    <Link
                      href={`/olustur?templateId=${result.id}`}
                      className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md"
                    >
                      Seç ve Başla
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
