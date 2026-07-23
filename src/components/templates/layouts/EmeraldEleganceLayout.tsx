
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function EmeraldEleganceLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground }: any) {
  return (
    <div className="w-full max-w-lg mx-auto text-white p-12 text-center shadow-2xl relative" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div className="border border-white/20 p-8 relative">
        <h3 className="text-xs uppercase font-bold tracking-widest text-[#A7F3D0] mb-8">Söz Daveti</h3>
        <h1 className="text-4xl mb-4 font-serif">{wedding.bride_name}</h1>
        <h1 className="text-4xl mb-10 font-serif">{wedding.groom_name}</h1>
        
        <p className="text-sm font-light italic mb-8 opacity-80 text-[#A7F3D0]">Yüzüklerimiz takılırken sizi de yanımızda görmek isteriz.</p>
        
        <div className="bg-black/20 p-4 border border-white/10 mb-8">
          <p className="font-bold mb-1">{dateStr}</p>
          <p className="text-xs text-[#A7F3D0]">{wedding.venue_name}</p>
        </div>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#A7F3D0" styleType="digital" />}
        <div className="mt-8 scale-90">{renderRsvpButton()}</div>
        <div className="mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
