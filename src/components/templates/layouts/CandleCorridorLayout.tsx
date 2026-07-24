
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function CandleCorridorLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full min-h-screen text-[#fcd34d] p-6 flex flex-col items-center justify-center" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" className="w-full max-w-md border border-[#fcd34d]/30 p-8 rounded-t-full shadow-[0_0_50px_rgba(252,211,77,0.1)] text-center relative overflow-hidden" style={cardSurfaceStyle}>
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[#fcd34d] blur-[40px] opacity-30"></div>
        <h1 className="text-4xl mt-20 mb-4" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name}</h1>
        <h3 className="text-xs tracking-[0.4em] uppercase opacity-70 mb-12">Kına Gecesi</h3>
        
        <div className="bg-black/50 p-6 rounded-xl border border-[#fcd34d]/10 mb-8 backdrop-blur">
          <p className="font-bold text-lg mb-2">{dateStr}</p>
          <p className="text-sm opacity-80">{wedding.venue_name}</p>
        </div>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#fcd34d" styleType="digital" />}
        <div className="mt-10 opacity-90">{renderRsvpButton()}</div>
        <div className="mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
