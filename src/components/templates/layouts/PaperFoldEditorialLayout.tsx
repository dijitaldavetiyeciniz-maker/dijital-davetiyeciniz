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

export default function PaperFoldEditorialLayout({
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

  // Paper fold crease intensity (Signature Moment - flattens on scroll)
  const creaseOpacity = prefersReducedMotion ? 0.02 : Math.max(0.02, 0.4 - progress * 0.4);
  const scaleEffect = prefersReducedMotion ? 1.0 : 0.95 + progress * 0.05;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-[#fbf9f6] text-stone-900 border-t-8 border-[#8d7c6e]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-paper-fold"
    >
      {/* Creased Paper Fold Texture Overlays (Signature Moment) */}
      <div 
        className="fixed inset-0 pointer-events-none z-10 transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${scaleEffect})`
        }}
      >
        {/* Horizontal fold crease shadow */}
        <div 
          className="absolute inset-x-0 top-1/2 h-12 bg-gradient-to-b from-stone-900/10 to-transparent pointer-events-none transition-opacity duration-300"
          style={{ opacity: creaseOpacity }}
        />
        <div 
          className="absolute inset-x-0 bottom-1/2 h-12 bg-gradient-to-t from-stone-900/10 to-transparent pointer-events-none transition-opacity duration-300"
          style={{ opacity: creaseOpacity }}
        />

        {/* Vertical fold crease shadow */}
        <div 
          className="absolute inset-y-0 left-1/2 w-12 bg-gradient-to-r from-stone-900/10 to-transparent pointer-events-none transition-opacity duration-300"
          style={{ opacity: creaseOpacity }}
        />
        <div 
          className="absolute inset-y-0 right-1/2 w-12 bg-gradient-to-l from-stone-900/10 to-transparent pointer-events-none transition-opacity duration-300"
          style={{ opacity: creaseOpacity }}
        />
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-20'}>

        {/* ----------------- FOLD 1: TITLE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcd0] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#8d7c6e] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-white border border-[#e5dfd5] shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-stone-900" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#8d7c6e]/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#8d7c6e] font-mono">SCROLL TO UNFLATTEN STATIONERY</p>
            </div>
          </div>
        )}

        {/* ----------------- FOLD 2: PROLOGUE ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcd0] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl px-6 italic text-[#2c2620] bg-white p-8 border border-[#e5dfd5] shadow-sm">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- FOLD 3: SPECIFICATIONS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcd0] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#8d7c6e] font-bold uppercase mb-8">STATIONERY SPECIFICATIONS & DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-white border border-[#e5dfd5] shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-[#8d7c6e] mb-2" />
                <span className="text-[#2c2620] text-lg">{dateStr}</span>
                <span className="text-[#8d7c6e]">{timeStr}</span>
              </div>

              <div id="paper-fold-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-white border border-[#e5dfd5] shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#8d7c6e] mb-2" />
                <span className="text-[#2c2620] text-lg">{wedding.venue_name || 'Gala Hall'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-500 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[9px] text-[#8d7c6e] mt-1 font-mono tracking-widest uppercase">SECTION 4 / ARCH</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#8d7c6e] bg-white text-[#2c2620] hover:bg-[#2c2620] hover:text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>PLAZZO DIRECTORY</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- FOLD 4: PORTRAIT ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcd0] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#8d7c6e] font-bold uppercase mb-8">STATIONERY PRINT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-[12px] border-[#e9e6df] shadow-2xl bg-white p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Paper Fold Editorial" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-110"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#8d7c6e]/30 bg-[#faf8f5]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- FOLD 5: RSVP GUESTBOOK ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="paper-fold-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white border border-[#e5dfd5] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#8d7c6e] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🔒 T-MINUS TO GALA START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#2c2620" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#e5dfd5]">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#8d7c6e] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-[#2c2620] [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
