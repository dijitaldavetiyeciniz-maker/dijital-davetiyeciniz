import React from "react";

type OpeningProps = {
  opened: boolean;
  brideName: string;
  groomName?: string;
  eventDate?: string;
  introText?: string;
};

export function CinematicFilmOpening({ opened, brideName, groomName, eventDate, introText }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 select-none overflow-hidden ${opened ? "opacity-0 scale-120 blur-2xl pointer-events-none" : "opacity-100 scale-100"}`}>
      <div className="absolute inset-0 bg-slate-950" />
      {/* Projector Spotlight Beam */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,215,0,0.25)_0%,transparent_60%)]" />
      
      <div className="relative z-10 text-center p-8 border-2 border-yellow-500/40 bg-black/60 backdrop-blur-md rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.2)] max-w-md mx-4">
        <div className="text-sm font-mono tracking-[0.4em] uppercase text-yellow-500/80 mb-2">
          🎬 CINEMATIC PREMIERE
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide my-4 drop-shadow-2xl">
          {brideName} {groomName ? `& ${groomName}` : ''}
        </h1>
        <p className="text-xs font-sans tracking-[0.3em] uppercase text-yellow-400 font-bold mt-2">
          {introText || "BAŞROLDE SİZLERİ GÖRMEKTEN ONUR DUYARIZ"}
        </p>
        {eventDate && (
          <p className="text-xs font-mono text-slate-300 mt-6 tracking-widest border-t border-yellow-500/30 pt-3">
            {eventDate}
          </p>
        )}
      </div>
    </div>
  );
}
