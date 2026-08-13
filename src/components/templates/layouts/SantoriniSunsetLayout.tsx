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

export default function SantoriniSunsetLayout({
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
  cardBgColor = '#f0f9ff',
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

  // Sunset sky color calculation based on scroll progress (Signature Moment)
  const skyGradient = prefersReducedMotion 
    ? 'linear-gradient(to bottom, #fdba74, #f97316)' 
    : `linear-gradient(to bottom, 
        ${progress < 0.5 ? '#38bdf8' : progress < 0.8 ? '#fb923c' : '#f97316'}, 
        ${progress < 0.5 ? '#bae6fd' : progress < 0.8 ? '#ffedd5' : '#fed7aa'}
      )`;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-sky-50 text-slate-800"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-santorini-sunset"
    >
      {/* Santorini Horizon Sky & Sun */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: skyGradient }}>
        {/* Dynamic Horizon Sun (Signature Moment) */}
        {!prefersReducedMotion && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-amber-200 blur-sm shadow-[0_0_40px_rgba(251,191,36,0.8)] transition-transform duration-100 ease-out"
            style={{
              transform: `translate(-50%, ${100 + progress * 400}px)`,
              opacity: 1 - progress * 0.4
            }}
          />
        )}

        {/* Cycladic architecture silhouettes (sea horizon white curves) */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-white rounded-t-[5rem] shadow-2xl flex flex-col justify-end">
          <div className="absolute top-[-30px] right-10 w-24 h-24 bg-sky-100 rounded-full border-8 border-white" />
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: HORIZON TITLE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-100 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#0284c7] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-white/90 backdrop-blur-md rounded-t-[4rem] rounded-b-[1rem] border border-sky-100 shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#0c4a6e]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-sky-300 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#0c4a6e]/70 font-mono">SCROLL TO WATCH THE AEGEAN SUNSET</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: STORY QUOTE ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-100 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-slate-800 bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-sky-100/50 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: ISLAND COORDINATES DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-100 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#0284c7] font-bold uppercase mb-8">CYCLADIC DETAILS & COORDINATES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-sky-100 bg-white/90 shadow-sm">
                <Calendar className="w-5 h-5 mx-auto text-[#0284c7] mb-2" />
                <span className="text-[#0c4a6e] text-lg">{dateStr}</span>
                <span className="text-[#0284c7]">{timeStr}</span>
              </div>

              <div id="santorini-coordinates-plaque" className="flex flex-col gap-2 p-6 rounded-2xl border border-sky-100 bg-white/90 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#0284c7] mb-2" />
                <span className="text-[#0c4a6e] text-lg">{wedding.venue_name || 'Santorini Terrace'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-500 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-[#0284c7] mt-1 font-mono tracking-widest uppercase">Coordinates: 36.4166° N, 25.4324° E</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#0284c7]/40 bg-white/80 text-[#0284c7] hover:bg-[#0284c7] hover:text-white rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>ISLAND DIRECTORY</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-100 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#0284c7] font-bold uppercase mb-8">SUNSET SNAPSHOT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-white">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Santorini Couple" 
                  className="w-full h-full object-cover"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#0284c7]/40 bg-sky-50">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: CONFIRMATION & RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="santorini-sunset-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white/95 border border-sky-100 rounded-[3rem] p-6 shadow-2xl backdrop-blur-sm">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#0284c7] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#0284c7]" /> T-MINUS TO SUNSET
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#0284c7" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-sky-100">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#0284c7] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-[#0369a1] [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-full">
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
