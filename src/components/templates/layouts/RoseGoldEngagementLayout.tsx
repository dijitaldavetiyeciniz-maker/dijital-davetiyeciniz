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

export default function RoseGoldEngagementLayout({
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
  cardBgColor = '#fff1f2',
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

  // Sliding panel coordinates (Signature Moment)
  const panelX1 = prefersReducedMotion ? 0 : -100 + progress * 100; // Left panel slides to center (0%)
  const panelX2 = prefersReducedMotion ? 0 : 100 - progress * 100; // Right panel slides to center (0%)
  const intersectOpacity = prefersReducedMotion ? 0.8 : Math.min(0.8, progress * 1.5);

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-sans bg-rose-50 text-rose-950 border-t-8 border-rose-450"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-rose-gold"
    >
      {/* Metallic blush backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#fff5f5]" />
        
        {/* Layered intersecting geometric panels (Signature Moment) */}
        <div className="absolute inset-x-0 bottom-24 h-48 flex justify-center z-5">
          <div 
            className="w-40 h-40 bg-white/70 border-r border-rose-350 shadow-lg transition-transform duration-100 ease-out"
            style={{
              transform: `translateX(${panelX1}px)`
            }}
          />
          <div 
            className="w-40 h-40 bg-white/70 border-l border-rose-350 shadow-lg transition-transform duration-100 ease-out"
            style={{
              transform: `translateX(${panelX2}px)`
            }}
          />
          {/* Overlapping intersection point indicator */}
          <div 
            className="absolute top-16 w-8 h-8 rounded-full border-2 border-rose-450 flex items-center justify-center font-bold text-xs text-rose-500 z-10 transition-opacity duration-200"
            style={{
              opacity: intersectOpacity
            }}
          >
            &amp;
          </div>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SESSION 1: ENTRANCE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-rose-100 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-rose-500 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-white/95 border border-rose-200 shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-rose-950" style={{ fontFamily: `"${headingFont}", sans-serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&amp;</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-rose-400/40 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-rose-500 font-mono">SCROLL TO MERGE TRANSPARENT LAYERS</p>
            </div>
          </div>
        )}

        {/* ----------------- SESSION 2: DINNER PROLOGUE ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-rose-100 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-xl font-medium leading-relaxed max-w-2xl px-6 text-rose-900 bg-white/95 p-8 border border-rose-150 shadow-sm">
              <div className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mb-4">RECEPTION ABSTRACT</div>
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SESSION 3: COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-rose-100 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-rose-500 font-bold uppercase mb-8">EVENT DIRECTORY & DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-white border border-rose-150 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-rose-500 mb-2" />
                <span className="text-rose-950 text-lg">{dateStr}</span>
                <span className="text-rose-500">{timeStr}</span>
              </div>

              <div id="rose-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-white border border-rose-150 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-rose-500 mb-2" />
                <span className="text-rose-950 text-lg">{wedding.venue_name || 'Garden'}</span>
                {wedding.venue_address && (
                  <span className="text-rose-700 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-rose-500 mt-1 font-mono tracking-widest uppercase">SECTION A // ROOFTOP DINING</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-rose-450 bg-white text-rose-700 hover:bg-rose-950 hover:text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>EXHIBIT COMPASS</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SESSION 4: PICTURE FRAME ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-rose-100 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-rose-500 font-bold uppercase mb-8">PORTRAIT TRANSMISSION</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border border-rose-200 shadow-2xl bg-white p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Rose Gold Engagement" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-110"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-rose-300 bg-white">
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
            <div id="rose-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white border border-rose-200 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-rose-500 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🥂 T-MINUS TO RECEPTION START
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#881337" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-rose-200">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-rose-950 [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-rose-900 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-[#4c0519]">
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
