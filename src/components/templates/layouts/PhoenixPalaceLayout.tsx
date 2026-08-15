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

export default function PhoenixPalaceLayout({
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

  // Rebirth progress calculations (Signature Moment)
  const ashOpacity = prefersReducedMotion ? 0 : Math.max(0, 1 - progress * 2);
  const goldIntensity = prefersReducedMotion ? 1 : Math.min(1, progress * 1.5);

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-stone-900 text-amber-100"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-phoenix-palace"
    >
      {/* Ember & Ash Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#1c1917]" />
        
        {/* Dissolving Ash Overlay (Signature Moment) */}
        {!prefersReducedMotion && (
          <div 
            className="absolute inset-0 bg-stone-950 transition-opacity duration-300"
            style={{
              opacity: ashOpacity,
              backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 20%, #1c1917 80%)'
            }}
          />
        )}

        {/* Glowing Ember Particles */}
        <div className="absolute inset-0 opacity-40 mix-blend-color-dodge">
          <div className="absolute bottom-10 left-1/4 w-2 h-2 rounded-full bg-amber-500 blur-xs animate-ping" />
          <div className="absolute bottom-20 right-1/3 w-3.5 h-3.5 rounded-full bg-orange-600 blur-xs animate-pulse" />
          <div className="absolute bottom-32 left-1/2 w-1.5 h-1.5 rounded-full bg-red-500 blur-xs animate-bounce" />
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: REBIRTH COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-orange-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-orange-400 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div 
                className="p-8 bg-stone-900/90 backdrop-blur-md rounded-none border border-orange-500/20 shadow-2xl max-w-md transition-all duration-300"
                style={{
                  boxShadow: `0 0 40px rgba(245, 158, 11, ${0.1 * goldIntensity})`
                }}
              >
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-amber-100" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-orange-900/30 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-orange-400 font-mono">SCROLL TO TRIGGER REBIRTH</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-orange-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-amber-100 bg-stone-900/80 backdrop-blur-md p-8 border border-orange-950/10 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: EMBER DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-orange-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-orange-400 font-bold uppercase mb-8">EMBER COORDINATES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 bg-stone-900/90 border border-orange-500/20 shadow-sm">
                <Calendar className="w-5 h-5 mx-auto text-orange-400 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-orange-400">{timeStr}</span>
              </div>

              <div id="phoenix-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-stone-900/90 border border-orange-500/20 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-orange-400 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Phoenix Hall'}</span>
                {wedding.venue_address && (
                  <span className="text-stone-400 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-orange-500/30 bg-stone-900/60 text-white hover:bg-orange-500 hover:text-stone-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>PALACE DIRECTORY</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-orange-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-orange-400 font-bold uppercase mb-8">EMBER SNAPSHOT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border border-orange-500/20 shadow-2xl bg-stone-950">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Phoenix Couple" 
                  className="w-full h-full object-cover"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-orange-400/40 bg-[#1c1917]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="phoenix-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-stone-900/95 border border-orange-500/20 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-orange-400 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" /> T-MINUS TO COMPLETE REBIRTH
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#f59e0b" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-orange-500/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-orange-500 [&>button]:text-stone-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-orange-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-amber-100 font-sans">
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
