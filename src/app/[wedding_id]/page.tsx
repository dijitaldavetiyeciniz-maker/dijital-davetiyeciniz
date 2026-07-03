import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Template1 from '@/components/templates/Template1';
import Template2 from '@/components/templates/Template2';
import Template3 from '@/components/templates/Template3';
import Template4 from '@/components/templates/Template4';
import Template5 from '@/components/templates/Template5';

// Next.js App Router Page
export default async function WeddingPage({
  params,
}: {
  params: Promise<{ wedding_id: string }>;
}) {
  const { wedding_id } = await params;

  // Supabase'den veriyi çekiyoruz
  const { data: wedding, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', wedding_id)
    .single();

  // Eğer url yanlışsa veya böyle bir düğün yoksa 404 sayfası göster
  if (error || !wedding) {
    notFound();
  }

  // PAYWALL (Ödeme Duvarı) Kontrolü
  if (!wedding.is_paid) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Bu Davetiye Henüz Yayında Değil</h1>
        <p className="text-slate-500 max-w-md mb-8">
          Bu davetiye sayfası tasarım aşamasındadır veya ödeme onayı beklemektedir. Lütfen davetiye sahibi ile iletişime geçin.
        </p>
        <p className="text-xs text-slate-400">Dijital Davetiyeciniz &copy; 2026</p>
      </div>
    );
  }

  // Veritabanından gelen template_id değerine göre uygun şablonu render et.
  switch (wedding.template_id) {
    case 'template1':
      return <Template1 wedding={wedding} />;
    case 'template2':
      return <Template2 wedding={wedding} />;
    case 'template3':
      return <Template3 wedding={wedding} />;
    case 'template4':
      return <Template4 wedding={wedding} />;
    case 'template5':
      return <Template5 wedding={wedding} />;
    default:
      return <Template1 wedding={wedding} />;
  }
}
