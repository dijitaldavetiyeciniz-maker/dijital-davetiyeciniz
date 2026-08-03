import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function MediterraneanCeramicOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-sky-50" />
      <div className="absolute inset-4 border-2 border-sky-800/20 rounded-[40px] pointer-events-none" />
      <div className="absolute inset-6 border border-sky-800/10 rounded-[32px] pointer-events-none" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none px-8">
        <div className="w-12 h-12 mx-auto border-t-2 border-l-2 border-sky-800/40 rotate-45 mb-10" />
        <h1 className="text-4xl md:text-5xl font-serif text-sky-900">{semanticData.primaryName}</h1>
        {semanticData.secondaryName && <span className="block text-xl text-sky-700/60 font-serif italic">&</span>}
        {semanticData.secondaryName && <h1 className="text-4xl md:text-5xl font-serif text-sky-900">{semanticData.secondaryName}</h1>}
        <p className="text-sm tracking-[0.2em] uppercase text-sky-800/60 mt-10">{semanticData.eventTitle}</p>
        <div className="w-12 h-12 mx-auto border-b-2 border-r-2 border-sky-800/40 rotate-45 mt-10" />
      </div>
    </div>
  );
}