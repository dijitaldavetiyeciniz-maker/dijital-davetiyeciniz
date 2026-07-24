import React from "react";

type OpeningProps = {
  opened: boolean;
  brideName: string;
  groomName?: string;
  eventDate?: string;
  introText?: string;
};

export function TeddyBearOpening({ opened, brideName, groomName, eventDate, introText }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 select-none ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100"}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-amber-50 to-orange-100 opacity-95" />
      
      <div className="relative z-10 text-center p-8 bg-white/80 backdrop-blur-md rounded-[3rem] shadow-2xl border-4 border-amber-200/80 max-w-sm mx-4">
        <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-4xl shadow-md animate-bounce">
          🧸
        </div>
        <span className="text-xs font-bold tracking-[0.25em] uppercase text-amber-700 mb-2 block">
          {introText || "Sevimli Kutlama"}
        </span>
        <h2 className="text-3xl font-black text-amber-900 mb-2">
          {brideName} {groomName ? `& ${groomName}` : ''}
        </h2>
        {eventDate && (
          <p className="text-xs font-bold text-amber-800 tracking-wider mt-3 bg-amber-50 py-1.5 px-4 rounded-full inline-block border border-amber-200">
            {eventDate}
          </p>
        )}
      </div>
    </div>
  );
}
