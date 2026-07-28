
import React from 'react';
import { Calendar, MapPin, Wine } from 'lucide-react';
import CountdownTimer from '../../CountdownTimer';

export default function ParisianApartmentLayout({ wedding, primaryColor, textColor, headingFont, bodyFont, dateStr, timeStr, renderRsvpButton, renderGuestBook, renderQuote, selectedBackground, cardSurfaceStyle }: any) {
  if (wedding?.template_id === 'parisian-black-tie') {
    return (
      <div className="w-full min-h-screen bg-stone-50 flex flex-col items-center p-6 md:p-16 font-sans relative" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), color: textColor }}>
        {/* Asimetrik Çerçeve */}
        <div className="w-full max-w-5xl h-full min-h-[85vh] border-l border-b border-stone-800/30 p-8 md:p-20 relative flex flex-col">
          
          <div className="w-full text-right mb-16 md:mb-24">
            <span className="text-[9px] uppercase tracking-[0.4em] font-light text-stone-500 border-b border-stone-300 pb-2">
              L'invitation Exquise
            </span>
          </div>

          <div className="w-full flex flex-col md:flex-row justify-between items-start gap-12 flex-1">
            
            {/* Sol - Tipografi Ağrılıklı */}
            <div className="w-full md:w-2/3">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-6 tracking-tight text-stone-900" style={{ fontFamily: `"${headingFont}", serif` }}>
                {wedding.bride_name} <br/>
                <span className="text-3xl md:text-5xl italic font-serif opacity-50 block my-2 ml-4">et</span>
                {wedding.groom_name}
              </h1>
              
              <div className="w-24 h-px bg-stone-800/40 my-10" />

              <div className="text-sm md:text-base font-light italic leading-loose text-stone-600 max-w-md">
                {renderQuote()}
              </div>
            </div>

            {/* Sağ - Teknik Detaylar */}
            <div className="w-full md:w-1/3 flex flex-col border-l border-stone-300 pl-8 pt-4">
               <div className="mb-10">
                 <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">Quand</p>
                 <p className="text-lg font-serif text-stone-800">{dateStr}</p>
                 <p className="text-sm text-stone-500 mt-1">{timeStr}</p>
               </div>
               
               <div className="mb-10">
                 <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">Où</p>
                 <p className="text-base font-medium text-stone-800 leading-snug">{wedding.venue_name}</p>
                 {wedding.venue_address && <p className="text-xs text-stone-500 mt-2 leading-relaxed">{wedding.venue_address}</p>}
               </div>
            </div>
          </div>

          {/* Alt Bölüm - Tek Sıra Aksiyonlar */}
          <div className="w-full mt-24 border-t border-stone-300 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-auto">
              <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="minimal" />
            </div>
            
            <div className="flex-1 w-full flex flex-col md:flex-row justify-end items-center gap-4">
              <div className="w-full md:w-auto min-w-[200px]">
                {renderRsvpButton()}
              </div>
              <div className="w-full md:w-auto min-w-[200px]">
                {renderGuestBook()}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" className="w-full h-full border-x-4 border-t-8 border-b-4 rounded-t-[5rem] p-8 flex flex-col items-center relative overflow-hidden" style={{ ...cardSurfaceStyle,  borderColor: primaryColor }}>
        {/* Balcony Grill SVG */}
        <div className="absolute bottom-0 w-full h-32 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '10px 10px' }}></div>
        <h3 className="uppercase tracking-[0.3em] text-xs font-bold mb-12 mt-8" style={{ color: primaryColor }}>Une Soirée Élégante</h3>
        <h1 className="text-4xl md:text-6xl text-center leading-tight mb-8" style={{ fontFamily: `"${headingFont}", serif`, color: textColor }}>
          {wedding.bride_name} <br/><span className="text-xl italic opacity-70">&</span><br/> {wedding.groom_name}
        </h1>
        <div className="w-px h-24 my-6" style={{ backgroundColor: primaryColor }}></div>
        <div className="text-center font-serif text-lg mb-12" style={{ color: textColor }}>
          <p>{dateStr}</p>
          <p className="opacity-70 text-sm mt-2">{timeStr}</p>
        </div>
        <div className="bg-white/80 backdrop-blur p-6 border rounded-xl shadow-sm text-center w-full max-w-sm z-10" style={{ borderColor: primaryColor }}>
          <MapPin className="mx-auto mb-2 w-5 h-5" style={{ color: primaryColor }}/>
          <h4 className="font-bold">{wedding.venue_name}</h4>
          <p className="text-xs opacity-70 mt-1">{wedding.venue_address}</p>
        </div>
        {wedding.wedding_date && <div className="mt-12 w-full"><CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="minimal" /></div>}
        <div className="mt-8 z-10">{renderRsvpButton()}</div>
        <div className="w-full mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
