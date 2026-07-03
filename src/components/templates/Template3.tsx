'use client';
import { Sparkles, Calendar, MapPin, Leaf, Navigation } from 'lucide-react';
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

export default function Template3({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col items-center justify-center p-6 pb-28 text-[#4A3B32] font-serif">
      <div className="max-w-2xl w-full bg-white rounded-sm shadow-xl p-10 text-center relative border-8 border-[#E8E1D3]">
        <Leaf className="w-10 h-10 text-[#7C8964] mx-auto mb-6" />
        
        <h3 className="text-[#7C8964] font-serif italic mb-6 text-xl">
          {wedding.custom_message || 'Birlikte yeni bir hayata...'}
        </h3>
        
        <h1 className="text-6xl md:text-8xl font-serif text-[#4A3B32] mb-10 tracking-widest leading-tight">
          {wedding.bride_name} <br/> <span className="text-4xl text-[#7C8964] py-2 inline-block">&</span> <br/> {wedding.groom_name}
        </h1>
        
        {wedding.wedding_date && (
          <div className="mb-10">
            <CountdownTimer targetDate={wedding.wedding_date} />
          </div>
        )}
        
        <div className="flex flex-col gap-5 text-lg font-serif mb-12">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5 text-[#8D7B68]" />
            <span>{dateStr} - {timeStr}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#8D7B68]" />
              <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            </div>
            {wedding.venue_address && (
              <span className="text-sm text-[#8D7B68] px-8 mt-1">{wedding.venue_address}</span>
            )}
            
            {wedding.google_maps_url && (
              <a 
                href={wedding.google_maps_url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#7C8964] hover:text-[#687353] hover:underline transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Haritada Gör
              </a>
            )}
          </div>
        </div>

        <button 
          onClick={() => setIsRsvpOpen(true)}
          className="w-full px-10 py-4 bg-[#7C8964] text-white rounded-none font-serif text-lg hover:bg-[#687353] transition-colors border-2 border-[#7C8964] hover:border-[#687353]"
        >
          Davete Yanıt Ver (LCV)
        </button>
      </div>

      <FloatingActionBar 
        onRsvpClick={() => setIsRsvpOpen(true)} 
        googleMapsUrl={wedding.google_maps_url} 
        primaryColor="#7C8964" 
      />

      <RsvpModal 
        weddingId={wedding.id} 
        isOpen={isRsvpOpen} 
        onClose={() => setIsRsvpOpen(false)} 
        primaryColor="#7C8964" 
      />
    </div>
  );
}
