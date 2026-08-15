'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Compass, Heart, Send } from 'lucide-react';
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

export default function DestinationFilmLayout({
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
  cardBgColor = '#362118',
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

  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';
  const showRsvp = wedding.show_rsvp !== false;
  const hasMaps = !!wedding.google_maps_url;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-sans bg-[#362118] text-[#f4efe9]"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-cinematic-destination"
    >
      {/* Cappadocia Canyon & Floating Balloons Parallax Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Sky gradient representing warm Cappadocia sunrise */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#b05d3a] via-[#362118] to-[#1a0f0a]" />

        {/* Vector canyon silhouette */}
        <div className="absolute bottom-0 inset-x-0 h-[30vh] opacity-25">
          <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
            <path d="M0,300 L150,150 L300,280 L450,180 L600,290 L800,160 L1000,270 L1000,300 Z" fill="#b05d3a" />
            <path d="M0,300 Q250,220 500,280 T1000,290 L1000,300 Z" fill="#1a0f0a" />
          </svg>
        </div>

        {/* Dynamic floating hot air balloons (Signature Moment) */}
        {!prefersReducedMotion && (
          <>
            <div 
              className="absolute pointer-events-none transition-transform duration-100 ease-out z-10"
              style={{
                top: `${40 - (progress * 70)}%`, // floats upwards as scroll increases
                left: '12%',
                transform: 'scale(0.8)'
              }}
            >
              <svg width="60" height="90" viewBox="0 0 60 90">
                <path d="M30,0 C10,0 0,15 0,35 C0,55 15,70 30,80 C45,70 60,55 60,35 C60,15 50,0 30,0 Z" fill="#f59e0b" />
                <rect x="27" y="81" width="6" height="5" fill="#f59e0b" />
                <rect x="25" y="86" width="10" height="4" fill="#8b5a2b" />
              </svg>
            </div>
            <div 
              className="absolute pointer-events-none transition-transform duration-100 ease-out z-10"
              style={{
                top: `${70 - (progress * 90)}%`,
                right: '18%',
                transform: 'scale(0.55)'
              }}
            >
              <svg width="60" height="90" viewBox="0 0 60 90">
                <path d="M30,0 C10,0 0,15 0,35 C0,55 15,70 30,80 C45,70 60,55 60,35 C60,15 50,0 30,0 Z" fill="#ef4444" />
                <rect x="27" y="81" width="6" height="5" fill="#ef4444" />
                <rect x="25" y="86" width="10" height="4" fill="#8b5a2b" />
              </svg>
            </div>
          </>
        )}
      </div>

      {/* Sticky viewport */}
      <div className={prefersReducedMotion ? 'relative w-full' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>
        
        {/* ----------------- SCENE 1: TRAVEL COVER / SUNRISE ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20">
            <span className="text-[10px] tracking-[0.4em] text-amber-400 font-bold uppercase mb-6 flex items-center gap-2">
              <Compass className="w-4 h-4 animate-spin-slow" /> BOARDING JOURNEY PASS
            </span>
            
            <h1 className="text-4xl sm:text-6xl font-light tracking-widest uppercase leading-tight text-[#f4efe9]" style={{ fontFamily: `"${headingFont}", serif` }}>
              {wedding.bride_name} <br/>
              <span className="text-xl font-serif italic text-amber-400 block my-3">and</span>
              {wedding.groom_name}
            </h1>
            <div className="h-px w-20 bg-amber-400/40 my-8" />
            <p className="text-xs uppercase tracking-[0.3em] text-[#f4efe9]/60 font-mono">SCROLL TO LIFT OFF</p>
          </div>
        )}

        {/* ----------------- SCENE 2: LOVE TRAVEL SLOGAN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20">
            <div className="text-xl sm:text-3xl italic text-[#f4efe9] font-serif leading-relaxed max-w-xl border-l border-amber-400/40 pl-6">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: BOARDING PASS DETAILS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20">
            <span className="text-[10px] tracking-[0.35em] text-amber-400 font-bold uppercase mb-8">ROUTE CONFIGURATION</span>
            
            {/* Flight ticket stub card layout */}
            <div className="flex flex-col gap-6 text-left w-full max-w-md font-mono border border-amber-500/20 p-8 bg-neutral-950/70 rounded-xl relative">
              <div className="absolute -top-3 left-6 px-3 bg-amber-500 text-[#362118] text-[9px] font-black tracking-widest uppercase">GATE PASS</div>
              
              <div className="flex justify-between border-b border-amber-500/10 pb-3">
                <div>
                  <div className="text-[9px] text-amber-500/60 uppercase">PASSENGER NAME</div>
                  <div className="text-xs font-bold text-white uppercase">{wedding.bride_name} & {wedding.groom_name}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-amber-500/60 uppercase">FLIGHT</div>
                  <div className="text-xs font-bold text-amber-400">N-2027</div>
                </div>
              </div>

              <div className="flex justify-between border-b border-amber-500/10 pb-3">
                <div>
                  <div className="text-[9px] text-amber-500/60 uppercase">DEPARTURE DATE</div>
                  <div className="text-xs font-bold text-white uppercase">{dateStr}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-amber-500/60 uppercase">BOARDING TIME</div>
                  <div className="text-xs font-bold text-white">{timeStr}</div>
                </div>
              </div>

              <div>
                <div className="text-[9px] text-amber-500/60 uppercase">DESTINATION AIRPORT</div>
                <div className="text-xs font-bold text-white uppercase">{wedding.venue_name || 'Cappadocia Valley'}</div>
                {wedding.venue_address && <div className="text-[9px] text-neutral-400 mt-1">{wedding.venue_address}</div>}
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="mt-8 px-6 h-12 border border-amber-500/40 bg-neutral-950/40 text-amber-200 hover:bg-amber-500 hover:text-[#362118] rounded-none font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>MAP TO VENUE</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: VALLEY FRAME PHOTO ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20">
            <span className="text-[10px] tracking-[0.3em] text-amber-400 font-bold uppercase mb-8">JOURNEY FOOTAGE</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-xl overflow-hidden border border-amber-500/20 shadow-2xl bg-neutral-950">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Destination Couple" 
                  className="w-full h-full object-cover"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-amber-300/50 bg-[#362118]/40">
                  <Send className="w-12 h-12 mb-2 opacity-35" />
                  <span className="text-[9px] uppercase tracking-widest opacity-50">GALLERY CELL</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SCENE 5: COUPON ADMIT RSVP ----------------- */}
        {(prefersReducedMotion || (progress >= 0.85 && progress <= 1)) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20 overflow-y-auto">
            <div className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-neutral-950 border border-amber-500/20 rounded-xl p-6 shadow-2xl">
              
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                COUPON CHECK-IN RSVP
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#f59e0b" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-amber-500/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-amber-500 [&>button]:text-[#362118] [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-amber-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
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
