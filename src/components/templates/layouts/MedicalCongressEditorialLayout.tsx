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

export default function MedicalCongressEditorialLayout({
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
  cardBgColor = '#ffffff',
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

  // Microscope cells focus offset (Signature Moment)
  const cellBlur = prefersReducedMotion ? 0 : Math.max(0, (1 - progress * 2) * 8); // in px
  const cellScale = prefersReducedMotion ? 1 : 0.8 + progress * 0.2;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-sans bg-white text-[#1e293b] border-t-8 border-[#0284c7]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-medical-congress"
    >
      {/* Clean Scientific Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        {/* Focused Cell structures SVG (Signature Moment) */}
        <div 
          className="transition-all duration-200"
          style={{
            filter: `blur(${cellBlur}px)`,
            transform: `scale(${cellScale})`,
            opacity: 0.12
          }}
        >
          <svg className="w-80 h-80 text-[#0284c7]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="50" cy="50" r="30" />
            <circle cx="50" cy="50" r="8" strokeDasharray="2 2" />
            <circle cx="35" cy="40" r="4" fill="currentColor" />
            <circle cx="65" cy="55" r="5" fill="currentColor" />
            {/* Connection vectors */}
            <line x1="35" y1="40" x2="50" y2="50" />
            <line x1="65" y1="55" x2="50" y2="50" />
          </svg>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: JOURNAL COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-slate-100 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#0284c7] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-white border border-[#e2e8f0] shadow-sm max-w-md">
                <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#0f172a]" style={{ fontFamily: `"${headingFont}", sans-serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#0284c7]/40 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#0284c7] font-mono">SCROLL TO MAGNIFY SCENARIO</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: SCIENTIFIC ABSTRACT ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-slate-100 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-xl font-medium leading-relaxed max-w-2xl px-6 text-[#334155] bg-slate-50 p-8 border border-slate-200">
              <div className="text-[10px] text-red-600 font-bold uppercase tracking-widest mb-4">ABSTRACT // INVITATION</div>
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: SESSION ANNOTATIONS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-slate-100 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#0284c7] font-bold uppercase mb-8">SESSION SCHEDULE & HALL ASSIGNMENTS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-white border border-slate-200 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-[#0284c7] mb-2" />
                <span className="text-[#0f172a] text-lg">{dateStr}</span>
                <span className="text-[#0284c7]">{timeStr}</span>
              </div>

              <div id="medical-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-white border border-slate-200 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#0284c7] mb-2" />
                <span className="text-[#0f172a] text-lg">{wedding.venue_name || 'Congress Hall'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-500 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-red-600 mt-1 font-mono tracking-widest uppercase">HALL A / MAIN NAve</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#0284c7] bg-white text-[#0284c7] hover:bg-[#0284c7] hover:text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXHIBIT MAP LAYOUT</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-slate-100 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#0284c7] font-bold uppercase mb-8">DOCUMENTATION ATTACHMENT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border border-slate-200 shadow-2xl bg-white p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Medical Congress" 
                  className="w-full h-full object-cover"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: REGISTRATION & RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="medical-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white border border-slate-300 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#0284c7] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🔴 COUNTDOWN TO SESSION START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#0f172a" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-slate-200">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#0284c7] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-sky-750 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-[#1e293b] font-sans">
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
