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
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { wedding_id } = await params;
  const sParams = await searchParams;
  const isPreview = sParams.preview === 'true';

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

  // Değişiklikleri kaydetmeden canlı önizleme yapabilmek için URL query parametrelerini ez
  if (isPreview) {
    if (sParams.template_id) wedding.template_id = sParams.template_id;
    if (sParams.primary_color) wedding.primary_color = sParams.primary_color;
    if (sParams.text_color) wedding.text_color = sParams.text_color;
    if (sParams.is_dark_mode) wedding.is_dark_mode = sParams.is_dark_mode === 'true';
    if (sParams.entrance_animation) wedding.entrance_animation = sParams.entrance_animation;
    if (sParams.background_animation) wedding.background_animation = sParams.background_animation;
    if (sParams.background_design) wedding.background_design = sParams.background_design;
    if (sParams.envelope_color) wedding.envelope_color = sParams.envelope_color;
    if (sParams.envelope_bg_color) wedding.envelope_bg_color = sParams.envelope_bg_color;
    if (sParams.envelope_style) wedding.envelope_style = sParams.envelope_style;
    if (sParams.seal_style) wedding.seal_style = sParams.seal_style;
    if (sParams.seal_color) wedding.seal_color = sParams.seal_color;
    if (sParams.seal_type) wedding.seal_type = sParams.seal_type;
    if (sParams.use_envelope) wedding.use_envelope = sParams.use_envelope === 'true';
    if (sParams.show_photos) wedding.show_photos = sParams.show_photos === 'true';
    if (sParams.show_rsvp) wedding.show_rsvp = sParams.show_rsvp === 'true';
    if (sParams.show_comments) wedding.show_comments = sParams.show_comments === 'true';
    if (sParams.show_countdown) wedding.show_countdown = sParams.show_countdown === 'true';
    if (sParams.envelope_flap_type) wedding.envelope_flap_type = sParams.envelope_flap_type;
    if (sParams.effect_type) wedding.effect_type = sParams.effect_type;
    if (sParams.font_family) wedding.font_family = sParams.font_family;
    if (sParams.names_font_family) wedding.names_font_family = sParams.names_font_family;
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
