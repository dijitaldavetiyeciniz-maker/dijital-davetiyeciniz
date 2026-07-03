'use client';
import { Sparkles, Calendar, MapPin, Crown, Navigation } from 'lucide-react';
import { useState } from 'react';
import CountdownTimer from '../CountdownTimer';
import RsvpModal from '../RsvpModal';
import FloatingActionBar from '../FloatingActionBar';

interface TemplateProps {
  wedding: {
    id: string;
    bride_name: string;
    groom_name: string;
    wedding_date: string | null;
    event_type: string | null;
    venue_name: string | null;
    venue_address: string | null;
    google_maps_url: string | null;
    custom_message: string | null;
    primary_color: string | null;
    font_family: string | null;
    background_image_url: string | null;
  };
}

export default function Template4({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  
  const eventTitle = wedding.event_type ? `${wedding.event_type} TÖRENİ` : 'DÜĞÜN TÖRENİ';
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 pb-28 text-slate-900 font-serif">
      <div className="max-w-2xl w-full p-10 text-center relative">
        <div className="absolute inset-0 border-[1px] border-amber-300 m-2 rounded-t-full pointer-events-none" />
        <div className="absolute inset-0 border-[1px] border-amber-300 m-4 rounded-t-full pointer-events-none" />
        
        <Crown className="w-12 h-12 text-amber-500 mx-auto mb-6 relative z-10" />
        
        <h3 className="text-amber-600 font-serif tracking-[0.4em] uppercase mb-6 text-sm relative z-10">
          {eventTitle}
        </h3>
        
        <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-8 relative z-10 uppercase tracking-widest leading-tight">
          {wedding.bride_name} <br/> <span className="text-amber-500 text-3xl py-2 inline-block">ile</span> <br/> {wedding.groom_name}
        </h1>
        
        {wedding.custom_message && (
          <p className="text-lg text-slate-600 font-light italic mb-8 px-4 leading-relaxed relative z-10">
            "{wedding.custom_message}"
          </p>
        )}
        
        <div className="w-24 h-px bg-amber-300 mx-auto mb-8 relative z-10" />
        
        {wedding.wedding_date && (
          <div className="mb-8 relative z-10">
            <CountdownTimer targetDate={wedding.wedding_date} />
          </div>
        )}
        
        <div className="flex flex-col gap-6 text-lg font-serif mb-10 relative z-10">
          <div>
            <div className="text-amber-600 text-sm tracking-widest uppercase mb-1">Tarih</div>
            <div className="text-xl">{dateStr}</div>
            <div className="text-slate-500 text-base">{timeStr}</div>
          </div>
          <div>
            <div className="text-amber-600 text-sm tracking-widest uppercase mb-1">Mekan</div>
            <div className="text-xl font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</div>
            {wedding.venue_address && (
              <div className="text-slate-500 text-base mt-1">{wedding.venue_address}</div>
            )}
            
            {wedding.google_maps_url && (
              <a 
                href={wedding.google_maps_url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Haritada Gör
              </a>
            )}
          </div>
        </div>

        <button 
          onClick={() => setIsRsvpOpen(true)}
          className="w-full px-12 py-4 bg-slate-900 text-amber-500 rounded-none font-serif tracking-widest uppercase hover:bg-slate-800 transition-colors relative z-10 border border-amber-500"
        >
          Katılım Bildirimi (LCV)
        </button>
      </div>

      <FloatingActionBar 
        onRsvpClick={() => setIsRsvpOpen(true)} 
        googleMapsUrl={wedding.google_maps_url} 
        primaryColor="#f59e0b" 
      />

      <RsvpModal 
        weddingId={wedding.id} 
        isOpen={isRsvpOpen} 
        onClose={() => setIsRsvpOpen(false)} 
        primaryColor="#f59e0b" // amber-500
      />
    </div>
  );
}
