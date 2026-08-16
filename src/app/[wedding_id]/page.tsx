export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ wedding_id: string }>;
}): Promise<Metadata> {
  const { wedding_id } = await params;
  
  const { data: wedding } = await supabase
    .from('weddings')
    .select('bride_name, groom_name, venue_name, event_type, updated_at')
    .eq('slug', wedding_id)
    .single();

  if (!wedding) return {};

  const title = `${wedding.bride_name} & ${wedding.groom_name} Davetiyesi`;
  const description = `${wedding.venue_name} salonundaki ${wedding.event_type === 'wedding' ? 'düğün' : 'etkinlik'} davetiyemize bekliyoruz.`;
  const cacheBust = wedding.updated_at ? new Date(wedding.updated_at).getTime() : Date.now();
  const ogImageUrl = `/api/og?wedding_id=${wedding_id}&v=${cacheBust}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
import PremiumTemplateRenderer from '@/components/templates/PremiumTemplateRenderer';
import Envelope from '@/components/Envelope';
import BubblesEffect from '@/components/effects/BubblesEffect';
import SparklesEffect from '@/components/effects/SparklesEffect';
import HeartsEffect from '@/components/effects/HeartsEffect';
import SnowEffect from '@/components/effects/SnowEffect';

import BackgroundMusic from '@/components/BackgroundMusic';
import WeddingClientWrapper from '@/components/invitation/WeddingClientWrapper';
import EventsTimeline from '@/components/invitation/EventsTimeline';
import { sanitizePublicWedding } from '@/lib/sanitizeWedding';
import { predefinedThemes } from '@/lib/themes';
import { resolveGuestToken } from '@/server/guestTokens';

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
    .select('*, invitation_events(*)')
    .eq('slug', wedding_id)
    .single();

  // Eğer url yanlışsa veya böyle bir düğün yoksa 404 sayfası göster
  if (error || !wedding) {
    notFound();
  }

  let guestContext = null;
  let guestErrorMsg = null;
  let guestSeating: any[] = [];
  
  if (sParams.guest) {
    guestContext = await resolveGuestToken(sParams.guest, wedding.slug);
    if (!guestContext) {
      guestErrorMsg = "Kişisel davet bağlantısı doğrulanamadı. Genel davetiyeyi görüntülüyorsunuz.";
    } else {
      // Fetch seating securely via service role since public select is not allowed on assignments
      const { createServerServiceRoleClient } = await import('@/server/supabaseClient');
      const sClient = createServerServiceRoleClient();
      const { data: seats } = await sClient
        .from('guest_seat_assignments')
        .select('event_id, seating_tables(name)')
        .eq('guest_id', (guestContext as any).id);
      
      if (seats) guestSeating = seats;
    }
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
    
    if (!wedding.invitation_events || wedding.invitation_events.length === 0) {
      wedding.invitation_events = [
        {
          id: 'mock-event-1',
          wedding_id: wedding.id,
          type: 'nikah',
          title: 'Kıyım Töreni',
          start_time: '2027-09-20T18:00:00.000Z',
          timezone: 'Europe/Istanbul',
          venue_name: 'Yalı Rıhtımı',
          venue_address: 'Yalı Sokak No 12, Tarabya',
          is_primary: true
        },
        {
          id: 'mock-event-2',
          wedding_id: wedding.id,
          type: 'cocktail',
          title: 'Kokteyl ve Resepsiyon',
          start_time: '2027-09-20T19:30:00.000Z',
          timezone: 'Europe/Istanbul',
          venue_name: 'Yalı Bahçesi',
          venue_address: 'Yalı Sokak No 12, Tarabya',
          is_primary: false
        }
      ];
    }
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

  console.log("DEBUG EVENT INJECTION: slug =", wedding.slug, "events =", JSON.stringify(wedding.invitation_events));
  const cleanWedding = sanitizePublicWedding(wedding);

  // Veritabanından gelen template_id değerine göre uygun şablonu render et.
  const templateComponent = (
    <PremiumTemplateRenderer 
      wedding={cleanWedding} 
      templateId={cleanWedding.template_id || 'template1'} 
    />
  );

  // Zarf kullanımı kontrolü (use_envelope sütunu true ise veya null/undefined ise varsayılan true)
  const useEnvelope = cleanWedding.use_envelope !== false;
  
  let effectComponent = null;
  const customBgId = cleanWedding?.custom_overrides?.design?.backgroundDesign;
  let bgAnim = cleanWedding.background_animation || '';
  let effType = cleanWedding.effect_type || '';
  
  if (customBgId) {
     const allBgs = predefinedThemes.flatMap((t: any) => t.backgroundOptions || []);
     const bg = allBgs.find((b: any) => b.id === customBgId);
     
     if (bg?.ornamentSet) {
        bgAnim = bg.ornamentSet;
        effType = ''; // override effect if ornamentSet is provided
     } else if (bg) {
        bgAnim = ''; // disable default if bg is selected but has no ornamentSet
        effType = '';
     }
  }

  if (bgAnim === 'rosePetals' || effType === 'hearts') {
    effectComponent = <HeartsEffect color={cleanWedding.primary_color} />;
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
      <div className="relative z-10 flex flex-col items-center">
        {templateComponent}
        {cleanWedding.invitation_events && cleanWedding.invitation_events.length > 0 && (
          <EventsTimeline 
            events={cleanWedding.invitation_events} 
            primaryColor={cleanWedding.primary_color}
            textColor={cleanWedding.text_color}
          />
        )}
      </div>
      <BackgroundMusic 
        url={cleanWedding.music_url} 
        isEnvelopeOpened={true} 
        autoplay={cleanWedding.music_autoplay !== false}
        primaryColor={cleanWedding.primary_color}
      />
    </>
  );

  const greeting = guestContext ? `Sayın ${guestContext.displayName}, davetimize hoş geldiniz.` : null;

  return (
    <WeddingClientWrapper wedding={cleanWedding}>
      {guestErrorMsg && (
        <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center py-2 z-[9999] text-sm">
          {guestErrorMsg}
        </div>
      )}
      {greeting && (
        <div className="fixed top-0 left-0 w-full bg-slate-900/80 backdrop-blur text-white text-center py-2 z-[9999] text-sm flex flex-col items-center">
          <span>{greeting}</span>
          {guestSeating.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-2 justify-center">
              {guestSeating.map((seat: any, i: number) => {
                const event = wedding.invitation_events?.find((e: any) => e.id === seat.event_id);
                return (
                  <span key={i} className="bg-rose-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
                    {event ? event.title : 'Masa'}: {seat.seating_tables?.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
      {contentWithMusic}
    </WeddingClientWrapper>
  );
}
