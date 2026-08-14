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

export default function RobotLaboratoryLayout({
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
  cardBgColor = '#0f172a',
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

  // Mechanical components translation offsets (Signature Moment)
  const armOffset = prefersReducedMotion ? 0 : (1 - progress) * -40; // in px
  const headOffset = prefersReducedMotion ? 0 : (1 - progress) * -60; // in px
  const gearRotation = prefersReducedMotion ? 0 : progress * 360; // in degrees

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-x-hidden font-mono bg-slate-900 text-slate-100"
      style={{ height: prefersReducedMotion ? 'auto' : '350vh' }}
      data-testid="layout-robot-laboratory"
    >
      {/* Robotics Laboratory Blueprint Grid Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0f172a]" />
        
        {/* Futuristic blueprint matrix lines */}
        <div className="absolute inset-0 opacity-15"
             style={{
               backgroundImage: 'linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)',
               backgroundSize: '24px 24px'
             }} 
        />

        {/* Assembling Robot Mascot SVG (Signature Moment) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-64 h-64 text-cyan-400 opacity-60" viewBox="0 0 100 100">
            {/* Rotating Gear background */}
            <g transform={`translate(50, 50) rotate(${gearRotation}) translate(-50, -50)`}>
              <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" fill="none" />
              {[...Array(6)].map((_, i) => (
                <rect key={i} x="47" y="14" width="6" height="8" rx="1" fill="currentColor" transform={`rotate(${i * 60} 50 50)`} />
              ))}
            </g>

            {/* Robot Head (falls down on scroll) */}
            <g transform={`translate(0, ${headOffset})`}>
              {/* Head block */}
              <rect x="35" y="32" width="30" height="20" rx="4" className="fill-slate-800 stroke-cyan-400 stroke-2" />
              {/* Eyes */}
              <circle cx="43" cy="42" r="3" className="fill-cyan-300 animate-pulse" />
              <circle cx="57" cy="42" r="3" className="fill-cyan-300 animate-pulse" />
              {/* Antenna */}
              <line x1="50" y1="32" x2="50" y2="24" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="22" r="2" fill="currentColor" />
            </g>

            {/* Robot Left Arm (slides in from left) */}
            <g transform={`translate(${armOffset}, 0)`}>
              <line x1="20" y1="58" x2="35" y2="58" stroke="currentColor" strokeWidth="3" />
              <circle cx="18" cy="58" r="3" fill="currentColor" />
            </g>

            {/* Robot Right Arm (slides in from right) */}
            <g transform={`translate(${-armOffset}, 0)`}>
              <line x1="65" y1="58" x2="80" y2="58" stroke="currentColor" strokeWidth="3" />
              <circle cx="82" cy="58" r="3" fill="currentColor" />
            </g>

            {/* Robot Torso body */}
            <rect x="30" y="52" width="40" height="26" rx="6" className="fill-slate-800 stroke-cyan-400 stroke-2" />
            {/* Heart plate */}
            <path d="M 50,68 C 50,68 47,65 47,63 C 47,61 48.5,59.5 50,61 C 51.5,59.5 53,61 53,63 C 53,65 50,68 50,68 Z" fill="#ec4899" />
          </svg>
        </div>
      </div>

      {/* Viewport content */}
      <div className={prefersReducedMotion ? 'relative w-full flex flex-col' : 'sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between z-10'}>

        {/* ----------------- SCENE 1: SYSTEM COVER ----------------- */}
        {(prefersReducedMotion || (progress >= 0 && progress < 0.22)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-cyan-900/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center animate-fade-in z-20"}>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-[10px] tracking-[0.45em] text-cyan-400 font-bold uppercase mb-6">{eventTitle}</span>
              
              <div className="p-8 bg-slate-950/80 backdrop-blur-md rounded-none border border-cyan-500/30 shadow-2xl max-w-md">
                <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-slate-100" style={{ fontFamily: `"${headingFont}", serif` }}>
                  {wedding.bride_name} <br/>
                  <span className="text-lg opacity-40 font-light block my-3">&</span>
                  {wedding.groom_name}
                </h1>
              </div>
              
              <div className="h-px w-20 bg-cyan-950/40 my-8" />
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-mono">SCROLL TO BOOT THE MECHANICS</p>
            </div>
          </div>
        )}

        {/* ----------------- SCENE 2: POETRY ----------------- */}
        {(prefersReducedMotion || (progress >= 0.22 && progress < 0.42)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-cyan-900/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <div className="text-lg sm:text-2xl font-light leading-relaxed max-w-xl font-serif px-6 italic text-slate-200 bg-slate-950/70 backdrop-blur-md p-8 border border-cyan-950/20 shadow-md">
              "{renderQuote()}"
            </div>
          </div>
        )}

        {/* ----------------- SCENE 3: LAB COORDINATES ----------------- */}
        {(prefersReducedMotion || (progress >= 0.42 && progress < 0.65)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-cyan-900/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.35em] text-cyan-400 font-bold uppercase mb-8">LAB COORDINATES</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-sm font-semibold mb-8 font-mono">
              <div className="flex flex-col gap-2 p-6 bg-slate-950/80 border border-cyan-500/20 shadow-sm">
                <Clock className="w-5 h-5 mx-auto text-cyan-400 mb-2" />
                <span className="text-white text-lg">{dateStr}</span>
                <span className="text-cyan-400">{timeStr}</span>
              </div>

              <div id="robot-coordinates-plaque" className="flex flex-col gap-2 p-6 bg-slate-950/80 border border-cyan-500/20 shadow-sm">
                <MapPin className="w-5 h-5 mx-auto text-cyan-400 mb-2" />
                <span className="text-white text-lg">{wedding.venue_name || 'Inventor Lab'}</span>
                {wedding.venue_address && (
                  <span className="text-slate-400 leading-normal text-xs">{wedding.venue_address}</span>
                )}
                <span className="text-[10px] text-cyan-450 mt-1 font-mono tracking-widest uppercase">Grid: Sector 45 / Mech Area</span>
              </div>
            </div>

            {hasMaps && (
              <button 
                onClick={handleMapClick}
                className="px-6 h-12 border border-cyan-500/30 bg-slate-950/60 text-white hover:bg-cyan-500 hover:text-slate-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>LAB NAVIGATION</span>
              </button>
            )}
          </div>
        )}

        {/* ----------------- SCENE 4: GALLERY SCREEN ----------------- */}
        {(prefersReducedMotion || (progress >= 0.65 && progress < 0.85)) && (
          <div className={prefersReducedMotion ? "relative w-full min-h-screen flex flex-col justify-center items-center p-6 text-center border-b border-cyan-900/20 py-24 z-20" : "absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-20"}>
            <span className="text-[10px] tracking-[0.3em] text-cyan-400 font-bold uppercase mb-8">BLUEPRINT SNAPSHOT</span>
            
            <div className="relative w-full max-w-sm aspect-[4/3] mx-auto overflow-hidden border-4 border-cyan-500/20 shadow-2xl bg-slate-950 p-2">
              {couplePhoto ? (
                <SafeImage 
                  src={couplePhoto} 
                  alt="Robot Laboratory" 
                  className="w-full h-full object-cover grayscale opacity-90 contrast-125"
                  isHero={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-cyan-500 bg-[#0f172a]">
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
            <div id="robot-rsvp" className="w-full max-w-md mx-auto pt-10 pb-6 relative z-10 bg-slate-950/95 border border-cyan-500/20 p-6 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-300 block mb-4 uppercase font-bold flex items-center justify-center gap-2">
                ⚙️ ACCESS SYSTEM TIMER
              </span>

              {wedding.wedding_date && (
                <div className="mb-6 scale-90">
                  <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#22d3ee" styleType="elegant" />
                </div>
              )}

              <div className="w-full space-y-6 pt-4 border-t border-dashed border-cyan-500/20">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:h-14 [&>button]:bg-cyan-500 [&>button]:text-slate-950 [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs [&>button]:font-black [&>button]:hover:bg-cyan-400 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-none">
                    {renderRsvpButton()}
                  </div>
                )}
                
                <div className="w-full text-slate-100 font-sans">
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
