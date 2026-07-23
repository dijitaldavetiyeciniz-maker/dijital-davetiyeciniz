
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function CrownCrestLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook }: any) {
  return (
    <div className="w-full max-w-sm mx-auto bg-white p-6 shadow-2xl border border-yellow-500/20 text-center relative overflow-hidden" style={{ color: textColor }}>
      <div className="w-full h-48 bg-gradient-to-b from-yellow-50 to-white absolute top-0 left-0 pointer-events-none"></div>
      <div className="relative z-10 pt-10">
        <div className="w-24 h-24 mx-auto border-2 border-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-md bg-white">
          <span className="text-4xl">👑</span>
        </div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-2">Sünnet Töreni</h3>
        <h1 className="text-3xl font-black mb-8" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name}</h1>
        
        <div className="bg-yellow-50/50 p-6 rounded-2xl mb-8">
          <p className="font-bold text-lg mb-1 text-slate-800">{dateStr}</p>
          <p className="text-sm font-medium text-slate-600">{wedding.venue_name}</p>
        </div>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#EAB308" styleType="elegant" />}
        <div className="mt-6">{renderRsvpButton()}</div>
        <div className="mt-6">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
