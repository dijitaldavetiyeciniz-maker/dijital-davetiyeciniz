import React from "react";

type OpeningProps = {
  opened: boolean;
  brideName: string;
  groomName?: string;
  eventDate?: string;
  introText?: string;
};

export function CloudBaloonOpening({ opened, brideName, groomName, eventDate, introText }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 select-none ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100"}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-sky-100 opacity-95" />
      
      {/* Floating Cloud & Balloon Accents */}
      <div className="absolute top-12 left-8 animate-bounce duration-[4000ms] text-5xl opacity-80">☁️</div>
      <div className="absolute top-20 right-10 animate-pulse duration-[3000ms] text-4xl opacity-80">🎈</div>
      <div className="absolute bottom-24 left-10 animate-pulse duration-[3500ms] text-4xl opacity-80">⭐</div>
      <div className="absolute bottom-16 right-12 animate-bounce duration-[4500ms] text-5xl opacity-80">☁️</div>

      <div className="relative z-10 text-center p-8 bg-white/70 backdrop-blur-md rounded-[3rem] shadow-2xl border-4 border-white max-w-sm mx-4 transform transition-all hover:scale-105">
        <div className="w-16 h-16 mx-auto mb-4 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center text-3xl shadow-inner animate-pulse">
          ☁️
        </div>
        <span className="text-xs font-bold tracking-[0.3em] uppercase text-sky-600 mb-2 block">
          {introText || "Bulutların Üzerinde"}
        </span>
        <h2 className="text-3xl font-black text-sky-900 mb-2">
          {brideName} {groomName ? `& ${groomName}` : ''}
        </h2>
        {eventDate && (
          <p className="text-xs font-semibold text-sky-700 tracking-widest mt-3 bg-sky-50 py-1.5 px-4 rounded-full inline-block border border-sky-200">
            {eventDate}
          </p>
        )}
      </div>
    </div>
  );
}
