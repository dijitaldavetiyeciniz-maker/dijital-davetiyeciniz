
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function StorybookLayout({ wedding, primaryColor, textColor, headingFont, dateStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-2xl mx-auto shadow-2xl flex flex-col md:flex-row text-slate-800 rounded-xl overflow-hidden border border-slate-200" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}) }}>
      <div data-testid="invitation-card-surface invitation-content-surface hero-text-surface date-surface venue-surface countdown-surface action-surface" className="w-full md:w-1/2 p-10 bg-white border-r border-slate-200 flex flex-col justify-center items-center text-center" style={cardSurfaceStyle}>
        <h1 className="text-5xl font-black mb-4 text-[#7C3AED]" style={{ fontFamily: `"${headingFont}", cursive` }}>{wedding.bride_name}</h1>
        <h3 className="text-sm uppercase tracking-widest font-bold opacity-60">Birinci Bölüm</h3>
      </div>
      <div className="w-full md:w-1/2 p-10 bg-[#FDF8F5] flex flex-col justify-center">
        <p className="text-lg font-serif mb-6 leading-relaxed">
          <span className="text-4xl font-bold text-[#7C3AED] float-left mr-2 line-height-1">B</span>u özel günümüzde, masalımızın bu mutlu bölümünde sizleri de aramızda görmek isteriz.
        </p>
        <div className="border-l-4 border-[#7C3AED] pl-4 mb-8">
          <p className="font-bold">{dateStr}</p>
          <p className="text-sm mt-1">{wedding.venue_name}</p>
        </div>
        
        {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor="#7C3AED" styleType="digital" />}
        <div className="mt-6 flex justify-start scale-90 origin-left">{renderRsvpButton()}</div>
        <div className="mt-6">{renderGuestBook()}</div>
      </div>
    </div>
  );
}
