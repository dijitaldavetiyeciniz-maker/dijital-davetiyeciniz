import { Sparkles, Calendar, MapPin, Navigation } from 'lucide-react';
import CountdownTimer from '../CountdownTimer';

interface TemplateProps {
  wedding: {
    bride_name: string;
    groom_name: string;
    wedding_date: string | null;
    event_type: string | null;
    venue_name: string | null;
    venue_address: string | null;
    google_maps_url: string | null;
    custom_message: string | null;
  };
}

export default function Template1({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  
  const eventTitle = wedding.event_type ? `${wedding.event_type} Töreni` : 'Düğün Töreni';

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-6 text-slate-800 font-serif relative overflow-hidden">
      {/* Arkaplan Süslemeleri */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-10 text-center relative z-10 border border-white">
        <Sparkles className="w-8 h-8 text-rose-400 mx-auto mb-6" />
        
        <h3 className="text-rose-500 font-medium tracking-widest uppercase mb-4 text-sm">
          {eventTitle}
        </h3>
        
        <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-8 mt-4 leading-tight">
          {wedding.bride_name} <br/> <span className="text-3xl text-rose-400">&</span> <br/> {wedding.groom_name}
        </h1>
        
        {/* Özel Söz / Mesaj */}
        {wedding.custom_message && (
          <p className="text-lg text-slate-600 font-light italic mb-8 px-4 leading-relaxed">
            "{wedding.custom_message}"
          </p>
        )}
        
        {/* Geri Sayım Sayacı */}
        {wedding.wedding_date && (
          <CountdownTimer targetDate={wedding.wedding_date} />
        )}
        
        <div className="flex flex-col gap-5 text-lg font-medium text-slate-700 mb-10 mt-6">
          <div className="flex items-center justify-center gap-3 bg-white py-3 rounded-xl border border-rose-100 shadow-sm">
            <Calendar className="w-5 h-5 text-rose-500" />
            <span>{dateStr} <span className="text-rose-300 mx-2">|</span> {timeStr}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-rose-500" />
              <span className="font-bold">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
            </div>
            {wedding.venue_address && (
              <span className="text-sm text-slate-500 font-light px-8">{wedding.venue_address}</span>
            )}
            
            {wedding.google_maps_url && (
              <a 
                href={wedding.google_maps_url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm text-rose-600 font-bold hover:text-rose-700 hover:underline"
              >
                <Navigation className="w-4 h-4" />
                Haritada Gör
              </a>
            )}
          </div>
        </div>

        <button className="w-full px-8 py-4 bg-rose-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all hover:-translate-y-1">
          LCV Formunu Doldur
        </button>
      </div>
    </div>
  );
}
