import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function MediterraneanGardenLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-lg mx-auto border-x-[16px] border-[#0ea5e9] min-h-[80vh] p-8 text-center shadow-lg relative overflow-hidden" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), color: textColor }}>
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" className="absolute top-0 left-0 w-full h-32 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 pointer-events-none" style={cardSurfaceStyle}></div>
      
      <div className="relative z-10 pt-10">
        <h3 className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#0ea5e9] mb-6">Akdeniz Bahçesi</h3>
        <h1 className="text-5xl font-light mb-10 text-slate-800" style={{ fontFamily: `"${headingFont}", cursive` }}>{wedding.bride_name} <br/><span className="text-2xl text-[#0ea5e9]">&</span><br/> {wedding.groom_name}</h1>
        
        <div className="w-16 h-px bg-[#0ea5e9]/30 mx-auto mb-8"></div>
        
        <p className="font-bold text-lg mb-2 text-[#0ea5e9]">{dateStr}</p>
        <p className="text-sm text-slate-600 mb-10">{wedding.venue_name}</p>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#0ea5e9" styleType="glass" />}
        <div className="mt-8">{renderRsvpButton()}</div>
        <div className="mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
