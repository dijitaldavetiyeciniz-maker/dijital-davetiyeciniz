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

export default function PersianMiniatureLayout({
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
  cardBgColor = '#1e1b4b',
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
      className="w-full relative overflow-x-hidden font-serif bg-[#1e1b4b] text-[#fef3c7]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-persian-miniature"
    >
      {/* Persian manuscript backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Lapis lazuli background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#171544] via-[#1e1b4b] to-[#0f0d2c]" />
        
        {/* Fine gold details margin border (Signature Moment) */}
        {!prefersReducedMotion && (
          <div 
            className="absolute inset-4 border-2 border-[#eab308]/20 transition-all duration-300 pointer-events-none"
            style={{
              padding: `${20 - progress * 15}px`,
              opacity: 0.15 + progress * 0.3
            }}
          />
        )}
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: MINIATURE COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-indigo-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              
              {/* Persian Manuscript Medallion */}
              <div className="w-24 h-24 rounded-full border-2 border-[#eab308]/40 flex items-center justify-center bg-[#b91c1c]/25 mb-8 shadow-lg">
                <span className="text-[#eab308] text-2xl font-serif">❦</span>
              </div>

              <span className="text-[10px] tracking-[0.4em] text-[#eab308] font-bold uppercase mb-4">{eventTitle}</span>
              <h1 className="text-4xl sm:text-6xl font-light uppercase tracking-widest text-[#fef3c7]" style={{ fontFamily: `"${headingFont}", serif` }}>
                {wedding.bride_name} <br/>
                <span className="text-lg opacity-40 font-light block my-4">+</span>
                {wedding.groom_name}
              </h1>
              
              <div className="h-px w-20 bg-[#eab308]/30 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#eab308]/60 font-mono">SCROLL TO OPEN MANUSCRIPT</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETIC INVITATION ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-indigo-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-[#fef3c7]">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: DETAILS & GATEPASS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-indigo-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#eab308] font-bold uppercase mb-8">MANUSCRIPT DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-[#eab308]/20 bg-[#171544]/80">
                <Calendar className="w-5 h-5 mx-auto text-[#eab308] mb-2" />
                <span className="text-[#fef3c7] text-lg">{dateStr}</span>
                <span className="text-amber-300">{timeStr}</span>
              </div>

              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-[#eab308]/20 bg-[#171544]/80">
                <MapPin className="w-5 h-5 mx-auto text-[#eab308] mb-2" />
                <span className="text-[#fef3c7] text-lg">{wedding.venue_name || 'Persian Garden'}</span>
                {wedding.venue_address && (
                  <span className="text-amber-300/80 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#eab308]/40 bg-[#171544]/40 text-amber-200 hover:bg-[#eab308] hover:text-[#1e1b4b] rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>MAPS LINK</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: ILLUMINATED PORTRAIT ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-indigo-950/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#eab308] font-bold uppercase mb-8">ILLUMINATION PORTRAIT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-none overflow-hidden border-4 border-[#eab308]/30 shadow-2xl bg-[#171544]">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Persian Couple" 
                  className="w-full h-full object-cover"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-amber-300/50 bg-[#171544]/60">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT PANEL</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: ILLUMINATED MEDALLIONS RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            
            {/* Custom Plaque/Medallion Countdown & RSVP */}
            <div id="persian-countdown-medallions" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-[#171544]/95 border border-[#eab308]/30 rounded-none p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#eab308] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#eab308]" /> COUNTDOWN TO LAUNCH
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#eab308" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#eab308]/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#eab308] [&>button]:text-[#1e1b4b] [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-yellow-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
