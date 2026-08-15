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

export default function CeramicStudioLayout({
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
  cardBgColor = '#faf6f0',
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

  // Clay wheel rotation progress (Signature Moment)
  const wheelRotation = prefersReducedMotion ? 360 : progress * 360;
  const glazeScale = prefersReducedMotion ? 1 : Math.min(1, progress * 1.5);

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-[#faf6f0] text-[#5c4d3c] border-t-8 border-[#c97d60]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-ceramic"
    >
      {/* Ceramic Potter Studio Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#f7f0e6]" />
        
        {/* Soft terracotta clay splatter textures */}
        <div className="absolute inset-0 opacity-5"
             style={{
               backgroundImage: 'radial-gradient(circle, #c97d60 0.8px, transparent 0.8px)',
               backgroundSize: '28px 28px'
             }} 
        />

        {/* Potter Wheel Circle (Signature Moment - rotates and glazes on scroll) */}
        <div 
          className="absolute w-64 h-64 border-2 border-dashed border-[#c97d60]/30 rounded-full transition-transform duration-100 ease-out z-5 flex items-center justify-center"
          style={{
            transform: `rotate(${wheelRotation}deg) scale(${glazeScale})`
          }}
        >
          {/* Concentric rings represent clay shape */}
          <div className="w-48 h-48 border border-[#c97d60]/20 rounded-full flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-double border-[#c97d60]/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SESSION 1: CLAY ENTRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcd0] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#c97d60] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-white border border-[#ebdcd0] shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#5c4d3c]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#c97d60]/50 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#c97d60] font-mono">SCROLL TO SPIN THE POTTER WHEEL</p>
            </div>
          </div>
        )}

        {/* ----------------- SESSION 2: CRAFT STATEMENT ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcd0] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl px-6 italic text-[#5c4d3c] bg-white p-8 border border-[#ebdcd0] shadow-sm">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SESSION 3: ATELIER DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcd0] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#c97d60] font-bold uppercase mb-8">ATELIER DIRECTORY & DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-white border border-[#ebdcd0] shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-[#c97d60] mb-2" />
                <span className="text-[#5c4d3c] text-lg">{dateStr}</span>
                <span className="text-[#c97d60]">{timeStr}</span>
              </div>

              <div id="ceramic-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-white border border-[#ebdcd0] shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#c97d60] mb-2" />
                <span className="text-[#5c4d3c] text-lg">{wedding.venue_name || 'Ceramic Atelier'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-505 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[9px] text-[#c97d60] mt-1 font-mono tracking-widest uppercase">Studio Room C // Terracotta Row</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#c97d60] bg-white text-[#5c4d3c] hover:bg-[#5c4d3c] hover:text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>ATELIER LOCATOR</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SESSION 4: PICTURE FRAME ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-[#ebdcd0] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#c97d60] font-bold uppercase mb-8">ATELIER PORTRAIT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-[12px] border-white shadow-2xl bg-white p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Ceramic Studio" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-110"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#c97d60]/30 bg-white">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SESSION 5: RSVP GUESTBOOK ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="ceramic-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white border border-[#ebdcd0] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#c97d60] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🔒 T-MINUS TO GALA START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#5c4d3c" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#ebdcd0]">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#c97d60] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-[#5c4d3c] [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-[#5c4d3c]">
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
