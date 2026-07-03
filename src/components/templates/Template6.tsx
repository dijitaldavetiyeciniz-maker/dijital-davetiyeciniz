'use client';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import CountdownTimer from '../CountdownTimer';

interface TemplateProps {
  wedding: any;
}

export default function Template6({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const primaryColor = wedding.primary_color || '#e11d48';
  const fontFamilyClass = wedding.font_family === 'serif' ? 'font-serif' : wedding.font_family === 'mono' ? 'font-mono' : 'font-sans';
  const bgImageStyle = wedding.background_image_url ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 pb-28 text-slate-800 ${fontFamilyClass} relative`}
      style={{ ...bgImageStyle, backgroundColor: wedding.background_image_url ? 'transparent' : '#fff1f2' }}
    >
      {wedding.background_image_url && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />}

      <div 
        className="max-w-[420px] mx-auto w-full bg-white/95 backdrop-blur-md rounded-[3rem] shadow-2xl p-8 sm:p-12 text-center relative z-10 my-8 border-4"
        style={{ borderColor: primaryColor + '40' }}
      >
        <div className="w-16 h-16 mx-auto rounded-full mb-6 flex items-center justify-center" style={{ backgroundColor: primaryColor + '20', color: primaryColor }}>
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
        
        <p className="text-sm uppercase tracking-[0.3em] mb-4 text-slate-500 font-bold">Evleniyoruz</p>
        
        <h1 className="text-5xl font-bold mb-4" style={{ color: primaryColor }}>
          <div className="flex flex-col items-center gap-2">
            {wedding.bride_parents && <span className="text-sm font-normal text-slate-400 block mb-1">{wedding.bride_parents}</span>}
            <span>{wedding.bride_name}</span>
            <span className="text-3xl text-slate-300 font-light">&</span>
            <span>{wedding.groom_name}</span>
            {wedding.groom_parents && <span className="text-sm font-normal text-slate-400 block mt-1">{wedding.groom_parents}</span>}
          </div>
        </h1>

        <p className="text-slate-600 mb-8 italic text-lg border-y py-4 border-slate-100">
          "{wedding.custom_message || 'Bu mutlu günümüzde sizleri de aramızda görmekten onur duyarız.'}"
        </p>
        
        {wedding.wedding_date && (
          <div className="mb-8">
            <CountdownTimer targetDate={wedding.wedding_date} />
          </div>
        )}
        
        <div className="bg-slate-50 rounded-2xl p-6 text-sm flex flex-col gap-4">
          <div className="flex flex-col items-center gap-1">
            <Calendar className="w-5 h-5 mb-1" style={{ color: primaryColor }} />
            <span className="font-bold text-base">{dateStr}</span>
            <span className="text-slate-500">{timeStr}</span>
          </div>
          <div className="h-px w-full bg-slate-200"></div>
          <div className="flex flex-col items-center gap-1">
            <MapPin className="w-5 h-5 mb-1" style={{ color: primaryColor }} />
            <span className="font-bold text-base">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            <span className="text-slate-500 text-center">{wedding.venue_address}</span>
            {wedding.google_maps_url && (
              <a href={wedding.google_maps_url} target="_blank" rel="noreferrer" className="mt-2 text-xs font-bold flex items-center gap-1 hover:underline" style={{ color: primaryColor }}>
                <Navigation className="w-3 h-3" /> Haritada Aç
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
