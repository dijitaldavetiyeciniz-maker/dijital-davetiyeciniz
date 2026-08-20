'use client';
import React from 'react';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';

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
  const getGoogleCalendarUrl = (event: any) => {
    const start = new Date(event.start_time);
    const end = event.end_time ? new Date(event.end_time) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
    
    // Format to YYYYMMDDTHHMMSSZ (UTC)
    const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', event.title || 'Etkinlik');
    url.searchParams.append('dates', `${fmt(start)}/${fmt(end)}`);
    
    if (event.description) url.searchParams.append('details', event.description);
    if (event.venue_address) url.searchParams.append('location', event.venue_address);
    if (event.timezone) url.searchParams.append('ctz', event.timezone);
    
    return url.toString();
  };

  // Generate ICS File
  const downloadICS = (event: any) => {
    const start = new Date(event.start_time);
    const end = event.end_time ? new Date(event.end_time) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
    
    const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Dijital Davetiyeciniz//TR',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${event.title?.replace(/,/g, '\\,').replace(/;/g, '\\;') || 'Etkinlik'}`,
      event.description ? `DESCRIPTION:${event.description.replace(/,/g, '\\,').replace(/;/g, '\\;')}` : '',
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

  const getDeterministicDateTimeStr = (d: Date) => {
    const day = d.getUTCDate();
    const months = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    const month = months[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} - ${hours}:${minutes}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 relative z-10" style={{ color: textColor }}>
      <h3 className="text-2xl font-semibold text-center mb-10" style={{ fontFamily: 'var(--font-heading)' }}>
        Program Akışı
      </h3>
      
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        
        {events.map((event, index) => {
          const startDate = new Date(event.start_time);
          const isLeft = index % 2 === 0;
          
          // Deterministic formatting using fixed locale and event-specified timezone to avoid SSR/hydration mismatch
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
            <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Timeline dot */}
              <div 
                className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"
                style={{ backgroundColor: primaryColor }}
              >
                <Clock className="w-4 h-4 text-white" />
              </div>

              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-1 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }} suppressHydrationWarning>
                    {formattedDateTime}
                  </span>
                  <h4 className="text-xl font-medium" style={{ fontFamily: 'var(--font-heading)' }}>{event.title}</h4>
                </div>

                {event.description && (
                  <p className="text-sm opacity-80 mb-4">{event.description}</p>
                )}

                <div className="space-y-2 mb-4 text-sm opacity-90">
                  {event.venue_name && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                      <span>
                        <span className="font-semibold">{event.venue_name}</span>
                        {event.venue_address && <span className="block text-xs opacity-75">{event.venue_address}</span>}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100/50">
                  {event.google_maps_url && (
                    <a 
                      href={event.google_maps_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      <MapPin className="w-3 h-3 mr-1" /> Harita
                    </a>
                  )}
                  <a 
                    href={getGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Calendar className="w-3 h-3 mr-1" /> Google Takvim
                  </a>
                  <button 
                    onClick={() => downloadICS(event)}
                    className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
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
