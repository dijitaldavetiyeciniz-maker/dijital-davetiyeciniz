'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Compass, Heart, Clock } from 'lucide-react';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import CountdownTimer from '../../CountdownTimer';
import SafeImage from '@/components/ui/SafeImage';

interface LayoutProps {
  cardSurfaceStyle?: React.CSSProperties;
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

export default function TypographicMonumentLayout({
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
  cardBgColor = '#fafaf9',
  selectedBackground,
  cardSurfaceStyle
}: LayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress } = useSceneProgress(containerRef, 5);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';
  const showRsvp = wedding.show_rsvp !== false;
  const hasMaps = !!wedding.google_maps_url;

  // Typographic shift (Signature Moment)
  const nameOffsetLeft = prefersReducedMotion ? 0 : 80 - progress * 80; // slides in from left
  const nameOffsetRight = prefersReducedMotion ? 0 : -80 + progress * 80; // slides in from right
  const textScale = prefersReducedMotion ? 1.0 : 1.2 - progress * 0.2;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden bg-[#fafaf9] text-stone-900 border-t-8 border-stone-800 font-sans"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-typographic-monument"
    >
      {/* Giant Monument Initials (Signature Moment - shifts and scales on scroll) */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#f5f5f4]" />
        
        {/* Giant Left Initials */}
        <div 
          className="absolute text-[24vw] font-black uppercase text-stone-200/50 leading-none select-none transition-transform duration-100 ease-out"
          style={{
            transform: `translateX(-${nameOffsetLeft}px) scale(${textScale})`,
            fontFamily: `"${headingFont}", serif`,
            left: '2vw'
          }}
        >
          {wedding.bride_name?.[0] || 'M'}
        </div>

        {/* Giant Right Initials */}
        <div 
          className="absolute text-[24vw] font-black uppercase text-stone-200/50 leading-none select-none transition-transform duration-100 ease-out"
          style={{
            transform: `translateX(${nameOffsetRight}px) scale(${textScale})`,
            fontFamily: `"${headingFont}", serif`,
            right: '2vw'
          }}
        >
          {wedding.groom_name?.[0] || 'C'}
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SEC 1: SHIFTING NAMES ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.5em] text-stone-400 font-bold uppercase mb-8">{eventTitle}</span>
              
              <div className="p-10 bg-[#fafaf9]/90 border border-stone-200/60 shadow-xl">
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-stone-900 leading-tight" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-xl opacity-30 font-light block my-4">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-stone-300 my-8" />
              <p className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-mono">SCROLL TO LOCK TYPOGRAPHY</p>
            </div>
          </div>
        )}

        {/* ----------------- SEC 2: POEM ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl px-6 italic text-stone-700 bg-[#fafaf9]/90 p-8 border border-stone-200">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SEC 3: METRIC PLOTS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-stone-450 font-bold uppercase mb-8">MONUMENT SPECIFICATIONS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-[#fafaf9] border border-stone-200 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-stone-450 mb-2" />
                <span className="text-stone-900 text-lg">{dateStr}</span>
                <span className="text-stone-450">{timeStr}</span>
              </div>

              <div id="monument-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-[#fafaf9] border border-stone-200 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-stone-450 mb-2" />
                <span className="text-stone-900 text-lg">{wedding.venue_name || 'Pavilion Hall'}</span>
                {wedding.venue_address && (
                  <span className="text-stone-500 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[9px] text-stone-450 mt-1 font-mono tracking-widest uppercase">HALL A // SECTION 1</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-stone-850 bg-[#fafaf9] text-stone-900 hover:bg-stone-900 hover:text-[#fafaf9] font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXHIBIT TARGET</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SEC 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-stone-450 font-bold uppercase mb-8">PORTRAIT IMAGE</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border border-stone-200 shadow-xl bg-[#fafaf9] p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Typographic Monument" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-110"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 bg-[#fafaf9]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SEC 5: RSVP GUESTBOOK ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="monument-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-[#fafaf9]/95 border border-stone-200 p-6 shadow-xl">
              <span className="text-[10px] font-mono tracking-[0.25em] text-stone-450 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🔒 T-MINUS TO DINNER START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#1c1917" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-stone-200">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-stone-900 [&>button]:text-[#fafaf9] [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-stone-800 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-stone-900 font-sans">
                  {renderGuestBook()}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
