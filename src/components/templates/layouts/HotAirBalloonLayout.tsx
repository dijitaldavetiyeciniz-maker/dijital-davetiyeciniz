
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function HotAirBalloonLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook }: any) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white text-slate-700 p-6 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white/40 backdrop-blur-md rounded-[3rem] p-8 shadow-xl text-center relative mt-20 border border-white">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-7xl animate-bounce">🎈</div>
        <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-sky-600 mb-6 mt-4">Gökyüzü Yolculuğu</h3>
        <h1 className="text-4xl font-bold mb-8 text-slate-800" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name}</h1>
        <p className="text-sm font-medium italic mb-8 px-4 opacity-80">Yeni yaşıma uçarken sizi de yanımda görmek isterim!</p>
        
        <div className="w-full bg-white/60 p-4 rounded-xl mb-8">
          <p className="font-bold text-lg text-sky-700">{dateStr}</p>
          <p className="text-sm mt-1">{wedding.venue_name}</p>
        </div>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#0284c7" styleType="glass" />}
        <div className="mt-8">{renderRsvpButton()}</div>
        <div className="mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
