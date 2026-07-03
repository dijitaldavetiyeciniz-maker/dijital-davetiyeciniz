import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface TemplateProps {
  wedding: {
    bride_name: string;
    groom_name: string;
    wedding_date: string | null;
  };
}

export default function Template5({ wedding }: TemplateProps) {
  const dateObj = wedding.wedding_date ? new Date(wedding.wedding_date) : new Date();
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center p-6 text-zinc-900 font-sans">
      <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
        
        <div className="flex-1">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
            {wedding.bride_name}.<br/>
            {wedding.groom_name}.
          </h1>
          <p className="text-xl text-zinc-500 font-medium mb-12 max-w-sm">
            Hayatımızın en özel gününde sizleri de aramızda görmekten mutluluk duyarız.
          </p>
          
          <div className="space-y-6 mb-12">
            <div className="flex items-start gap-4">
              <Calendar className="w-6 h-6 text-zinc-300 mt-1" />
              <div>
                <div className="font-bold text-lg">{dateStr}</div>
                <div className="text-zinc-500">{timeStr}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-zinc-300 mt-1" />
              <div>
                <div className="font-bold text-lg">Minimalist Loft Event Space</div>
                <div className="text-zinc-500">Karaköy, İstanbul</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-96 bg-black text-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-8">Sen de Gel.</h2>
          <p className="text-zinc-400 mb-8">
            Lütfen katılım durumunuzu aşağıdaki butona tıklayarak bize bildirin.
          </p>
          <button className="flex items-center justify-between w-full p-4 bg-white text-black font-bold hover:bg-zinc-200 transition-colors group">
            <span>LCV Formu</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
