'use client';
import React from 'react';
import { Calendar, MapPin, Key, Star, Clock, Bell, Navigation, ArrowRight } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';
import { getReadableTextColor, WCAG_MIN_RATIO, checkTemplateContrast } from '@/lib/colorUtils';

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

export default function LuxuryHotelLayout({ wedding,
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
  cardBgColor = '#0a0a0a',
  mode = 'public'
, selectedBackground, cardSurfaceStyle }: LayoutProps) {
  const overrides = wedding.custom_overrides || {};
  const focalX = overrides.photoFocalPoint?.x ?? wedding.photo_focal_point?.x ?? 50;
  const focalY = overrides.photoFocalPoint?.y ?? wedding.photo_focal_point?.y ?? 50;
  const objectPosition = `${focalX}% ${focalY}%`;

  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';
  
  // Premium Gold Palette
  const goldLight = '#FDE08B';
  const goldMain = '#D4AF37';
  const goldDark = '#997A15';

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="min-h-screen w-full flex flex-col md:flex-row text-neutral-200 overflow-hidden font-sans"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", sans-serif` }}
      data-testid="layout-luxury-hotel"
    >
      {/* LEFT: GRAND PHOTO (Split Screen) */}
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" className="w-full h-[50vh] md:h-screen md:w-[45%] lg:w-[50%] relative shrink-0" style={cardSurfaceStyle}>
        <div className="absolute inset-0 z-10 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent pointer-events-none" />
        
        {couplePhoto ? (
          <SafeImage 
            src={couplePhoto} 
            alt="Premium Event Background"
            className="w-full h-full object-cover transition-transform duration-[20s] ease-out hover:scale-110"
            style={{ objectPosition }}
            isHero={true}
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none" />
            <Bell className="w-16 h-16 opacity-30 mb-4 text-[#D4AF37]" />
            <span className="text-3xl font-serif tracking-widest text-neutral-500 uppercase">Grand Hotel</span>
          </div>
        )}

        {/* 5-Star Overlay */}
        <div className="absolute top-8 left-8 z-20 flex gap-1 animate-fade-in drop-shadow-md">
          {[1,2,3,4,5].map((star) => (
            <Star key={star} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
          ))}
        </div>
      </div>

      {/* RIGHT: CONTENT & VIP KEYCARD */}
      <div className="w-full md:w-[55%] lg:w-[50%] min-h-screen flex items-center justify-center p-6 md:p-12 lg:p-24 relative bg-[#0a0a0a]">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        {/* VIP KEYCARD WRAPPER */}
        <div className="relative w-full max-w-xl mx-auto z-10 flex flex-col items-center">
          
          <div className="mb-8 flex flex-col items-center text-center animate-fade-in-up">
            <h3 className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-semibold mb-3 flex items-center gap-2">
              <Key className="w-4 h-4" /> VIP Guest Access
            </h3>
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight drop-shadow-lg"
              style={{ fontFamily: `"${headingFont}", serif` }}
            >
              {wedding.bride_name} <span className="text-[#D4AF37] italic font-light">&amp;</span> {wedding.groom_name}
            </h1>
            <p className="mt-4 text-sm text-neutral-400 max-w-md italic" style={{ fontFamily: `"${accentFont}", serif` }}>
              {renderQuote()}
            </p>
          </div>

          {/* THE CARD */}
          <div className="w-full bg-gradient-to-b from-[#141414] to-[#0f0f0f] border border-white/5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-1 relative overflow-hidden backdrop-blur-sm transform transition-all duration-500 hover:shadow-[0_20px_60px_rgba(212,175,55,0.1)] group">
            
            {/* Edge reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="bg-[#0a0a0a]/90 rounded-xl p-6 sm:p-10 border border-[#D4AF37]/20 relative z-10">
              
              {/* Card Header */}
              <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-6">
                <div>
                  <div className="text-[10px] text-neutral-500 tracking-widest uppercase mb-1">Event Type</div>
                  <div className="text-white text-lg tracking-wider" style={{ fontFamily: `"${headingFont}", serif` }}>{eventTitle}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-neutral-500 tracking-widest uppercase mb-1">Room No.</div>
                  <div className="text-[#D4AF37] text-xl font-mono tracking-widest">{dateObj.getDate().toString().padStart(2, '0')}{(dateObj.getMonth() + 1).toString().padStart(2, '0')}</div>
                </div>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs tracking-widest uppercase">Date</span>
                  </div>
                  <span className="text-white text-sm font-medium pl-6">{dateStr}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs tracking-widest uppercase">Time</span>
                  </div>
                  <span className="text-white text-sm font-medium pl-6">{timeStr}</span>
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs tracking-widest uppercase">Venue</span>
                  </div>
                  <span className="text-white text-sm font-medium pl-6">{wedding.venue_name || 'Grand Venue'}</span>
                  {wedding.venue_address && (
                    <span className="text-neutral-400 text-xs pl-6 mt-1">{wedding.venue_address}</span>
                  )}
                </div>
              </div>

              {/* Timer */}
              <div className="bg-[#141414] rounded-lg p-4 border border-white/5 mb-8">
                <div className="text-[10px] text-neutral-500 tracking-widest uppercase mb-3 text-center">Countdown to Check-in</div>
                <div className="[&>div]:text-[#D4AF37]">
                  {renderTimer()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                {showRsvp && (
                  <div className="w-full [&>button]:w-full [&>button]:bg-[#D4AF37] [&>button]:text-black [&>button]:hover:bg-[#FDE08B] [&>button]:rounded-md [&>button]:font-semibold [&>button]:tracking-widest [&>button]:uppercase [&>button]:transition-all">
                    {renderRsvpButton()}
                  </div>
                )}
                
                {hasMaps && (
                  <button 
                    type="button"
                    onClick={handleMapClick}
                    className="w-full py-3 px-4 rounded-md border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 flex items-center justify-center gap-2 text-xs tracking-widest uppercase transition-all"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </button>
                )}
              </div>

            </div>
          </div>
          
          {/* Guestbook section underneath the card */}
          <div className="w-full mt-12">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
            {renderGuestBook()}
          </div>

        </div>
      </div>
    </div>
  );
}
