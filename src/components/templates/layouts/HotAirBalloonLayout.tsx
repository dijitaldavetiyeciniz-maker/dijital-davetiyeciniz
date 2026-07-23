
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function HotAirBalloonLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardBgColor }: any) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), backgroundColor: !selectedBackground?.background ? '#e0f2fe' : undefined }}>
      <div className="w-full max-w-lg backdrop-blur-md rounded-[3rem] p-8 shadow-xl text-center relative mt-20 border" style={{ backgroundColor: cardBgColor || 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.3)', color: textColor || '#334155' }}>
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-7xl animate-bounce">🎈</div>
        <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-6 mt-4" style={{ color: primaryColor }}>Gökyüzü Yolculuğu</h3>
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name}</h1>
        <p className="text-sm font-medium italic mb-8 px-4 opacity-80">Yeni yaşıma uçarken sizi de yanımda görmek isterim!</p>
        
        <div className="w-full p-4 rounded-xl mb-8 border border-white/20" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
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
