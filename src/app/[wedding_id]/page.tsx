export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PremiumTemplateRenderer from '@/components/templates/PremiumTemplateRenderer';
import Envelope from '@/components/Envelope';
import BubblesEffect from '@/components/effects/BubblesEffect';
import SparklesEffect from '@/components/effects/SparklesEffect';
import HeartsEffect from '@/components/effects/HeartsEffect';
import SnowEffect from '@/components/effects/SnowEffect';

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
  const templateComponent = (
    <PremiumTemplateRenderer 
      wedding={wedding} 
      templateId={wedding.template_id || 'template1'} 
    />
  );

  // Zarf kullanımı kontrolü (use_envelope sütunu true ise veya null/undefined ise varsayılan true)
  const useEnvelope = wedding.use_envelope !== false;
  
  let effectComponent = null;
  switch (wedding.effect_type) {
    case 'bubbles': effectComponent = <BubblesEffect />; break;
    case 'sparkles': effectComponent = <SparklesEffect />; break;
    case 'hearts': effectComponent = <HeartsEffect color={wedding.primary_color} />; break;
    case 'snow': effectComponent = <SnowEffect />; break;
  }

  const contentWithEffect = (
    <>
      {effectComponent}
      {templateComponent}
    </>
  );

  return useEnvelope ? (
    <Envelope 
      brideName={wedding.bride_name} 
      groomName={wedding.groom_name} 
      primaryColor={wedding.primary_color}
      envelopeColor={wedding.envelope_color}
      envelopeBgColor={wedding.envelope_bg_color || 'slate'}
      envelopeFlapType={wedding.envelope_flap_type || 'triangle'}
      sealType={wedding.seal_type || 'sparkles'}
      sealColor={wedding.seal_color}
      entranceType={wedding.entrance_type || 'envelope'}
    >
      {contentWithEffect}
    </Envelope>
  ) : (
    contentWithEffect
  );
}
