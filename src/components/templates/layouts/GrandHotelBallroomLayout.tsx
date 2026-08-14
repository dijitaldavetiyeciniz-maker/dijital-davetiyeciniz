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

export default function GrandHotelBallroomLayout({
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

  // Chandelier drop progress (Signature Moment)
  const chandelierY = prefersReducedMotion ? 40 : 10 + progress * 30; // descends from y=10 to y=40
  const floorGlow = prefersReducedMotion ? 0.9 : Math.min(0.9, progress * 1.5);

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-stone-950 text-amber-100 border-t-8 border-amber-500"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-ballroom"
    >
      {/* Grand Ballroom Bezel Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#120f0e]" />
        
        {/* Repeating luxury wallpaper grid */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: 'linear-gradient(rgba(245,158,11,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.1) 1px, transparent 1px)',
               backgroundSize: '30px 30px'
             }} 
        />

        {/* Crystal Chandelier outline (Signature Moment - descends on scroll) */}
        <div className="absolute inset-0 flex justify-center z-5">
          <svg className="w-80 h-full text-amber-500/25" viewBox="0 0 100 100">
            {/* Chandelier hanging rod & body */}
            <line x1="50" y1="0" x2="50" y2={chandelierY} stroke="currentColor" strokeWidth="1.2" />
            <path 
              d={`M 35,${chandelierY} Q 50,${chandelierY + 12} 65,${chandelierY} M 40,${chandelierY + 5} Q 50,${chandelierY + 15} 60,${chandelierY + 5}`} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2" 
            />
            {/* Light nodes */}
            <circle cx="35" cy={chandelierY} r="1.5" fill="currentColor" />
            <circle cx="50" cy={chandelierY + 10} r="1.5" fill="currentColor" />
            <circle cx="65" cy={chandelierY} r="1.5" fill="currentColor" />
            
            {/* Floor reflection radial glow */}
            <ellipse 
              cx="50" 
              cy="90" 
              rx="30" 
              ry="8" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.8" 
              strokeDasharray="2 2"
              style={{
                opacity: floorGlow
              }}
            />
          </svg>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: BALLROOM ENTRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-900/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-amber-400 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-stone-900/90 border border-amber-500 shadow-2xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-slate-100" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-amber-500/40 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-amber-400 font-mono">SCROLL TO LOWER CHANDELIER</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: BALLROOM PROLOGUE ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-900/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl px-6 italic text-slate-200 bg-stone-900/80 p-8 border border-amber-500/20 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-900/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-amber-400 font-bold uppercase mb-8">BALLROOM DIRECTORY & DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-stone-900/90 border border-amber-500/20 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-amber-450 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-amber-450">{timeStr}</span>
              </div>

              <div id="ballroom-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-stone-900/90 border border-amber-500/20 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-amber-450 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Grand Ballroom'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-400 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[9px] text-amber-500 mt-1 font-mono tracking-widest uppercase">HALL A // GRAND STAIRCASE</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-amber-500 bg-stone-900/60 text-white hover:bg-amber-500 hover:text-stone-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXHIBIT COMPASS</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-900/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-amber-400 font-bold uppercase mb-8">PORTRAIT FRAME</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-amber-500 shadow-2xl bg-stone-900 p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Grand Hotel Ballroom" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-125"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-amber-500 bg-stone-950">
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
            <div id="ballroom-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-stone-900/95 border-2 border-amber-500 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-350 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🏛️ T-MINUS TO RECEPTION START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#f59e0b" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-amber-500/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-amber-500 [&>button]:text-stone-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
