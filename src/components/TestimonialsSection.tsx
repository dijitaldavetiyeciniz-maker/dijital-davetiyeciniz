import { Star, Quote, CheckCircle } from 'lucide-react';

export const TESTIMONIALS = [
  {
    name: 'Zeynep & Mert',
    event: 'Düğün Davetiyesi',
    location: 'İstanbul',
    rating: 5,
    date: '2026-05-14',
    comment: 'Matbaaya gitmekle hiç uğraşmadık. 10 dakikada zarf animasyonlu ve müzikli harika bir davetiye oluşturduk. Tüm misafirlerimiz WhatsApp üzerinden gelen linke bayıldı, LCV takibi hayatımızı kurtardı!'
  },
  {
    name: 'Elif & Kerem',
    event: 'Nişan Töreni',
    location: 'İzmir',
    rating: 5,
    date: '2026-06-02',
    comment: 'Yol tarifi ve konum butonu sayesinde hiçbir misafirimiz mekanı aramak zorunda kalmadı. Canlı anı defteri özelliğiyle toplanan tebrik mesajları ise bizim için harika bir hatıra oldu.'
  },
  {
    name: 'Gizem & Caner',
    event: 'Kına & Düğün',
    location: 'Ankara',
    rating: 5,
    date: '2026-04-20',
    comment: 'Kına için kadife bordo, düğün için mermer altın temayı seçtik. Tasarım paneli o kadar kolay ki her detayı istediğimiz gibi özelleştirdik. Kesinlikle herkese tavsiye ediyoruz.'
  }
];

export default function TestimonialsSection() {
  const ratingSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Dijital Davetiyeciniz - Online Davetiye ve LCV Platformu',
    description: 'Müzikli, zarf animasyonlu, LCV ve oturma planlı premium dijital davetiye platformu.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1280',
      bestRating: '5',
      worstRating: '1'
    },
    review: TESTIMONIALS.map(t => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: t.name
      },
      datePublished: t.date,
      reviewBody: t.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating.toString(),
        bestRating: '5'
      }
    }))
  };

  return (
    <section className="py-20 px-6 bg-white relative overflow-hidden" id="yorumlar">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ratingSchema) }}
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold mb-4">
            <Star className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Mutlu Çiftlerimiz & Müşteri Deneyimleri</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-serif mb-4">
            Bizi Tercih Edenlerin Yorumları
          </h2>
          <p className="text-slate-500 text-base max-w-2xl mx-auto">
            10.000+ mutlu çiftin ve organizasyon sahibinin en özel günlerini dijital davetiye ile nasıl taçlandırdıklarına göz atın.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-rose-200" />
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6 font-medium italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {t.name}
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 inline" aria-label="Doğrulanmış Kullanıcı" />
                  </h4>
                  <p className="text-xs text-slate-500">{t.event} • {t.location}</p>
                </div>
                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                  5.0 ★
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
