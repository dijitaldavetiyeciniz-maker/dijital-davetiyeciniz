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

export default function PerfumeAtelierLayout({
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
  cardBgColor = '#faf8f5',
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

  // Notes alignment (Signature Moment - layers rise inside bottle outline)
  const baseNoteOpacity = prefersReducedMotion ? 0.95 : Math.min(0.95, progress * 1.5);
  const midNoteOpacity = prefersReducedMotion ? 0.95 : Math.min(0.95, Math.max(0, (progress - 0.25) * 1.5));
  const topNoteOpacity = prefersReducedMotion ? 0.95 : Math.min(0.95, Math.max(0, (progress - 0.5) * 1.5));

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-[#faf8f5] text-stone-900 border-t-8 border-stone-850"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-perfume"
    >
      {/* Fragrance Laboratory Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#fbfaf8]" />
        
        {/* Glass Perfume Bottle Silhouette (Signature Moment - notes align on scroll) */}
        <div className="absolute inset-y-12 right-12 w-48 z-5 text-stone-400">
          <svg className="w-full h-full text-stone-300" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="1.2">
            {/* Glass bottle outline */}
            <path d="M 25,60 L 75,60 L 75,180 L 25,180 Z" />
            <path d="M 40,60 L 40,40 L 60,40 L 60,60" />
            <rect x="35" y="30" width="30" height="10" />

            {/* Base Note section (Amber/Wood) */}
            <rect x="27" y="140" width="46" height="38" fill="rgba(180, 83, 9, 0.15)" stroke="none" style={{ opacity: baseNoteOpacity }} />
            {/* Middle Note section (Rose/Jasmine) */}
            <rect x="27" y="100" width="46" height="40" fill="rgba(244, 63, 94, 0.1)" stroke="none" style={{ opacity: midNoteOpacity }} />
            {/* Top Note section (Bergamot/Citrus) */}
            <rect x="27" y="62" width="46" height="38" fill="rgba(234, 179, 8, 0.1)" stroke="none" style={{ opacity: topNoteOpacity }} />
          </svg>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- LABORATORY 1: TITLE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl flex flex-col items-start gap-4">
              <span className="text-[9px] tracking-[0.5em] text-stone-450 uppercase mb-4">[ FRAGRANCE NO. 5 ]</span>
              
              <div className="p-8 bg-[#faf8f5]/90 border border-stone-200 shadow-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-stone-900" style={{ fontFamily: `"${headingFont}", sans-serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-stone-300 my-6" />
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400 font-mono">SCROLL TO DISTILL FRAGRANCE</p>
            </div>
          </div>
        )}

        {/* ----------------- LABORATORY 2: NOTES STATEMENT ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl italic text-stone-750 bg-white p-8 border border-stone-200 shadow-sm">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- LABORATORY 3: CODES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left z-20"}>
            <span className="text-[9px] tracking-[0.4em] text-stone-400 uppercase mb-8">ATELIER DIRECTORY & DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-white border border-stone-200 shadow-sm">
                <Clock className="w-5 h-5 text-stone-450 mb-2" />
                <span className="text-stone-900 text-lg">{dateStr}</span>
                <span className="text-stone-400">{timeStr}</span>
              </div>

              <div id="perfume-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-white border border-stone-200 shadow-sm">
                <MapPin className="w-5 h-5 text-stone-450 mb-2" />
                <span className="text-stone-900 text-lg">{wedding.venue_name || 'Perfume Atelier'}</span>
                {wedding.venue_address && (
                  <span className="text-stone-500 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[9px] text-stone-400 mt-1 font-mono tracking-widest uppercase">Atelier Room D // Glass Row</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-stone-400 bg-white text-stone-900 hover:bg-stone-900 hover:text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXHIBIT COMPASS</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- LABORATORY 4: STILL LIFE ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-stone-450 font-bold uppercase mb-8">LABORATORY SPECIMEN</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] overflow-hidden border-4 border-stone-200 shadow-xl bg-white p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Perfume Atelier" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-110"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 bg-[#faf8f5]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- LABORATORY 5: RSVP GUESTBOOK ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left z-20 overflow-y-auto"}>
            <div id="perfume-rsvp" className="w-full max-w-md pt-10 pb-6 relative z-10 bg-white border border-stone-200 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-stone-400 block mb-4 uppercase font-bold flex items-center gap-2">
                🔒 T-MINUS TO GALA START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90 origin-left">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#1c1917" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-stone-200">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-stone-900 [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-stone-800 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-stone-900">
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
