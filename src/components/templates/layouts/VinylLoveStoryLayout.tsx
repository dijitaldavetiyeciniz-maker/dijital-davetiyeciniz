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

export default function VinylLoveStoryLayout({
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
  cardBgColor = '#1c1917',
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

  // Vinyl rotation and tonearm needle sweep (Signature Moment)
  const vinylRotation = prefersReducedMotion ? 45 : progress * 360;
  const needleRotation = prefersReducedMotion ? 12 : 5 + progress * 20; // needle moves on groove

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-stone-900 text-stone-150 border-t-8 border-amber-500"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-vinyl-love-story"
    >
      {/* Retro Record Deck Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-end pr-12">
        <div className="absolute inset-0 bg-[#1e1b18]" />
        
        {/* Rotating Vinyl Record SVG (Signature Moment) */}
        <div 
          className="w-64 h-64 rounded-full border-[10px] border-black bg-stone-950 flex items-center justify-center relative shadow-2xl transition-transform duration-100 ease-out"
          style={{
            transform: `rotate(${vinylRotation}deg)`
          }}
        >
          {/* Groove concentric rings */}
          <div className="absolute inset-4 rounded-full border border-stone-900/60" />
          <div className="absolute inset-10 rounded-full border border-stone-900/60" />
          <div className="absolute inset-16 rounded-full border border-stone-900/60" />
          
          {/* Gold Center Label */}
          <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 font-bold text-[8px] text-center border-4 border-stone-950">
            LOVE<br/>STORY
          </div>
        </div>

        {/* Tonearm needle SVG (moves on scroll) */}
        <div 
          className="absolute top-20 right-12 w-24 h-48 origin-top-right transition-transform duration-100 ease-out z-10"
          style={{
            transform: `rotate(${needleRotation}deg)`
          }}
        >
          <svg className="w-full h-full text-stone-400" viewBox="0 0 50 100" fill="currentColor">
            {/* The arm */}
            <path d="M 45,5 L 35,5 L 15,60 L 22,65 Z" />
            {/* The cartridge head */}
            <rect x="12" y="65" width="8" height="12" fill="#000" rx="1" />
            <circle cx="45" cy="5" r="4" fill="#666" />
          </svg>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- TRACK 1: THE WELCOME WAGON ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-850 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-amber-500 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-stone-950 border border-stone-850 shadow-2xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-widest text-slate-100" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-60 block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-amber-500/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-amber-500 font-mono">SCROLL TO SPIN THE DISC</p>
            </div>
          </div>
        )}

        {/* ----------------- TRACK 2: LINER POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-850 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl px-6 italic text-stone-200 bg-stone-950/90 p-8 border border-stone-850 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- TRACK 3: RELEASE COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-850 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-amber-500 font-bold uppercase mb-8">RELEASE SCHEDULE & COORDINATES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-stone-950/95 border border-stone-850 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-amber-500">{timeStr}</span>
              </div>

              <div id="vinyl-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-stone-950/95 border border-stone-850 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Turntable Club'}</span>
                {wedding.venue_address && (
                  <span className="text-stone-400 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[9px] text-amber-500 mt-1 font-mono tracking-widest uppercase">TRACK 3 // SIDE A</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-amber-500/30 bg-stone-950/60 text-white hover:bg-amber-500 hover:text-slate-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>ALBUM DIRECTORY</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- TRACK 4: RECORD ALBUM COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-850 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-amber-500 font-bold uppercase mb-8">VINYL COVER SLEEVE</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-stone-800 shadow-2xl bg-stone-950 p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Vinyl Love Story" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-125"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-amber-500 bg-stone-900">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- TRACK 5: RSVP GUESTBOOK ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="vinyl-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-stone-950/95 border border-stone-850 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🎵 T-MINUS TO SLEEVE PLAYBACK
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#fbbf24" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-stone-850">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-amber-500 [&>button]:text-slate-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
