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

export default function JuniorPilotLayout({
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
  cardBgColor = '#bae6fd',
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

  // Takeoff height and lights (Signature Moment)
  const planeY = prefersReducedMotion ? -100 : (1 - progress * 2) * 100; // translate offset
  const lightsVisible = prefersReducedMotion || progress > 0.4;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-sky-200 text-sky-950"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-junior-pilot"
    >
      {/* Aviation Sky Runway Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7dd3fc] via-[#bae6fd] to-[#f0f9ff]" />
        
        {/* Runway Lines & Lights (Signature Moment) */}
        <div className="absolute inset-x-0 bottom-0 h-80 flex flex-col items-center justify-end">
          {/* Runway perspective polygon */}
          <svg className="w-64 h-full text-slate-700/30" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="10,100 90,100 60,0 40,0" />
            
            {/* Sequential Runway lights */}
            {lightsVisible && (
              <>
                <circle cx="45" cy="85" r="2.5" className="fill-amber-400 animate-ping" />
                <circle cx="55" cy="85" r="2.5" className="fill-amber-400 animate-ping" />
                <circle cx="47" cy="50" r="1.5" className="fill-amber-300" />
                <circle cx="53" cy="50" r="1.5" className="fill-amber-300" />
              </>
            )}
          </svg>
        </div>

        {/* Taking off Aircraft (Signature Moment) */}
        <div 
          className="absolute inset-x-0 bottom-40 flex items-center justify-center transition-transform duration-100 ease-out z-10"
          style={{
            transform: `translateY(${planeY}px) scale(${prefersReducedMotion ? 1 : 0.6 + progress * 0.4})`
          }}
        >
          <svg className="w-24 h-24 text-sky-900" viewBox="0 0 100 100" fill="currentColor">
            {/* Plane shape */}
            <path d="M 50,15 L 53,40 L 85,60 L 85,65 L 53,58 L 53,75 L 65,82 L 65,86 L 50,83 L 35,86 L 35,82 L 47,75 L 47,58 L 15,65 L 15,60 L 47,40 Z" />
          </svg>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: PILOT COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-300 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-sky-700 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-white/95 border-4 border-sky-900 shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-widest text-sky-950" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-60 block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-sky-900/30 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-sky-700 font-mono">SCROLL TO ACTIVATE TAKEOFF</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: STORY FLIGHT LOG ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-300 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-bold leading-relaxed max-w-xl px-6 italic text-sky-950 bg-white/80 p-8 border-2 border-sky-900">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: RUNWAY COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-300 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-sky-700 font-bold uppercase mb-8">RUNWAY DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-white/95 border-2 border-sky-900 shadow-sm">
                <Calendar className="w-5 h-5 mx-auto text-sky-700 mb-2" />
                <span className="text-sky-950 text-lg">{dateStr}</span>
                <span className="text-sky-700">{timeStr}</span>
              </div>

              <div id="pilot-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-white/95 border-2 border-sky-900 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-sky-700 mb-2" />
                <span className="text-sky-950 text-lg">{wedding.venue_name || 'Pilot Hangar'}</span>
                {wedding.venue_address && (
                  <span className="text-sky-750 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-sky-700 mt-1 font-mono tracking-widest uppercase">Runway: 36L / Flight Deck</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border-2 border-sky-900 bg-white text-sky-950 hover:bg-sky-950 hover:text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>HANGAR LOCATION</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-300 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-sky-700 font-bold uppercase mb-8">COCKPIT SNAPSHOT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-sky-900 shadow-2xl bg-white p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Junior Pilot" 
                  className="w-full h-full object-cover"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-sky-500 bg-sky-100">
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
            <div id="pilot-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white/95 border-4 border-sky-900 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-sky-750 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                ✈️ T-MINUS TO FLIGHT TAKE-OFF
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#0284c7" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-sky-900/25">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-sky-600 [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-sky-700 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-sky-950 font-sans">
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
