
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

import { Castle } from 'lucide-react';

export default function FairyTalePalaceLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-b from-pink-100 to-pink-50 shadow-2xl border-4 border-pink-200 rounded-t-[8rem] text-center p-8 relative overflow-hidden text-pink-900" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div data-testid="invitation-card-surface" className="absolute top-10 left-1/2 -translate-x-1/2 opacity-50" style={cardSurfaceStyle}>
        <Castle className="w-12 h-12 text-pink-400" />
      </div>
      <div className="relative z-10 pt-20">
        <h3 className="text-xs uppercase font-bold tracking-widest mb-6">Bir Varmış Bir Yokmuş...</h3>
        <h1 className="text-5xl font-black mb-8" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name}</h1>
        <p className="italic text-sm opacity-80 mb-8 px-4">Prensesimizin 1. Yaş Günü balosuna davetlisiniz.</p>
        
        <div className="bg-white/60 p-6 rounded-2xl mb-8 border border-pink-200">
          <p className="font-bold text-lg mb-2">{dateStr}</p>
          <p className="text-sm font-medium">{wedding.venue_name}</p>
        </div>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#EC4899" styleType="glass" />}
        <div className="mt-6">{renderRsvpButton()}</div>
        <div className="mt-6">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
