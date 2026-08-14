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

export default function CandlelightEngagementTableLayout({
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
  cardBgColor = '#faf8f5',
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

  // Table candlelight glide perspective progress (Signature Moment)
  const activeCandles = prefersReducedMotion ? 4 : Math.min(4, Math.floor(progress * 4.5));

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-[#fbf9f6] text-[#2c2620] border-t-8 border-[#a37c5a]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-candlelight-table"
    >
      {/* Intimate Garden veranda Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#f7f5f0]" />
        
        {/* Table candlelight nodes (Signature Moment) */}
        <div className="absolute bottom-12 inset-x-0 h-32 flex justify-around px-12 z-5 text-[#a37c5a]">
          {[...Array(4)].map((_, idx) => {
            const lit = idx < activeCandles;
            return (
              <svg 
                key={idx} 
                className={`w-10 h-16 transition-all duration-300 ${lit ? 'opacity-100 text-amber-500 scale-110 drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]' : 'opacity-20 scale-95'}`} 
                viewBox="0 0 50 100" 
                fill={lit ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                strokeWidth="1.2"
              >
                {/* Vintage Taper Candle Stick & Flame */}
                <line x1="25" y1="95" x2="25" y2="40" strokeWidth="2" />
                <rect x="23" y="40" width="4" height="2" fill="currentColor" />
                <line x1="15" y1="95" x2="35" y2="95" strokeWidth="3" />
                {lit && (
                  <path d="M 25,40 C 22,32 25,20 25,20 C 25,20 28,32 25,40 Z" fill="currentColor" />
                )}
              </svg>
            );
          })}
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SEAT 1: ENTRANCE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#e9e6df] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#a37c5a] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-white border border-[#e5dfd5] shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#2c2620]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#a37c5a]/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#a37c5a] font-mono">SCROLL TO LIGHT TAPER CANDLES</p>
            </div>
          </div>
        )}

        {/* ----------------- SEAT 2: MANIFESTO ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#e9e6df] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl px-6 italic text-[#2c2620] bg-white p-8 border border-[#e5dfd5] shadow-sm">
              <div className="text-[9px] text-[#a37c5a] font-mono tracking-widest uppercase mb-4">VERANDA // DINNER</div>
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SEAT 3: COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#e9e6df] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#a37c5a] font-bold uppercase mb-8">VERANDA SPECIFICATIONS & DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-white border border-[#e5dfd5] shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-[#a37c5a] mb-2" />
                <span className="text-[#2c2620] text-lg">{dateStr}</span>
                <span className="text-[#a37c5a]">{timeStr}</span>
              </div>

              <div id="candle-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-white border border-[#e5dfd5] shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#a37c5a] mb-2" />
                <span className="text-[#2c2620] text-lg">{wedding.venue_name || 'Garden veranda'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-500 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[9px] text-[#a37c5a] mt-1 font-mono tracking-widest uppercase">Table 4 / Garden Row</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#a37c5a] bg-white text-[#2c2620] hover:bg-[#2c2620] hover:text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXHIBIT COMPASS</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SEAT 4: PICTURE FRAME ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#e9e6df] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#a37c5a] font-bold uppercase mb-8">VERANDA PORTRAIT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-[12px] border-[#e9e6df] shadow-2xl bg-white p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Candlelight Table" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-110"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#a37c5a]/30 bg-[#faf8f5]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SEAT 5: RSVP GUESTBOOK ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="candlelight-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white border border-[#e5dfd5] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#a37c5a] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🕯️ T-MINUS TO DINNER START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#2c2620" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#e5dfd5]">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#a37c5a] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-[#2c2620] [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-[#2c2620]">
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
