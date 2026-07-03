import { Sparkles, Calendar, MapPin } from 'lucide-react';

interface TemplateProps {
  wedding: {
    bride_name: string;
    groom_name: string;
    wedding_date: string | null;
  };
}

export default function Template1({ wedding }: TemplateProps) {
  // Tarih formatlama
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center relative border border-rose-100 p-12">
        {/* Dekorasyon */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-rose-100/50 to-transparent pointer-events-none" />
        
        <Sparkles className="w-10 h-10 text-rose-400 mx-auto mb-6" />
        
        <h3 className="text-rose-500 font-medium tracking-[0.2em] uppercase mb-4 text-sm">
          Sizi Düğünümüze Bekliyoruz
        </h3>
        
        <h1 className="text-5xl md:text-7xl font-serif text-slate-900 mb-8">
          {wedding.bride_name} <span className="text-rose-300">&</span> {wedding.groom_name}
        </h1>
        
        <div className="flex flex-col gap-4 text-lg text-slate-600 font-light mb-12">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5 text-rose-400" />
            <span>{dateStr} | Saat: {timeStr}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-rose-400" />
            <span>Senin Siten Düğün Salonu, İstanbul</span>
          </div>
        </div>

        <button className="px-8 py-4 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30">
          Katılım Durumu Bildir (LCV)
        </button>
      </div>
    </div>
  );
}
