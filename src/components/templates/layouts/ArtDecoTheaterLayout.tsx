'use client';
import React from 'react';
import { Calendar, MapPin, Ticket, Sparkles, Navigation, Music } from 'lucide-react';
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

export default function ArtDecoTheaterLayout({
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
  cardBgColor = '#050505',
  mode = 'public'
}: LayoutProps) {
  const brideInitial = wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'E';
  const groomInitial = wedding.groom_name ? wedding.groom_name.trim().charAt(0) : '';

  const overrides = wedding.custom_overrides || {};
  const focalX = overrides.photoFocalPoint?.x ?? wedding.photo_focal_point?.x ?? 50;
  const focalY = overrides.photoFocalPoint?.y ?? wedding.photo_focal_point?.y ?? 50;
  const objectPosition = `${focalX}% ${focalY}%`;

  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="min-h-screen w-full relative z-10 animate-fade-in flex flex-col lg:flex-row overflow-x-hidden selection:bg-[#D4AF37] selection:text-black"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", sans-serif` }}
      data-testid="layout-art-deco-theater"
    >
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Left / Top Side: Marquee & Photo Area (Fixed on Desktop) */}
      <div className="relative w-full lg:w-[45%] xl:w-[50%] min-h-[60vh] lg:min-h-screen flex flex-col items-center justify-center border-b-[6px] lg:border-b-0 lg:border-r-[6px] border-[#D4AF37]/50 bg-black z-20 overflow-hidden lg:fixed lg:left-0 lg:top-0">
        
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#D4AF37]/20 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#D4AF37]/20 to-transparent pointer-events-none z-10" />
        
        {couplePhoto ? (
          <div className="absolute inset-0 opacity-50 mix-blend-luminosity grayscale z-0">
            <SafeImage 
              src={couplePhoto} 
              alt="Couple"
              className="w-full h-full object-cover"
              style={{ objectPosition }}
              isHero={true}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)] opacity-70" />
          </div>
        ) : (
          <div className="absolute inset-0 opacity-20 flex items-center justify-center z-0">
            <Sparkles className="w-48 h-48 text-[#D4AF37]" />
          </div>
        )}

        {/* Marquee Sign */}
        <div className="relative z-30 p-8 flex flex-col items-center justify-center text-center max-w-[90%] lg:max-w-xl w-full mx-auto">
          {/* Border Frame */}
          <div className="absolute inset-0 border-[3px] border-[#D4AF37] rounded-tl-[50px] rounded-br-[50px] shadow-[0_0_40px_rgba(212,175,55,0.4)] pointer-events-none" />
          <div className="absolute inset-3 border-2 border-[#D4AF37]/40 rounded-tl-[40px] rounded-br-[40px] pointer-events-none" />
          <div className="absolute inset-5 border border-[#D4AF37]/20 rounded-tl-[30px] rounded-br-[30px] pointer-events-none bg-black/40 backdrop-blur-sm" />
          
          <div className="relative z-10 flex flex-col items-center w-full py-12 px-6">
            <div className="py-2 px-8 border border-[#D4AF37] bg-[#D4AF37]/10 uppercase text-[10px] md:text-xs tracking-[0.4em] text-[#D4AF37] mb-8 shadow-[0_0_20px_rgba(212,175,55,0.2)] whitespace-nowrap">
              {eventTitle || "A Grand Celebration"}
            </div>

            <h1 
              className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2CC] via-[#D4AF37] to-[#AA7C11] filter drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] leading-none"
              style={{ fontFamily: `"${headingFont}", serif` }}
            >
              {wedding.bride_name}
            </h1>
            <div className="my-6 text-[#D4AF37] text-3xl lg:text-5xl drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" style={{ fontFamily: `"${accentFont}", cursive` }}>
              &
            </div>
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2CC] via-[#D4AF37] to-[#AA7C11] filter drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] leading-none"
              style={{ fontFamily: `"${headingFont}", serif` }}
            >
              {wedding.groom_name}
            </h1>

            <div className="mt-10 flex items-center justify-center gap-6 text-[#D4AF37] uppercase tracking-[0.3em] text-xs md:text-sm font-semibold">
              <Sparkles className="w-5 h-5" />
              <span>{dateObj.getFullYear()}</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

      </div>

      {/* Right / Bottom Side: Content & Ticket Booth */}
      <div className="relative w-full lg:w-[55%] xl:w-[50%] min-h-screen z-10 flex flex-col p-6 md:p-12 lg:p-24 lg:ml-auto overflow-y-auto pb-32 md:pb-24">
        
        {/* Quote / Subtitle */}
        <div className="text-center w-full mb-16 mt-8 lg:mt-0">
          <p className="text-[#F3E5AB] text-xl md:text-2xl font-light italic opacity-90 mx-auto max-w-2xl leading-relaxed" style={{ fontFamily: `"${accentFont}", cursive` }}>
            {renderQuote()}
          </p>
          <div className="flex justify-center items-center mt-8 gap-3">
            <div className="h-[1px] w-24 bg-[#D4AF37]/50" />
            <div className="w-3 h-3 rotate-45 border border-[#D4AF37] bg-[#D4AF37]/20" />
            <div className="h-[1px] w-24 bg-[#D4AF37]/50" />
          </div>
        </div>

        {/* Elegant Ticket View for Details */}
        <div className="relative w-full max-w-2xl mx-auto bg-[#0a0a0a] border-[3px] border-[#D4AF37] rounded-sm p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] before:absolute before:inset-0 before:border before:border-[#D4AF37]/20 before:m-2 pointer-events-auto">
          <div className="border-2 border-[#D4AF37]/50 border-dashed p-8 flex flex-col items-center text-center bg-[#111]">
            
            {/* Ticket Cutouts */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#050505] rounded-full border-r-[3px] border-[#D4AF37]" />
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#050505] rounded-full border-l-[3px] border-[#D4AF37]" />

            <Ticket className="w-10 h-10 text-[#D4AF37] mb-4" />
            <h2 className="text-3xl text-[#F3E5AB] uppercase tracking-[0.2em] mb-8 font-black" style={{ fontFamily: `"${headingFont}", serif` }}>
              Admit One
            </h2>

            <div className="w-full flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center text-[#D4AF37] text-sm uppercase tracking-widest mb-10 border-t border-b border-[#D4AF37]/20 py-6">
              <div className="flex flex-col items-center flex-1">
                <span className="text-[10px] opacity-60 mb-2">Date</span>
                <span className="font-bold text-lg">{dateStr}</span>
              </div>
              <div className="w-full h-px md:w-px md:h-12 bg-[#D4AF37]/30" />
              <div className="flex flex-col items-center flex-1">
                <span className="text-[10px] opacity-60 mb-2">Time</span>
                <span className="font-bold text-lg">{timeStr}</span>
              </div>
            </div>

            <div className="w-full bg-[#050505] p-6 rounded-sm border border-[#D4AF37]/30 mb-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#D4AF37]/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <MapPin className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-white font-bold uppercase tracking-[0.15em] text-lg">{wedding.venue_name || 'TBA'}</span>
                {wedding.venue_address && (
                  <span className="text-sm text-white/60 text-center max-w-xs">{wedding.venue_address}</span>
                )}
              </div>
            </div>

            {/* Timer Area */}
            <div className="w-full relative py-6">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#111] px-4 text-[#D4AF37] text-[10px] uppercase tracking-widest font-bold">
                Curtain Call In
              </span>
              <div className="text-white scale-110 mt-2">
                {renderTimer()}
              </div>
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="mt-16 flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
          {hasMaps && (
            <button 
              type="button"
              onClick={handleMapClick}
              className="group relative w-full h-16 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-[0.2em] text-sm font-bold overflow-hidden flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            >
              <div className="absolute inset-0 bg-[#D4AF37] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 flex items-center gap-3">
                <Navigation className="w-5 h-5" /> Get Directions
              </span>
            </button>
          )}

          {showRsvp && (
            <div className="w-full [&>button]:w-full [&>button]:h-16 [&>button]:bg-[#D4AF37] [&>button]:text-black [&>button]:uppercase [&>button]:tracking-[0.2em] [&>button]:text-sm [&>button]:font-black [&>button]:hover:bg-[#FFF2CC] [&>button]:transition-all [&>button]:duration-500 [&>button]:border-2 [&>button]:border-[#D4AF37] [&>button]:shadow-[0_0_20px_rgba(212,175,55,0.2)] [&>button]:hover:shadow-[0_0_40px_rgba(212,175,55,0.5)]">
              {renderRsvpButton()}
            </div>
          )}
        </div>

        {/* Guestbook */}
        <div className="mt-20 w-full max-w-2xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <h3 className="text-[#D4AF37] uppercase tracking-[0.3em] text-base font-bold">Guest Ledger</h3>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <div className="art-deco-guestbook bg-black/50 p-6 md:p-8 rounded-sm border border-[#D4AF37]/20 [&_.guestbook-container]:bg-transparent [&_.guestbook-container]:border-none [&_.guestbook-container]:shadow-none [&_.guestbook-container]:text-white [&_input]:bg-[#111] [&_input]:border-[#D4AF37]/30 [&_input]:text-[#F3E5AB] [&_input:focus]:border-[#D4AF37] [&_textarea]:bg-[#111] [&_textarea]:border-[#D4AF37]/30 [&_textarea]:text-[#F3E5AB] [&_textarea:focus]:border-[#D4AF37] [&_button[type='submit']]:bg-transparent [&_button[type='submit']]:border-2 [&_button[type='submit']]:border-[#D4AF37] [&_button[type='submit']]:text-[#D4AF37] [&_button[type='submit']]:hover:bg-[#D4AF37] [&_button[type='submit']]:hover:text-black [&_button[type='submit']]:uppercase [&_button[type='submit']]:tracking-widest [&_button[type='submit']]:transition-all [&_button[type='submit']]:duration-300">
            {renderGuestBook()}
          </div>
        </div>

      </div>
    </div>
  );
}
