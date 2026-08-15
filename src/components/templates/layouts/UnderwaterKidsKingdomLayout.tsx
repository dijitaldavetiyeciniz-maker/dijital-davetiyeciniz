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

export default function UnderwaterKidsKingdomLayout({
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
  cardBgColor = '#e0f2fe',
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

  // Sea creatures translation offsets (Signature Moment)
  const fishOffset = prefersReducedMotion ? 0 : (1 - progress) * 120; // in px
  const bubbleScale = prefersReducedMotion ? 1 : 0.6 + progress * 0.4;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-sky-100 text-sky-900"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-underwater-kids"
    >
      {/* Aquatic Storybook Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]" />
        
        {/* Floating Bubble circles */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 left-12 w-6 h-6 rounded-full border-2 border-white/50" style={{ transform: `scale(${bubbleScale})` }} />
          <div className="absolute top-24 right-1/4 w-10 h-10 rounded-full border-2 border-white/30" style={{ transform: `scale(${bubbleScale * 0.8})` }} />
          <div className="absolute bottom-20 left-1/3 w-8 h-8 rounded-full border-2 border-white/40" style={{ transform: `scale(${bubbleScale * 1.2})` }} />
        </div>

        {/* Animated Friendly Turtle / Fish SVG (Signature Moment) */}
        <div 
          className="absolute bottom-32 w-20 h-16 text-sky-400/40 transition-transform duration-100 ease-out"
          style={{
            transform: `translateX(${fishOffset}px)`
          }}
        >
          <svg viewBox="0 0 100 100" fill="currentColor">
            {/* Playful cartoon fish shape */}
            <path d="M 10,50 C 30,30 70,30 90,50 C 70,70 30,70 10,50 Z" />
            <polygon points="10,50 3,40 3,60" />
            <circle cx="75" cy="45" r="3" fill="#fff" />
          </svg>
        </div>

        {/* Coral Castle Silhouettes bottom overlay */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-sky-200/50 backdrop-blur-xs border-t border-white/20" />
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: CORAL COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-300 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-sky-600 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-white/95 rounded-[2.5rem] border-4 border-sky-300 shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-widest text-sky-950" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-60 block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-sky-300 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-sky-600 font-mono">SCROLL TO DIVE IN</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-300 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-bold leading-relaxed max-w-xl px-6 italic text-sky-950 bg-white/80 p-8 rounded-3xl border border-sky-200 shadow-sm">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: KINGDOM DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-300 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-sky-600 font-bold uppercase mb-8">CORAL CASTLE DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-white/90 rounded-3xl border border-sky-200 shadow-sm">
                <Calendar className="w-5 h-5 mx-auto text-sky-600 mb-2" />
                <span className="text-sky-950 text-lg">{dateStr}</span>
                <span className="text-sky-600">{timeStr}</span>
              </div>

              <div id="underwater-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-white/90 rounded-3xl border border-sky-200 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-sky-600 mb-2" />
                <span className="text-sky-950 text-lg">{wedding.venue_name || 'Coral Castle'}</span>
                {wedding.venue_address && (
                  <span className="text-sky-700 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-sky-300 bg-white/90 text-sky-750 hover:bg-sky-655 hover:text-white rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>CASTLE DIRECTIONS</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-sky-300 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-sky-600 font-bold uppercase mb-8">BUBBLE PORTRAIT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl bg-sky-200 p-1 flex items-center justify-center">
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                {couplePhoto ? (
                  <SafeImage 
                    src={couplePhoto} 
                    alt="Underwater Kids Kingdom" 
                    className="w-full h-full object-cover"
                    isHero={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-sky-400 bg-sky-100">
                    <Heart className="w-12 h-12 mb-2 opacity-35" />
                    <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: CONFIRMATION & RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="underwater-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white/95 border border-sky-200 rounded-[3rem] p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-sky-600 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                🫧 T-MINUS TO BUBBLE CELEBRATION
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#0369a1" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-sky-250">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-sky-600 [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-sky-700 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-full">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-sky-900 font-sans">
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
