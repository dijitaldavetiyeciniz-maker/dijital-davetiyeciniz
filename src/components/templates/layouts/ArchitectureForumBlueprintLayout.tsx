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

export default function ArchitectureForumBlueprintLayout({
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
  cardBgColor = '#1e3a8a',
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

  // Extrude building heights (Signature Moment)
  const structuralHeight = prefersReducedMotion ? 60 : progress * 60; // scale height in svg
  const drawingDashOffset = prefersReducedMotion ? 0 : 400 - progress * 400;

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-blue-900 text-blue-100"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-architecture-forum"
    >
      {/* Drafting Blueprint Grid Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#1e3a8a]" />
        
        {/* Engineering blueprint square grid lines */}
        <div className="absolute inset-0 opacity-15"
             style={{
               backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} 
        />

        {/* 3D Silhouette Building extrusion SVG (Signature Moment) */}
        <div className="absolute bottom-16 inset-x-0 flex justify-center z-5">
          <svg className="w-80 h-48 text-cyan-200" viewBox="0 0 100 60">
            {/* Draw blueprint frame */}
            <rect x="2" y="2" width="96" height="56" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            
            {/* Structural building outline (height changes on scroll) */}
            <path 
              d={`M 10,55 L 10,${55 - structuralHeight * 0.4} L 35,${55 - structuralHeight * 0.4} L 35,${55 - structuralHeight * 0.75} L 65,${55 - structuralHeight * 0.75} L 65,${55 - structuralHeight * 0.3} L 90,${55 - structuralHeight * 0.3} L 90,55 Z`}
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              style={{
                strokeDashoffset: drawingDashOffset,
                strokeDasharray: '400'
              }}
            />

            {/* Scale lines */}
            <line x1="5" y1="55" x2="95" y2="55" stroke="currentColor" strokeWidth="0.5" />
            <line x1="50" y1="5" x2="50" y2="55" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 1" />
          </svg>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: DESIGN COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-blue-800/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-cyan-300 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-blue-950/90 border border-cyan-400 shadow-2xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-widest text-slate-100" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-60 block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-cyan-400/55 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-mono">SCROLL TO DRAW WIREFRAME</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: FORUM MANIFESTO ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-blue-800/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl px-6 italic text-slate-200 bg-blue-950/80 p-8 border border-cyan-500/20 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: STRUCTURAL PLANS ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-blue-800/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-cyan-300 font-bold uppercase mb-8">FORUM DIRECTORY & ELEVATIONS</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-bold mb-8">
              <div className="flex flex-col gap-2 p-6 bg-blue-950/90 border border-cyan-500/20 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-cyan-300 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-cyan-300">{timeStr}</span>
              </div>

              <div id="architecture-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-blue-950/90 border border-cyan-500/20 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-cyan-300 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Draft Hall'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-350 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-cyan-350 mt-1 font-mono tracking-widest uppercase">Elevation: +14.50m / Hall 3</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-cyan-400 bg-blue-950/60 text-white hover:bg-white hover:text-blue-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>ELEVATION PLAN</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-blue-800/30 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-cyan-300 font-bold uppercase mb-8">RENDER BLUEPRINT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border border-cyan-500/20 shadow-2xl bg-blue-950 p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Architecture Forum" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-125"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-cyan-500 bg-blue-900">
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
            <div id="architecture-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-blue-950/95 border border-cyan-500/20 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-300 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                📏 T-MINUS TO EXHIBITION LAUNCH
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#06b6d4" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-cyan-500/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-cyan-500 [&>button]:text-blue-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-cyan-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-blue-100 font-sans">
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
