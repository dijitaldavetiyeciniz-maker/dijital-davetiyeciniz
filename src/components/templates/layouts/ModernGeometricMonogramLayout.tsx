
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function ModernGeometricMonogramLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground }: any) {
  return (
    <div className="w-full max-w-lg mx-auto shadow-lg flex flex-col overflow-hidden" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div className="w-full aspect-square bg-[#1E3A8A] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:20px_20px]"></div>
        <div className="w-48 h-48 border-[8px] border-white flex items-center justify-center rotate-45 shadow-2xl relative z-10 bg-[#1E3A8A]/50 backdrop-blur-sm">
          <span className="text-6xl text-white font-black -rotate-45" style={{ fontFamily: `"${headingFont}", sans-serif` }}>{wedding.bride_name[0]}</span>
        </div>
      </div>
      <div className="p-10 text-center bg-white relative z-20 -mt-10 mx-6 rounded-t-3xl shadow-lg border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 uppercase tracking-wide">{wedding.bride_name}</h1>
        <h3 className="text-xs uppercase font-bold tracking-widest text-[#1E3A8A] mb-8">Sünnet Daveti</h3>
        
        <p className="font-medium text-slate-600 mb-2">{dateStr}</p>
        <p className="text-sm text-slate-500 mb-8">{wedding.venue_name}</p>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#1E3A8A" styleType="minimal" />}
        <div className="mt-8">{renderRsvpButton()}</div>
        <div className="mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
