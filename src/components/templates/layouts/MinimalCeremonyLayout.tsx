
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function MinimalCeremonyLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-md mx-auto min-h-[80vh] flex flex-col items-center justify-center p-12 text-center" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), color: textColor }}>
      <h1 className="text-3xl font-light mb-12 tracking-widest uppercase" style={{ fontFamily: `"${headingFont}", sans-serif` }}>
        <span className="block mb-4">{wedding.bride_name}</span>
        <span className="block text-sm opacity-40 mb-4">+</span>
        <span className="block">{wedding.groom_name}</span>
      </h1>
      <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-50">Nişan Töreni</p>
      <div data-testid="invitation-card-surface" className="w-8 h-px bg-black/20 mx-auto mb-8" style={cardSurfaceStyle}></div>
      
      <p className="font-medium text-lg mb-2">{dateStr}</p>
      <p className="text-xs opacity-70 mb-12">{wedding.venue_name}</p>
      
      {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="elegant" />}
      <div className="mt-12">{renderRsvpButton()}</div>
      <div className="mt-12">{renderGuestBook()}</div>
    </div>
  );
}
