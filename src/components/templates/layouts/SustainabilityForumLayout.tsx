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

export default function SustainabilityForumLayout({
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
  cardBgColor = '#f0fdf4',
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

  // Circular loop animation (Signature Moment)
  const circularOffset = prefersReducedMotion ? 0 : 360 - progress * 360;
  const circularScale = prefersReducedMotion ? 1 : 0.85 + progress * 0.15;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-sans bg-emerald-50 text-emerald-950 border-t-8 border-emerald-600"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-sustainability-forum"
    >
      {/* Ecosystem Circular Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#f0fdf4]" />
        
        {/* Connection circular loops (Signature Moment) */}
        <div 
          className="absolute w-80 h-80 transition-all duration-200 opacity-20"
          style={{
            transform: `scale(${circularScale})`,
            strokeDashoffset: circularOffset
          }}
        >
          <svg className="w-full h-full text-emerald-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            {/* Circular diagram cycle */}
            <circle cx="50" cy="50" r="32" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="22" />
            {/* Connected node circles */}
            <circle cx="50" cy="18" r="3.5" fill="currentColor" />
            <circle cx="50" cy="82" r="3.5" fill="currentColor" />
            <circle cx="18" cy="50" r="3.5" fill="currentColor" />
            <circle cx="82" cy="50" r="3.5" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: SUMMARY COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-emerald-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-emerald-600 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-white/95 border border-emerald-350 shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-emerald-950" style={{ fontFamily: `"${headingFont}", sans-serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-60 block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-emerald-600/40 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 font-mono">SCROLL TO MAP SYSTEM CYCLE</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: MANIFESTO ABSTRACT ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-emerald-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-xl font-medium leading-relaxed max-w-2xl px-6 text-emerald-900 bg-white/90 p-8 border border-emerald-100 shadow-sm rounded-none">
              <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-4">SYSTEMS STABILITY STATEMENT</div>
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: AGENDA COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-emerald-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-emerald-600 font-bold uppercase mb-8">FORUM AGENDA & ECOLOGY DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-white border border-emerald-150 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-emerald-600 mb-2" />
                <span className="text-emerald-950 text-lg">{dateStr}</span>
                <span className="text-emerald-600">{timeStr}</span>
              </div>

              <div id="sustainability-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-white border border-emerald-150 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-emerald-600 mb-2" />
                <span className="text-emerald-950 text-lg">{wedding.venue_name || 'Ecology Center'}</span>
                {wedding.venue_address && (
                  <span className="text-emerald-700 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-emerald-600 mt-1 font-mono tracking-widest uppercase">ECOLOGICAL BIOME ROOM 2</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>ECO SYSTEM LOCATION</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-emerald-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-emerald-600 font-bold uppercase mb-8">DOCUMENTARY ATTACHMENT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border border-emerald-250 shadow-2xl bg-white p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Sustainability Forum" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-110"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-emerald-300 bg-white">
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
            <div id="sustainability-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white border border-emerald-200 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-emerald-600 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🌱 COUNTDOWN TO DEPLOYMENT START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#065f46" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-emerald-200">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-emerald-600 [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-emerald-700 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-emerald-950 font-sans">
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
