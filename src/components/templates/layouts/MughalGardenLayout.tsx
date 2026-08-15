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

export default function MughalGardenLayout({
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
  cardBgColor = '#fafafa',
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

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-[#f3fbfb] text-[#115e59]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-mughal-garden"
    >
      {/* Symmetrical Mughal Garden Pool Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e0f2fe] via-[#ccfbf1] to-[#99f6e4]" />
        
        {/* Pool Symmetrical reflection overlay (Signature Moment) */}
        {!prefersReducedMotion && (
          <div 
            className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-[#0d9488]/40 to-transparent transition-all duration-300 pointer-events-none"
            style={{
              transform: `skewX(${Math.sin(progress * 20) * 3}deg) scaleY(${1 + Math.sin(progress * 10) * 0.05})`,
              filter: `blur(${Math.sin(progress * 20) * 2}px)`
            }}
          />
        )}
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: SYMMETRICAL DOME ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-teal-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              
              {/* Marble dome geometric shape */}
              <div className="w-20 h-20 border border-[#0d9488]/35 bg-white/80 rounded-t-full flex items-center justify-center mb-8 shadow-sm">
                <span className="text-[#0d9488] text-xl">❊</span>
              </div>

              <span className="text-[10px] tracking-[0.4em] text-[#0d9488] font-bold uppercase mb-4">{eventTitle}</span>
              <h1 className="text-4xl sm:text-6xl font-light uppercase tracking-widest text-[#115e59]" style={{ fontFamily: `"${headingFont}", serif` }}>
                {wedding.bride_name} <br/>
                <span className="text-lg opacity-40 font-light block my-4">+</span>
                {wedding.groom_name}
              </h1>
              
              <div className="h-px w-20 bg-[#0d9488]/30 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#0d9488]/70 font-mono">SCROLL TO RIPPLE THE WATER reflection</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRIC WATER RIPPLES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-teal-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-[#115e59]">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: DETAILS PLAN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-teal-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#0d9488] font-bold uppercase mb-8">MARBLE GARDEN INVITATION</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-[#0d9488]/20 bg-white/90">
                <Calendar className="w-5 h-5 mx-auto text-[#0d9488] mb-2" />
                <span className="text-[#115e59] text-lg">{dateStr}</span>
                <span className="text-teal-700">{timeStr}</span>
              </div>

              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-[#0d9488]/20 bg-white/90">
                <MapPin className="w-5 h-5 mx-auto text-[#0d9488] mb-2" />
                <span className="text-[#115e59] text-lg">{wedding.venue_name || 'Mughal Garden'}</span>
                {wedding.venue_address && (
                  <span className="text-teal-700 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#0d9488]/40 bg-white/40 text-[#0d9488] hover:bg-[#0d9488] hover:text-white rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>MAPS DIRECTION</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: TAJ ALBUM PHOTO ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-teal-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#0d9488] font-bold uppercase mb-8">TAJ GARDEN PORTRAIT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-none overflow-hidden border border-[#0d9488]/20 shadow-2xl bg-white p-2">
              <div className="w-full h-full border border-teal-100 overflow-hidden relative">
                {couplePhoto ? (
                  <SafeImage 
                    src={couplePhoto} 
                    alt="Mughal Couple" 
                    className="w-full h-full object-cover"
                    isHero={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-teal-700 bg-teal-50/60">
                    <Heart className="w-12 h-12 mb-2 opacity-35" />
                    <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT CELL</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: REFLECTION SYMMETRY RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            
            {/* Symmetrical countdown/RSVP container */}
            <div id="mughal-symmetry-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white/95 border border-[#0d9488]/20 rounded-none p-6 shadow-2xl backdrop-blur-sm">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#0d9488] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#0d9488]" /> T-MINUS TO RECEPTION
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#0d9488" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#0d9488]/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#0d9488] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-teal-700 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-slate-800">
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
