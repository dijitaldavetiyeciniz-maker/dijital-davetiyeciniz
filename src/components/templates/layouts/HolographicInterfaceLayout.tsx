'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Cpu } from 'lucide-react';

interface LayoutProps {
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
  templateId?: string;
}

export default function HolographicInterfaceLayout(props: LayoutProps) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, dateStr, timeStr, eventTitle, renderTimer, renderRsvpButton, handleMapClick } = props;
  const [pulse, setPulse] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const coupleName = wedding.bride_name && wedding.groom_name 
    ? `${wedding.bride_name} & ${wedding.groom_name}` 
    : wedding.title;

  return (
    <div className="w-full min-h-screen bg-[#070913] text-[#a5f3fc] relative font-mono overflow-x-hidden selection:bg-cyan-500/30">
      {/* Holographic matrix background */}
      <div className="absolute inset-0 pointer-events-none opacity-5 z-0">
        <div className="w-full h-full bg-[radial-gradient(rgba(34,211,238,0.3)_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Futuristic Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto px-6 py-16 space-y-20">
        {/* Title / Hero */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.5em] text-cyan-400 border border-cyan-400/30 py-1.5 px-4 rounded-md bg-cyan-950/20">
            {eventTitle || 'SYSTEM INITIALIZED'}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-cyan-400 animate-pulse" style={{ fontFamily: `"${headingFont}", sans-serif` }}>
            {coupleName}
          </h1>
          <div className="w-24 h-[1px] bg-cyan-500/30" />
          <p className="text-lg tracking-wider text-indigo-400">
            {dateStr} &bull; {timeStr}
          </p>
        </section>

        {/* Counter Widget */}
        <section className="w-full border border-cyan-500/30 rounded-3xl p-8 bg-[#0a0f24]/80 backdrop-blur-md relative overflow-hidden">
          {/* Glowing border effect */}
          <div 
            className="absolute inset-0 border border-cyan-400/40 rounded-3xl transition-opacity duration-1000 ease-in-out"
            style={{ opacity: pulse ? 1 : 0.4 }}
          />
          <h2 className="text-xs uppercase tracking-[0.3em] text-cyan-400 text-center mb-6">Countdown Status</h2>
          {renderTimer()}
        </section>

        {/* Console Log Quote */}
        <section className="w-full bg-[#0a0f24]/90 border border-cyan-500/20 rounded-2xl p-6 font-mono text-sm leading-relaxed text-indigo-300">
          <div className="text-[10px] text-cyan-400/60 mb-2">// LOG MESSAGE INITIALIZATION:</div>
          <span className="text-white">&gt; </span>{props.renderQuote()}
        </section>

        {/* Details Grid */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-cyan-500/20 rounded-3xl p-8 bg-[#0a0f24]/80 backdrop-blur-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-cyan-400 mr-4" />
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider">Date & Time</h3>
                  <p className="text-xs opacity-75">{dateStr} at {timeStr}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-cyan-400 mr-4" />
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider">Coordinates</h3>
                  <p className="text-xs opacity-75">{wedding.venue_address || 'Tech Center Room A'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleMapClick}
              className="w-full py-3 rounded-xl border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400 hover:text-[#070913] transition duration-300 flex items-center justify-center space-x-2 text-xs uppercase tracking-widest font-bold"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Coordinates</span>
            </button>
          </div>

          <div className="border border-cyan-500/20 rounded-3xl p-8 bg-[#0a0f24]/80 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-6">
            <Cpu className="w-10 h-10 text-cyan-400 animate-spin" />
            <h3 className="text-lg font-bold uppercase tracking-wider">Interface Confirmation</h3>
            <p className="text-xs opacity-75 max-w-xs leading-relaxed font-mono">Confirm access permission by completing RSVP response.</p>
            {renderRsvpButton()}
          </div>
        </section>

        {/* Guestbook */}
        <section className="w-full border border-cyan-500/20 rounded-3xl p-8 bg-[#0a0f24]/80 backdrop-blur-md">
          <h3 className="text-xs font-bold mb-6 uppercase tracking-widest text-cyan-400">Registry Subsystem</h3>
          {props.renderGuestBook()}
        </section>
      </div>
    </div>
  );
}
