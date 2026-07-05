export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PremiumTemplateRenderer from '@/components/templates/PremiumTemplateRenderer';
import Envelope from '@/components/Envelope';
import BubblesEffect from '@/components/effects/BubblesEffect';
import SparklesEffect from '@/components/effects/SparklesEffect';
import HeartsEffect from '@/components/effects/HeartsEffect';
import SnowEffect from '@/components/effects/SnowEffect';
import BackgroundMusic from '@/components/BackgroundMusic';

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
      fontFamily={wedding.font_family || 'Montserrat'}
      musicUrl={wedding.music_url}
      musicAutoplay={wedding.music_autoplay !== false}
    >
      {contentWithEffect}
    </Envelope>
  ) : (
    <>
      {contentWithEffect}
      <BackgroundMusic 
        url={wedding.music_url} 
        isEnvelopeOpened={true} 
        autoplay={wedding.music_autoplay !== false}
        primaryColor={wedding.primary_color}
      />
    </>
  );
}
