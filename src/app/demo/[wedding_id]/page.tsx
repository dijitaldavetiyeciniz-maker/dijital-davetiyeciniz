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

export default async function DemoWeddingPage({
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

  // Demo modunda ödeme duvarını tamamen baypas etmek için is_paid'i true yapıyoruz
  wedding.is_paid = true;

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
