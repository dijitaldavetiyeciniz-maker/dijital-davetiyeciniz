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

export default function TuscanyVineyardLayout({
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
  cardBgColor = '#faf5ff',
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
      className="w-full relative overflow-x-hidden font-serif bg-[#fafaf9] text-stone-850"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-tuscany-vineyard"
    >
      {/* Tuscany Vineyard Landscape Parallax Stack */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Layer 1: Background Estate Hills */}
        <div 
          className="absolute inset-0 bg-[#d6d3d1] bg-cover bg-center transition-transform duration-100 ease-out"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1504198266287-1659872e6590?q=80&w=1000")',
            transform: prefersReducedMotion ? 'none' : `scale(1.1) translateY(${progress * 50}px)`
          }}
        />

        {/* Layer 2: Midground Rolling Hills Outline */}
        <div 
          className="absolute inset-x-0 bottom-24 h-48 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-800/10 via-transparent to-transparent pointer-events-none transition-transform duration-100 ease-out"
          style={{
            transform: prefersReducedMotion ? 'none' : `translateY(${progress * -30}px)`
          }}
        />

        {/* Layer 3: Foreground Vineyard Parallax leaves (Signature Moment) */}
        {!prefersReducedMotion && (
          <div 
            className="absolute bottom-0 inset-x-0 h-32 bg-contain bg-bottom bg-no-repeat opacity-[0.06] transition-transform duration-100 ease-out"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1000")',
              transform: `translateY(${progress * -60}px) scale(${1 + progress * 0.05})`
            }}
          />
        )}
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: VINEYARD TITLE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#78350f] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-[#fafaf9]/90 backdrop-blur-md rounded-none border border-stone-300 shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#451a03]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-stone-300 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#451a03] font-mono">SCROLL THROUGH THE CYPRESS VALLEYS</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRIC STORY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-[#451a03] bg-white/70 backdrop-blur-sm p-8 rounded-none border border-stone-200 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: ESTATE DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#78350f] font-bold uppercase mb-8">VINEYARD ESTATE CHAPTERS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div id="tuscany-details-panel-1" className="flex flex-col gap-2 p-6 rounded-none border border-stone-300 bg-white/95 shadow-sm">
                <Calendar className="w-5 h-5 mx-auto text-[#78350f] mb-2" />
                <span className="text-[#451a03] text-lg">{dateStr}</span>
                <span className="text-amber-800">{timeStr}</span>
              </div>

              <div id="tuscany-details-panel-2" className="flex flex-col gap-2 p-6 rounded-none border border-stone-300 bg-white/95 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#78350f] mb-2" />
                <span className="text-[#451a03] text-lg">{wedding.venue_name || 'Tuscany Estate'}</span>
                {wedding.venue_address && (
                  <span className="text-stone-600 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-stone-400 bg-white/60 text-[#78350f] hover:bg-[#78350f] hover:text-white rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>ESTATE LOCATION</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-stone-200 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#78350f] font-bold uppercase mb-8">VINEYARD ALBUM</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-none overflow-hidden border border-stone-300 shadow-2xl bg-white p-2">
              <div className="w-full h-full border border-stone-200 overflow-hidden relative">
                {couplePhoto ? (
                  <SafeImage 
                    src={couplePhoto} 
                    alt="Tuscany Couple" 
                    className="w-full h-full object-cover"
                    isHero={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-50">
                    <Heart className="w-12 h-12 mb-2 opacity-35" />
                    <span className="text-[10px] tracking-wider uppercase opacity-55">PORTRAIT</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="tuscany-manor-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white/95 border border-stone-300 rounded-none p-6 shadow-2xl backdrop-blur-sm">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#78350f] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#78350f]" /> COUNTDOWN TO CEREMONY
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#78350f" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-stone-300">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#78350f] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-stone-850 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
