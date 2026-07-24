
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function OttomanGardenLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-lg mx-auto p-8 shadow-xl text-center border-[20px] border-[#134E4A] relative" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" style={cardSurfaceStyle}></div>
      <div className="relative z-10">
        <div className="text-3xl mb-4">🌷</div>
        <h1 className="text-4xl font-bold mb-6 text-[#134E4A]" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name}</h1>
        <h3 className="text-xs uppercase tracking-widest font-bold opacity-80 mb-10">Sünnet Düğünü</h3>
        
        <div className="grid grid-cols-1 gap-6 mb-10">
          <div className="border-b-2 border-dotted border-[#134E4A]/30 pb-4">
            <p className="text-sm font-bold text-[#134E4A]">Tarih & Saat</p>
            <p>{dateStr}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#134E4A]">Mekan</p>
            <p>{wedding.venue_name}</p>
            <p className="text-xs opacity-70 mt-1">{wedding.venue_address}</p>
          </div>
        </div>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#134E4A" styleType="glass" />}
        <div className="mt-8">{renderRsvpButton()}</div>
        <div className="mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
