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

export default function EngagementRingAtelierLayout({
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
  cardBgColor = '#fafafa',
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

  // Ring drawing progress (Signature Moment)
  const ringDashOffset = prefersReducedMotion ? 0 : 350 - progress * 350;
  const gemOpacity = prefersReducedMotion ? 1 : Math.min(1, progress * 2.0);

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-slate-50 text-slate-800 border-t-8 border-amber-600"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-ring-atelier"
    >
      {/* Jewelry Workbench Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#f8fafc]" />
        
        {/* Drawing blueprints grid */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: 'radial-gradient(circle, #b45309 1px, transparent 1px)',
               backgroundSize: '24px 24px'
             }} 
        />

        {/* Ring blueprint drawing SVG (Signature Moment) */}
        <div className="absolute w-80 h-80 transition-all duration-200">
          <svg className="w-full h-full text-amber-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            {/* Draw ring blueprint outline */}
            <circle 
              cx="50" 
              cy="60" 
              r="22" 
              strokeDasharray="350"
              style={{
                strokeDashoffset: ringDashOffset
              }}
            />
            {/* Jewelry gem facets setting (fades in on scroll) */}
            <polygon 
              points="50,22 42,32 58,32" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2"
              style={{
                opacity: gemOpacity
              }}
            />
            <line x1="50" y1="22" x2="50" y2="32" stroke="currentColor" strokeWidth="0.8" style={{ opacity: gemOpacity }} />
          </svg>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: DESIGN SHEET COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-slate-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-amber-700 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-white border border-slate-350 shadow-2xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-slate-900" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-amber-600/40 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-amber-700 font-mono">SCROLL TO EXTRUDE SETTING</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: ATELIER STATEMENT ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-slate-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl px-6 italic text-slate-700 bg-white/95 p-8 border border-slate-250 shadow-sm">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: WORKBENCH COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-slate-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-amber-700 font-bold uppercase mb-8">WORKBENCH SPECIFICATIONS & CODES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-white border border-slate-200 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-amber-600 mb-2" />
                <span className="text-slate-900 text-lg">{dateStr}</span>
                <span className="text-amber-600">{timeStr}</span>
              </div>

              <div id="atelier-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-white border border-slate-200 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-amber-600 mb-2" />
                <span className="text-slate-900 text-lg">{wedding.venue_name || 'Design Atelier'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-500 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[9px] text-amber-600 mt-1 font-mono tracking-widest uppercase">Bench 4 / Craft Center</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-amber-600 bg-white text-slate-800 hover:bg-slate-900 hover:text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXHIBIT TARGET</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-slate-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-amber-700 font-bold uppercase mb-8">EDITORIAL ATTACHMENT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-slate-350 shadow-2xl bg-white p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Engagement Ring Atelier" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-125"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
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
            <div id="atelier-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white border border-slate-300 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-600 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🔒 T-MINUS TO CEREMONY START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#1e293b" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-slate-200">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-amber-600 [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-700 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
