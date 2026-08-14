'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar as CalIcon, MapPin, Navigation, Compass, Heart, Clock } from 'lucide-react';
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

export default function MoonPalaceLayout({
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

  // Custom Moon Phase calculation for Countdown
  const getMoonPhaseSymbol = () => {
    if (prefersReducedMotion || progress > 0.8) return '🌕'; // Full Moon
    if (progress < 0.2) return '🌑'; // New Moon
    if (progress < 0.4) return '🌒'; // Crescent
    if (progress < 0.6) return '🌓'; // First Quarter
    return '🌔'; // Gibbous
  };

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-slate-950 text-slate-100"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-moon-palace"
    >
      {/* Lunar Palace Silver & Mist Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e293b]" />
        
        {/* Glowing Moon Phase Indicator (Signature Moment) */}
        <div 
          className="absolute top-20 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full transition-all duration-300 flex items-center justify-center"
          style={{
            background: prefersReducedMotion 
              ? 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)'
              : `radial-gradient(circle, rgba(255,255,255,${0.3 + progress * 0.6}) 0%, rgba(255,255,255,0) ${40 + progress * 30}%)`,
            transform: prefersReducedMotion ? 'scale(1)' : `scale(${0.8 + progress * 0.4})`,
          }}
        >
          {/* Inner crescent shadow overlay */}
          {!prefersReducedMotion && (
            <div 
              className="absolute inset-0 bg-slate-950 rounded-full transition-transform duration-100"
              style={{
                transform: `translateX(${progress * 100}%)`,
                opacity: 1 - progress
              }}
            />
          )}
        </div>

        {/* Silver-white palace silhouettes and floating mist */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-slate-950 to-transparent opacity-80 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-slate-950/60 backdrop-blur-xs border-t border-white/5" />
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: LUNAR TITLE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-white/5 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-slate-400 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-2xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-white" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-slate-500/30 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-mono">SCROLL TO WAX THE SILVER MOON</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: STORY POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-white/5 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-slate-200 bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: LUNAR TERRACE DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-white/5 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-slate-400 font-bold uppercase mb-8">LUNAR TERRACE COORDINATES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-md shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-slate-300 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-slate-400">{timeStr}</span>
              </div>

              <div id="lunar-coordinates-plaque" className="flex flex-col gap-2 p-6 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-md shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-slate-300 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Lunar Palace'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-400 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-slate-400 mt-1 font-mono tracking-widest uppercase">Palace Coordinates: 24.5° N, 12.8° E</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-white/20 bg-slate-900/60 text-white hover:bg-white hover:text-slate-950 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>PALACE DIRECTORY</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-white/5 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-slate-400 font-bold uppercase mb-8">SILVER PORTRAIT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-[3.5rem] overflow-hidden border-8 border-slate-900 shadow-2xl bg-slate-950">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Lunar Couple" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-125"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: CONFIRMATION & RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="lunar-palace-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-slate-900/95 border border-white/10 rounded-[3rem] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <span>{getMoonPhaseSymbol()}</span> T-MINUS TO FULL ALIGNMENT
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#e2e8f0" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-white/10">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-white [&>button]:text-slate-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-slate-200 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-full">
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
