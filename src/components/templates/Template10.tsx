'use client';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import CountdownTimer from '../CountdownTimer';

interface TemplateProps {
  wedding: any;
}

export default function Template10({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const primaryColor = wedding.primary_color || '#8b5cf6'; // violet
  const fontFamilyClass = wedding.font_family === 'serif' ? 'font-serif' : wedding.font_family === 'mono' ? 'font-mono' : 'font-sans';
  const bgImageStyle = wedding.background_image_url ? { backgroundImage: `url(${wedding.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 pb-28 text-slate-800 ${fontFamilyClass} relative`} style={{ backgroundColor: '#f8fafc' }}>
      {wedding.background_image_url && <div className="absolute inset-0 opacity-10" style={bgImageStyle} />}

      <div 
        className="max-w-[420px] mx-auto w-full bg-[#fdfbf7] shadow-xl p-6 sm:p-10 text-center relative z-10 my-8 rounded-xl"
        style={{ backgroundImage: 'radial-gradient(#00000010 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        <div className="border border-slate-300 rounded-lg p-6 bg-[#fdfbf7]/90 backdrop-blur-sm">
          
          <div className="w-12 h-12 mx-auto mb-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-serif italic text-slate-400">
            Davet
          </div>

          <h1 className="text-4xl font-serif mb-6" style={{ color: primaryColor }}>
            <div className="flex flex-col items-center gap-2">
              {wedding.bride_parents && <span className="text-[11px] font-sans tracking-widest text-slate-400 uppercase">{wedding.bride_parents}</span>}
              <span>{wedding.bride_name}</span>
              <span className="text-2xl text-slate-300 italic">&</span>
              <span>{wedding.groom_name}</span>
              {wedding.groom_parents && <span className="text-[11px] font-sans tracking-widest text-slate-400 uppercase mt-2">{wedding.groom_parents}</span>}
            </div>
          </h1>

          <div className="flex items-center justify-center gap-4 mb-6 opacity-50">
            <div className="h-px w-12 bg-slate-400"></div>
            <div className="w-2 h-2 rounded-full bg-slate-400 transform rotate-45"></div>
            <div className="h-px w-12 bg-slate-400"></div>
          </div>

          <p className="text-slate-600 mb-8 text-sm leading-loose">
            {wedding.custom_message || 'Bu mutlu günümüzde sizleri de aramızda görmekten mutluluk duyarız.'}
          </p>
          
          {wedding.wedding_date && (
            <div className="mb-8 border-y py-4 border-slate-200">
              <CountdownTimer targetDate={wedding.wedding_date} />
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Tarih & Saat</span>
              <div className="font-serif text-lg">{dateStr}</div>
              <div className="text-sm text-slate-500">{timeStr}</div>
            </div>
            
            <div className="pt-4 flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Mekan</span>
              <div className="font-serif text-lg">{wedding.venue_name || 'Mekan Belirtilmedi'}</div>
              <div className="text-sm text-slate-500 max-w-[200px] mx-auto">{wedding.venue_address}</div>
              {wedding.google_maps_url && (
                <a href={wedding.google_maps_url} target="_blank" rel="noreferrer" className="mt-3 text-xs font-bold uppercase tracking-widest hover:underline px-4 py-2 border rounded-full transition-colors hover:bg-slate-50" style={{ borderColor: primaryColor, color: primaryColor }}>
                  Yol Tarifi
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
