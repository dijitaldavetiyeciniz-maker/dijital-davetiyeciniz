'use client';
import React from 'react';
import { Calendar, MapPin, Navigation, Heart, Camera, Clock } from 'lucide-react';
import { getReadableTextColor, WCAG_MIN_RATIO, checkTemplateContrast } from '@/lib/colorUtils';
import SafeImage from '@/components/ui/SafeImage';

interface LayoutProps {
  selectedBackground?: any;
  wedding: any;
  primaryColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  accentFont: string;
  dateObj: Date;
  dateStr: string;
  timeStr: string;
  eventTitle: string;
  renderTimer: () => React.ReactNode;
  renderRsvpButton: () => React.ReactNode;
  renderGuestBook: () => React.ReactNode;
  renderQuote: () => React.ReactNode;
  handleMapClick: () => void;
  cardBgColor?: string;
  mode?: 'preview' | 'public';
}

export default function PolaroidStoryLayout({
  wedding,
  primaryColor,
  textColor,
  headingFont,
  bodyFont,
  accentFont,
  dateObj,
  dateStr,
  timeStr,
  eventTitle,
  renderTimer,
  renderRsvpButton,
  renderGuestBook,
  renderQuote,
  handleMapClick,
  cardBgColor = '#eae7e0',
  mode = 'public'
, selectedBackground}: LayoutProps) {
  const themeRose = primaryColor || '#e11d48';
  const mainBg = cardBgColor || '#eae7e0';

  const overrides = wedding.custom_overrides || {};
  const timelineItems = overrides.timelineItems || overrides.content?.timelineItems || [
    { title: 'İlk Karşılaşma', date: '2022', description: 'Gözlerimizin ilk kesiştiği an' },
    { title: 'Evlilik Teklifi', date: '2024', description: 'Sonsuz bir evete atılan ilk adım' },
    { title: 'Büyük Gün', date: '2026', description: 'Mutluluğumuzu paylaştığımız özel gün' }
  ];

  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';
  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="min-h-screen w-full relative overflow-x-hidden font-sans text-stone-800 selection:"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", sans-serif`,
        backgroundColor: mainBg,
        backgroundImage: `radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)`,
        backgroundSize: '24px 24px' 
      }}
      data-testid="layout-polaroid-story"
    >
      {/* Container - Stacked on mobile, huge canvas on desktop */}
      <div className="max-w-[1400px] mx-auto w-full min-h-screen relative p-4 sm:p-8 md:min-h-[1100px] lg:min-h-[900px] flex flex-col md:block items-center overflow-hidden">

        {/* MOBILE VIEW: Vertical Flow, DESKTOP VIEW: Absolute Scattered Flow */}

        {/* 1. Hero Polaroid */}
        <div className="relative md:absolute md:top-[8%] md:left-[5%] lg:left-[10%] w-full max-w-[400px] mb-12 md:mb-0 z-20 group transition-transform duration-500 hover:z-50 md:-rotate-3 md:hover:rotate-0">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 backdrop-blur-md border border-white/20 shadow-sm rotate-[2deg] z-30" />
          
          <div className="bg-white p-4 pb-12 rounded shadow-2xl border border-stone-200">
            <div className="w-full aspect-[4/3] rounded bg-stone-900 overflow-hidden relative border border-stone-100">
               {couplePhoto ? (
                  <SafeImage src={couplePhoto} alt="Hero" className="w-full h-full object-cover" isHero />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-stone-400">
                    <Camera className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-xs font-mono tracking-widest uppercase">EN GÜZEL ANILARIMIZ</span>
                  </div>
                )}
            </div>
            
            <div className="mt-6 text-center">
              <h1 className="text-4xl sm:text-5xl font-normal leading-tight tracking-wide mb-2" style={{ color: themeRose, fontFamily: `"${headingFont}", serif` }}>
                {wedding.bride_name} <span className="text-2xl italic text-stone-400 font-serif" style={{ fontFamily: `"${accentFont}", cursive` }}>&</span> {wedding.groom_name}
              </h1>
              <p className="text-base italic text-stone-600 mt-2" style={{ fontFamily: `"${accentFont}", cursive` }}>
                {eventTitle || 'En mutlu günümüzde yanımızda olmanız dileğiyle...'}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Ticket / Date & Venue Card */}
        <div className="relative md:absolute md:top-[12%] md:right-[5%] lg:right-[15%] w-full max-w-[340px] mb-12 md:mb-0 z-10 transition-transform duration-500 hover:z-50 md:rotate-3 md:hover:rotate-1">
          <div className="absolute -top-3 -right-2 w-16 h-6 bg-amber-200/50 -rotate-12 shadow-sm z-30" />
          
          <div className="bg-[#fcfbf9] p-6 rounded shadow-xl border border-stone-300">
            <h3 className="font-mono text-xs tracking-widest text-stone-400 uppercase mb-4 border-b border-stone-200 pb-2">Ayrıntılar</h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 shrink-0 mt-0.5" style={{ color: themeRose }} />
                <div>
                  <p className="font-bold text-lg">{dateStr}</p>
                  <p className="text-sm opacity-70">{timeStr}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: themeRose }} />
                <div>
                  <p className="font-bold text-lg">{wedding.venue_name || 'Mekan Belirtilmedi'}</p>
                  {wedding.venue_address && (
                    <p className="text-sm opacity-70 mt-1">{wedding.venue_address}</p>
                  )}
                </div>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="mt-6 w-full py-3 flex items-center justify-center gap-2 rounded border-2 border-stone-800 text-stone-800 font-bold text-xs tracking-wider uppercase hover:bg-stone-800 hover:text-white transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Haritada Gör
              </button>
            )}
          </div>
        </div>

        {/* 3. Post-it Note (Quote) */}
        <div className="relative md:absolute md:bottom-[20%] md:left-[8%] lg:left-[22%] w-full max-w-[280px] mb-12 md:mb-0 z-20 transition-transform duration-500 hover:z-50 md:-rotate-6 md:hover:-rotate-2">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-400 shadow-sm border border-rose-500/50 z-30 flex items-center justify-center" style={{ backgroundColor: themeRose }}>
            <div className="w-1 h-1 bg-white/50 rounded-full" />
          </div>
          <div className="bg-[#feff9c] p-6 pt-10 rounded-sm shadow-md border border-yellow-200/50 flex flex-col items-center text-center">
            <Heart className="w-6 h-6 mb-3 opacity-20 text-stone-800" />
            <div className="text-xl leading-relaxed italic text-stone-800" style={{ fontFamily: `"${accentFont}", cursive` }}>
              {renderQuote()}
            </div>
            {/* Curled corner effect */}
            <div className="absolute bottom-0 right-0 border-t-[16px] border-t-yellow-300/30 border-r-[16px] border-r-transparent rounded-tl shadow-[-2px_-2px_2px_rgba(0,0,0,0.05)] w-0 h-0" />
          </div>
        </div>

        {/* 4. Photo Strip / Timeline */}
        <div className="relative md:absolute md:top-[55%] md:right-[38%] lg:right-[42%] w-full max-w-[320px] mb-12 md:mb-0 z-10 transition-transform duration-500 hover:z-50 md:-rotate-2 md:hover:rotate-0">
          <div className="absolute -top-3 left-4 w-20 h-6 bg-blue-200/50 rotate-[5deg] shadow-sm z-30" />
          
          <div className="bg-white p-5 rounded shadow-xl border border-stone-200">
            <h3 className="font-mono text-xs tracking-widest text-stone-400 uppercase mb-5">Hikayemiz</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-stone-100">
              {timelineItems.map((item: any, idx: number) => (
                <div key={idx} className="relative flex items-center gap-4">
                  <div className="w-12 h-12 shrink-0 bg-stone-50 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10" style={{ borderColor: mainBg }}>
                    <Heart className="w-4 h-4" style={{ color: themeRose }} />
                  </div>
                  <div className="flex-1 bg-stone-50/50 p-3 rounded border border-stone-100">
                    <h4 className="font-bold text-sm" style={{ color: themeRose }}>{item.title}</h4>
                    <p className="text-xs font-mono text-stone-400 mb-1">{item.date}</p>
                    {item.description && <p className="text-xs text-stone-600 leading-snug">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Action Card (RSVP, Timer, Guestbook) */}
        <div className="relative md:absolute md:bottom-[10%] md:right-[5%] lg:right-[10%] w-full max-w-[380px] z-30 transition-transform duration-500 hover:z-50 md:rotate-2 md:hover:rotate-0">
          <div className="absolute -top-4 right-10 w-24 h-6 bg-rose-200/50 -rotate-[4deg] shadow-sm z-30" />
          
          <div className="bg-white p-6 md:p-8 rounded shadow-2xl border border-stone-200">
            {/* Timer */}
            <div className="mb-8">
              <h3 className="font-mono text-xs tracking-widest text-stone-400 uppercase mb-4 text-center">Geri Sayım</h3>
              <div className="flex justify-center scale-90 sm:scale-100 origin-top">
                {renderTimer()}
              </div>
            </div>

            {/* RSVP */}
            {showRsvp && (
              <div className="mb-8 pt-6 border-t border-stone-100 text-center">
                <h3 className="font-mono text-xs tracking-widest text-stone-400 uppercase mb-4">Lütfen Yanıtlayın</h3>
                {renderRsvpButton()}
              </div>
            )}

            {/* Guestbook */}
            <div className="pt-6 border-t border-stone-100 text-center">
              <h3 className="font-mono text-xs tracking-widest text-stone-400 uppercase mb-4">Anı Defteri</h3>
              {renderGuestBook()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
