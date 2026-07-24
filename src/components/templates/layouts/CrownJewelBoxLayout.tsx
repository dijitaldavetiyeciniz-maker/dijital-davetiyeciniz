
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function CrownJewelBoxLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-sm mx-auto shadow-[0_20px_50px_rgba(236,72,153,0.2)] p-1 border-[16px] border-[#FCE7F3]" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div data-testid="invitation-card-surface" className="border border-pink-200 p-8 text-center bg-pink-50/50" style={cardSurfaceStyle}>
        <h1 className="text-3xl font-bold text-pink-600 mb-2" style={{ fontFamily: `"${headingFont}", sans-serif` }}>{wedding.bride_name}</h1>
        <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-8">Doğum Günü Partisi</p>
        
        <div className="w-16 h-px bg-pink-300 mx-auto mb-8"></div>
        
        <p className="font-bold text-pink-900 mb-1">{dateStr}</p>
        <p className="text-sm text-pink-700 mb-8">{wedding.venue_name}</p>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#DB2777" styleType="minimal" />}
        <div className="mt-8 scale-90">{renderRsvpButton()}</div>
        <div className="mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
