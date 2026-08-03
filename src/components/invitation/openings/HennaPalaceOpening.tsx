import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function HennaPalaceOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-rose-950" />
      <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-rose-900 to-transparent" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none px-8">
        <div className="text-rose-400 text-5xl mb-6">🏮</div>
        <h1 className="text-5xl md:text-6xl font-serif text-rose-200 drop-shadow-lg">{semanticData.primaryName}</h1>
        <div className="w-24 h-[1px] bg-rose-500/50 mx-auto my-4" />
        <p className="text-sm tracking-[0.3em] uppercase text-rose-300/70">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}