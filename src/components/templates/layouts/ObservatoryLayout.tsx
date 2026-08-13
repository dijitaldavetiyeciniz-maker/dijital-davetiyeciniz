'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Star } from 'lucide-react';

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

export default function ObservatoryLayout(props: LayoutProps) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, dateStr, timeStr, eventTitle, renderTimer, renderRsvpButton, handleMapClick } = props;
  const chartRef = useRef<HTMLDivElement>(null);
  const [lineProgress, setLineProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!chartRef.current || prefersReducedMotion) return;
      const rect = chartRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight / 2)));
      setLineProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  const coupleName = wedding.bride_name && wedding.groom_name 
    ? `${wedding.bride_name} & ${wedding.groom_name}` 
    : wedding.title;

  return (
    <div className="w-full min-h-screen bg-[#080711] text-[#e0e0ed] relative font-sans overflow-x-hidden">
      {/* Stars Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="w-full h-full bg-[radial-gradient(white_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto px-6 py-16 space-y-24">
        {/* Title */}
        <section className="min-h-[75vh] flex flex-col justify-center items-center text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.4em] text-indigo-400 font-mono">{eventTitle || 'ASTRONOMICAL EVENT'}</span>
          <h1 className="text-4xl sm:text-6xl font-light tracking-wide max-w-xl leading-tight" style={{ fontFamily: `"${headingFont}", serif` }}>
            {coupleName}
          </h1>
          <div className="w-16 h-[1px] bg-indigo-500/40" />
          <p className="text-lg tracking-widest font-light text-indigo-400">
            {dateStr} &bull; {timeStr}
          </p>
        </section>

        {/* Signature Moment: Constellation Drawing */}
        <section ref={chartRef} className="w-full flex flex-col items-center py-6">
          <div className="relative w-48 h-48 rounded-full border border-indigo-500/20 flex items-center justify-center">
            {/* SVG drawing constellation lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" stroke="rgba(99,102,241,0.1)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
              {/* Star Nodes */}
              <circle cx="60" cy="60" r="4" fill="#a5b4fc" />
              <circle cx="140" cy="60" r="4" fill="#a5b4fc" />
              <circle cx="100" cy="140" r="5" fill="#f43f5e" />
              <circle cx="40" cy="110" r="3" fill="#a5b4fc" />
              <circle cx="160" cy="110" r="3" fill="#a5b4fc" />
              {/* Connecting lines */}
              <line 
                x1="60" y1="60" x2="100" y2="140" 
                stroke="#6366f1" strokeWidth="1.5" 
                strokeDasharray="100" 
                strokeDashoffset={prefersReducedMotion ? 0 : Math.round((1 - lineProgress) * 100)} 
              />
              <line 
                x1="140" y1="60" x2="100" y2="140" 
                stroke="#6366f1" strokeWidth="1.5" 
                strokeDasharray="100" 
                strokeDashoffset={prefersReducedMotion ? 0 : Math.round((1 - lineProgress) * 100)} 
              />
              <line 
                x1="40" y1="110" x2="60" y2="60" 
                stroke="#6366f1" strokeWidth="1" 
                strokeDasharray="100" 
                strokeDashoffset={prefersReducedMotion ? 0 : Math.round((1 - lineProgress) * 100)} 
              />
              <line 
                x1="160" y1="110" x2="140" y2="60" 
                stroke="#6366f1" strokeWidth="1" 
                strokeDasharray="100" 
                strokeDashoffset={prefersReducedMotion ? 0 : Math.round((1 - lineProgress) * 100)} 
              />
            </svg>
            <div className="text-center z-10">
              <Star className="w-8 h-8 text-indigo-400 mx-auto animate-pulse" />
              <span className="text-[10px] tracking-widest font-mono text-indigo-300 block mt-2">OBSERVATORY</span>
            </div>
          </div>
          <p className="text-xs text-indigo-400/70 mt-6 uppercase tracking-wider font-mono">Connect the Dots</p>
        </section>

        {/* Counter */}
        <section className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md">
          {renderTimer()}
        </section>

        {/* Quote */}
        <section className="w-full text-center italic text-lg leading-relaxed max-w-2xl px-6 opacity-90">
          {props.renderQuote()}
        </section>

        {/* Info Grid */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 text-indigo-400 mr-4" />
                <div>
                  <h3 className="font-bold text-sm">Date</h3>
                  <p className="text-xs opacity-75">{dateStr} — {timeStr}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-indigo-400 mr-4" />
                <div>
                  <h3 className="font-bold text-sm">Venue</h3>
                  <p className="text-xs opacity-75">{wedding.venue_address || 'Planetarium Dome Hall'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleMapClick}
              className="w-full py-3 rounded-xl border border-indigo-400/30 text-indigo-400 hover:bg-indigo-400 hover:text-black transition duration-300 flex items-center justify-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </button>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6">
            <Star className="w-10 h-10 text-indigo-400" />
            <h3 className="text-xl font-light">Join the Gathering</h3>
            <p className="text-xs opacity-75 max-w-xs leading-relaxed">It would be our honor to celebrate this celestial convergence with you.</p>
            {renderRsvpButton()}
          </div>
        </section>

        {/* Guestbook */}
        <section className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-6 text-center text-indigo-400">Leave a Message</h3>
          {props.renderGuestBook()}
        </section>
      </div>
    </div>
  );
}
