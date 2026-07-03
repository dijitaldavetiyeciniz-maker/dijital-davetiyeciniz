'use client';
import { Calendar, MapPin, Heart, Navigation } from 'lucide-react';
import { useState } from 'react';
import SparklesEffect from '../effects/SparklesEffect';
import CountdownTimer from '../CountdownTimer';
import RsvpModal from '../RsvpModal';
import FloatingActionBar from '../FloatingActionBar';
import { isColorLight } from '@/lib/colorUtils';

interface TemplateProps {
  wedding: any;
}

export default function Template2({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const eventTitle = wedding.event_type ? `${wedding.event_type} TÖRENİ` : 'DÜĞÜN TÖRENİ';
  
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  
  const primaryColor = wedding.primary_color || '#8b5cf6';
  const textColor = wedding.text_color || '#ffffff';
  const fontFamilyClass = wedding.font_family === 'sans' ? 'font-sans' : wedding.font_family === 'serif' ? 'font-serif' : 'font-mono';
  const bgImageStyle = wedding.background_image_url ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {};

  // For Neon, we want a solid contrasting background overlay so neon pops
  const textIsLight = isColorLight(textColor);
  const overlayClass = textIsLight ? 'bg-slate-950/90' : 'bg-slate-50/90';

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-6 pb-32 ${fontFamilyClass} relative overflow-hidden`}
      style={{ ...bgImageStyle, backgroundColor: wedding.background_image_url ? 'transparent' : (textIsLight ? '#020617' : '#f8fafc'), color: textColor }}
    >
      {/* Koyu/Açık Neon Overlay */}
      {wedding.background_image_url && <div className={`absolute inset-0 ${overlayClass}`} />}
      <SparklesEffect color={primaryColor} />

      <div className="max-w-[500px] w-full text-center relative z-10 my-10 flex flex-col items-center justify-center min-h-[80vh]">
        
        <div className="border border-white/10 p-10 rounded-2xl w-full relative" style={{ boxShadow: `0 0 30px ${primaryColor}30, inset 0 0 20px ${primaryColor}20`, borderColor: `${primaryColor}50` }}>
          
          <Heart className="w-10 h-10 mx-auto mb-6 animate-pulse" style={{ color: primaryColor, filter: `drop-shadow(0 0 10px ${primaryColor})` }} />
          
          <h3 className="tracking-[0.3em] text-xs font-bold uppercase mb-8" style={{ color: primaryColor, textShadow: `0 0 8px ${primaryColor}80` }}>
            {eventTitle}
          </h3>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none uppercase tracking-tighter" style={{ textShadow: `0 0 15px ${primaryColor}80` }}>
            <div className="flex flex-col items-center">
              {wedding.bride_parents && <span className="text-xs md:text-sm tracking-[0.2em] font-normal mb-3 opacity-60" style={{ textShadow: 'none' }}>{wedding.bride_parents}</span>}
              <span>{wedding.bride_name}</span>
            </div>
            <span className="text-4xl my-4 block" style={{ color: primaryColor, textShadow: `0 0 20px ${primaryColor}` }}>&</span>
            <div className="flex flex-col items-center">
              <span>{wedding.groom_name}</span>
              {wedding.groom_parents && <span className="text-xs md:text-sm tracking-[0.2em] font-normal mt-3 opacity-60" style={{ textShadow: 'none' }}>{wedding.groom_parents}</span>}
            </div>
          </h1>
          
          {wedding.custom_message && (
            <div className="my-10 relative">
              <div className="absolute left-0 top-0 w-8 h-[1px]" style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }}></div>
              <p className="text-base font-light italic px-4 py-4 leading-relaxed opacity-80">
                "{wedding.custom_message}"
              </p>
              <div className="absolute right-0 bottom-0 w-8 h-[1px]" style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }}></div>
            </div>
          )}
          
          {wedding.wedding_date && (
            <div className="my-10">
              <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="neon" />
            </div>
          )}
          
          <div className="flex flex-col gap-6 font-mono text-sm tracking-widest mt-12">
            <div className="flex flex-col items-center gap-2">
              <Calendar className="w-6 h-6 mb-2" style={{ color: primaryColor, filter: `drop-shadow(0 0 8px ${primaryColor})` }} />
              <span>{dateStr}</span>
              <span style={{ color: primaryColor }}>{timeStr}</span>
            </div>
            
            <div className="w-px h-12 mx-auto opacity-30" style={{ backgroundColor: textColor }}></div>
            
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-6 h-6 mb-2" style={{ color: primaryColor, filter: `drop-shadow(0 0 8px ${primaryColor})` }} />
              <span className="font-bold text-center px-4 uppercase">{wedding.venue_name || 'MEKAN BELİRTİLMEDİ'}</span>
              
              {wedding.venue_address && (
                <span className="text-[10px] font-light opacity-50 px-8 text-center mt-2">{wedding.venue_address}</span>
              )}
              
              {wedding.google_maps_url && (
                <a 
                  href={wedding.google_maps_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-4 px-6 py-2 border rounded-full text-xs uppercase hover:bg-white/10 transition-colors"
                  style={{ borderColor: primaryColor, color: primaryColor, boxShadow: `0 0 10px ${primaryColor}40` }}
                >
                  HARİTADA AÇ
                </a>
              )}
            </div>
          </div>

          <button 
            onClick={() => setIsRsvpOpen(true)}
            className="w-full mt-12 py-4 rounded-xl font-bold tracking-widest uppercase text-sm border-2 transition-all hover:scale-105 active:scale-95"
            style={{ 
              borderColor: primaryColor, 
              color: textIsLight ? '#000' : '#fff',
              backgroundColor: primaryColor, 
              boxShadow: `0 0 25px ${primaryColor}80` 
            }}
          >
            LCV ONAYLA
          </button>
        </div>
      </div>

      <FloatingActionBar 
        onRsvpClick={() => setIsRsvpOpen(true)} 
        googleMapsUrl={wedding.google_maps_url} 
        primaryColor={primaryColor}
        styleType="neon" 
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
