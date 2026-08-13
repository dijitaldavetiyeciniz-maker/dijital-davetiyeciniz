'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, Heart } from 'lucide-react';

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

export default function UnderwaterJourneyLayout(props: LayoutProps) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, dateStr, timeStr, eventTitle, renderTimer, renderRsvpButton, handleMapClick } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState(0);
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
      if (!containerRef.current) return;
      const scrolled = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? scrolled / totalHeight : 0;
      setDepth(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const coupleName = wedding.bride_name && wedding.groom_name 
    ? `${wedding.bride_name} & ${wedding.groom_name}` 
    : wedding.title;

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-gradient-to-b from-[#113047] via-[#0b1f30] to-[#050f1a] text-[#d6eef8] relative font-sans overflow-x-hidden">
      {/* Bioluminescent floating dots (bubbles) */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute w-2 h-2 bg-cyan-400/20 rounded-full blur-[1px] animate-bounce" style={{ top: '20%', left: '15%', animationDuration: '4s' }} />
          <div className="absolute w-3 h-3 bg-cyan-400/10 rounded-full blur-[1px] animate-bounce" style={{ top: '50%', right: '20%', animationDuration: '6s' }} />
          <div className="absolute w-2 h-2 bg-cyan-400/30 rounded-full blur-[1px] animate-bounce" style={{ bottom: '30%', left: '40%', animationDuration: '5s' }} />
        </div>
      )}

      {/* Signature Moment: Submarine diving/ascending on scroll */}
      {!prefersReducedMotion && (
        <div 
          className="fixed z-10 pointer-events-none transition-all duration-75 ease-out opacity-80"
          style={{
            right: '10%',
            bottom: `${20 + (depth * 60)}%`,
            transform: `rotate(${Math.sin(depth * Math.PI * 2) * 5}deg)`
          }}
        >
          {/* Submarine Vector SVG */}
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
            <rect x="15" y="15" width="30" height="15" rx="7.5" fill="#f43f5e" />
            <path d="M25,15 L25,5 L30,5 L30,15 Z" fill="#f43f5e" />
            <circle cx="30" cy="22" r="3" fill="#fff" />
            <rect x="43" y="18" width="5" height="9" fill="#113047" />
          </svg>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto px-6 py-16 space-y-24">
        {/* Title */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.4em] text-cyan-400 font-mono">{eventTitle || 'UNDERWATER CELEBRATION'}</span>
          <h1 className="text-4xl sm:text-6xl font-light tracking-wide max-w-xl leading-tight" style={{ fontFamily: `"${headingFont}", serif` }}>
            {coupleName}
          </h1>
          <div className="w-16 h-[1px] bg-cyan-400/40" />
          <p className="text-lg tracking-widest font-light text-cyan-400">
            {dateStr} &bull; {timeStr}
          </p>
        </section>

        {/* Counter */}
        <section className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md">
          <h2 className="text-xs uppercase tracking-[0.3em] text-center text-cyan-400 mb-6 font-mono">DIVE DEPTH STATUS</h2>
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
                <Calendar className="w-6 h-6 text-cyan-400 mr-4" />
                <div>
                  <h3 className="font-bold text-sm">Date</h3>
                  <p className="text-xs opacity-75">{dateStr} — {timeStr}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-cyan-400 mr-4" />
                <div>
                  <h3 className="font-bold text-sm">Coordinates</h3>
                  <p className="text-xs opacity-75">{wedding.venue_address || 'Poseidon Deep Palazzo'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleMapClick}
              className="w-full py-3 rounded-xl border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400 hover:text-[#0b1f30] transition duration-300 flex items-center justify-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </button>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6">
            <Heart className="w-10 h-10 text-cyan-400" />
            <h3 className="text-xl font-light">Confirm Your Descent</h3>
            <p className="text-xs opacity-75 max-w-xs leading-relaxed">Join us beneath the waves to celebrate this special milestone.</p>
            {renderRsvpButton()}
          </div>
        </section>

        {/* Guestbook */}
        <section className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-6 text-center text-cyan-400 font-mono">Ocean Board Message Logs</h3>
          {props.renderGuestBook()}
        </section>
      </div>
    </div>
  );
}
