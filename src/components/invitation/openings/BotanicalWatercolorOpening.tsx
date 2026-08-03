import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function BotanicalWatercolorOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-[#f9f8f6]" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/40 blur-[60px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200/40 blur-[60px] rounded-full" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none px-6">
        <h1 className="text-5xl md:text-7xl font-serif text-emerald-900/80">{semanticData.primaryName}</h1>
        {semanticData.secondaryName && <span className="block text-3xl text-pink-700/50 font-serif italic">&</span>}
        {semanticData.secondaryName && <h1 className="text-5xl md:text-7xl font-serif text-emerald-900/80">{semanticData.secondaryName}</h1>}
        <p className="text-sm tracking-[0.2em] uppercase text-emerald-800/40">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}