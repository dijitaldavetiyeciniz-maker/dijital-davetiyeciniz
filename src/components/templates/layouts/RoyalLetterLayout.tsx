'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Navigation, Sparkles, Scroll, ChevronDown, Award } from 'lucide-react';
import { getReadableTextColor, WCAG_MIN_RATIO, checkTemplateContrast } from '@/lib/colorUtils';
import SafeImage from '@/components/ui/SafeImage';

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
}

export default function RoyalLetterLayout({
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
  cardBgColor = '#fdfbf7',
  mode = 'public'
}: LayoutProps) {
  const [isUnrolled, setIsUnrolled] = useState(false);

  useEffect(() => {
    // Auto-unroll animation after a brief delay
    const timer = setTimeout(() => setIsUnrolled(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const themeGold = primaryColor || '#B8860B'; // Rich Gold
  const mainBg = cardBgColor || '#f9f6f0';
  const readableTextColor = getReadableTextColor(mainBg, '#ffffff', '#292524');
  
  checkTemplateContrast('royal-letter', 'Calligraphy Text', themeGold, mainBg, WCAG_MIN_RATIO.NORMAL_TEXT);

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="min-h-screen w-full relative overflow-x-hidden font-serif selection:/20 selection:text-amber-950 flex flex-col items-center"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), backgroundColor: '#1a1814', color: readableTextColor, fontFamily: `"${bodyFont}", serif` }}
      data-testid="layout-royal-letter"
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(60,45,20,0.6)_0%,#0a0806_100%)] opacity-80" />
        {/* Subtle floating sparkles pattern */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #B8860B 1px, transparent 1px)', backgroundSize: '100px 100px' }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50" />
      </div>

      {/* Main Grand Scroll Container */}
      <div 
        className={`relative z-10 w-full max-w-6xl min-h-screen flex flex-col items-center justify-start py-12 md:py-24 transition-all duration-1000 transform ${isUnrolled ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}
      >
        
        {/* Scroll Top Roller */}
        <div className="w-[95%] md:w-full h-12 md:h-16 relative z-30 shadow-2xl rounded-full" style={{ background: 'linear-gradient(to bottom, #d4af37, #aa7c11, #8a6508)' }}>
           <div className="absolute top-0 left-0 w-full h-full rounded-full border-t border-white/30 border-b border-black/40 mix-blend-overlay"></div>
           <div className="absolute top-1/2 left-[-10px] md:left-[-20px] transform -translate-y-1/2 w-8 md:w-12 h-14 md:h-20 rounded-full shadow-lg border border-amber-900/50" style={{ background: 'radial-gradient(circle, #f3d573, #aa7c11)' }}></div>
           <div className="absolute top-1/2 right-[-10px] md:right-[-20px] transform -translate-y-1/2 w-8 md:w-12 h-14 md:h-20 rounded-full shadow-lg border border-amber-900/50" style={{ background: 'radial-gradient(circle, #f3d573, #aa7c11)' }}></div>
        </div>

        {/* Scroll Content (Parchment) */}
        <div 
          className="w-[90%] md:w-[95%] relative z-20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col items-center pb-24"
          style={{ 
            backgroundColor: mainBg,
            backgroundImage: 'radial-gradient(circle at 50% 0%, #ffffff 0%, transparent 100%)',
          }}
        >
          {/* Subtle paper texture overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(120,53,15,0.03)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none z-0 opacity-70 mix-blend-multiply" />

          {/* Edge burn/shadow effects */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(100,70,30,0.15)] pointer-events-none z-10" />
          <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-black/5 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-10" />

          {/* Golden Border Accents */}
          <div className="absolute inset-4 md:inset-8 border border-amber-900/20 rounded-sm pointer-events-none z-10" />
          <div className="absolute inset-5 md:inset-10 border border-dashed border-amber-900/20 rounded-sm pointer-events-none z-10" />

          {/* Ornate Corner Elements */}
          <div className="absolute top-6 left-6 md:top-12 md:left-12 text-amber-800/40 text-3xl md:text-5xl pointer-events-none select-none z-10">⚜️</div>
          <div className="absolute top-6 right-6 md:top-12 md:right-12 text-amber-800/40 text-3xl md:text-5xl pointer-events-none select-none z-10">⚜️</div>
          <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 text-amber-800/40 text-3xl md:text-5xl pointer-events-none select-none z-10">⚜️</div>
          <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 text-amber-800/40 text-3xl md:text-5xl pointer-events-none select-none z-10">⚜️</div>

          <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center px-6 md:px-16 pt-16 md:pt-24 text-center">
            
            {/* 3D Wax Seal with Tassels */}
            <div className="relative mb-12 flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform duration-500">
              <div 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center relative shadow-[0_15px_35px_rgba(120,53,15,0.6),inset_0_-8px_16px_rgba(0,0,0,0.5)] bg-red-900 text-amber-100 border-2 border-red-950/50"
                style={{ background: 'radial-gradient(circle at 30% 30%, #a82315, #5e0d05)' }}
              >
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-dashed border-red-950/40 flex items-center justify-center font-serif text-3xl md:text-5xl opacity-80 shadow-inner">
                  {wedding.bride_name?.charAt(0) || 'R'}
                  <span className="text-xl md:text-3xl mx-1 opacity-70">&amp;</span>
                  {wedding.groom_name?.charAt(0) || 'E'}
                </div>
                {/* Highlights for 3D effect */}
                <div className="absolute top-2 left-4 w-6 h-6 bg-white/20 rounded-full blur-sm"></div>
              </div>
              
              {/* Tassels */}
              <div className="w-1 h-20 md:h-32 relative flex justify-center mt-[-10px] z-[-1]">
                <div className="absolute inset-0 bg-yellow-600/80 shadow-md" style={{ background: 'linear-gradient(to right, #b8860b, #d4af37, #b8860b)' }} />
                <div className="absolute bottom-0 w-6 h-6 rounded-full bg-yellow-600 shadow-md" style={{ background: 'radial-gradient(circle, #f3d573, #aa7c11)' }} />
                <div className="absolute bottom-[-24px] w-8 h-10 bg-gradient-to-b from-yellow-700 to-amber-900 rounded-b-lg opacity-90 shadow-md" />
              </div>
            </div>

            {/* Decree Title */}
            <div className="flex items-center gap-4 text-xs md:text-sm font-bold tracking-[0.4em] uppercase text-amber-900/80 mb-6">
              <Scroll className="w-5 h-5 text-amber-700" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900">ROYAL DECREE</span>
              <Scroll className="w-5 h-5 text-amber-700 transform scale-x-[-1]" />
            </div>

            <h3 className="font-semibold tracking-[0.3em] uppercase text-xs md:text-sm mb-12" style={{ color: themeGold }}>
              {eventTitle}
            </h3>

            {/* Names */}
            <div className="w-full mb-16 relative">
              <div className="absolute top-1/2 left-0 w-[15%] md:w-[30%] h-px bg-gradient-to-r from-transparent to-amber-900/30"></div>
              <div className="absolute top-1/2 right-0 w-[15%] md:w-[30%] h-px bg-gradient-to-l from-transparent to-amber-900/30"></div>
              
              {wedding.bride_parents && (
                <p className="text-[10px] md:text-xs tracking-[0.3em] font-light mb-6 opacity-60 uppercase font-sans text-amber-950">
                  {wedding.bride_parents}
                </p>
              )}

              <h1 
                className="text-6xl md:text-8xl lg:text-9xl font-normal leading-tight tracking-wide drop-shadow-sm px-4"
                style={{ color: themeGold, fontFamily: `"${headingFont}", serif` }}
              >
                {wedding.bride_name}
              </h1>
              
              {wedding.groom_name && (
                <>
                  <div className="my-6 md:my-8 text-2xl md:text-4xl italic opacity-50 font-serif" style={{ fontFamily: `"${accentFont}", cursive` }}>
                    &
                  </div>
                  <h1 
                    className="text-6xl md:text-8xl lg:text-9xl font-normal leading-tight tracking-wide drop-shadow-sm px-4"
                    style={{ color: themeGold, fontFamily: `"${headingFont}", serif` }}
                  >
                    {wedding.groom_name}
                  </h1>
                </>
              )}

              {wedding.groom_parents && (
                <p className="text-[10px] md:text-xs tracking-[0.3em] font-light mt-6 opacity-60 uppercase font-sans text-amber-950">
                  {wedding.groom_parents}
                </p>
              )}
            </div>

            {/* Quote */}
            <div className="my-8 md:my-12 leading-loose text-lg md:text-2xl text-amber-950/80 italic max-w-2xl font-serif px-4" style={{ fontFamily: `"${accentFont}", cursive` }}>
              <span className="text-4xl text-amber-700/40 font-serif leading-none mr-2">"</span>
              {renderQuote()}
              <span className="text-4xl text-amber-700/40 font-serif leading-none ml-2">"</span>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-900/20 to-transparent my-12" />

            {/* Event Details Grid for Desktop */}
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16 px-4">
              
              {/* Date & Time */}
              <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-amber-900/5 border border-amber-900/10 shadow-[inset_0_0_20px_rgba(120,53,15,0.05)] hover:bg-amber-900/10 transition-colors duration-500">
                <Calendar className="w-10 h-10 mb-4" style={{ color: themeGold }} />
                <h4 className="text-sm tracking-[0.2em] font-bold uppercase text-amber-950/70 mb-4">The Date</h4>
                <div className="text-2xl md:text-3xl font-serif text-amber-950 mb-2">{dateStr}</div>
                <div className="text-lg md:text-xl text-amber-950/80">{timeStr}</div>
              </div>

              {/* Location */}
              <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-amber-900/5 border border-amber-900/10 shadow-[inset_0_0_20px_rgba(120,53,15,0.05)] hover:bg-amber-900/10 transition-colors duration-500 text-center">
                <MapPin className="w-10 h-10 mb-4" style={{ color: themeGold }} />
                <h4 className="text-sm tracking-[0.2em] font-bold uppercase text-amber-950/70 mb-4">The Venue</h4>
                <div className="text-xl md:text-2xl font-bold font-serif text-amber-950 mb-2">{wedding.venue_name || 'Grand Palace'}</div>
                {wedding.venue_address && (
                  <p className="text-sm md:text-base text-amber-950/70 leading-relaxed max-w-[250px]">{wedding.venue_address}</p>
                )}
              </div>

            </div>

            {/* Countdown */}
            <div className="w-full max-w-2xl my-8 md:my-16 relative">
              <div className="absolute inset-0 bg-amber-900/5 transform -skew-y-2 border-y border-amber-900/10"></div>
              <div className="relative py-12 px-6">
                <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-amber-900/70 block mb-6 uppercase">Awaiting the Royal Ceremony</span>
                <div className="scale-110 md:scale-125 transform origin-top flex justify-center">
                  <div className="max-w-[400px]">
                    {renderTimer()}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full max-w-xl flex flex-col gap-6 mt-8 md:mt-12 px-4">
              {hasMaps && (
                <button 
                  type="button"
                  onClick={handleMapClick}
                  className="group w-full h-16 rounded-none border border-amber-900/30 bg-amber-50 text-amber-950 hover:bg-amber-100 flex items-center justify-center gap-4 px-4 md:px-8 font-bold text-xs md:text-base tracking-[0.2em] uppercase transition-all duration-500 shadow-[0_5px_15px_rgba(120,53,15,0.1)] hover:shadow-[0_8px_25px_rgba(120,53,15,0.2)]"
                >
                  <Navigation className="w-5 h-5 text-amber-700 group-hover:animate-bounce shrink-0" />
                  <span className="truncate">Explore the Kingdom</span>
                </button>
              )}

              {showRsvp && (
                <div className="w-full mt-4 scale-100 md:scale-110 origin-top transform transition-transform">
                  {renderRsvpButton()}
                </div>
              )}
            </div>

            {/* Guest Book */}
            <div className="w-full max-w-3xl mt-24 mb-12 px-4">
              <div className="flex items-center gap-4 text-xs md:text-sm font-bold tracking-[0.4em] uppercase text-amber-900/80 mb-8 justify-center">
                <Award className="w-5 h-5 text-amber-700 hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 text-center">The Royal Register</span>
                <Award className="w-5 h-5 text-amber-700 hidden md:block" />
              </div>
              <div className="bg-white/40 p-6 md:p-10 rounded-xl border border-amber-900/20 shadow-xl w-full">
                {renderGuestBook()}
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Bottom Roller */}
        <div className="w-[95%] md:w-full h-12 md:h-16 relative z-30 shadow-2xl rounded-full" style={{ background: 'linear-gradient(to bottom, #d4af37, #aa7c11, #8a6508)' }}>
           <div className="absolute top-0 left-0 w-full h-full rounded-full border-t border-white/30 border-b border-black/40 mix-blend-overlay"></div>
           <div className="absolute top-1/2 left-[-10px] md:left-[-20px] transform -translate-y-1/2 w-8 md:w-12 h-14 md:h-20 rounded-full shadow-lg border border-amber-900/50" style={{ background: 'radial-gradient(circle, #f3d573, #aa7c11)' }}></div>
           <div className="absolute top-1/2 right-[-10px] md:right-[-20px] transform -translate-y-1/2 w-8 md:w-12 h-14 md:h-20 rounded-full shadow-lg border border-amber-900/50" style={{ background: 'radial-gradient(circle, #f3d573, #aa7c11)' }}></div>
        </div>

      </div>
    </div>
  );
}
