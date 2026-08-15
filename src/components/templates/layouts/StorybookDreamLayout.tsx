'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, BookOpen, Clock, Heart } from 'lucide-react';
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

export default function StorybookDreamLayout({
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
  cardBgColor = '#f5eae1',
  selectedBackground,
  cardSurfaceStyle
}: LayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, activeScene } = useSceneProgress(containerRef, 5);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const couplePhoto = wedding.bride_photo_url || wedding.groom_name_url || wedding.background_image_url || '';
  const showRsvp = wedding.show_rsvp !== false;
  const hasMaps = !!wedding.google_maps_url;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-serif bg-[#fdf8f5] text-[#1e293b]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-cinematic-storybook"
    >
      {/* Soft warm paper textured background layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#f5eae1]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1000')] bg-repeat bg-center" />
      </div>

      {/* Sticky viewport for animation tracking */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>
        
        {/* ----------------- SCENE 1: BOOK COVER / TITLE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-900/10 py-24" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <span className="text-[10px] tracking-[0.4em] text-amber-800 font-bold uppercase mb-6 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-700" /> BİRİNCİ BÖLÜM: BAŞLANGIÇ
            </span>
            
            <h1 className="text-5xl sm:text-7xl font-bold text-amber-900 leading-tight tracking-wide" style={{ fontFamily: `"${headingFont}", serif` }}>
              {wedding.bride_name} <br/>
              <span className="text-3xl font-serif italic text-amber-600 block my-4">&amp;</span>
              {wedding.groom_name}
            </h1>
            <div className="h-[2px] w-20 bg-amber-800/20 my-8" />
            <p className="text-xs uppercase tracking-[0.3em] text-amber-800/60 font-mono">SCROLL TO OPEN BOOK</p>
          </div>
        )}

        {/* ----------------- SCENE 2: POP-UP PAPER-CUT NAMES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-900/10 py-24" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            {/* Pop-up Paper Cut animation container */}
            <div 
              className="relative bg-white/95 border border-amber-900/10 p-8 rounded-2xl shadow-2xl max-w-sm mx-auto flex flex-col items-center justify-center text-center"
              style={{
                transform: prefersReducedMotion ? 'scale(1) rotateX(0deg)' : `scale(${0.95 + (progress - 0.22) * 0.25}) rotateX(${(0.42 - progress) * 90}deg)`,
                perspective: '1000px',
                transition: 'transform 0.1s ease-out'
              }}
            >
              <span className="text-4xl font-serif italic text-amber-700/80 mb-4 float-left">B</span>
              <div className="text-lg leading-relaxed text-slate-800 italic px-4">
                "{renderQuote()}"
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: STORYBOOK CHAPTERS (DETAILS) ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-900/10 py-24" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-amber-800 font-bold uppercase mb-8">İKİNCİ BÖLÜM: DETAYLAR</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-10">
              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-amber-900/15 bg-white/80 shadow-md">
                <Calendar className="w-5 h-5 mx-auto text-amber-700 mb-2" />
                <span className="text-amber-900 text-lg">{dateStr}</span>
                <span className="text-slate-600 font-mono text-xs">{timeStr}</span>
              </div>

              <div className="flex flex-col gap-2 p-6 rounded-2xl border border-amber-900/15 bg-white/80 shadow-md">
                <MapPin className="w-5 h-5 mx-auto text-amber-700 mb-2" />
                <span className="text-amber-900 text-lg">{wedding.venue_name || 'Masal Bahçesi'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-600 leading-normal text-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-amber-800/30 bg-white/90 text-amber-900 hover:bg-amber-800 hover:text-white rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2 shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                <span>YOL TARİFİ AL</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: STORYBOOK PHOTO ALBUM ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-amber-900/10 py-24" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-amber-800 font-bold uppercase mb-8">ANI SAYFALARI</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-2xl overflow-hidden border-8 border-white shadow-2xl bg-white">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Storybook Couple" 
                  className="w-full h-full object-cover"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-amber-700 bg-amber-50">
                  <Heart className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[10px] tracking-wider uppercase opacity-55">MUTLU SAYFALAR</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: FINAL CHAPTER RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center py-24" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto"}>
            <div className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-white/95 border border-amber-900/10 rounded-2xl p-6 shadow-2xl">
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-800 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" /> MUTLU SONA GERİ SAYIM
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#b45309" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-amber-900/10">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-amber-800 [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-900 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-full">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full">
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
