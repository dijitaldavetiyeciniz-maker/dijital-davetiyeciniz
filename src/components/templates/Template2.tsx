'use client';
import { Sparkles, Calendar, MapPin, Heart, Navigation } from 'lucide-react';
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

export default function Template2({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  
  const eventTitle = wedding.event_type ? `${wedding.event_type} TÖRENİ` : 'DÜĞÜN TÖRENİ';
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 pb-28 text-white relative overflow-hidden font-sans">
      {/* Arkaplan Işıkları */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-10 text-center relative z-10 shadow-2xl">
        <Heart className="w-12 h-12 text-blue-400 mx-auto mb-6 animate-pulse" />
        
        <h3 className="text-blue-300 font-medium tracking-[0.3em] uppercase mb-4 text-xs">
          {eventTitle}
        </h3>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-8 tracking-tight leading-tight py-2">
          {wedding.bride_name} <br/><span className="text-3xl text-white/50">&</span><br/> {wedding.groom_name}
        </h1>
        
        {wedding.custom_message && (
          <p className="text-lg text-slate-300 font-light italic mb-8 px-4 leading-relaxed">
            "{wedding.custom_message}"
          </p>
        )}
        
        {wedding.wedding_date && (
          <div className="mb-8">
            <CountdownTimer targetDate={wedding.wedding_date} />
          </div>
        )}
        
        <div className="flex flex-col gap-4 text-lg text-slate-300 font-light mb-10 mt-6">
          <div className="flex items-center justify-center gap-3 bg-white/5 py-3 rounded-2xl border border-white/5">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>{dateStr} <span className="text-slate-500 mx-2">|</span> {timeStr}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            </div>
            {wedding.venue_address && (
              <span className="text-sm text-slate-400 font-light px-8">{wedding.venue_address}</span>
            )}
            
            {wedding.google_maps_url && (
              <a 
                href={wedding.google_maps_url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Haritada Gör
              </a>
            )}
          </div>
        </div>

        <button 
          onClick={() => setIsRsvpOpen(true)}
          className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:-translate-y-1"
        >
          LCV Formunu Doldur
        </button>
      </div>

      <FloatingActionBar 
        onRsvpClick={() => setIsRsvpOpen(true)} 
        googleMapsUrl={wedding.google_maps_url} 
        primaryColor="#6366f1" 
      />

      <RsvpModal 
        weddingId={wedding.id} 
        isOpen={isRsvpOpen} 
        onClose={() => setIsRsvpOpen(false)} 
        primaryColor="#6366f1" 
      />
    </div>
  );
}
