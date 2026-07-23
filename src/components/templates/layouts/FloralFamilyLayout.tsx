
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function FloralFamilyLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook }: any) {
  return (
    <div className="w-full max-w-lg mx-auto bg-white p-8 text-center rounded-[4rem] shadow-xl relative overflow-hidden" style={{ color: textColor }}>
      <div className="absolute top-0 left-0 w-full h-32 bg-green-50 rounded-t-[4rem] pointer-events-none"></div>
      <div className="relative z-10 pt-10">
        <h3 className="text-xs uppercase tracking-widest font-bold mb-6 text-green-700">Aile Arası Nişan</h3>
        <h1 className="text-4xl mb-6 font-bold" style={{ fontFamily: `"${headingFont}", serif` }}>{wedding.bride_name} & {wedding.groom_name}</h1>
        <p className="text-sm italic opacity-80 mb-8 px-6 font-serif">Ailelerimizin katılacağı bu özel davetimizde, sınırlı sayıdaki en yakınlarımızla bir arada olacağız.</p>
        
        <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 mb-8">
          <p className="font-bold text-lg text-green-800 mb-1">{dateStr}</p>
          <p className="text-sm text-green-700">{wedding.venue_name}</p>
        </div>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#15803d" styleType="elegant" />}
        <div className="mt-8">{renderRsvpButton()}</div>
        <div className="mt-8">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
