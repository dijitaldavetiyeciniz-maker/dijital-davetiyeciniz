'use client';
import React from 'react';
import { OpeningProps } from './GrandOperaOpening';

export function CelestialEclipseOpening({ opened, semanticData, wedding }: OpeningProps) {
  const animSettings = wedding?.custom_overrides?.animation_settings?.['celestial-eclipse'] || {};
  const celestialBodyType = animSettings.celestialBodyType ?? 'solar';
  const eclipseScale = animSettings.eclipseScale ?? 100;
  const glowColor = animSettings.glowColor ?? '#f59e0b';
  const starsDensity = animSettings.starsDensity ?? 60;

  const primaryName = semanticData?.primaryName || 'Gelin';
  const secondaryName = semanticData?.secondaryName || 'Damat';

  // Stars coordinates array memoized
  const stars = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < starsDensity; i++) {
      arr.push({
        x: (i * 21 + 7) % 100,
        y: (i * 13 + 11) % 100,
        s: (i % 2) + 1,
        opacity: ((i % 5) + 3) / 10
      });
    }
    return arr;
  }, [starsDensity]);

  const eclipseBg = celestialBodyType === 'solar' 
    ? 'radial-gradient(circle, #020617 65%, transparent 70%)'
    : 'radial-gradient(circle, #450a0a 65%, transparent 70%)';

  const ringGlow = celestialBodyType === 'solar' 
    ? `0 0 40px 10px ${glowColor}, inset 0 0 20px 2px ${glowColor}`
    : `0 0 45px 12px ${glowColor}, inset 0 0 25px 3px ${glowColor}`;

  return (
    <div
      data-testid="celestial-eclipse-stage"
      data-celestial-body-type={celestialBodyType}
      data-eclipse-scale={eclipseScale}
      data-glow-color={glowColor}
      className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 z-50 ${
        opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: 'radial-gradient(circle at center, #0c1524 0%, #030712 100%)'
      }}
    >
      {/* Background stars */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        {stars.map((s, idx) => (
          <div 
            key={idx}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.s}px`,
              height: `${s.s}px`,
              opacity: s.opacity,
              animationDuration: `${(idx % 3) + 2}s`
            }}
          />
        ))}
      </div>

      {/* Cosmic Nebula Cloud */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full filter blur-[80px] opacity-20 animate-pulse pointer-events-none"
        style={{
          background: glowColor,
          animationDuration: '8s'
        }}
      />

      {/* Eclipse Ring */}
      <div 
        className="relative w-48 h-48 rounded-full flex items-center justify-center z-10 transition-transform duration-500 hover:scale-105"
        style={{
          transform: `scale(${eclipseScale / 100})`,
          background: eclipseBg,
          boxShadow: ringGlow
        }}
      >
        {/* Monogram inside Eclipse */}
        <span className="text-3xl font-serif text-white/80 select-none tracking-widest">
          {semanticData?.monogram || `${primaryName[0]}&${secondaryName[0]}`}
        </span>
      </div>

      {/* Names info panel */}
      <div className="relative z-15 text-center mt-12 space-y-4 pointer-events-none px-6">
        <h1 className="text-3xl md:text-5xl font-serif text-slate-100 drop-shadow-lg tracking-wider">
          {primaryName} & {secondaryName}
        </h1>
        <p className="text-xs tracking-[0.35em] uppercase text-slate-400 font-medium">
          {semanticData?.eventTitle}
        </p>
      </div>
    </div>
  );
}
