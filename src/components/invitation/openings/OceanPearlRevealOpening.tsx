'use client';
import React from 'react';
import { OpeningProps } from './GrandOperaOpening';

export function OceanPearlRevealOpening({ opened, semanticData, wedding }: OpeningProps) {
  const animSettings = wedding?.custom_overrides?.animation_settings?.['ocean-pearl-reveal'] || {};
  const waterTurbulence = animSettings.waterTurbulence ?? 40;
  const causticsIntensity = animSettings.causticsIntensity ?? 70;
  const pearlLuster = animSettings.pearlLuster ?? 80;
  const surfaceWaveSpeed = animSettings.surfaceWaveSpeed ?? 'calm';

  const primaryName = semanticData?.primaryName || 'Gelin';
  const secondaryName = semanticData?.secondaryName || 'Damat';

  return (
    <div
      data-testid="ocean-pearl-stage"
      data-water-turbulence={waterTurbulence}
      data-caustics-intensity={causticsIntensity}
      data-pearl-luster={pearlLuster}
      data-surface-wave-speed={surfaceWaveSpeed}
      className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 z-50 ${
        opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: 'linear-gradient(to bottom, #075985 0%, #0369a1 40%, #0c4a6e 100%)'
      }}
    >
      {/* Light Caustics water overlay */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 10%, #bae6fd 0%, transparent 60%)',
          animation: surfaceWaveSpeed === 'calm' ? 'causticsWave 8s ease-in-out infinite alternate' : 'causticsWave 4s ease-in-out infinite alternate'
        }}
      />

      {/* Floating Sparkles / Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-[10%] left-[20%] w-3 h-3 bg-white/20 rounded-full animate-bounce" />
        <div className="absolute bottom-[30%] left-[75%] w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-[20%] left-[50%] w-4 h-4 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Elegant Pearl Reveal Core */}
      <div 
        className="relative w-40 h-40 rounded-full bg-sky-100/10 border border-white/20 backdrop-blur-sm flex flex-col items-center justify-center"
        style={{
          boxShadow: `0 0 40px ${pearlLuster / 2}px rgba(255,255,255,0.4)`
        }}
      >
        {/* Soft shining pearl center */}
        <div 
          className="w-12 h-12 rounded-full bg-radial-gradient from-white to-sky-200"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e0f2fe 60%, #93c5fd 100%)',
            boxShadow: `0 0 20px rgba(255,255,255,0.8), 0 0 10px rgba(147,197,253,0.5)`
          }}
        />
        <span className="text-[10px] text-white/60 tracking-widest font-mono uppercase mt-3">
          {semanticData?.monogram || `${primaryName[0]}&${secondaryName[0]}`}
        </span>
      </div>

      {/* Typography */}
      <div className="relative z-15 text-center mt-10 space-y-3 pointer-events-none px-6">
        <h1 className="text-3xl md:text-5xl font-serif text-white tracking-wide drop-shadow-md font-bold">
          {primaryName} & {secondaryName}
        </h1>
        <p className="text-xs tracking-[0.25em] uppercase text-sky-200/60 font-semibold">
          {semanticData?.eventTitle}
        </p>
      </div>

      <style jsx global>{`
        @keyframes causticsWave {
          0% { opacity: 0.15; transform: scale(1) rotate(0deg); }
          100% { opacity: 0.45; transform: scale(1.15) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
