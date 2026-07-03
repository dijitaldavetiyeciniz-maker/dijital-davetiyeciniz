import { Sparkles, Calendar, MapPin, Heart } from 'lucide-react';

interface TemplateProps {
  wedding: {
    bride_name: string;
    groom_name: string;
    wedding_date: string | null;
  };
}

export default function Template2({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden font-sans">
      {/* Arkaplan Işıkları */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full" />

      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-12 text-center relative z-10 shadow-2xl">
        <Heart className="w-12 h-12 text-blue-400 mx-auto mb-8 animate-pulse" />
        
        <h3 className="text-blue-300 font-medium tracking-[0.3em] uppercase mb-4 text-xs">
          GELECEĞE İLK ADIM
        </h3>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-8 tracking-tight">
          {wedding.bride_name} & {wedding.groom_name}
        </h1>
        
        <div className="flex flex-col gap-5 text-lg text-slate-300 font-light mb-12">
          <div className="flex items-center justify-center gap-3 bg-white/5 py-3 rounded-full border border-white/5">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>{dateStr} <span className="text-slate-500 mx-2">|</span> {timeStr}</span>
          </div>
          <div className="flex items-center justify-center gap-3 bg-white/5 py-3 rounded-full border border-white/5">
            <MapPin className="w-5 h-5 text-purple-400" />
            <span>Modern Sanatlar Merkezi, İstanbul</span>
          </div>
        </div>

        <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
          LCV Formunu Doldur
        </button>
      </div>
    </div>
  );
}
