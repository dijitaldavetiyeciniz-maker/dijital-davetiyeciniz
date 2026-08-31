'use client';
import React from 'react';
import { OpeningProps } from './GrandOperaOpening';

export function LanternNightOpening({ opened, semanticData, wedding }: OpeningProps) {
  const animSettings = wedding?.custom_overrides?.animation_settings?.['lantern-night'] || {};
  const lanternCount = animSettings.lanternCount ?? 12;
  const lanternFlameWarmth = animSettings.lanternFlameWarmth ?? '#ea580c';
  const floatSpeed = animSettings.floatSpeed ?? 10;
  const fireflyDensity = animSettings.fireflyDensity ?? 50;

  const primaryName = semanticData?.primaryName || 'Gelin';
  const secondaryName = semanticData?.secondaryName || 'Damat';

  // Calculate random points for the floating lanterns
  const lanterns = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < lanternCount; i++) {
      list.push({
        x: (i * 27 + 10) % 90, // scattered horizontally
        y: (i * 17 + 40) % 60 + 30, // vertical starting zone
        scale: (i % 3) * 0.2 + 0.6, // sizes 0.6 - 1.2
        delay: (i * 0.4) % 4
      });
    }
    return list;
  }, [lanternCount]);

  return (
    <div
      data-testid="lantern-night-stage"
      data-lantern-count={lanternCount}
      data-lantern-flame-warmth={lanternFlameWarmth}
      data-float-speed={floatSpeed}
      data-firefly-density={fireflyDensity}
      className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 z-50 ${
        opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: 'linear-gradient(to bottom, #020617 0%, #090d16 50%, #0f172a 100%)'
      }}
    >
      {/* Floating lanterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {lanterns.map((l, idx) => (
          <div 
            key={idx}
            className="absolute rounded-t-md flex flex-col items-center justify-between"
            style={{
              left: `${l.x}%`,
              bottom: `${l.y}%`,
              width: '16px',
              height: '24px',
              backgroundColor: '#fed7aa',
              boxShadow: `0 0 15px 2px ${lanternFlameWarmth}`,
              opacity: 0.8,
              transform: `scale(${l.scale})`,
              animation: `lanternFloat ${floatSpeed + (idx % 4)}s linear infinite`,
              animationDelay: `${l.delay}s`
            }}
          >
            {/* Inner flame */}
            <div 
              className="w-2.5 h-2.5 rounded-full mt-auto mb-1 animate-pulse"
              style={{ backgroundColor: lanternFlameWarmth }}
            />
          </div>
        ))}
      </div>

      {/* Center details display */}
      <div 
        className="relative z-10 text-center p-8 border border-white/5 bg-black/40 backdrop-blur-sm rounded-xl max-w-sm pointer-events-none"
        style={{
          boxShadow: `0 15px 35px rgba(0,0,0,0.6)`
        }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-orange-200/50 mb-3 block font-mono">
          Davetlimizsiniz
        </span>

        <h1 className="text-3xl font-serif text-white tracking-wider font-bold">
          {primaryName} & {secondaryName}
        </h1>

        <p className="text-xs tracking-[0.25em] uppercase text-orange-100/60 mt-4 pt-4 border-t border-white/10">
          {semanticData?.eventTitle}
        </p>
      </div>

      <style jsx global>{`
        @keyframes lanternFloat {
          0% { transform: translateY(100px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-400px) rotate(8deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
