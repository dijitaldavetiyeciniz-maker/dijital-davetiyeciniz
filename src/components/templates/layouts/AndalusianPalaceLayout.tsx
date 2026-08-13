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

export default function AndalusianPalaceLayout({
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
  cardBgColor = '#1f2937',
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
      className="w-full relative overflow-x-hidden font-serif bg-[#1f2937] text-[#f3f4f6]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-andalusian-palace"
    >
      {/* Symmetrical Palace Column Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#030712]" />
        
        {/* Symmetrical plasterwork frames (Signature Moment) */}
        {!prefersReducedMotion && (
          <div 
            className="absolute inset-x-8 top-10 bottom-10 border border-[#b45309]/30 transition-transform duration-300 pointer-events-none"
            style={{
              transform: `scale(${0.9 + progress * 0.1})`,
              opacity: 0.2 + progress * 0.4
            }}
          />
        )}
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: ARCH Facade ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-gray-800 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.4em] text-[#b45309] font-bold uppercase mb-6">{eventTitle}</span>
              
              {/* Islamic geometry medallion */}
              <div className="w-16 h-16 border border-[#b45309]/40 rounded-full flex items-center justify-center bg-[#b45309]/10 mb-8">
                <span className="text-[#b45309] text-xl">❊</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-light uppercase tracking-widest text-[#f3f4f6]" style={{ fontFamily: `"${headingFont}", serif` }}>
                {wedding.bride_name} <br/>
                <span className="text-lg opacity-40 font-light block my-4">+</span>
                {wedding.groom_name}
              </h1>
              
              <div className="h-px w-20 bg-[#b45309]/30 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#b45309]/70 font-mono">SCROLL THROUGH THE ALHAMBRA ARCHES</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-gray-800 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-[#f3f4f6]">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-gray-800 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#b45309] font-bold uppercase mb-8">ALHAMBRA DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-[#b45309]/20 bg-[#111827]/80">
                <Calendar className="w-5 h-5 mx-auto text-[#b45309] mb-2" />
                <span className="text-[#f3f4f6] text-lg">{dateStr}</span>
                <span className="text-amber-300">{timeStr}</span>
              </div>

              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-[#b45309]/20 bg-[#111827]/80">
                <MapPin className="w-5 h-5 mx-auto text-[#b45309] mb-2" />
                <span className="text-[#f3f4f6] text-lg">{wedding.venue_name || 'Alhambra Palace'}</span>
                {wedding.venue_address && (
                  <span className="text-amber-300/80 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#b45309]/40 bg-[#111827]/40 text-[#b45309] hover:bg-[#b45309] hover:text-[#111827] rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>MAPS LOCATION</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-gray-800 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#b45309] font-bold uppercase mb-8">PALACE GALLERY</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-none overflow-hidden border border-[#b45309]/20 shadow-2xl bg-[#111827]">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Andalusian Couple" 
                  className="w-full h-full object-cover"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-amber-300/50 bg-[#111827]/60">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT PANEL</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: PALACE CHAPTER RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-[#111827]/95 border border-[#b45309]/30 rounded-none p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#b45309] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#b45309]" /> T-MINUS TO CEREMONY
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#b45309" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#b45309]/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#b45309] [&>button]:text-[#111827] [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-600 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
