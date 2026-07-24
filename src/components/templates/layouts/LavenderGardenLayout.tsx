
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function LavenderGardenLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-md mx-auto border-x-[12px] border-[#6B21A8] min-h-[80vh] p-8 text-center shadow-lg flex flex-col justify-center" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <h3 className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#6B21A8] mb-6">Kır Nişanı</h3>
      <h1 className="text-5xl font-light mb-10 text-slate-800" style={{ fontFamily: `"${headingFont}", cursive` }}>{wedding.bride_name} <br/><span className="text-2xl text-[#6B21A8]">&</span><br/> {wedding.groom_name}</h1>
      
      <div data-testid="invitation-card-surface" className="w-16 h-px bg-[#6B21A8]/30 mx-auto mb-8" style={cardSurfaceStyle}></div>
      
      <p className="font-bold text-lg mb-2 text-[#6B21A8]">{dateStr}</p>
      <p className="text-sm text-slate-600 mb-10">{wedding.venue_name}</p>
      
      {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#6B21A8" styleType="glass" />}
      <div className="mt-8">{renderRsvpButton()}</div>
      <div className="mt-8">{renderGuestBook()}</div>
    </div>
  );
}
