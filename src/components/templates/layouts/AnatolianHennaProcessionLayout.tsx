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

export default function AnatolianHennaProcessionLayout({
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
  cardBgColor = '#faf6ed',
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

  // Procession lantern lights (Signature Moment)
  const activeLanterns = prefersReducedMotion ? 5 : Math.min(5, Math.floor(progress * 5.5));

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-[#fbf8f0] text-[#543b2b] border-t-8 border-[#b45309]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-anatolian-henna"
    >
      {/* Traditional Courtyard Path Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#fbf7ee]" />
        
        {/* Repeating Anatolian carpet patterns (soft opacity) */}
        <div className="absolute inset-0 opacity-5"
             style={{
               backgroundImage: 'linear-gradient(45deg, #b45309 2px, transparent 2px)',
               backgroundSize: '40px 40px'
             }} 
        />

        {/* Procession path lanterns (Signature Moment) */}
        <div className="absolute bottom-16 inset-x-0 h-24 flex justify-around px-8 z-5 text-[#b45309]">
          {[...Array(5)].map((_, idx) => {
            const lit = idx < activeLanterns;
            return (
              <svg 
                key={idx} 
                className={`w-12 h-12 transition-all duration-300 ${lit ? 'opacity-100 text-amber-500 scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'opacity-25 scale-95'}`} 
                viewBox="0 0 100 100" 
                fill={lit ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                strokeWidth="1"
              >
                {/* Traditional lantern silhouette */}
                <rect x="35" y="25" width="30" height="45" rx="5" />
                <path d="M 50,5 L 50,25 M 30,70 L 70,70 M 50,70 L 50,95" />
                <circle cx="50" cy="47" r="8" fill={lit ? 'white' : 'none'} />
              </svg>
            );
          })}
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- STEP 1: WELCOME PROCESSION ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcc5] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#b45309] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-white border border-[#ebdcc5] shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#543b2b]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#b45309]/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#b45309] font-mono">SCROLL TO LIGHT THE PROCESSION PATH</p>
            </div>
          </div>
        )}

        {/* ----------------- STEP 2: CULTURAL POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcc5] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl px-6 italic text-[#543b2b] bg-white/95 p-8 border border-[#ebdcc5] shadow-sm">
              <div className="text-[9px] text-[#b45309] font-mono tracking-widest uppercase mb-4">ANATOLIAN // PROCESSION</div>
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- STEP 3: COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcc5] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#b45309] font-bold uppercase mb-8">PROCESSION SCHEDULE & DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-white border border-[#ebdcc5] shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-[#b45309] mb-2" />
                <span className="text-[#543b2b] text-lg">{dateStr}</span>
                <span className="text-[#b45309]">{timeStr}</span>
              </div>

              <div id="anatolian-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-white border border-[#ebdcc5] shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#b45309] mb-2" />
                <span className="text-[#543b2b] text-lg">{wedding.venue_name || 'Village Hearth'}</span>
                {wedding.venue_address && (
                  <span className="text-stone-500 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[9px] text-[#b45309] mt-1 font-mono tracking-widest uppercase">SECTION A // VILLAGE SQUARE</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#b45309] bg-white text-[#543b2b] hover:bg-[#543b2b] hover:text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXHIBIT MAP</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- STEP 4: PICTURE FRAME ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcc5] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#b45309] font-bold uppercase mb-8">PROCESSION TRANSLATION</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-[12px] border-[#ebdcc5] shadow-2xl bg-white p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Anatolian Henna Procession" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-110"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#b45309]/30 bg-[#fbf8f0]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- STEP 5: RSVP GUESTBOOK ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="anatolian-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white border border-[#ebdcc5] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#b45309] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🏮 T-MINUS TO PROCESSION START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#543b2b" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#ebdcc5]">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#b45309] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-[#543b2b] [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-[#543b2b]">
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
