import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function FilmPremiereOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-y-0 left-4 w-4 border-l-2 border-r-2 border-white/20 border-dashed" />
      <div className="absolute inset-y-0 right-4 w-4 border-l-2 border-r-2 border-white/20 border-dashed" />
      <div className="relative z-10 text-center space-y-8 pointer-events-none px-12">
        <p className="text-[10px] tracking-[0.5em] text-white/50 uppercase">Sunar</p>
        <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest uppercase text-shadow-sm">{semanticData.primaryName}</h1>
        {semanticData.secondaryName && <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest uppercase text-shadow-sm">{semanticData.secondaryName}</h1>}
        <p className="text-xs tracking-[0.3em] uppercase text-white/40">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}