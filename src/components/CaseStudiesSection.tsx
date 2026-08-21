import Link from 'next/link';
import { Sparkles, Eye, ArrowRight, Heart, Calendar, MapPin } from 'lucide-react';

export const CASE_STUDIES = [
  {
    title: 'Zeynep & Mert Düğün Daveti',
    slug: 'zeynep-mert',
    theme: 'Gilded Marble (Altın Varak & Mermer)',
    type: 'Düğün',
    date: '18 Eylül 2026',
    venue: 'Çırağan Sarayı Kempinski, İstanbul',
    color: 'from-amber-500/20 to-rose-500/20',
    tag: 'Öne Çıkan Düğün'
  },
  {
    title: 'Elif & Kerem Nişan Töreni',
    slug: 'elif-kerem',
    theme: 'Botanical Line Art & Rose Gold',
    type: 'Nişan',
    date: '24 Ekim 2026',
    venue: 'Kordon Otel, İzmir',
    color: 'from-rose-500/20 to-pink-500/20',
    tag: 'Popüler Nişan'
  },
  {
    title: 'Teknoloji & İnovasyon Zirvesi 2026',
    slug: 'demo',
    theme: 'Modern Tech & Neon Dark',
    type: 'Kurumsal Etkinlik',
    date: '12 Kasım 2026',
    venue: 'Kongre ve Sergi Sarayı, İstanbul',
    color: 'from-cyan-500/20 to-indigo-500/20',
    tag: 'Kurumsal Vaka'
  }
];

export default function CaseStudiesSection() {
  return (
    <section className="py-20 px-6 bg-slate-900 text-white relative overflow-hidden" id="vaka-calismalari">
      {/* Background Lights */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-rose-400 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gerçek Örnekler & Başarı Hikayeleri</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold font-serif">
              Canlı Davetiye Örnekleri
            </h2>
          </div>
          <Link
            href="/sablonlar"
            className="inline-flex items-center gap-2 text-sm font-bold text-rose-400 hover:text-rose-300 transition-colors"
          >
            Tüm 120+ Şablonu İncele <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {CASE_STUDIES.map((study, idx) => (
            <div
              key={idx}
              className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:border-rose-500/40 backdrop-blur-xl transition-all hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className={`h-44 rounded-2xl bg-gradient-to-br ${study.color} p-6 flex flex-col justify-between mb-6 border border-white/10 relative overflow-hidden`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white">
                      {study.tag}
                    </span>
                    <Heart className="w-5 h-5 text-rose-400 fill-rose-400/30" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-300 font-semibold">{study.type}</span>
                    <h4 className="text-lg font-bold text-white font-serif">{study.title}</h4>
                  </div>
                </div>

                <div className="space-y-2 mb-6 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span>{study.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span className="truncate">{study.venue}</span>
                  </div>
                  <div className="pt-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Tasarım:</span> {study.theme}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href={`/${study.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-rose-500 px-4 py-2 rounded-xl transition-all group-hover:bg-rose-500"
                >
                  <Eye className="w-3.5 h-3.5" /> Canlı İncele
                </Link>
                <Link
                  href="/olustur"
                  className="text-xs font-bold text-rose-400 hover:text-white transition-colors"
                >
                  Benzerini Oluştur →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
