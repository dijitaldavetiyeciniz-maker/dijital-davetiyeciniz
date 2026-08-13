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

export default function VerticalBalloonJourneyLayout(props: LayoutProps) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, accentFont, dateStr, timeStr, eventTitle, renderTimer, renderRsvpButton, handleMapClick } = props;
  const [scrollY, setScrollY] = useState(0);
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
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const coupleName = wedding.bride_name && wedding.groom_name 
    ? `${wedding.bride_name} & ${wedding.groom_name}` 
    : wedding.title;

  return (
    <div className="w-full min-h-screen bg-[#362118] text-[#f4efe9] overflow-x-hidden relative font-sans">
      {/* Background Parallax Landscape - Cappadocia fairy chimneys silhouette */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M0,800 L150,650 L300,800 L450,700 L600,850 L800,680 L1000,800 L1000,1000 L0,1000 Z" fill="#20110a" />
          <path d="M0,880 Q250,830 500,880 T1000,880 L1000,1000 L0,1000 Z" fill="#140a06" />
        </svg>
      </div>

      {/* Signature Moment: Parallax floating balloons */}
      {!prefersReducedMotion && (
        <>
          <div 
            className="fixed pointer-events-none z-10 opacity-70 transition-transform duration-100 ease-out"
            style={{
              bottom: `${10 + (scrollY * 0.15)}%`,
              left: '10%',
              transform: 'scale(0.8)'
            }}
          >
            {/* Balloon SVG 1 */}
            <svg width="60" height="90" viewBox="0 0 60 90">
              <path d="M30,0 C10,0 0,15 0,35 C0,55 15,70 30,80 C45,70 60,55 60,35 C60,15 50,0 30,0 Z" fill="#c26a3a" />
              <rect x="26" y="83" width="8" height="7" fill="#8b5a2b" />
              <line x1="26" y1="80" x2="26" y2="83" stroke="#fff" />
              <line x1="34" y1="80" x2="34" y2="83" stroke="#fff" />
            </svg>
          </div>
          <div 
            className="fixed pointer-events-none z-10 opacity-50 transition-transform duration-100 ease-out"
            style={{
              bottom: `${25 + (scrollY * 0.22)}%`,
              right: '15%',
              transform: 'scale(0.6)'
            }}
          >
            {/* Balloon SVG 2 */}
            <svg width="60" height="90" viewBox="0 0 60 90">
              <path d="M30,0 C10,0 0,15 0,35 C0,55 15,70 30,80 C45,70 60,55 60,35 C60,15 50,0 30,0 Z" fill="#b08d57" />
              <rect x="26" y="83" width="8" height="7" fill="#8b5a2b" />
            </svg>
          </div>
        </>
      )}

      {/* Content Flow */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto px-6 py-16 space-y-20">
        {/* Header */}
        <header className="min-h-[80vh] flex flex-col justify-center items-center text-center space-y-8">
          <span className="text-xs tracking-[0.4em] uppercase text-amber-400 font-mono">{eventTitle || 'Save the Date'}</span>
          <h1 className="text-4xl sm:text-6xl font-light tracking-wide max-w-xl leading-tight" style={{ fontFamily: `"${headingFont}", serif` }}>
            {coupleName}
          </h1>
          <div className="w-16 h-[2px] bg-amber-400/40" />
          <p className="text-lg tracking-widest font-light" style={{ fontFamily: `"${accentFont}", sans-serif` }}>
            {dateStr} &bull; {timeStr}
          </p>
        </header>

        {/* Counter Card */}
        <section className="w-full bg-white/[0.03] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
          <h2 className="text-xs tracking-[0.3em] uppercase text-center text-amber-400 mb-6 font-mono">COUNTDOWN</h2>
          {renderTimer()}
        </section>

        {/* Quote */}
        <section className="w-full text-center italic text-lg leading-relaxed max-w-2xl px-6 opacity-90">
          {props.renderQuote()}
        </section>

        {/* Info Grid */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 text-amber-400 mr-4" />
                <div>
                  <h3 className="font-bold text-sm">Date</h3>
                  <p className="text-xs opacity-75">{dateStr} — {timeStr}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-amber-400 mr-4" />
                <div>
                  <h3 className="font-bold text-sm">Venue</h3>
                  <p className="text-xs opacity-75">{wedding.venue_address || 'Cappadocia Valley Gardens'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleMapClick}
              className="w-full py-3 rounded-xl border border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-[#362118] transition duration-300 flex items-center justify-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </button>
          </div>

          {/* RSVP Button / Section */}
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6">
            <Heart className="w-10 h-10 text-amber-400" />
            <h3 className="text-xl font-light">Confirm Your Presence</h3>
            <p className="text-xs opacity-75 max-w-xs">We look forward to sharing this magical day with you. Please RSVP by completing the form.</p>
            {renderRsvpButton()}
          </div>
        </section>

        {/* Guestbook */}
        <section className="w-full bg-white/[0.03] border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-6 text-center text-amber-400">Wishes for the Couple</h3>
          {props.renderGuestBook()}
        </section>
      </div>
    </div>
  );
}
