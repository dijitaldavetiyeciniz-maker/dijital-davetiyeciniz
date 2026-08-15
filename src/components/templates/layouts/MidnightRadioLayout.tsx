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

export default function MidnightRadioLayout({
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
  cardBgColor = '#0b0f19',
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

  // Tuning dial offset progress (Signature Moment)
  const dialOffset = prefersReducedMotion ? 60 : 15 + progress * 60; // moves slider red line from 15% to 75%
  const signalGlow = prefersReducedMotion || (progress > 0.65 && progress < 0.85);

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-[#090d16] text-[#e2e8f0] border-t-8 border-rose-600"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-midnight-radio"
    >
      {/* Studio Radio Deck Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex flex-col justify-end pb-24 items-center">
        {/* On Air glowing sign */}
        <div className="absolute top-12 flex items-center justify-center">
          <div className={`px-4 py-1.5 border border-rose-600 rounded text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${signalGlow ? 'bg-rose-950 text-rose-500 shadow-[0_0_12px_rgba(220,38,38,0.5)]' : 'text-slate-700 border-slate-800'}`}>
            ON AIR // BROADCAST
          </div>
        </div>

        {/* Analog Tuner Dial (Signature Moment) */}
        <div className="w-[85%] max-w-xl h-20 bg-slate-950 border-2 border-slate-800 relative flex items-center shadow-2xl">
          {/* Frequencies text */}
          <div className="absolute inset-x-4 top-2 flex justify-between text-[9px] text-slate-500">
            <span>88 MHz</span>
            <span>94 MHz</span>
            <span>100 MHz</span>
            <span>106 MHz</span>
            <span>108 MHz</span>
          </div>

          {/* Dotted scale lines */}
          <div className="absolute inset-x-4 bottom-4 h-4 bg-repeat-x opacity-40"
               style={{
                 backgroundImage: 'linear-gradient(90deg, #475569 2px, transparent 2px)',
                 backgroundSize: '12px 100%'
               }} 
          />

          {/* Tuning needle slider (moves on scroll) */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] z-10 transition-all duration-100"
            style={{
              left: `${dialOffset}%`
            }}
          />
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SESSION 1: TUNING IN ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-slate-900 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-rose-500 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-slate-950/80 border border-slate-850 shadow-2xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-slate-100" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-rose-900/40 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-rose-500 font-mono">SCROLL TO TUNE IN THE STATION</p>
            </div>
          </div>
        )}

        {/* ----------------- SESSION 2: ANNOUNCEMENT TRANSCRIPT ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-slate-900 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl px-6 italic text-slate-200 bg-slate-950/70 p-8 border border-slate-850 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SESSION 3: COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-slate-900 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-rose-500 font-bold uppercase mb-8">BROADCAST SCHEDULE & STATION HARBOR</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 bg-slate-950/80 border border-slate-850 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-rose-500 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-rose-500">{timeStr}</span>
              </div>

              <div id="radio-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-slate-950/80 border border-slate-850 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-rose-500 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Broadcasting Studio'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-400 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[9px] text-rose-500 mt-1 font-mono tracking-widest uppercase">TUNED TO: 104.2 FM STUDIO</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-rose-500/30 bg-slate-950/60 text-white hover:bg-rose-500 hover:text-slate-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>STUDIO COMPASS</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SESSION 4: ALBUM COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-slate-900 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-rose-500 font-bold uppercase mb-8">ALBUM COVER ART</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-slate-800 shadow-2xl bg-slate-950 p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Midnight Radio" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-125"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-rose-500 bg-[#0b0f19]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SESSION 5: LISTENERS CONFIRMATION ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="radio-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-slate-950/95 border border-slate-800 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-rose-450 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                📻 T-MINUS TO STATION BROADCAST
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#f43f5e" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-slate-800">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#dc2626] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-red-800 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-slate-100">
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
