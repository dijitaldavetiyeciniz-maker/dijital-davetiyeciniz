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

export default function AstralCathedralLayout({
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
  cardBgColor = '#0c0a09',
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

  // Stained glass illumination opacity based on scroll (Signature Moment)
  const windowOpacity = prefersReducedMotion ? 0.95 : Math.min(1, progress * 1.5);
  const rayTranslateY = prefersReducedMotion ? 0 : (1 - progress) * -60;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-stone-950 text-stone-100"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-astral-cathedral"
    >
      {/* Astral Stained Glass & Cathedral Nave Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a09] via-[#1c1917] to-[#0c0a09]" />
        
        {/* Light Shaft Rays (Signature Moment) */}
        <div 
          className="absolute inset-0 opacity-40 bg-gradient-to-br from-amber-500/0 via-violet-500/20 to-amber-500/0 transition-transform duration-100 ease-out"
          style={{
            transform: `translateY(${rayTranslateY}px) rotate(15deg) scale(1.2)`
          }}
        />

        {/* Cathedral Columns Silhouette */}
        <div className="absolute inset-0 flex justify-between px-6 pointer-events-none z-10 opacity-30">
          <div className="w-10 h-full bg-gradient-to-r from-stone-950 to-stone-900 border-r border-white/5" />
          <div className="w-10 h-full bg-gradient-to-l from-stone-950 to-stone-900 border-l border-white/5" />
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: ARCH TITLE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-900 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-violet-400 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-stone-900/90 backdrop-blur-md rounded-t-[3rem] border border-white/10 shadow-2xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-stone-100" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-stone-850 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400 font-mono">SCROLL TO LIGHT THE STAINED GLASS</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-900 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-stone-200 bg-stone-950/70 backdrop-blur-md p-8 border border-white/5 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: ALTAR DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-900 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-violet-400 font-bold uppercase mb-8">SANCTUARY COORDINATES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 rounded-none border border-white/10 bg-stone-900/90 shadow-sm">
                <Calendar className="w-5 h-5 mx-auto text-violet-400 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-violet-300">{timeStr}</span>
              </div>

              <div id="cathedral-coordinates-plaque" className="flex flex-col gap-2 p-6 rounded-none border border-white/10 bg-stone-900/90 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-violet-400 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Astral Altar'}</span>
                {wedding.venue_address && (
                  <span className="text-stone-400 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-white/20 bg-stone-900/60 text-white hover:bg-white hover:text-stone-950 rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>SANCTUARY DIRECTIONS</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY GLASS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-900 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-violet-400 font-bold uppercase mb-8">STAINED GLASS FRAME</span>
            
            {/* Stained-glass window frame styled Gallery */}
            <div id="cathedral-gallery-window" className="relative w-full max-w-xs aspect-[3/4] mx-auto rounded-t-full overflow-hidden border-8 border-stone-900 shadow-2xl bg-stone-950 p-1 flex items-center justify-center">
              <div className="w-full h-full rounded-t-full overflow-hidden relative">
                {couplePhoto ? (
                  <SafeImage 
                    src={couplePhoto} 
                    alt="Cathedral Couple" 
                    className="w-full h-full object-cover grayscale opacity-90 contrast-125 transition-all duration-500"
                    style={{
                      opacity: windowOpacity
                    }}
                    isHero={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 bg-stone-900">
                    <Heart className="w-12 h-12 mb-2 opacity-35" />
                    <span className="text-[10px] tracking-wider uppercase opacity-55">ALTAR PORTRAIT</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: ALTAR RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="cathedral-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-stone-900/95 border border-white/10 rounded-t-[3rem] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-violet-400 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" /> T-MINUS TO ALIGNMENT
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#a855f7" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-white/10">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-violet-600 [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-violet-500 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-stone-100 font-sans">
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
