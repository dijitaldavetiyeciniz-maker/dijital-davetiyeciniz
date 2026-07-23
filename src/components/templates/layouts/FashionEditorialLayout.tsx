
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function FashionEditorialLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground }: any) {
  return (
    <div className="w-full min-h-screen text-slate-900 p-8 sm:p-12 flex flex-col items-center" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div className="w-full max-w-3xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-[#FF69B4] p-12 text-white flex flex-col justify-center relative">
          <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 opacity-80">Vol. 1</h4>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.8]" style={{ fontFamily: `"${headingFont}", sans-serif` }}>{wedding.bride_name}</h1>
          <h2 className="text-xl italic mt-6 opacity-90 font-serif">A Little Princess</h2>
        </div>
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-10 pb-6 border-b border-pink-100">
            <h3 className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-2">Tarih</h3>
            <p className="text-xl font-medium">{dateStr}</p>
          </div>
          <div className="mb-10">
            <h3 className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-2">Mekan</h3>
            <p className="text-lg font-medium">{wedding.venue_name}</p>
            <p className="text-xs opacity-60 mt-1">{wedding.venue_address}</p>
          </div>
          {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#FF69B4" styleType="minimal" />}
          <div className="mt-8">{renderRsvpButton()}</div>
          <div className="mt-8">{renderGuestBook()}</div>
        </div>
      </div>
    </div>
  );
}
