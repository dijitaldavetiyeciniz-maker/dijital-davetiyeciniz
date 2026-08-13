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

export default function KoreanHanokLayout({
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
  cardBgColor = '#fafaf9',
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
      className="w-full relative overflow-x-hidden font-serif bg-[#fafaf9] text-[#292524]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-korean-hanok"
    >
      {/* Timber & Hanji Paper Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#fafaf9]" />
        
        {/* Soft Hanji paper fiber texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1000')] bg-repeat bg-center" />

        {/* Slow bamboo branch shadow crawls across paper screen on scroll (Signature Moment) */}
        {!prefersReducedMotion && (
          <div 
            className="absolute top-10 right-[-10%] w-96 h-96 opacity-[0.07] bg-contain bg-no-repeat pointer-events-none transition-transform duration-500"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1000")',
              transform: `translate(${-progress * 40}px, ${progress * 20}px) rotate(${15 + progress * 5}deg)`,
              filter: 'grayscale(100%) blur(4px)'
            }}
          />
        )}
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: HANOK PAPER COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              
              {/* Minimal timber outline block */}
              <div className="w-16 h-16 border-2 border-[#78350f]/30 flex items-center justify-center mb-8 bg-stone-50">
                <span className="text-[#78350f] text-xs font-mono">禪</span>
              </div>

              <span className="text-[10px] tracking-[0.4em] text-stone-500 font-bold uppercase mb-4">{eventTitle}</span>
              <h1 className="text-4xl sm:text-6xl font-light uppercase tracking-widest text-[#292524]" style={{ fontFamily: `"${headingFont}", serif` }}>
                {wedding.bride_name} <br/>
                <span className="text-lg opacity-30 font-light block my-4">-</span>
                {wedding.groom_name}
              </h1>
              
              <div className="h-px w-20 bg-stone-300 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500 font-mono">SCROLL TO OPEN SCREEN</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRY WASH ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-[#44403c] border-l-2 border-stone-300 pl-6">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: HANJI PANEL DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-stone-500 font-bold uppercase mb-8">HANJI SCREEN SCHEDULE</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div id="hanok-details-panel-1" className="flex flex-col gap-2 p-6 rounded-none border border-stone-300 bg-stone-50 shadow-sm">
                <Calendar className="w-5 h-5 mx-auto text-stone-700 mb-2" />
                <span className="text-stone-850 text-lg">{dateStr}</span>
                <span className="text-stone-600">{timeStr}</span>
              </div>

              <div id="hanok-details-panel-2" className="flex flex-col gap-2 p-6 rounded-none border border-stone-300 bg-stone-50 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-stone-700 mb-2" />
                <span className="text-stone-850 text-lg">{wedding.venue_name || 'Traditional Hanok'}</span>
                {wedding.venue_address && (
                  <span className="text-stone-600 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-stone-400 bg-stone-50 text-stone-700 hover:bg-stone-800 hover:text-white rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>MAP TO HANOK</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-stone-500 font-bold uppercase mb-8">HANJI ALBUM SLIDE</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-none overflow-hidden border border-stone-300 bg-stone-50 p-2">
              <div className="w-full h-full border border-stone-200 overflow-hidden relative">
                {couplePhoto ? (
                  <SafeImage 
                    src={couplePhoto} 
                    alt="Hanok Couple" 
                    className="w-full h-full object-cover grayscale opacity-90"
                    isHero={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100">
                    <Heart className="w-12 h-12 mb-2 opacity-35" />
                    <span className="text-[10px] tracking-wider uppercase opacity-55">MUTLU KARE</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: HANJI PLAQUE RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-stone-50 border border-stone-300 rounded-none p-6 shadow-xl">
              <span className="text-[10px] font-mono tracking-[0.25em] text-stone-600 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-stone-700" /> T-MINUS TO CEREMONY
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#78350f" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-stone-300">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#78350f] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-stone-800 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
