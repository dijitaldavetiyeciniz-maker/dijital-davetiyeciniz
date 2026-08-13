'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Film, Clock, UserCheck, Heart } from 'lucide-react';
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

export default function BlackTieCinemaLayout({
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
  cardBgColor = '#050505',
  selectedBackground,
  cardSurfaceStyle
}: LayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, activeScene } = useSceneProgress(containerRef, 5);
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

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-black text-white"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-cinematic-black-tie"
    >
      {/* Light film grain overlay for cinema feel */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000')] bg-repeat" />

      {/* Sticky layout container */}
      <div className={prefersReducedMotion ? 'relative w-full' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>
        
        {/* Projector / Spotlight dynamic sweep beam */}
        {!prefersReducedMotion && (
          <div 
            className="absolute inset-0 pointer-events-none z-10 mix-blend-screen opacity-20"
            style={{
              background: `radial-gradient(circle at ${30 + progress * 40}% ${40 + progress * 20}%, rgba(255, 240, 200, 0.45) 0%, transparent 45%)`,
            }}
          />
        )}

        {/* ----------------- SCENE 1: TITLE CARD (NOIR INTRO) ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20">
            <span className="text-[9px] tracking-[0.4em] text-red-500 font-bold uppercase mb-6 flex items-center gap-2">
              <Film className="w-3.5 h-3.5 animate-pulse" /> A METRO-GOLDWYN NUPTIAL
            </span>
            
            <div 
              className="text-4xl sm:text-7xl font-black uppercase tracking-tight leading-none text-neutral-100"
              style={{
                fontFamily: `"${headingFont}", sans-serif`,
                transform: prefersReducedMotion ? 'scale(1)' : `scale(${1 + progress * 0.25})`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              {wedding.bride_name} <br />
              <span className="text-sm font-bold tracking-[0.6em] text-red-500 block my-4 shrink-0">FEATURING</span>
              {wedding.groom_name}
            </div>

            <div className="h-[2px] w-24 bg-red-600/30 my-8" />
            <p className="text-[10px] tracking-[0.3em] text-neutral-400">SCROLL TO ADVANCE PREMIERE</p>
          </div>
        )}

        {/* ----------------- SCENE 2: MOVIE QUOTE CARD ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20">
            <div className="text-xl sm:text-3xl italic text-neutral-300 font-serif leading-relaxed max-w-xl border-l border-red-500/40 pl-6">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: PREMIERE CAST / PROGRAM ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20">
            <span className="text-[10px] tracking-[0.35em] text-red-500 font-bold uppercase mb-8">PRODUCTION DETAILS</span>
            
            {/* Cast & Crew Board list representation */}
            <div className="flex flex-col gap-6 text-left w-full max-w-md font-mono border border-neutral-800 p-8 bg-neutral-950/60 rounded-lg">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500 uppercase">PRODUCERS</span>
                <span className="text-white text-right">{wedding.bride_parents || 'FAMILY'} & {wedding.groom_parents || 'FAMILY'}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500 uppercase">SCREENPLAY</span>
                <span className="text-white text-right">{dateStr}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-500 uppercase">SHOWTIME</span>
                <span className="text-white text-right">{timeStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 uppercase">LOCATION</span>
                <span className="text-white text-right truncate max-w-[200px]">{wedding.venue_name || 'Cinema Hall'}</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="mt-8 px-6 h-12 border border-red-600/40 bg-red-950/20 text-red-200 hover:bg-red-600 hover:text-white rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>SALON DIRECTIONS</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: HORIZONTAL FILM STRIP GALLERY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20">
            <span className="text-[10px] tracking-[0.3em] text-red-500 font-bold uppercase mb-8">FILM REEL FOOTAGE</span>
            
            {/* Horizontal Film Strip */}
            <div className="relative w-full max-w-lg aspect-[16/9] mx-auto bg-neutral-900 border-y-8 border-dashed border-neutral-800 flex items-center justify-center overflow-hidden">
              <div 
                className="w-full h-full relative"
                style={{
                  transform: prefersReducedMotion ? 'translateX(0)' : `translateX(${(progress - 0.65) * -100}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                {couplePhoto ? (
                  <SafeImage 
                    src={couplePhoto} 
                    alt="Premiere Couple" 
                    className="w-full h-full object-cover grayscale opacity-80"
                    isHero={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 bg-neutral-950">
                    <Film className="w-12 h-12 mb-2 opacity-35" />
                    <span className="text-[9px] uppercase tracking-widest opacity-50">LOCKED CELLULOID</span>
                  </div>
                )}
              </div>
              
              {/* Overlay side ticket notches */}
              <div className="absolute top-0 bottom-0 left-0 w-6 bg-black border-r border-dashed border-neutral-700/30" />
              <div className="absolute top-0 bottom-0 right-0 w-6 bg-black border-l border-dashed border-neutral-700/30" />
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: RESERVED ACTION ADMISSION ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto">
            <div className="w-full max-w-md mx-auto pt-10 pb-6 bg-neutral-950 border border-neutral-800 rounded-lg p-6 shadow-2xl relative">
              
              {/* Ticket Admit One Cutouts */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-black border-r border-neutral-800" />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-black border-l border-neutral-800" />

              <span className="text-[10px] font-mono tracking-[0.25em] text-red-500 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" /> ADMIT ONE GUEST
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#ef4444" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-neutral-800">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-red-600 [&>button]:text-white [&>button]:uppercase [&>button]:tracking-[0.2em] [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-red-500 [&>button]:transition-all [&>button]:duration-300 [&>button]:border [&>button]:border-red-400/40 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full">
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
