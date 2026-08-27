'use client';

import React from 'react';
import { Calendar, MapPin, Clock, Users, Sparkles, Heart, Music, Utensils, Star, Coffee } from 'lucide-react';
import { parseEventMeta } from '@/components/admin/events/EventsTab';

interface EventProps {
  events: any[];
  primaryColor?: string;
  textColor?: string;
}

export default function EventsTimeline({ events, primaryColor = '#f43f5e', textColor = '#334155' }: EventProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!events || events.length === 0) return null;

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (event: any, meta: any) => {
    const start = new Date(event.start_time);
    const end = event.end_time ? new Date(event.end_time) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', event.title || 'Etkinlik');
    url.searchParams.append('dates', `${fmt(start)}/${fmt(end)}`);
    
    const descText = meta.special_note || meta.text || event.description || '';
    if (descText) url.searchParams.append('details', descText);
    if (event.venue_address) url.searchParams.append('location', event.venue_address);
    if (event.timezone) url.searchParams.append('ctz', event.timezone);
    
    return url.toString();
  };

  // Generate ICS File
  const downloadICS = (event: any, meta: any) => {
    const start = new Date(event.start_time);
    const end = event.end_time ? new Date(event.end_time) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const descText = meta.special_note || meta.text || event.description || '';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Dijital Davetiyeciniz//TR',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${event.title?.replace(/,/g, '\\,').replace(/;/g, '\\;') || 'Etkinlik'}`,
      descText ? `DESCRIPTION:${descText.replace(/,/g, '\\,').replace(/;/g, '\\;')}` : '',
      event.venue_address ? `LOCATION:${event.venue_address.replace(/,/g, '\\,').replace(/;/g, '\\;')}` : '',
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title ? event.title.replace(/\s+/g, '_') : 'etkinlik'}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 relative z-10" style={{ color: textColor }}>
      <h3 className="text-2xl font-semibold text-center mb-10" style={{ fontFamily: 'var(--font-heading)' }}>
        Etkinlikler & Program Akışı
      </h3>
      
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        
        {events.map((event, index) => {
          const startDate = new Date(event.start_time);
          const meta = parseEventMeta(event.description);
          
          const formatter = new Intl.DateTimeFormat('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: event.timezone || 'Europe/Istanbul'
          });
          const formattedDateTime = formatter.format(startDate);
          
          return (
            <div key={event.id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Timeline dot */}
              <div 
                className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"
                style={{ backgroundColor: primaryColor }}
              >
                <Clock className="w-4 h-4 text-white" />
              </div>

              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left">
                <div className="flex flex-col gap-1 mb-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }} suppressHydrationWarning>
                      {formattedDateTime}
                    </span>
                    {meta.audience_type && meta.audience_type !== 'all' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" />
                        {meta.audience_type === 'women' ? 'Kadınlar Arasında' :
                         meta.audience_type === 'family' ? 'Aile İçi' :
                         meta.audience_type === 'men' ? 'Erkekler Arasında' : meta.audience_type}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-medium text-slate-800" style={{ fontFamily: 'var(--font-heading)' }}>{event.title}</h4>
                </div>

                {meta.special_note && (
                  <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 text-slate-700">
                    <span className="font-semibold block text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Bilgilendirme Notu</span>
                    {meta.special_note}
                  </div>
                )}

                {/* Sub Program Items */}
                {meta.program_items && meta.program_items.length > 0 && (
                  <div className="my-3 pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Program Akışı
                    </span>
                    <div className="space-y-1.5">
                      {meta.program_items.map((item: any, pIdx: number) => (
                        <div key={item.id || pIdx} className="flex items-start gap-2 text-xs">
                          <span className="font-mono font-bold text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {item.time}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-800">{item.title}</span>
                            {item.description && (
                              <span className="text-[11px] text-slate-500 block">{item.description}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 mb-4 text-xs opacity-90">
                  {event.venue_name && (
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                      <span>
                        <span className="font-semibold text-slate-700">{event.venue_name}</span>
                        {event.venue_address && <span className="block text-[11px] text-slate-500">{event.venue_address}</span>}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                  {event.google_maps_url && (
                    <a 
                      href={event.google_maps_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700"
                    >
                      <MapPin className="w-3 h-3 mr-1" /> Harita
                    </a>
                  )}
                  <a 
                    href={getGoogleCalendarUrl(event, meta)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700"
                  >
                    <Calendar className="w-3 h-3 mr-1" /> Google Takvim
                  </a>
                  <button 
                    onClick={() => downloadICS(event, meta)}
                    className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer"
                  >
                    <Calendar className="w-3 h-3 mr-1" /> Apple/Outlook
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
