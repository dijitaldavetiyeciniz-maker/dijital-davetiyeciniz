'use client';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import CountdownTimer from '../CountdownTimer';

interface TemplateProps {
  wedding: any;
}

export default function Template7({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const primaryColor = wedding.primary_color || '#3b82f6';
  const fontFamilyClass = wedding.font_family === 'serif' ? 'font-serif' : wedding.font_family === 'mono' ? 'font-mono' : 'font-sans';
  const bgImageStyle = wedding.background_image_url ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 pb-28 text-slate-900 ${fontFamilyClass} bg-slate-100`}>
      <div 
        className="max-w-[420px] mx-auto w-full bg-white shadow-2xl p-4 sm:p-6 text-center relative z-10 my-8 rounded-sm transform rotate-1"
      >
        <div 
          className="w-full h-80 bg-slate-200 mb-6 rounded-sm relative overflow-hidden"
          style={bgImageStyle}
        >
          {!wedding.background_image_url && <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">Fotoğraf Eklenmedi</div>}
        </div>
        
        <h1 className="text-4xl font-bold mb-2 flex flex-col gap-1 items-center" style={{ color: primaryColor }}>
          {wedding.bride_parents && <span className="text-xs font-normal text-slate-400">{wedding.bride_parents}</span>}
          <span>{wedding.bride_name}</span>
          <span className="text-xl text-slate-300">&</span>
          <span>{wedding.groom_name}</span>
          {wedding.groom_parents && <span className="text-xs font-normal text-slate-400 mt-1">{wedding.groom_parents}</span>}
        </h1>

        <p className="text-slate-600 mb-6 mt-4 text-sm px-4">
          {wedding.custom_message || 'Hayatımızın bu en anlamlı gününde sizleri de aramızda görmekten mutluluk duyarız.'}
        </p>
        
        {wedding.wedding_date && (
          <div className="mb-6 transform -rotate-1">
            <CountdownTimer targetDate={wedding.wedding_date} />
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-left border-t-2 border-dashed border-slate-200 pt-6">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
              <span className="font-bold text-xs uppercase text-slate-500">Tarih</span>
            </div>
            <div className="font-bold text-sm">{dateStr}</div>
            <div className="text-slate-500 text-sm">{timeStr}</div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
              <span className="font-bold text-xs uppercase text-slate-500">Mekan</span>
            </div>
            <div className="font-bold text-sm line-clamp-1">{wedding.venue_name || 'Mekan Yok'}</div>
            {wedding.google_maps_url && (
              <a href={wedding.google_maps_url} target="_blank" rel="noreferrer" className="text-xs font-bold hover:underline" style={{ color: primaryColor }}>
                Harita Linki
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
