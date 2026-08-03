import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function RoyalPalaceOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-stone-900" />
      <div className="absolute inset-8 border border-amber-600/30 rounded-t-[100px] pointer-events-none" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none px-12">
        <div className="w-16 h-16 mx-auto mb-8 bg-amber-700/20 rounded-full flex items-center justify-center border border-amber-500/40 shadow-[0_0_30px_rgba(217,119,6,0.3)]">
          <span className="text-amber-500 font-serif text-xl">{semanticData.monogram}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-amber-500 drop-shadow-md">{semanticData.primaryName}</h1>
        {semanticData.secondaryName && <span className="block text-xl text-amber-700/80 font-serif italic">&</span>}
        {semanticData.secondaryName && <h1 className="text-4xl md:text-5xl font-serif text-amber-500 drop-shadow-md">{semanticData.secondaryName}</h1>}
        <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mt-8">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}