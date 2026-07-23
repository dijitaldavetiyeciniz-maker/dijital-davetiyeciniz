'use client';
import React from 'react';
import { Calendar, MapPin, Navigation, BookOpen, Clock, Heart } from 'lucide-react';
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

export default function FashionMagazineLayout({
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
  cardBgColor = '#ffffff',
  mode = 'public'
}: LayoutProps) {
  const overrides = wedding.custom_overrides || {};
  const focalX = overrides.photoFocalPoint?.x ?? wedding.photo_focal_point?.x ?? 50;
  const focalY = overrides.photoFocalPoint?.y ?? wedding.photo_focal_point?.y ?? 50;
  const objectPosition = `${focalX}% ${focalY}%`;

  const couplePhoto = wedding.bride_photo_url || wedding.groom_photo_url || wedding.background_image_url || '';

  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  const monthStr = dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const yearStr = dateObj.getFullYear();
  const dayStr = dateObj.getDate().toString().padStart(2, '0');

  // We enforce a dark mode/vignette approach for the full-bleed to ensure white text is readable
  // If primaryColor is given, we use it for accents.

  return (
    <div 
      className="relative min-h-screen w-full text-white overflow-x-hidden animate-fade-in selection:bg-white/30"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", sans-serif` }}
      data-testid="layout-fashion-magazine"
    >
      {/* FULL BLEED BACKGROUND IMAGE */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        {couplePhoto ? (
          <SafeImage 
            src={couplePhoto} 
            alt="Fashion Editorial Cover"
            className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out hover:scale-105"
            style={{ objectPosition }}
            isHero={true}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center">
            <Heart className="w-24 h-24 text-zinc-700 opacity-50" />
          </div>
        )}
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 lg:from-black/50 lg:to-black/50 pointer-events-none" />
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 min-h-screen w-full flex flex-col pt-6 pb-12 px-6 md:px-12 lg:px-20">
        
        {/* TOP BAR: ISSUE INFO & BARCODE (Desktop split, Mobile stack) */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start w-full uppercase tracking-[0.2em] text-[10px] md:text-xs font-semibold mb-8 lg:mb-4 text-white/80">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0 space-y-1">
            <span>THE WEDDING ISSUE</span>
            <span>VOL. 1 — {monthStr} {yearStr}</span>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-1">
            <span className="opacity-60">EXCLUSIVE EDITION</span>
            <span>PRICELESS</span>
          </div>
        </div>

        {/* MASSIVE MAGAZINE TITLE */}
        <div className="w-full flex justify-center mb-12 lg:mb-16">
          <h1 
            className="text-[18vw] md:text-[15vw] lg:text-[13vw] leading-[0.8] tracking-tighter uppercase text-center font-black drop-shadow-2xl mix-blend-overlay text-white"
            style={{ fontFamily: `"${headingFont}", serif` }}
          >
            NUPTIALS
          </h1>
        </div>

        {/* MAIN EDITORIAL LAYOUT (Desktop Grid vs Mobile Stack) */}
        <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-end pb-12">
          
          {/* LEFT SIDEBAR: Editorial Highlights (Only visible/large on desktop, mixed on mobile) */}
          <div className="lg:col-span-3 flex flex-col gap-8 text-left order-2 lg:order-1 lg:pb-12">
            <div className="space-y-3">
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white/90" style={{ fontFamily: `"${accentFont}", serif` }}>
                The Couple
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-white/70 font-light border-l border-white/20 pl-4">
                {wedding.bride_name} <br/> &mdash; and &mdash; <br/> {wedding.groom_name}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/50">
                Editorial Note
              </h3>
              <div className="text-sm md:text-base leading-relaxed text-white/80 italic font-serif">
                {renderQuote()}
              </div>
            </div>
            
            {(wedding.bride_parents || wedding.groom_parents) && (
              <div className="space-y-2 mt-4 pt-4 border-t border-white/20">
                <p className="text-[10px] uppercase tracking-widest text-white/50">Proudly presented by</p>
                <p className="text-xs font-medium tracking-wide">
                  {wedding.bride_parents && <span>{wedding.bride_parents}</span>}
                  {wedding.bride_parents && wedding.groom_parents && <span className="mx-2">|</span>}
                  {wedding.groom_parents && <span>{wedding.groom_parents}</span>}
                </p>
              </div>
            )}
          </div>

          {/* CENTER SPACE FOR SUBJECT (Visual breathing room) */}
          <div className="lg:col-span-5 h-[30vh] lg:h-auto order-1 lg:order-2 pointer-events-none" />

          {/* RIGHT SIDEBAR: Event Details & Actions */}
          <div className="lg:col-span-4 flex flex-col gap-8 order-3 backdrop-blur-md bg-black/20 p-6 md:p-8 rounded-none border border-white/10 lg:pb-12 shadow-2xl">
            
            <div className="text-center pb-6 border-b border-white/20">
              <h2 className="text-3xl md:text-4xl font-light uppercase tracking-widest mb-2" style={{ fontFamily: `"${headingFont}", serif` }}>
                {eventTitle}
              </h2>
              <p className="text-sm tracking-[0.3em] text-white/60 uppercase">{dateStr}</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <Clock className="w-5 h-5 text-white/40 mt-1 group-hover:text-white transition-colors" />
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase text-white/50 mb-1">Time</h4>
                  <p className="text-lg font-light tracking-wide">{timeStr}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <MapPin className="w-5 h-5 text-white/40 mt-1 group-hover:text-white transition-colors" />
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase text-white/50 mb-1">Venue</h4>
                  <p className="text-lg font-light tracking-wide mb-1">{wedding.venue_name || 'Location TBA'}</p>
                  {wedding.venue_address && (
                    <p className="text-xs text-white/60 leading-relaxed font-light">{wedding.venue_address}</p>
                  )}
                </div>
              </div>

              {hasMaps && (
                <button 
                  onClick={handleMapClick}
                  className="mt-2 text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:text-white text-white/60 transition-colors border-b border-white/20 pb-1"
                >
                  <Navigation className="w-3 h-3" /> Get Directions
                </button>
              )}
            </div>

            <div className="pt-6 border-t border-white/20 space-y-4">
              <div className="text-center w-full">
                {renderTimer()}
              </div>

              {showRsvp && (
                <div className="mt-6">
                  {renderRsvpButton()}
                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* BOTTOM GUESTBOOK SECTION */}
        <div className="w-full mt-8 pt-12 border-t border-white/20 flex flex-col items-center">
          <div className="max-w-2xl w-full mx-auto">
            <h3 className="text-center text-sm uppercase tracking-[0.3em] mb-8 text-white/60 flex items-center justify-center gap-3">
              <BookOpen className="w-4 h-4" /> Editorial Guestbook
            </h3>
            {renderGuestBook()}
          </div>
        </div>

      </div>
    </div>
  );
}
