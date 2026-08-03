import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
export function AuroraGlassOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-slate-900" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none p-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-sans font-light text-white drop-shadow-sm">{semanticData.primaryName}</h1>
        {semanticData.secondaryName && <h1 className="text-4xl md:text-5xl font-sans font-light text-white drop-shadow-sm">{semanticData.secondaryName}</h1>}
        <p className="text-xs tracking-[0.4em] uppercase text-white/50">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}