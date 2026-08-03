const fs = require('fs');
const path = require('path');

const OPENINGS_DIR = path.join(__dirname, 'src', 'components', 'invitation', 'openings');

const IMPORTS = `import React from 'react';
import { OpeningSemanticContent } from "@/data/eventTypeConfig";

export interface OpeningProps {
  opened: boolean;
  semanticData: OpeningSemanticContent;
  introText?: string;
  animationState?: 'playing' | 'completed-awaiting-interaction' | 'opened';
}
`;

const templates = {
  ParisianBlackTieOpening: `export function ParisianBlackTieOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      {/* Spotlight Effect */}
      <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center space-y-8 pointer-events-none w-full max-w-md px-6">
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/80 to-transparent mb-4" />
        <h1 className="text-5xl md:text-7xl font-serif font-light tracking-widest text-white drop-shadow-lg text-center uppercase">
          {semanticData.primaryName}
          {semanticData.secondaryName && <span className="block text-2xl md:text-3xl mt-4 text-amber-500/80 font-serif italic">&</span>}
          {semanticData.secondaryName && <span className="block mt-4">{semanticData.secondaryName}</span>}
        </h1>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/80 to-transparent mt-4" />
        <p className="text-xs tracking-[0.4em] uppercase text-white/50">{semanticData.eventTitle}</p>
        <p className="text-[10px] tracking-[0.2em] text-white/40 font-mono mt-8">{semanticData.eventDate}</p>
      </div>
    </div>
  );
}`,
  GrandOperaOpening: `export function GrandOperaOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
      {/* Red Velvet Curtain Background */}
      <div className="absolute inset-0 bg-red-950" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full bg-gradient-to-r from-red-900/40 to-transparent shadow-[inset_-20px_0_50px_rgba(0,0,0,0.5)]" />
        <div className="w-1/2 h-full bg-gradient-to-l from-red-900/40 to-transparent shadow-[inset_20px_0_50px_rgba(0,0,0,0.5)]" />
      </div>
      <div className="relative z-10 text-center space-y-6 pointer-events-none p-10 border border-amber-900/30 bg-black/40 backdrop-blur-sm rounded-sm">
        <div className="text-amber-600/80 text-6xl mb-6">🎭</div>
        <h1 className="text-4xl md:text-6xl font-serif text-amber-500 drop-shadow-2xl">{semanticData.primaryName}</h1>
        {semanticData.secondaryName && <h1 className="text-4xl md:text-6xl font-serif text-amber-500 drop-shadow-2xl">{semanticData.secondaryName}</h1>}
        <p className="text-sm tracking-[0.3em] uppercase text-amber-200/50 pt-4 border-t border-amber-900/50">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}`,
  MoonlitGardenOpening: `export function MoonlitGardenOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
      <div className="absolute inset-0 bg-[#040b16]" />
      <div className="absolute top-[10%] w-64 h-64 rounded-full bg-slate-100/10 blur-[80px]" />
      <div className="absolute bottom-0 w-full h-[40%] bg-gradient-to-t from-[#02050a] to-transparent" />
      <div className="relative z-10 text-center space-y-4 pointer-events-none">
        <div className="w-20 h-20 mx-auto border border-indigo-500/30 rounded-full flex items-center justify-center mb-8">
          <span className="text-indigo-200/80 font-serif text-3xl">{semanticData.monogram}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif text-indigo-50 drop-shadow-lg">{semanticData.primaryName}</h1>
        {semanticData.secondaryName && <p className="text-xl text-indigo-200/50 font-serif italic">ile</p>}
        {semanticData.secondaryName && <h1 className="text-3xl md:text-5xl font-serif text-indigo-50 drop-shadow-lg">{semanticData.secondaryName}</h1>}
        <p className="text-xs tracking-[0.2em] uppercase text-indigo-300/50 mt-8">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}`,
  VogueEditorialOpening: `export function VogueEditorialOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-between transition-all duration-1000 z-50 p-6 md:p-12 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
      <div className="absolute inset-0 bg-white" />
      <div className="relative z-10 w-full text-center mt-10 pointer-events-none">
        <h2 className="text-[10px] tracking-[0.5em] font-bold text-black uppercase mb-4">{semanticData.eventTitle}</h2>
        <div className="w-full border-b-2 border-black mb-12" />
        <h1 className="text-6xl md:text-8xl font-serif text-black uppercase tracking-tighter leading-none">
          {semanticData.primaryName}
        </h1>
        {semanticData.secondaryName && (
          <h1 className="text-6xl md:text-8xl font-serif text-black uppercase tracking-tighter leading-none mt-2">
            {semanticData.secondaryName}
          </h1>
        )}
      </div>
      <div className="relative z-10 w-full flex justify-between items-end pb-8 pointer-events-none">
        <div className="text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-black">Tarih</p>
          <p className="text-sm font-serif text-black">{semanticData.eventDate}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-black">Özel Sayı</p>
          <p className="text-sm font-serif text-black">No. 1</p>
        </div>
      </div>
    </div>
  );
}`,
  MediterraneanCeramicOpening: `export function MediterraneanCeramicOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
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
}`,
  OttomanIlluminationOpening: `export function OttomanIlluminationOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
      <div className="absolute inset-0 bg-[#0d1512]" />
      <div className="absolute inset-2 border-[4px] border-double border-emerald-900/50 pointer-events-none" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none p-12 bg-[#0d1512]/80 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="w-24 h-24 mx-auto bg-emerald-900/20 rotate-45 flex items-center justify-center border border-emerald-500/30 mb-8">
          <div className="rotate-[-45deg] text-emerald-500 font-serif text-2xl">{semanticData.monogram}</div>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-emerald-50 drop-shadow-md">{semanticData.primaryName}</h1>
        {semanticData.secondaryName && <p className="text-lg text-emerald-500/80 font-serif">ve</p>}
        {semanticData.secondaryName && <h1 className="text-4xl md:text-5xl font-serif text-emerald-50 drop-shadow-md">{semanticData.secondaryName}</h1>}
        <div className="w-32 h-[1px] bg-emerald-800/50 mx-auto mt-6" />
        <p className="text-xs tracking-[0.2em] text-emerald-600/70">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}`,
  CoastalSunsetOpening: `export function CoastalSunsetOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
      <div className="absolute inset-0 bg-gradient-to-b from-orange-100 via-rose-100 to-sky-200" />
      <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-sky-900/20 to-transparent" />
      <div className="relative z-10 text-center space-y-4 pointer-events-none mix-blend-multiply">
        <h1 className="text-5xl md:text-7xl font-serif text-orange-950/80">{semanticData.primaryName}</h1>
        {semanticData.secondaryName && <h1 className="text-5xl md:text-7xl font-serif text-orange-950/80">{semanticData.secondaryName}</h1>}
        <p className="text-sm tracking-[0.3em] uppercase text-orange-900/60 mt-8">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}`,
  AuroraGlassOpening: `export function AuroraGlassOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
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
}`,
  BotanicalWatercolorOpening: `export function BotanicalWatercolorOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
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
}`,
  FilmPremiereOpening: `export function FilmPremiereOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
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
}`,
  SwissGalleryOpening: `export function SwissGalleryOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-start justify-end transition-all duration-1000 z-50 p-8 md:p-16 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
      <div className="absolute inset-0 bg-[#f4f4f4]" />
      <div className="absolute inset-0 grid grid-cols-4 gap-4 pointer-events-none">
        <div className="border-l border-black/5 h-full" />
        <div className="border-l border-black/5 h-full" />
        <div className="border-l border-black/5 h-full" />
        <div className="border-l border-black/5 h-full" />
      </div>
      <div className="relative z-10 text-left pointer-events-none max-w-2xl">
        <h1 className="text-6xl md:text-8xl font-sans font-bold text-black tracking-tighter leading-[0.9] uppercase">
          {semanticData.primaryName}
          {semanticData.secondaryName && <br />}
          {semanticData.secondaryName && semanticData.secondaryName}
        </h1>
        <div className="flex gap-12 mt-12">
          <div>
            <p className="text-[10px] font-bold text-black uppercase mb-1">Event</p>
            <p className="text-sm text-black">{semanticData.eventTitle}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-black uppercase mb-1">Date</p>
            <p className="text-sm text-black">{semanticData.eventDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}`,
  RoyalPalaceOpening: `export function RoyalPalaceOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
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
}`,
  HennaPalaceOpening: `export function HennaPalaceOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
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
}`,
  PrinceCeremonyOpening: `export function PrinceCeremonyOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
      <div className="absolute inset-0 bg-blue-950" />
      <div className="absolute inset-4 border-2 border-blue-400/20 rounded-full pointer-events-none opacity-50 scale-[2]" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none">
        <div className="w-20 h-20 mx-auto bg-blue-800/40 rounded-full flex items-center justify-center border-4 border-white/10 shadow-xl mb-6">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-serif text-blue-100 drop-shadow-lg">{semanticData.primaryName}</h1>
        <p className="text-sm tracking-[0.2em] uppercase text-blue-300/60 mt-4">{semanticData.eventTitle}</p>
      </div>
    </div>
  );
}`,
  StorybookOpening: `export function StorybookOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
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
}`,
  FutureSummitOpening: `export function FutureSummitOpening({ opened, semanticData }: OpeningProps) {
  return (
    <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 \${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}\`}>
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none">
        <div className="w-16 h-16 mx-auto bg-white mb-8 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.5)]">
          <span className="text-black font-black text-2xl">{semanticData.monogram}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-sans font-black text-white tracking-tighter uppercase">{semanticData.eventTitle}</h1>
        <p className="text-sm tracking-[0.3em] uppercase text-white/50">{semanticData.companyName || semanticData.primaryName}</p>
        <p className="text-xs font-mono text-white/40 mt-8">{semanticData.eventDate}</p>
      </div>
    </div>
  );
}`
};

Object.keys(templates).forEach(name => {
  const code = IMPORTS + templates[name];
  fs.writeFileSync(path.join(OPENINGS_DIR, name + '.tsx'), code);
});
console.log('Openings generated successfully.');
