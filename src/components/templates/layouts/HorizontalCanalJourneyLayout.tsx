'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Sparkles, Navigation, Heart } from 'lucide-react';

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

export default function HorizontalCanalJourneyLayout(props: LayoutProps) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, accentFont, dateStr, timeStr, eventTitle, renderTimer, renderRsvpButton, handleMapClick } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
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
      const rect = containerRef.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? scrolled / totalHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const coupleName = wedding.bride_name && wedding.groom_name 
    ? `${wedding.bride_name} & ${wedding.groom_name}` 
    : wedding.title;

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#071624] text-white overflow-x-hidden relative font-sans">
      {/* Background Layer with Venice Canal or Sakura motif depending on ID */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M0,500 Q250,450 500,500 T1000,500 L1000,1000 L0,1000 Z" fill="#0c233c" />
          <path d="M0,600 Q250,550 500,600 T1000,600 L1000,1000 L0,1000 Z" fill="#123050" />
        </svg>
      </div>

      {/* Signature Moment: Gondola / Sakura Petal drifting horizontally */}
      {!prefersReducedMotion && (
        <div 
          className="fixed z-10 pointer-events-none transition-all duration-75 ease-out"
          style={{
            left: `${scrollProgress * 90}%`,
            bottom: '15%',
            transform: `translateY(${Math.sin(scrollProgress * Math.PI * 4) * 15}px)`
          }}
        >
          {props.templateId === 'japanese-folding-screen-sakura' ? (
            <div className="w-12 h-12 bg-pink-300 rounded-full blur-[2px] opacity-80 flex items-center justify-center animate-spin">🌸</div>
          ) : (
            <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 25 C 20 25, 30 35, 50 35 C 70 35, 80 25, 95 25 L 90 28 L 10 28 Z" fill="#b08d57" />
              <line x1="50" y1="15" x2="35" y2="30" stroke="#fff" strokeWidth="2" />
              <path d="M15 25 L 85 25 L 50 5 Z" fill="#b08d57" opacity="0.3" />
            </svg>
          )}
        </div>
      )}

      {/* Main Flow (Mobile: standard vertical snap sections, Desktop: multi-scene display) */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto px-6 py-12 space-y-24">
        {/* Hero Section */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.4em] text-amber-400 font-mono">{eventTitle || 'DIGITAL INVITATION'}</span>
          <h1 className="text-5xl sm:text-7xl font-light tracking-tight" style={{ fontFamily: `"${headingFont}", serif` }}>
            {coupleName}
          </h1>
          <div className="w-24 h-[1px] bg-amber-400/50" />
          <p className="text-lg sm:text-xl font-light tracking-widest max-w-md uppercase" style={{ fontFamily: `"${accentFont}", sans-serif` }}>
            {dateStr} &bull; {timeStr}
          </p>
        </section>

        {/* Timer Section */}
        <section className="w-full flex flex-col items-center bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
          <h2 className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-6 font-mono">Countdown to Event</h2>
          {renderTimer()}
        </section>

        {/* Story / Quote Section */}
        <section className="w-full text-center max-w-2xl leading-relaxed italic text-lg opacity-90 py-6 border-y border-white/10">
          {props.renderQuote()}
        </section>

        {/* Details Section */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between space-y-6">
            <div className="flex items-center space-y-2">
              <Calendar className="w-8 h-8 text-amber-400 mr-4" />
              <div>
                <h3 className="font-bold text-lg">Date & Time</h3>
                <p className="text-sm opacity-80">{dateStr} at {timeStr}</p>
              </div>
            </div>
            <div className="flex items-center space-y-2">
              <MapPin className="w-8 h-8 text-amber-400 mr-4" />
              <div>
                <h3 className="font-bold text-lg">Location</h3>
                <p className="text-sm opacity-80">{wedding.venue_address || 'Grand Palazzo Hall'}</p>
              </div>
            </div>
            <button 
              onClick={handleMapClick} 
              className="mt-4 flex items-center justify-center space-x-2 border border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-[#071624] py-3 rounded-xl transition duration-300"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </button>
          </div>

          {/* RSVP Section */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6">
            <Heart className="w-12 h-12 text-amber-400 animate-pulse" />
            <h3 className="text-2xl font-light">Join Our Celebration</h3>
            <p className="text-sm opacity-80 max-w-xs">Please confirm your attendance by completing the guest response form below.</p>
            {renderRsvpButton()}
          </div>
        </section>

        {/* Guestbook Section */}
        <section className="w-full bg-white/5 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6 text-center text-amber-400">Leave a Message</h3>
          {props.renderGuestBook()}
        </section>
      </div>
    </div>
  );
}
