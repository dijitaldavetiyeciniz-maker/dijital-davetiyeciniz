import { Sparkles, Calendar, MapPin, Leaf } from 'lucide-react';

interface TemplateProps {
  wedding: {
    bride_name: string;
    groom_name: string;
    wedding_date: string | null;
  };
}

export default function Template3({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col items-center justify-center p-6 text-[#4A3B32]">
      <div className="max-w-2xl w-full bg-white rounded-sm shadow-xl p-12 text-center relative border-8 border-[#E8E1D3]">
        <Leaf className="w-10 h-10 text-[#7C8964] mx-auto mb-6" />
        
        <h3 className="text-[#7C8964] font-serif italic mb-6 text-xl">
          Birlikte yeni bir hayata...
        </h3>
        
        <h1 className="text-6xl md:text-8xl font-serif text-[#4A3B32] mb-10 tracking-widest">
          {wedding.bride_name} <br/> <span className="text-4xl text-[#7C8964]">&</span> <br/> {wedding.groom_name}
        </h1>
        
        <div className="flex flex-col gap-4 text-lg font-serif mb-12">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5 text-[#8D7B68]" />
            <span>{dateStr} - {timeStr}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-[#8D7B68]" />
            <span>Doğa Kır Bahçesi, İzmir</span>
          </div>
        </div>

        <button className="px-10 py-4 bg-[#7C8964] text-white rounded-none font-serif text-lg hover:bg-[#687353] transition-colors border-2 border-[#7C8964] hover:border-[#687353]">
          Davete Yanıt Ver
        </button>
      </div>
    </div>
  );
}
