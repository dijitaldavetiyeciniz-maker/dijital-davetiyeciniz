import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { HelpCircle, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { FAQ_ITEMS } from '@/data/faqData';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular | Dijital Davetiyeciniz',
  description: 'Dijital davetiye nasıl oluşturulur, LCV katılım bildirimi, müzik ve zarf animasyonları hakkında en çok merak edilen 5+ soru ve yanıtı.',
  alternates: {
    canonical: '/sss',
  },
};

export default function SssPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-200 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-4xl mx-auto w-full flex-grow">
        <Breadcrumbs items={[{ name: 'Sıkça Sorulan Sorular', url: '/sss' }]} />

        {/* Header */}
        <div className="text-center my-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl mb-6 shadow-sm border border-rose-100">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-serif">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-base">
            Dijital davetiye hazırlama, LCV bildirimleri, ödeme ve tasarım düzenleme hakkında merak ettiğiniz tüm yanıtlar.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} open={i === 0} className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-xs hover:shadow-md transition-all">
              <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-slate-800 hover:text-rose-600 transition-colors">
                <span className="flex items-center gap-3 text-base md:text-lg">
                  <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 text-xs flex items-center justify-center font-extrabold shrink-0">
                    0{i + 1}
                  </span>
                  {item.question}
                </span>
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed text-sm md:text-base border-t border-slate-100">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        {/* Bottom CTA Box */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 rounded-3xl p-8 md:p-12 text-white text-center shadow-xl shadow-rose-500/20">
          <Sparkles className="w-10 h-10 mx-auto mb-4 text-white/90 animate-pulse" />
          <h3 className="text-2xl md:text-3xl font-bold font-serif mb-3">
            Hemen Ücretsiz Davetiyenizi Oluşturun
          </h3>
          <p className="text-white/90 text-sm max-w-md mx-auto mb-6">
            Kredi kartı gerekmez. Tasarımınızı 2 dakikada seçip anında canlı önizleyin.
          </p>
          <Link
            href="/olustur"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-extrabold rounded-2xl hover:bg-rose-50 hover:scale-105 transition-all shadow-lg text-sm"
          >
            <span>Davetiye Oluşturmaya Başla</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
