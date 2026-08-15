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

export default function HennaCourtyardRitualLayout({
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
  cardBgColor = '#fcf8f2',
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

  // Candle circle ignition scale (Signature Moment)
  const candleScale = prefersReducedMotion ? 1 : 0.8 + progress * 0.2;
  const candleOpacity = prefersReducedMotion ? 0.95 : Math.min(0.95, progress * 1.5);

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-[#fdf9f3] text-[#4a3b32] border-t-8 border-[#c27d38]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-henna-courtyard"
    >
      {/* Courtyard Intimate Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#faf5ed]" />
        
        {/* Soft courtyard tiling grid */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: 'linear-gradient(45deg, #c27d38 1px, transparent 1px), linear-gradient(-45deg, #c27d38 1px, transparent 1px)',
               backgroundSize: '32px 32px'
             }} 
        />

        {/* Copper henna bowl & candle circle SVG (Signature Moment) */}
        <div 
          className="absolute w-80 h-80 transition-all duration-200"
          style={{
            transform: `scale(${candleScale})`,
            opacity: candleOpacity
          }}
        >
          <svg className="w-full h-full text-[#c27d38]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            {/* Henna copper bowl */}
            <circle cx="50" cy="50" r="18" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="10" strokeDasharray="2 2" />
            {/* Candle circle */}
            {[...Array(6)].map((_, i) => (
              <circle key={i} cx={50 + 30 * Math.cos((i * 60 * Math.PI) / 180)} cy={50 + 30 * Math.sin((i * 60 * Math.PI) / 180)} r="2.5" fill="currentColor" />
            ))}
          </svg>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- RITUAL 1: COURTYARD ENTRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcc5] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#c27d38] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-white border border-[#ebdcc5] shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#4a3b32]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#c27d38]/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#c27d38] font-mono">SCROLL TO IGNITE CANDLE CIRCLE</p>
            </div>
          </div>
        )}

        {/* ----------------- RITUAL 2: COURTYARD POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcc5] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl px-6 italic text-[#4a3b32] bg-white/95 p-8 border border-[#ebdcc5] shadow-sm">
              <div className="text-[9px] text-[#c27d38] font-mono tracking-widest uppercase mb-4">COURTYARD // RITUAL</div>
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- RITUAL 3: CEREMONY COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcc5] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#c27d38] font-bold uppercase mb-8">COURTYARD ANNOTATIONS & DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-white border border-[#ebdcc5] shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-[#c27d38] mb-2" />
                <span className="text-[#4a3b32] text-lg">{dateStr}</span>
                <span className="text-[#c27d38]">{timeStr}</span>
              </div>

              <div id="henna-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-white border border-[#ebdcc5] shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#c27d38] mb-2" />
                <span className="text-[#4a3b32] text-lg">{wedding.venue_name || 'Courtyard'}</span>
                {wedding.venue_address && (
                  <span className="text-stone-500 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[9px] text-[#c27d38] mt-1 font-mono tracking-widest uppercase">COPPER HEARTH / LOWER DECK</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#c27d38] bg-white text-[#4a3b32] hover:bg-[#4a3b32] hover:text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXHIBIT COMPASS</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- RITUAL 4: PICTURE FRAME ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcc5] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#c27d38] font-bold uppercase mb-8">COURTYARD DOCUMENTATION</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-[12px] border-[#ebdcc5] shadow-2xl bg-white p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Henna Courtyard" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-110"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#c27d38]/30 bg-[#fdf9f3]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- RITUAL 5: RSVP GUESTBOOK ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="henna-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white border border-[#ebdcc5] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#c27d38] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🕯️ T-MINUS TO CEREMONY START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#4a3b32" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#ebdcc5]">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#c27d38] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-[#4a3b32] [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-[#4a3b32]">
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
