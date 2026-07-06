export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PremiumTemplateRenderer from '@/components/templates/PremiumTemplateRenderer';
import Envelope from '@/components/Envelope';
import BubblesEffect from '@/components/effects/BubblesEffect';
import SparklesEffect from '@/components/effects/SparklesEffect';
import HeartsEffect from '@/components/effects/HeartsEffect';
import SnowEffect from '@/components/effects/SnowEffect';

import BackgroundMusic from '@/components/BackgroundMusic';
import { WeddingClientWrapper } from '@/components/invitation/WeddingClientWrapper';

// Next.js App Router Page
export default async function WeddingPage({
  params,
  searchParams,
}: {
  params: Promise<{ wedding_id: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { wedding_id } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

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

  // PAYWALL (Ödeme Duvarı) Kontrolü (Bypass if in preview mode)
  if (!wedding.is_paid && !isPreview) {
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
  const bgAnim = wedding.background_animation || '';
  const effType = wedding.effect_type || '';

  if (bgAnim === 'rosePetals' || effType === 'hearts') {
    effectComponent = <HeartsEffect color={wedding.primary_color} />;
  } else if (bgAnim === 'goldParticles' || bgAnim === 'stars' || bgAnim === 'leafFall' || effType === 'sparkles') {
    effectComponent = <SparklesEffect />;
  } else if (bgAnim === 'pearlLight' || effType === 'bubbles') {
    effectComponent = <BubblesEffect />;
  } else if (bgAnim === 'snowFall' || effType === 'snow') {
    effectComponent = <SnowEffect />;
  }

  const contentWithMusic = (
    <>
      {effectComponent}
      {templateComponent}
      <BackgroundMusic 
        url={wedding.music_url} 
        isEnvelopeOpened={true} 
        autoplay={wedding.music_autoplay !== false}
        primaryColor={wedding.primary_color}
      />
    </>
  );

  return (
    <WeddingClientWrapper wedding={wedding}>
      {contentWithMusic}
    </WeddingClientWrapper>
  );
}
