import { Sparkles, Calendar, MapPin, Crown } from 'lucide-react';

interface TemplateProps {
  wedding: {
    bride_name: string;
    groom_name: string;
    wedding_date: string | null;
  };
}

export default function Template4({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-slate-900">
      <div className="max-w-2xl w-full p-12 text-center relative">
        <div className="absolute inset-0 border-[1px] border-amber-300 m-4 rounded-t-full pointer-events-none" />
        <div className="absolute inset-0 border-[1px] border-amber-300 m-6 rounded-t-full pointer-events-none" />
        
        <Crown className="w-12 h-12 text-amber-500 mx-auto mb-8 relative z-10" />
        
        <h3 className="text-amber-600 font-serif tracking-[0.4em] uppercase mb-8 text-sm relative z-10">
          Düğün Töreni
        </h3>
        
        <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-10 relative z-10 uppercase tracking-widest leading-tight">
          {wedding.bride_name} <br/> <span className="text-amber-500 text-3xl">ile</span> <br/> {wedding.groom_name}
        </h1>
        
        <div className="w-24 h-px bg-amber-300 mx-auto mb-10" />
        
        <div className="flex flex-col gap-6 text-lg font-serif mb-12 relative z-10">
          <div>
            <div className="text-amber-600 text-sm tracking-widest uppercase mb-1">Tarih</div>
            <div className="text-xl">{dateStr}</div>
            <div className="text-slate-500 text-base">{timeStr}</div>
          </div>
          <div>
            <div className="text-amber-600 text-sm tracking-widest uppercase mb-1">Mekan</div>
            <div className="text-xl">Çırağan Sarayı</div>
            <div className="text-slate-500 text-base">Beşiktaş, İstanbul</div>
          </div>
        </div>

        <button className="px-12 py-4 bg-slate-900 text-amber-500 rounded-none font-serif tracking-widest uppercase hover:bg-slate-800 transition-colors relative z-10 border border-amber-500">
          Katılım Bildirimi (LCV)
        </button>
      </div>
    </div>
  );
}
