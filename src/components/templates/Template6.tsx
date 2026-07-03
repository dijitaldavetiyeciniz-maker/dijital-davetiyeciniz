'use client';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import { useState } from 'react';

import CountdownTimer from '../CountdownTimer';
import RsvpModal from '../RsvpModal';
import FloatingActionBar from '../FloatingActionBar';
import { isColorLight } from '@/lib/colorUtils';

interface TemplateProps {
  wedding: any;
}

export default function Template6({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const eventTitle = wedding.event_type ? `${wedding.event_type}` : 'Düğün';
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  
  const primaryColor = wedding.primary_color || '#ec4899';
  const textColor = wedding.text_color || '#1e293b';
  const fontFamilyClass = wedding.font_family === 'sans' ? 'font-sans' : wedding.font_family === 'mono' ? 'font-mono' : 'font-serif';
  
  // Background is solid primary with low opacity, or black/white depending on text
  const textIsLight = isColorLight(textColor);
  const bgColor = textIsLight ? '#0f172a' : '#fdf2f8';

  return (
    <div 
      className={`min-h-screen flex flex-col items-center p-6 sm:p-12 pb-32 ${fontFamilyClass} relative overflow-hidden`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >


      <div className="max-w-2xl w-full relative z-10 flex flex-col items-center text-center mt-12">
        
        {/* Yuvarlak Fotoğraf Çerçevesi */}
        {wedding.background_image_url ? (
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-12">
            <div 
              className="absolute inset-0 rounded-full border-[10px] animate-spin-slow opacity-50"
              style={{ borderColor: primaryColor, borderStyle: 'dashed' }}
            ></div>
            <div 
              className="absolute inset-4 rounded-full bg-cover bg-center shadow-2xl"
              style={{ backgroundImage: `url(${wedding.background_image_url})` }}
            ></div>
          </div>
        ) : (
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-12">
            <div 
              className="absolute inset-0 rounded-full border-[10px] animate-spin-slow opacity-50"
              style={{ borderColor: primaryColor, borderStyle: 'dashed' }}
            ></div>
            <div 
              className="absolute inset-4 rounded-full flex items-center justify-center shadow-2xl"
              style={{ backgroundColor: primaryColor }}
            >
              <span className="opacity-50 text-white">Görsel Yok</span>
            </div>
          </div>
        )}

        <h3 className="tracking-[0.3em] uppercase text-sm mb-6 opacity-70" style={{ color: primaryColor }}>
          {eventTitle}
        </h3>
        
        <h1 className="text-5xl sm:text-7xl font-bold leading-tight mb-8">
          <div className="flex flex-col items-center">
            {wedding.bride_parents && <span className="text-sm tracking-widest opacity-60 mb-2 font-normal italic">{wedding.bride_parents}</span>}
            <span className="italic">{wedding.bride_name}</span>
          </div>
          <span className="text-4xl my-3 block" style={{ color: primaryColor }}>&</span>
          <div className="flex flex-col items-center">
            <span className="italic">{wedding.groom_name}</span>
            {wedding.groom_parents && <span className="text-sm tracking-widest opacity-60 mt-2 font-normal italic">{wedding.groom_parents}</span>}
          </div>
        </h1>
        
        {wedding.custom_message && (
          <div className="relative my-8 px-8 py-6 rounded-3xl" style={{ backgroundColor: `${primaryColor}10` }}>
            <p className="text-lg sm:text-xl font-light italic leading-relaxed opacity-90">
              "{wedding.custom_message}"
            </p>
          </div>
        )}
        
        {wedding.wedding_date && (
          <div className="my-10 w-full">
            <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="glass" />
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl mt-8">
          <div className="flex flex-col items-center justify-center p-8 rounded-[3rem]" style={{ backgroundColor: `${primaryColor}15` }}>
            <Calendar className="w-8 h-8 mb-4" style={{ color: primaryColor }} />
            <span className="font-bold text-lg mb-1">{dateStr}</span>
            <span className="opacity-70">{timeStr}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-8 rounded-[3rem]" style={{ backgroundColor: `${primaryColor}15` }}>
            <MapPin className="w-8 h-8 mb-4" style={{ color: primaryColor }} />
            <span className="font-bold text-lg mb-2 text-center leading-tight">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            {wedding.venue_address && (
              <span className="opacity-70 text-sm text-center mb-4">{wedding.venue_address}</span>
            )}
            
            {wedding.google_maps_url && (
              <a 
                href={wedding.google_maps_url} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors hover:opacity-80"
                style={{ backgroundColor: primaryColor, color: textIsLight ? '#000' : '#fff' }}
              >
                <Navigation className="w-3 h-3" />
                Yol Tarifi
              </a>
            )}
          </div>
        </div>

        <button 
          onClick={() => setIsRsvpOpen(true)}
          className="mt-12 px-12 py-4 rounded-full font-bold tracking-widest uppercase text-sm shadow-xl transition-transform hover:scale-105"
          style={{ backgroundColor: primaryColor, color: textIsLight ? '#000' : '#fff' }}
        >
          Katılım Bildir
        </button>
      </div>

      <FloatingActionBar 
        onRsvpClick={() => setIsRsvpOpen(true)} 
        googleMapsUrl={wedding.google_maps_url} 
        primaryColor={primaryColor}
        styleType="orbs" 
      />

      <RsvpModal 
        weddingId={wedding.id} 
        isOpen={isRsvpOpen} 
        onClose={() => setIsRsvpOpen(false)} 
        primaryColor={primaryColor} 
      />
    </div>
  );
}
