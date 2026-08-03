import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function StorybookOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-amber-50" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none max-w-sm px-6">
        <div className="text-6xl mb-6 opacity-80">📖</div>
        <h1 className="text-4xl md:text-5xl font-serif text-amber-900">{semanticData.primaryName}</h1>
        {semanticData.age && <p className="text-xl text-amber-700/80 font-serif">{semanticData.age}. Yaş</p>}
        {semanticData.motherName && <p className="text-sm text-amber-800/60 font-serif">Anne: {semanticData.motherName}</p>}
        <p className="text-sm tracking-[0.1em] uppercase text-amber-900/40 mt-8 font-sans font-bold">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}