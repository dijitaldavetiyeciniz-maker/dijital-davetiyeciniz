
import React from 'react';
import CountdownTimer from '../../CountdownTimer';

export default function SwissGridCeremonyLayout({ wedding, primaryColor, textColor, dateStr, timeStr, renderRsvpButton, renderGuestBook, selectedBackground, cardSurfaceStyle }: any) {
  return (
    <div className="w-full max-w-5xl mx-auto p-8 sm:p-12 font-sans" style={{ ...(selectedBackground?.background ? { background: selectedBackground.background } : {}), color: textColor }}>
      <div data-testid="invitation-card-surface" className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t-4 pt-4" style={{ ...cardSurfaceStyle,  borderColor: primaryColor }}>
        <div className="md:col-span-3 text-xs uppercase tracking-widest font-bold">
          <p className="mb-2">01 — Gelin & Damat</p>
          <div className="w-full h-px bg-black/10 mb-8"></div>
        </div>
        <div className="md:col-span-9">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 leading-none">{wedding.bride_name}</h1>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-12 leading-none text-slate-400">+ {wedding.groom_name}</h1>
        </div>
        
        <div className="md:col-span-3 text-xs uppercase tracking-widest font-bold">
          <p className="mb-2">02 — Detaylar</p>
          <div className="w-full h-px bg-black/10 mb-8"></div>
        </div>
        <div className="md:col-span-4 text-sm font-medium">
          <p className="mb-1 text-slate-400">TARİH & SAAT</p>
          <p className="text-xl mb-6">{dateStr} / {timeStr}</p>
        </div>
        <div className="md:col-span-5 text-sm font-medium">
          <p className="mb-1 text-slate-400">LOKASYON</p>
          <p className="text-xl">{wedding.venue_name}</p>
          <p className="text-sm opacity-60 mt-1">{wedding.venue_address}</p>
        </div>
        
        <div className="md:col-span-3 text-xs uppercase tracking-widest font-bold mt-8">
          <p className="mb-2">03 — LCV</p>
          <div className="w-full h-px bg-black/10 mb-8"></div>
        </div>
        <div className="md:col-span-9 mt-8 flex flex-col md:flex-row items-start gap-8">
          {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} primaryColor={primaryColor} styleType="digital" />}
          <div className="w-full md:w-auto">{renderRsvpButton()}</div>
        </div>
      </div>
      <div className="mt-16">{renderGuestBook()}</div>
    </div>
  );
}
