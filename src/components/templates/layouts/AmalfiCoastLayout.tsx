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

export default function AmalfiCoastLayout({
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
  cardBgColor = '#fffbeb',
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
      className="w-full relative overflow-x-hidden font-serif bg-[#fffbeb] text-slate-800"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-amalfi-coast"
    >
      {/* Amalfi Coast Background Parallax Stack */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Layer 1: Background Cobalt Sea & Cliffs */}
        <div 
          className="absolute inset-0 bg-[#075985] bg-cover bg-center transition-transform duration-100 ease-out"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000")',
            transform: prefersReducedMotion ? 'none' : `scale(1.1) translateY(${progress * 40}px)`
          }}
        />

        {/* Layer 2: Midground Pergola Shadows */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-transparent to-sky-950/40 transition-transform duration-100 ease-out"
          style={{
            transform: prefersReducedMotion ? 'none' : `translateY(${progress * -30}px)`
          }}
        />

        {/* Layer 3: Foreground Lemon Branches (Signature Moment) */}
        {!prefersReducedMotion && (
          <div 
            className="absolute top-0 inset-x-0 h-48 bg-contain bg-top bg-no-repeat opacity-90 transition-transform duration-100 ease-out pointer-events-none"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=1000")',
              transform: `translateY(${progress * -80}px) scale(${1 + progress * 0.05})`
            }}
          />
        )}
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: COAST TITLE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-100/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-[#d97706] font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-[#fffbeb]/90 backdrop-blur-md rounded-none border-2 border-double border-[#d97706]/40 shadow-xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#78350f]" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-[#d97706]/30 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-white font-mono drop-shadow">SCROLL DOWN TO DEPART TO THE COAST</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-100/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-xl sm:text-3xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-[#78350f] bg-[#fffbeb]/85 backdrop-blur-sm p-8 rounded-none border border-[#d97706]/20 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: DETAILS PERGOLA ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-100/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-[#d97706] font-bold uppercase mb-8">AMALFI PERGOLA DETAILS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 rounded-none border border-[#d97706]/20 bg-[#fffbeb]/90 shadow-sm">
                <Calendar className="w-5 h-5 mx-auto text-[#d97706] mb-2" />
                <span className="text-[#78350f] text-lg">{dateStr}</span>
                <span className="text-[#d97706]">{timeStr}</span>
              </div>

              <div id="amalfi-pergola-plaque" className="flex flex-col gap-2 p-6 rounded-none border border-[#d97706]/20 bg-[#fffbeb]/90 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-[#d97706] mb-2" />
                <span className="text-[#78350f] text-lg">{wedding.venue_name || 'Lemon Pergola'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-600 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-[#d97706]/40 bg-[#fffbeb]/80 text-[#d97706] hover:bg-[#d97706] hover:text-white rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>MAPS LOCATION</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: POSTCARD GALLERY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-100/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-[#d97706] font-bold uppercase mb-8">COASTAL POSTCARD</span>
            
            {/* Postcard Styled Gallery View */}
            <div id="amalfi-postcard-frame" className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-none overflow-hidden border-[12px] border-white shadow-2xl bg-white rotate-2 hover:rotate-0 transition-transform duration-300">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Amalfi Couple" 
                  className="w-full h-full object-cover"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#d97706]/40 bg-[#fffbeb]">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">POSTCARD VIEW</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div id="amalfi-lemon-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-[#fffbeb]/95 border border-[#d97706]/20 rounded-none p-6 shadow-2xl backdrop-blur-sm">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#d97706] block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#d97706]" /> COUNTDOWN TO LAUNCH
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#d97706" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-[#d97706]/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-[#d97706] [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-700 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
