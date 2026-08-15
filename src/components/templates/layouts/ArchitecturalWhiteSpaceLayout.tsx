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

export default function ArchitecturalWhiteSpaceLayout({
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
  cardBgColor = '#fcfbfa',
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

  // Structural lines grid draw (Signature Moment)
  const lineDrawWidth = prefersReducedMotion ? 100 : progress * 100;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden bg-[#fcfbfa] text-stone-900 border-t border-stone-300 font-sans"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-architectural-white"
    >
      {/* Structural Thin Lines Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#fbfaf8]" />
        
        {/* Fine grey drafting grids (Signature Moment) */}
        <div className="absolute top-1/4 inset-x-12 h-px bg-stone-300/30 transition-all duration-300"
             style={{ width: `${lineDrawWidth}%` }} />
        <div className="absolute bottom-1/4 inset-x-12 h-px bg-stone-300/30 transition-all duration-300"
             style={{ width: `${lineDrawWidth}%` }} />
        <div className="absolute left-1/4 inset-y-12 w-px bg-stone-300/30 transition-all duration-300"
             style={{ height: `${lineDrawWidth}%` }} />
        <div className="absolute right-1/4 inset-y-12 w-px bg-stone-300/30 transition-all duration-300"
             style={{ height: `${lineDrawWidth}%` }} />
      </div>

      {/* Viewport Content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- PHASE 1: FRAME ENTRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl flex flex-col items-start gap-4">
              <span className="text-[9px] tracking-[0.6em] text-stone-400 font-mono uppercase mb-4">{eventTitle}</span>
              
              <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-[0.2em] text-stone-900 leading-tight" style={{ fontFamily: `"${headingFont}", sans-serif` }}>
                {wedding.bride_name} <br/>
                <span className="text-xs opacity-50 font-mono tracking-widest block my-2">{"// AND"}</span>
                {wedding.groom_name}
              </h1>

              <div className="h-px w-12 bg-stone-400/40 my-6" />
              <p className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-mono">SCROLL TO DEFINE SPACE PROPORTIONS</p>
            </div>
          </div>
        )}

        {/* ----------------- PHASE 2: BREATHE ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left z-20"}>
            <div className="text-base sm:text-xl font-light leading-relaxed max-w-lg italic text-stone-700 bg-[#fcfbfa]/80 p-8 border border-stone-200/50">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- PHASE 3: METRIC PLOTS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left z-20"}>
            <span className="text-[9px] tracking-[0.4em] text-stone-400 font-mono uppercase mb-6">ALIGNMENT PLOTS & SPECS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl text-xs font-mono mb-8">
              <div className="flex flex-col gap-2 p-6 bg-[#fcfbfa] border border-stone-200">
                <Clock className="w-4 h-4 text-stone-400 mb-2" />
                <span className="text-stone-900 text-sm font-bold">{dateStr}</span>
                <span className="text-stone-400">{timeStr}</span>
              </div>

              <div id="architect-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-[#fcfbfa] border border-stone-200">
                <MapPin className="w-4 h-4 text-stone-400 mb-2" />
                <span className="text-stone-900 text-sm font-bold">{wedding.venue_name || 'Pavilion Space'}</span>
                {wedding.venue_address && (
                  <span className="text-stone-500 leading-normal">{wedding.venue_address}</span>
                )}
                <span className="text-[8px] text-stone-400 mt-1 font-mono tracking-widest uppercase">Grid 1.4 // Pavilion</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-stone-400 bg-[#fcfbfa] text-stone-900 hover:bg-stone-900 hover:text-[#fcfbfa] font-mono text-[9px] tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXHIBIT COMPASS</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- PHASE 4: PHOTO FRAME ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left z-20"}>
            <span className="text-[9px] tracking-[0.4em] text-stone-400 font-mono uppercase mb-6">SPACE PORTRAIT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] overflow-hidden border border-stone-200 bg-[#fcfbfa] p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Architectural White Space" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-110"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 bg-[#fcfbfa]">
                  <Heart className="w-8 h-8 mb-2 opacity-35" />
                  <span className="text-[8px] tracking-widest uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- PHASE 5: RSVP GUESTBOOK ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left z-20 overflow-y-auto"}>
            <div id="architectural-rsvp" className="w-full max-w-md pt-10 pb-6 relative z-10 bg-[#fcfbfa]/95 border border-stone-200 p-8">
              <span className="text-[9px] font-mono tracking-[0.25em] text-stone-450 block mb-4 uppercase flex items-center gap-2">
                📏 T-MINUS TO DINNER START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90 origin-left">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#1c1917" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-stone-200">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-12 [&>button]:bg-stone-900 [&>button]:text-[#fcfbfa] [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-[9px] [&>button]:font-mono [&>button]:hover:bg-stone-800 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
