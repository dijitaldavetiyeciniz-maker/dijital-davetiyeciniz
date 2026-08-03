'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Navigation, Award, Disc, Mic, Star, Sparkles, Map } from 'lucide-react';
import { getPrimarySubjectName, getSecondarySubjectName, resolveEventTitle, getEventTypeConfig } from '@/data/eventTypeConfig';

interface Speaker {
  name: string;
  role: string;
  company?: string;
}
interface Sponsor {
  name: string;
}

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

function TechLaunchView({ props, semanticData }: { props: LayoutProps, semanticData: any }) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, dateObj, dateStr, timeStr, renderTimer, renderRsvpButton, handleMapClick, cardSurfaceStyle } = props;
  const { overrides, primaryName, secondaryName, eventTitle } = semanticData;
  const speakers: Speaker[] = overrides.speakers || [
    { name: 'Dr. Sarah Connor', role: 'Chief AI Officer', company: 'Cyberdyne' },
    { name: 'John Doe', role: 'Lead Engineer', company: 'TechNova' }
  ];

  return (
    <div data-testid="modern-event-tech-launch" className="w-full min-h-screen flex flex-col bg-[#050505] text-[#f4f4f5] font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Hero */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center p-6 sm:p-12" style={cardSurfaceStyle}>
        <div className="absolute inset-0 bg-radial-gradient from-cyan-900/20 to-[#050505] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto space-y-6">
          <span className="text-xs sm:text-sm font-mono tracking-[0.4em] uppercase text-cyan-400 border border-cyan-400/30 py-1.5 px-4 rounded-full">
            {eventTitle || 'TECH LAUNCH'}
          </span>
          <h1 className="text-[12vw] sm:text-7xl md:text-8xl font-black leading-none tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500" style={{ fontFamily: `"${headingFont}", sans-serif` }}>
            {primaryName || 'INNOVATE'}
          </h1>
          {secondaryName && <h2 className="text-xl sm:text-3xl font-medium text-slate-300 tracking-wide">{secondaryName}</h2>}
          <div className="pt-8">
            <p className="text-lg sm:text-xl font-mono text-slate-400 tracking-widest">{dateStr} — {timeStr}</p>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 w-full flex justify-center animate-bounce opacity-50">
          <span className="text-2xl">&darr;</span>
        </div>
      </section>

      {/* Timer & Quote */}
      <section className="w-full py-16 px-6 sm:px-12 bg-black border-y border-white/5 flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="max-w-xl text-center md:text-left text-sm sm:text-base text-slate-400 leading-relaxed font-light">
          {props.renderQuote()}
        </div>
        <div className="shrink-0 scale-110 sm:scale-125 transform origin-center">
          {renderTimer()}
        </div>
      </section>

      {/* Speakers */}
      {speakers.length > 0 && (
        <section className="w-full py-20 px-6 sm:px-12 max-w-6xl mx-auto">
          <h3 className="text-xs font-mono tracking-[0.3em] uppercase text-slate-500 mb-10 text-center">Featured Speakers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {speakers.map((sp, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-start gap-4 transition-transform hover:-translate-y-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {sp.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">{sp.name}</h4>
                  <p className="text-sm text-cyan-400 font-medium">{sp.role}</p>
                  {sp.company && <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{sp.company}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <section className="w-full py-20 px-6 sm:px-12 bg-gradient-to-t from-cyan-900/20 to-transparent flex flex-col items-center text-center space-y-10">
        <div className="space-y-4 max-w-lg">
          <MapPin className="w-8 h-8 mx-auto text-cyan-400" />
          <h3 className="text-2xl font-bold">{wedding.venue_name || 'Location TBA'}</h3>
          {wedding.venue_address && <p className="text-sm text-slate-400">{wedding.venue_address}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          {wedding.google_maps_url && (
            <button onClick={handleMapClick} className="flex-1 py-4 px-6 rounded-full bg-white/10 text-white font-bold text-sm tracking-widest uppercase hover:bg-white/20 transition-colors flex justify-center items-center gap-2">
              <Navigation className="w-4 h-4" /> Map
            </button>
          )}
          {wedding.show_rsvp !== false && (
            <div className="flex-1 w-full [&>button]:w-full [&>button]:py-4 [&>button]:rounded-full [&>button]:text-sm [&>button]:tracking-widest [&>button]:uppercase [&>button]:bg-cyan-500 [&>button]:text-black hover:[&>button]:bg-cyan-400 [&>button]:font-bold transition-colors">
              {renderRsvpButton()}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function GraduationView({ props, semanticData }: { props: LayoutProps, semanticData: any }) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, dateObj, dateStr, timeStr, renderTimer, renderRsvpButton, handleMapClick, cardSurfaceStyle } = props;
  const { overrides, primaryName, secondaryName, eventTitle } = semanticData;
  const graduationYear = overrides.graduation_year || dateObj.getFullYear().toString();
  const department = overrides.department || secondaryName || 'Computer Science';
  const faculty = overrides.faculty || 'Engineering Faculty';

  return (
    <div data-testid="modern-event-graduation" className="w-full min-h-screen flex flex-col bg-[#0f172a] text-[#f8fafc] overflow-x-hidden font-sans">
      <section className="w-full min-h-[85vh] flex flex-col items-center justify-center p-6 sm:p-12 relative" style={cardSurfaceStyle}>
        {/* Background elements */}
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-8">
            <Award className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight mb-4" style={{ fontFamily: `"${headingFont}", sans-serif` }}>
            {primaryName}
          </h1>
          <div className="h-px w-24 bg-amber-500/50 my-6" />
          <h2 className="text-xl sm:text-2xl text-amber-200 font-medium tracking-widest uppercase mb-2">
            Class of {graduationYear}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 uppercase tracking-widest mt-4">
            {faculty} <br className="sm:hidden" /> <span className="hidden sm:inline">•</span> {department}
          </p>
        </div>
      </section>

      <section className="w-full py-16 px-6 bg-slate-900 border-t border-slate-800 flex flex-col items-center justify-center space-y-12">
        <div className="max-w-2xl text-center text-lg md:text-xl font-light leading-relaxed italic text-slate-300" style={{ fontFamily: `"${props.accentFont}", serif` }}>
          {props.renderQuote()}
        </div>
        <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 shadow-xl">
          {renderTimer()}
        </div>
      </section>

      <section className="w-full py-20 px-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-2">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold">Commencement</h3>
          <div className="space-y-1 text-slate-300">
            <p className="font-medium text-lg">{dateStr}</p>
            <p className="text-sm opacity-80">{timeStr}</p>
          </div>
        </div>

        <div className="flex flex-col space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-2">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold">Location</h3>
          <div className="space-y-1 text-slate-300">
            <p className="font-medium">{wedding.venue_name || 'TBA'}</p>
            {wedding.venue_address && <p className="text-sm opacity-80">{wedding.venue_address}</p>}
          </div>
          {wedding.google_maps_url && (
            <button onClick={handleMapClick} className="text-sm text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2 mt-4 hover:text-amber-300">
              Get Directions <span aria-hidden="true">&rarr;</span>
            </button>
          )}
        </div>
      </section>

      {wedding.show_rsvp !== false && (
        <section className="w-full pb-24 px-6 flex justify-center">
          <div className="w-full max-w-md [&>button]:w-full [&>button]:py-4 [&>button]:rounded-2xl [&>button]:bg-amber-500 [&>button]:text-slate-900 [&>button]:font-bold [&>button]:uppercase [&>button]:tracking-widest hover:[&>button]:bg-amber-400 transition-colors shadow-xl shadow-amber-500/10">
            {renderRsvpButton()}
          </div>
        </section>
      )}
    </div>
  );
}

function GalaView({ props, semanticData }: { props: LayoutProps, semanticData: any }) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, dateObj, dateStr, timeStr, renderTimer, renderRsvpButton, handleMapClick, cardSurfaceStyle } = props;
  const { primaryName, eventTitle } = semanticData;

  return (
    <div data-testid="modern-event-gala" className="w-full min-h-screen flex flex-col bg-[#111111] text-[#e5e5e5] font-serif overflow-x-hidden">
      <section className="w-full min-h-screen flex flex-col justify-between p-6 sm:p-12 relative" style={cardSurfaceStyle}>
        <div className="absolute inset-4 sm:inset-8 border border-white/20 pointer-events-none" />
        <div className="absolute inset-5 sm:inset-10 border border-white/10 pointer-events-none" />
        
        <header className="w-full text-center pt-8 sm:pt-12 z-10">
          <span className="text-[10px] sm:text-xs font-sans tracking-[0.4em] uppercase text-yellow-600/80">
            {eventTitle || 'Annual Gala'}
          </span>
        </header>

        <main className="w-full flex-1 flex flex-col items-center justify-center text-center px-4 z-10">
          <Sparkles className="w-8 h-8 text-yellow-600 mb-8 opacity-70" />
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-normal leading-tight tracking-tight mb-8 max-w-5xl" style={{ fontFamily: `"${headingFont}", serif` }}>
            {primaryName || 'A Night of Elegance'}
          </h1>
          <div className="w-24 h-[1px] bg-yellow-600/50 mb-8" />
          <p className="text-lg sm:text-xl text-white/70 italic max-w-2xl" style={{ fontFamily: `"${props.accentFont}", serif` }}>
            {props.renderQuote()}
          </p>
        </main>

        <footer className="w-full text-center pb-8 sm:pb-12 z-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-xs sm:text-sm uppercase tracking-widest font-sans">
            <span>{dateStr}</span>
            <span className="w-1.5 h-1.5 bg-yellow-600 rotate-45" />
            <span>{timeStr}</span>
          </div>
          <p className="text-xs uppercase tracking-widest text-white/50 font-sans mt-2">{wedding.venue_name}</p>
        </footer>
      </section>

      <section className="w-full bg-[#0a0a0a] py-24 px-6 flex flex-col items-center justify-center space-y-16">
        <div className="transform scale-90 sm:scale-100">
          {renderTimer()}
        </div>
        
        <div className="w-full max-w-md space-y-6 font-sans">
          {wedding.google_maps_url && (
            <button onClick={handleMapClick} className="w-full py-4 border border-white/20 text-white uppercase tracking-widest text-xs hover:bg-white/5 transition-colors">
              View Map & Directions
            </button>
          )}
          {wedding.show_rsvp !== false && (
            <div className="w-full [&>button]:w-full [&>button]:py-4 [&>button]:bg-yellow-700 [&>button]:text-white [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-xs hover:[&>button]:bg-yellow-600 transition-colors">
              {renderRsvpButton()}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function NeonPartyView({ props, semanticData }: { props: LayoutProps, semanticData: any }) {
  const { wedding, primaryColor, textColor, headingFont, bodyFont, dateObj, dateStr, timeStr, renderTimer, renderRsvpButton, handleMapClick, cardSurfaceStyle } = props;
  const { overrides, primaryName, eventTitle } = semanticData;
  const djName = overrides.dj_name || 'DJ PULSE';
  const dressCode = overrides.dress_code || 'Neon Casual';

  return (
    <div data-testid="modern-event-neon-party" className="w-full min-h-screen flex flex-col bg-[#050014] text-white font-sans overflow-x-hidden">
      <section className="w-full min-h-[90vh] flex flex-col items-center justify-center relative p-6 sm:p-12 overflow-hidden" style={cardSurfaceStyle}>
        {/* Neon Glows */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-fuchsia-600/30 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/30 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
          <div className="inline-block py-1 px-4 rounded-full border border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-300 text-xs font-bold uppercase tracking-widest">
            {eventTitle || 'AFTER PARTY'}
          </div>
          
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]" style={{ fontFamily: `"${headingFont}", sans-serif` }}>
            {primaryName || 'NEON NIGHTS'}
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-lg sm:text-2xl font-bold uppercase tracking-widest text-white/90">
            <span>{dateStr}</span>
            <span className="hidden sm:block text-fuchsia-500">•</span>
            <span>{timeStr}</span>
          </div>
        </div>
      </section>

      <section className="w-full py-16 px-6 bg-[#03000a] flex flex-col md:flex-row gap-8 items-center justify-center border-y border-white/5">
        <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl w-full max-w-sm border border-white/5 backdrop-blur-md">
          <Disc className="w-10 h-10 text-cyan-400 mb-4 animate-[spin_4s_linear_infinite]" />
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">HEADLINE DJ</h3>
          <p className="text-xl font-black italic tracking-wider text-cyan-300">{djName}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl w-full max-w-sm border border-white/5 backdrop-blur-md">
          <Star className="w-10 h-10 text-fuchsia-400 mb-4" />
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">DRESS CODE</h3>
          <p className="text-xl font-black italic tracking-wider text-fuchsia-300">{dressCode}</p>
        </div>
      </section>

      <section className="w-full py-20 px-6 max-w-2xl mx-auto text-center space-y-12">
        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] text-white/50 mb-6">Countdown</h3>
          <div className="inline-block scale-110">
            {renderTimer()}
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-bold text-xl">{wedding.venue_name}</p>
          <p className="text-sm text-white/50">{wedding.venue_address}</p>
        </div>

        <div className="flex flex-col gap-4">
          {wedding.google_maps_url && (
            <button onClick={handleMapClick} className="w-full py-4 rounded-xl bg-white/10 text-white font-bold uppercase tracking-widest text-sm hover:bg-white/20 transition-all">
              Location Map
            </button>
          )}
          {wedding.show_rsvp !== false && (
            <div className="w-full [&>button]:w-full [&>button]:py-4 [&>button]:rounded-xl [&>button]:bg-gradient-to-r [&>button]:from-fuchsia-600 [&>button]:to-purple-600 [&>button]:text-white [&>button]:font-bold [&>button]:uppercase [&>button]:tracking-widest [&>button]:text-sm hover:[&>button]:opacity-90 transition-opacity shadow-[0_0_20px_rgba(192,38,211,0.4)]">
              {renderRsvpButton()}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ModernEventLayout(props: LayoutProps) {
  const { wedding, eventTitle } = props;
  
  // 1. ETKİNLİK VARYANT TESPİTİ
  const presetId = wedding.template_id || '';
  const overrides = wedding.custom_overrides || {};
  let variant: 'tech-launch' | 'graduation' | 'gala' | 'neon-party' = overrides.event_variant || 'tech-launch';

  if (!overrides.event_variant) {
    if (presetId === 'graduation-ceremony' || eventTitle.includes('Mezuniyet')) {
      variant = 'graduation';
    } else if (presetId === 'future-summit' || presetId === 'modern-event') {
      variant = 'tech-launch';
    } else if (presetId === 'gala-night') {
      variant = 'gala';
    } else if (presetId === 'neon-party') {
      variant = 'neon-party';
    }
  }

  const config = getEventTypeConfig(wedding.event_type);
  const semanticData = {
    overrides: wedding.custom_overrides || {},
    primaryName: getPrimarySubjectName(wedding),
    secondaryName: getSecondarySubjectName(wedding),
    eventTitle: resolveEventTitle(wedding)
  };

  switch (variant) {
    case 'graduation':
      return <GraduationView props={props} semanticData={semanticData} />;
    case 'gala':
      return <GalaView props={props} semanticData={semanticData} />;
    case 'neon-party':
      return <NeonPartyView props={props} semanticData={semanticData} />;
    case 'tech-launch':
    default:
      return <TechLaunchView props={props} semanticData={semanticData} />;
  }
}
