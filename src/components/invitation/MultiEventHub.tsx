'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ExternalLink, Sparkles, Check, Heart, ArrowRight } from 'lucide-react';
import OrnamentalFlowerMotif from './OrnamentalFlowerMotif';

export interface MultiSubEvent {
  id?: string;
  title: string;
  start_time: string;
  end_time?: string;
  venue_name?: string;
  venue_address?: string;
  google_maps_url?: string;
  description?: string;
  theme?: 'burgundy-amber-night' | 'navy-silver-starlight' | string;
  special_note?: string;
  dress_code?: string;
}

interface MultiEventHubProps {
  wedding: any;
  subEvents: MultiSubEvent[];
  onOpenRsvp: (selectedEventId?: string) => void;
}

export default function MultiEventHub({
  wedding,
  subEvents = [],
  onOpenRsvp
}: MultiEventHubProps) {
  const [now, setNow] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const brideName = wedding?.bride_name || 'Gelin';
  const groomName = wedding?.groom_name || 'Damat';

  // Format date helper
  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long'
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const formatEventTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return new Intl.DateTimeFormat('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(d);
    } catch {
      return '';
    }
  };

  // Google Calendar URL Generator
  const getGoogleCalUrl = (ev: MultiSubEvent) => {
    try {
      const start = new Date(ev.start_time);
      const end = ev.end_time ? new Date(ev.end_time) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
      const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const url = new URL('https://calendar.google.com/calendar/render');
      url.searchParams.append('action', 'TEMPLATE');
      url.searchParams.append('text', `${brideName} & ${groomName} - ${ev.title}`);
      url.searchParams.append('dates', `${fmt(start)}/${fmt(end)}`);
      if (ev.description || ev.special_note) url.searchParams.append('details', ev.description || ev.special_note || '');
      if (ev.venue_address) url.searchParams.append('location', ev.venue_address);
      return url.toString();
    } catch {
      return '#';
    }
  };

  // ICS File Download
  const downloadIcs = (ev: MultiSubEvent) => {
    try {
      const start = new Date(ev.start_time);
      const end = ev.end_time ? new Date(ev.end_time) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
      const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Dijital Davetiyeciniz//TR',
        'BEGIN:VEVENT',
        `DTSTART:${fmt(start)}`,
        `DTEND:${fmt(end)}`,
        `SUMMARY:${brideName} & ${groomName} - ${ev.title?.replace(/,/g, '\\,')}`,
        ev.description ? `DESCRIPTION:${ev.description.replace(/,/g, '\\,')}` : '',
        ev.venue_address ? `LOCATION:${ev.venue_address.replace(/,/g, '\\,')}` : '',
        'END:VEVENT',
        'END:VCALENDAR'
      ].filter(Boolean).join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${ev.title ? ev.title.replace(/\s+/g, '_') : 'etkinlik'}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  // Countdown calculations
  const calculateRemaining = (dateStr: string) => {
    if (!mounted || now === 0) return { days: 0, hours: 0, minutes: 0 };
    const diff = new Date(dateStr).getTime() - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    return { days, hours, minutes };
  };

  return (
    <div className="w-full min-h-screen py-16 px-4 md:px-8 text-slate-100 relative overflow-hidden bg-slate-950">
      {/* Dynamic Starfield Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute w-96 h-96 -top-20 -left-20 bg-rose-950/30 rounded-full blur-3xl" />
        <div className="absolute w-96 h-96 -bottom-20 -right-20 bg-indigo-950/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        {/* 1. Header with Equal 2-Column Grid for Couple Names */}
        <header className="text-center space-y-4">
          <span className="text-[10px] md:text-xs font-serif tracking-[0.35em] text-amber-200/70 uppercase">
            Özel Davetiye & Etkinlik Programı
          </span>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 max-w-2xl mx-auto px-4 py-2">
            <h1 
              className="text-right text-3xl md:text-5xl font-serif text-amber-100/95 truncate"
              style={{ fontFamily: '"Great Vibes", cursive, serif' }}
            >
              {brideName}
            </h1>
            <span className="text-xl md:text-2xl font-serif text-amber-400/80 px-2 select-none">&</span>
            <h1 
              className="text-left text-3xl md:text-5xl font-serif text-amber-100/95 truncate"
              style={{ fontFamily: '"Great Vibes", cursive, serif' }}
            >
              {groomName}
            </h1>
          </div>

          <p className="text-xs md:text-sm font-serif text-slate-400 max-w-md mx-auto leading-relaxed">
            {wedding?.custom_message || 'Bu mutlu ve anlamlı günlerimizde siz değerli dostlarımızı aramızda görmekten onur duyarız.'}
          </p>
        </header>

        {/* 2. Themed Multi-Event Cards (Tickets) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {subEvents.map((ev, idx) => {
            const isHenna = ev.title?.toLowerCase().includes('kına') || ev.theme === 'burgundy-amber-night' || idx === 0 && subEvents.length > 1 && ev.title?.toLowerCase().includes('kına');
            const cardTheme = isHenna ? 'burgundy' : 'navy';
            const remaining = calculateRemaining(ev.start_time);

            return (
              <div
                key={ev.id || idx}
                data-testid={`event-card-${idx}`}
                className={`relative rounded-3xl p-6 md:p-8 flex flex-col justify-between border shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden ${
                  cardTheme === 'burgundy'
                    ? 'bg-gradient-to-b from-[#2e100c] via-[#220b08] to-[#170705] border-amber-500/30 text-[#f5e6d8] shadow-[0_20px_50px_rgba(43,15,11,0.6)]'
                    : 'bg-gradient-to-b from-[#142036] via-[#0d1626] to-[#060a12] border-slate-400/30 text-[#f7f3e8] shadow-[0_20px_50px_rgba(13,22,38,0.6)]'
                }`}
              >
                {/* Corner Floral Motifs */}
                <div className="absolute top-2 left-2 opacity-50 pointer-events-none">
                  <OrnamentalFlowerMotif palette={cardTheme === 'burgundy' ? 'amber' : 'silver'} size={80} position="top-left" />
                </div>
                <div className="absolute top-2 right-2 opacity-50 pointer-events-none">
                  <OrnamentalFlowerMotif palette={cardTheme === 'burgundy' ? 'amber' : 'silver'} size={80} position="top-right" />
                </div>

                {/* Event Card Header & Badge */}
                <div className="relative z-10 space-y-4 pt-4 text-center">
                  <div className="flex justify-center">
                    <span 
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                        cardTheme === 'burgundy' 
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                          : 'bg-slate-300/10 text-slate-200 border-slate-300/30'
                      }`}
                    >
                      {ev.title || `Etkinlik #${idx + 1}`}
                    </span>
                  </div>

                  {ev.special_note && (
                    <p className={`text-xs font-semibold tracking-wide ${cardTheme === 'burgundy' ? 'text-amber-200' : 'text-slate-300'}`}>
                      ✨ {ev.special_note}
                    </p>
                  )}

                  {/* Countdown Timer */}
                  <div className="flex justify-center gap-3 py-3 border-y border-white/10 my-4">
                    <div className="text-center">
                      <span className="block text-xl md:text-2xl font-bold font-serif">{remaining.days}</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-60">Gün</span>
                    </div>
                    <span className="text-xl font-serif opacity-30">:</span>
                    <div className="text-center">
                      <span className="block text-xl md:text-2xl font-bold font-serif">{remaining.hours}</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-60">Saat</span>
                    </div>
                    <span className="text-xl font-serif opacity-30">:</span>
                    <div className="text-center">
                      <span className="block text-xl md:text-2xl font-bold font-serif">{remaining.minutes}</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-60">Dakika</span>
                    </div>
                  </div>
                </div>

                {/* Event Details: Date, Time, Venue */}
                <div className="relative z-10 space-y-3 my-6 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-4 h-4 shrink-0 ${cardTheme === 'burgundy' ? 'text-amber-400' : 'text-slate-300'}`} />
                    <span className="font-serif">{formatEventDate(ev.start_time)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className={`w-4 h-4 shrink-0 ${cardTheme === 'burgundy' ? 'text-amber-400' : 'text-slate-300'}`} />
                    <span>Saat: {formatEventTime(ev.start_time)}</span>
                  </div>

                  {ev.venue_name && (
                    <div className="flex items-start gap-3">
                      <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${cardTheme === 'burgundy' ? 'text-amber-400' : 'text-slate-300'}`} />
                      <div className="flex flex-col">
                        <span className="font-semibold">{ev.venue_name}</span>
                        {ev.venue_address && <span className="text-xs opacity-75 mt-0.5">{ev.venue_address}</span>}
                      </div>
                    </div>
                  )}

                  {ev.description && (
                    <p className="text-xs opacity-80 pt-2 border-t border-white/5 italic">
                      "{ev.description}"
                    </p>
                  )}
                </div>

                {/* Actions: Map, Calendar & RSVP */}
                <div className="relative z-10 space-y-3 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-2">
                    {ev.google_maps_url ? (
                      <a
                        href={ev.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                          cardTheme === 'burgundy'
                            ? 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-500/30 text-amber-200'
                            : 'bg-slate-800/60 hover:bg-slate-700/80 border-slate-500/30 text-slate-200'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Harita</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => downloadIcs(ev)}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Takvim (.ics)</span>
                      </button>
                    )}

                    <a
                      href={getGoogleCalUrl(ev)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Google Takvim</span>
                    </a>
                  </div>

                  <button
                    onClick={() => onOpenRsvp(ev.id || String(idx))}
                    data-testid={`rsvp-btn-${idx}`}
                    className={`w-full py-3 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition cursor-pointer ${
                      cardTheme === 'burgundy'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold shadow-amber-900/40'
                        : 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 hover:bg-white text-slate-900 font-bold shadow-slate-900/40'
                    }`}
                  >
                    <span>{ev.title} İçin LCV Bildir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Floating RSVP CTA */}
        <div className="text-center pt-8">
          <button
            onClick={() => onOpenRsvp()}
            data-testid="global-multi-rsvp-btn"
            className="px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-2xl text-sm font-bold tracking-wider uppercase shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2 mx-auto transition cursor-pointer hover:scale-105"
          >
            <Heart className="w-4 h-4 fill-white/20" />
            <span>Tüm Etkinlikler İçin Katılım Bildir (LCV)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
