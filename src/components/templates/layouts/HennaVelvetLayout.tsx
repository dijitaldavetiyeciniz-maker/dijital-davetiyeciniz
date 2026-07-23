'use client';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import { backgroundDesignRegistry, thematicAssetRegistry } from '@/lib/registries';

interface LayoutProps {
  wedding: any;
  primaryColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  accentFont: string;
  dateObj: Date;
  dateStr: string;
  timeStr: string;
  eventTitle: string;
  renderTimer: () => React.ReactNode;
  renderRsvpButton: () => React.ReactNode;
  renderGuestBook: () => React.ReactNode;
  renderQuote: () => React.ReactNode;
  handleMapClick: () => void;
  cardBgColor?: string;
  mode?: 'preview' | 'public';
}

export default function HennaVelvetLayout({
  wedding,
  primaryColor,
  textColor,
  headingFont,
  bodyFont,
  accentFont,
  dateObj,
  dateStr,
  timeStr,
  eventTitle,
  renderTimer,
  renderRsvpButton,
  renderGuestBook,
  renderQuote,
  handleMapClick,
  cardBgColor = '#3f0712',
  mode = 'public'
}: LayoutProps) {
  
  const hennaVariant = wedding.custom_overrides?.henna_variant || 'gold';
  
  // Metalik renk geçişleri (Gradient)
  let metalicBorder = 'linear-gradient(135deg, #dfb76c 0%, #c5a880 50%, #dfb76c 100%)'; 
  let metalicTextColor = '#dfb76c';
  let metalicTextShadow = '0 0 5px rgba(223, 183, 108, 0.4)';

  if (hennaVariant === 'rose-gold') {
    metalicBorder = 'linear-gradient(135deg, #c98778 0%, #e2b3a8 50%, #c98778 100%)';
    metalicTextColor = '#e2b3a8';
    metalicTextShadow = '0 0 5px rgba(226, 179, 168, 0.4)';
  } else if (hennaVariant === 'copper') {
    metalicBorder = 'linear-gradient(135deg, #b87333 0%, #dca373 50%, #b87333 100%)';
    metalicTextColor = '#dca373';
    metalicTextShadow = '0 0 5px rgba(220, 163, 115, 0.4)';
  }

  // 2. KADİFE ARKA PLAN DOKUSU (Derin bordo kadife degrade)
  const bgRegistry = backgroundDesignRegistry[wedding.background_design || 'solid-burgundy'] || backgroundDesignRegistry['solid-burgundy'];
  
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: bgRegistry.fallbackColor || cardBgColor,
    backgroundImage: bgRegistry.image ? `linear-gradient(${bgRegistry.overlay}, ${bgRegistry.overlay}), url('${bgRegistry.image}')` : `radial-gradient(circle at center, rgba(100, 10, 25, 0.95) 0%, rgba(35, 2, 8, 0.98) 100%)`,
    backgroundSize: bgRegistry.size,
    backgroundPosition: bgRegistry.position,
    backgroundRepeat: bgRegistry.repeat,
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)'
  };

  const hennaTrayAsset = thematicAssetRegistry['henna-tray'] || { src: '' };
  const hasMaps = !!wedding.google_maps_url;
  const showRsvp = wedding.show_rsvp !== false;

  return (
    <div 
      className="max-w-[550px] mx-auto w-full my-8 relative z-10 animate-fade-in font-sans"
      style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), fontFamily: `"${bodyFont}", serif` }}
    >
      {/* Kadife Görünümlü Lüks Asimetrik Kına Kartı */}
      <div 
        className="relative rounded-[2.5rem] overflow-hidden p-6 sm:p-10 text-center border flex flex-col items-center justify-between min-h-[640px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
        style={{ ...backgroundStyle, borderColor: `${metalicTextColor}35` }}
      >
        {/* Kadife DokuNoise Katmanı */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none z-0 opacity-50" />

        {/* Uçuşan Gül Yaprakları Animasyon Simülasyonu */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-40">
          <div className="absolute top-10 left-1/4 animate-bounce text-red-500 duration-[5000ms]">🌹</div>
          <div className="absolute top-20 right-1/4 animate-pulse text-red-600 duration-[4000ms]">🌹</div>
          <div className="absolute bottom-40 left-12 animate-bounce text-red-700 duration-[6000ms]">🌹</div>
          <div className="absolute bottom-20 right-12 animate-pulse text-red-500 duration-[5000ms]">🌹</div>
        </div>

        {/* Lüks Çerçeve Süsleri */}
        <div className="absolute inset-4 sm:inset-6 rounded-[2rem] pointer-events-none z-0 border" 
             style={{ borderImage: `${metalicBorder} 1`, borderWidth: '1.5px', opacity: 0.6 }} />

        {/* ASİMETRİK GÜVENLİ İÇERİK ALANI */}
        <div className="relative z-10 w-full flex flex-col items-center">
          
          {/* Logo / Mühür Rozeti */}
          <div className="flex flex-col items-center mb-4 select-none">
            <div 
              className="w-14 h-14 rounded-full border-2 flex items-center justify-center font-serif text-xl font-bold shadow-lg bg-rose-950/80 backdrop-blur-xs"
              style={{ borderColor: metalicTextColor, color: metalicTextColor, textShadow: metalicTextShadow }}
            >
              🌸
            </div>
          </div>

          {/* Kına Gecesi Başlığı */}
          <h2 
            className="text-3xl sm:text-4xl font-normal tracking-[0.25em] uppercase mb-4"
            style={{ color: metalicTextColor, fontFamily: `"${headingFont}", serif`, textShadow: metalicTextShadow }}
          >
            {eventTitle}
          </h2>

          {/* Gelin İsmi */}
          <div className="w-full mb-6">
            <h1 
              className="text-4xl sm:text-5xl font-normal leading-tight tracking-wide w-full"
              style={{ color: '#ffffff', fontFamily: `"${headingFont}", serif` }}
            >
              {wedding.bride_name}
            </h1>
            {wedding.bride_parents && (
              <p className="text-[10px] tracking-[0.2em] font-light mt-3 opacity-75 uppercase font-sans text-rose-200">
                AİLESİ: {wedding.bride_parents}
              </p>
            )}
          </div>

          {/* Asimetrik Davet Mesajı */}
          <div className="text-rose-100 my-4 leading-relaxed text-sm max-w-sm italic">
            {renderQuote()}
          </div>

          {/* Sayaç */}
          <div className="w-full my-4 bg-black/30 p-4 rounded-3xl border border-rose-900/30">
            <span className="text-[9px] font-bold tracking-widest text-rose-300 block mb-2">DAVET GÜNÜNE</span>
            {renderTimer()}
          </div>

          {/* ASİMETRİK SOLDA DİKEY TARİH KOMPOZİSYONU */}
          <div className="w-full max-w-sm my-6 flex gap-4 text-left text-white items-stretch">
            {/* Dikey Tarih Barı */}
            <div className="w-16 flex flex-col justify-center items-center rounded-xl bg-gradient-to-b from-rose-900/60 to-black/40 border border-rose-900/20 text-center py-2 px-1">
              <span className="text-[9px] font-bold tracking-wider text-rose-300 block">AY</span>
              <span className="text-xl font-bold" style={{ color: metalicTextColor }}>
                {dateObj.toLocaleDateString('tr-TR', { month: 'numeric' })}
              </span>
              <span className="text-lg font-bold">{dateObj.toLocaleDateString('tr-TR', { day: 'numeric' })}</span>
            </div>
            {/* Mekan Bilgisi Barı */}
            <div className="flex-1 p-3 rounded-xl border bg-black/35 flex flex-col justify-center" style={{ borderColor: `${metalicTextColor}20` }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: metalicTextColor }} />
                <span className="font-bold text-xs">{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
              </div>
              {wedding.venue_address && (
                <p className="text-[10px] font-light opacity-90 pl-6 leading-relaxed text-rose-200/80 mt-1">{wedding.venue_address}</p>
              )}
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="w-full max-w-sm flex flex-col gap-3 mt-4">
            {hasMaps && (
              <button 
                type="button"
                onClick={handleMapClick}
                className="w-full h-12 rounded-full border flex items-center justify-between px-6 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
                style={{ 
                  borderImage: `${metalicBorder} 1`,
                  borderWidth: '1.5px',
                  color: metalicTextColor,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  <span>KONUMA GİT</span>
                </div>
                <span>&rarr;</span>
              </button>
            )}

            {showRsvp && renderRsvpButton()}
          </div>

          {/* Anı Defteri */}
          {renderGuestBook()}
        </div>
      </div>
    </div>
  );
}
