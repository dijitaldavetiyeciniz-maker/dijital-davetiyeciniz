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

export default function EclipseCeremonyLayout({
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
  cardBgColor = '#09090b',
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

  // Custom corona opacity/glow calculation based on eclipse state (Signature Moment)
  const eclipseThreshold = 0.85;
  const isEclipsed = prefersReducedMotion || progress >= eclipseThreshold;
  
  // Calculate relative position of the moving dark moon sphere
  const moonOffset = prefersReducedMotion ? 0 : (1 - progress) * 120 - 40; // in px

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-zinc-950 text-zinc-100"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-eclipse"
    >
      {/* Dynamic Solar Eclipse Backdrop (Signature Moment) */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        {/* Sun Glow/Corona */}
        <div 
          className="absolute w-64 h-64 rounded-full transition-all duration-300"
          style={{
            background: isEclipsed
              ? 'radial-gradient(circle, rgba(251,191,36,0.9) 0%, rgba(251,191,36,0.4) 30%, rgba(251,191,36,0) 70%)'
              : 'radial-gradient(circle, rgba(254,243,199,0.8) 0%, rgba(251,191,36,0.2) 40%, rgba(251,191,36,0) 65%)',
            filter: isEclipsed ? 'blur(10px)' : 'none',
            transform: prefersReducedMotion ? 'scale(1)' : `scale(${0.9 + progress * 0.2})`,
          }}
        />

        {/* Eclipsing Moon Disk (sliding on scroll) */}
        <div 
          className="absolute w-56 h-56 rounded-full bg-zinc-950 border border-zinc-900 shadow-2xl transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${moonOffset}px, ${moonOffset * -0.2}px)`
          }}
        />
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: ECLIPSE INTRO ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-zinc-900 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-amber-500 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-zinc-950/80 backdrop-blur-md rounded-none border border-zinc-800 shadow-2xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-zinc-100" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-zinc-800 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">SCROLL TO WATCH THE ALIGNMENT</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: STORY LINE ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-zinc-900 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-zinc-300 bg-zinc-950/70 backdrop-blur-md p-8 border border-zinc-800 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: OCCLUSION DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-zinc-900 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-amber-500 font-bold uppercase mb-8">ASTRONOMICAL COORDINATES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 bg-zinc-950/80 border border-zinc-800 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-zinc-400">{timeStr}</span>
              </div>

              <div id="eclipse-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-zinc-950/80 border border-zinc-800 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Alignment Arena'}</span>
                {wedding.venue_address && (
                  <span className="text-zinc-400 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-zinc-400 mt-1 font-mono tracking-widest uppercase">RA 12h 45m / Dec +18° 12'</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-zinc-800 bg-zinc-950/60 text-white hover:bg-white hover:text-zinc-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>MAPS LOCATION</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY OVERLAY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-zinc-900 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-amber-500 font-bold uppercase mb-8">CORONA PORTRAIT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Eclipse Couple" 
                  className="w-full h-full object-cover opacity-80"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-900">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: TOTAL ECLIPSE RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="eclipse-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-zinc-950/95 border border-zinc-800 p-6 shadow-2xl backdrop-blur-md">
              
              {/* Eclipse Radial Dial styled Countdown */}
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🌕 T-MINUS TO TOTALITY
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#f59e0b" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-zinc-800">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-amber-500 [&>button]:text-zinc-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-zinc-100 font-sans">
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
