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

export default function BotanicalHerbariumLayout({
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
  cardBgColor = '#faf6eb',
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

  // Botanical specimen pin position (Signature Moment)
  const pinProgress = prefersReducedMotion ? 1 : Math.min(1, progress * 1.6);
  const specimenY = prefersReducedMotion ? 0 : -100 + progress * 100; // slides down and settles

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-[#faf6eb] text-[#3d322b] border-t-8 border-[#606c38]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-herbarium"
    >
      {/* Archival Specimen Sheet Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#f5efe0]" />
        
        {/* Soft paper fibers texture */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: 'radial-gradient(circle, #606c38 0.5px, transparent 0.5px)',
               backgroundSize: '32px 32px'
             }} 
        />

        {/* Specimen pressed leaves (Signature Moment - slides and pins on scroll) */}
        <div 
          className="absolute inset-y-12 right-12 w-48 transition-all duration-100 ease-out z-5"
          style={{
            transform: `translateY(${specimenY}px)`,
            opacity: pinProgress
          }}
        >
          <svg className="w-full h-full text-[#606c38]/20" viewBox="0 0 100 200" fill="currentColor">
            {/* Specimen stem & leaves */}
            <path d="M 50,200 Q 45,100 50,10 C 50,10 30,50 35,80 C 40,110 50,130 50,130 C 50,130 65,100 62,70 C 59,40 50,10 50,10 Z" />
            <circle cx="50" cy="10" r="3" fill="#bc6c25" /> {/* Herbarium red dot seal */}
          </svg>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SHEET 1: ARCHIVE TITLE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left border-b border-[#e5dfd0] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl flex flex-col items-start gap-4">
              <span className="text-[9px] tracking-[0.5em] text-[#bc6c25] font-mono uppercase mb-4">[ SPECIMEN NO. 901 ]</span>
              
              <div className="p-8 bg-[#faf6eb]/90 border border-[#e5dfd0] shadow-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#3d322b]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#606c38]/40 my-6" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#606c38] font-mono">SCROLL TO PIN BOTANICALS</p>
            </div>
          </div>
        )}

        {/* ----------------- SHEET 2: SPECIMEN CARD ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left border-b border-[#e5dfd0] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl italic text-[#3d322b] bg-[#faf6eb]/80 p-8 border border-[#e5dfd0] shadow-sm">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SHEET 3: SPECIMEN DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left border-b border-[#e5dfd0] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left z-20"}>
            <span className="text-[9px] tracking-[0.4em] text-[#bc6c25] font-mono uppercase mb-8">ARCHIVAL CLASSIFICATION & DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-[#faf6eb]/90 border border-[#e5dfd0] shadow-sm">
                <Clock className="w-5 h-5 text-[#bc6c25] mb-2" />
                <span className="text-[#3d322b] text-lg">{dateStr}</span>
                <span className="text-[#bc6c25]">{timeStr}</span>
              </div>

              <div id="specimen-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-[#faf6eb]/90 border border-[#e5dfd0] shadow-sm">
                <MapPin className="w-5 h-5 text-[#bc6c25] mb-2" />
                <span className="text-[#3d322b] text-lg">{wedding.venue_name || 'Specimen Garden'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-600 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[9px] text-[#606c38] mt-1 font-mono tracking-widest uppercase">Grid Specimen / Section A</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#606c38] bg-[#faf6eb] text-[#3d322b] hover:bg-[#606c38] hover:text-[#faf6eb] font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXHIBIT COMPASS</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SHEET 4: Specimen Portrait ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left border-b border-[#e5dfd0] py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#bc6c25] font-bold uppercase mb-8">SPECIMEN GRAPH</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] overflow-hidden border-8 border-white shadow-xl bg-[#faf6eb] p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Botanical Herbarium" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-110"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#606c38]/30 bg-[#faf6eb]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SHEET 5: RSVP GUESTBOOK ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-start p-12 text-left py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-start p-12 text-left z-20 overflow-y-auto"}>
            <div id="herbarium-rsvp" className="w-full max-w-md pt-10 pb-6 relative z-10 bg-[#faf6eb]/95 border border-[#e5dfd0] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#bc6c25] block mb-4 uppercase font-bold flex items-center gap-2">
                🍂 T-MINUS TO CURATION START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90 origin-left">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#606c38" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#e5dfd0]">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#606c38] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-[#3d322b] [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-[#3d322b]">
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
