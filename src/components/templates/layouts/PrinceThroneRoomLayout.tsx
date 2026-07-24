
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

import { Crown } from 'lucide-react';

export default function PrinceThroneRoomLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-b from-[#1a237e] to-[#0d47a1] text-white p-4 shadow-2xl rounded-t-full border-8 border-b-0 border-[#ffd54f]" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div data-testid="invitation-card-surface" className="bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] p-8 pt-24 text-center" style={cardSurfaceStyle}>
        <Crown className="w-10 h-10 text-[#ffd54f] mx-auto mb-4" />
        <h3 className="text-xs text-[#ffd54f] tracking-widest uppercase mb-8 font-bold">Şehzade Sünnet Töreni</h3>
        <h1 className="text-3xl font-black mb-8 drop-shadow-md" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name}</h1>
        <div className="w-3/4 mx-auto h-px bg-[#ffd54f]/40 mb-8"></div>
        <div className="bg-black/20 p-6 rounded-2xl mb-8 border border-[#ffd54f]/30">
          <p className="font-bold text-lg text-[#ffd54f] mb-2">{dateStr}</p>
          <p className="text-sm">{wedding.venue_name}</p>
        </div>
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#ffd54f" styleType="digital" />}
        <div className="mt-8">{renderRsvpButton()}</div>
        <div className="mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
