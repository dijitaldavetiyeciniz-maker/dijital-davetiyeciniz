'use client';
import React from 'react';
import { OpeningProps } from './GrandOperaOpening';

export function GoldenConstellationOpening({ opened, semanticData, wedding }: OpeningProps) {
  const animSettings = wedding?.custom_overrides?.animation_settings?.['golden-constellation'] || {};
  const constellationStyle = animSettings.constellationStyle ?? 'geometric-lines';
  const starSize = animSettings.starSize ?? 4;
  const lineColor = animSettings.lineColor ?? '#fbbf24';
  const lineGlow = animSettings.lineGlow ?? 75;
  const monogramInitial = animSettings.monogramInitial ?? (semanticData?.monogram ? semanticData.monogram[0] : 'W');

  const primaryName = semanticData?.primaryName || 'Gelin';
  const secondaryName = semanticData?.secondaryName || 'Damat';

  return (
    <div
      data-testid="golden-constellation-stage"
      data-constellation-style={constellationStyle}
      data-line-color={lineColor}
      data-line-glow={lineGlow}
      className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 z-50 ${
        opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: 'radial-gradient(circle at center, #0b1329 0%, #030712 100%)'
      }}
    >
      {/* Golden Constellation Canvas/Illustration */}
      <div className="relative w-72 h-72 flex items-center justify-center pointer-events-none">
        {/* Constellation lines */}
        {constellationStyle === 'geometric-lines' && (
          <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100">
            <line x1="20" y1="20" x2="50" y2="10" stroke={lineColor} strokeWidth="0.5" style={{ filter: `drop-shadow(0 0 3px ${lineColor})` }} />
            <line x1="50" y1="10" x2="80" y2="20" stroke={lineColor} strokeWidth="0.5" />
            <line x1="80" y1="20" x2="90" y2="50" stroke={lineColor} strokeWidth="0.5" />
            <line x1="90" y1="50" x2="50" y2="90" stroke={lineColor} strokeWidth="0.5" />
            <line x1="50" y1="90" x2="10" y2="50" stroke={lineColor} strokeWidth="0.5" />
            <line x1="10" y1="50" x2="20" y2="20" stroke={lineColor} strokeWidth="0.5" />
            <line x1="20" y1="20" x2="50" y2="50" stroke={lineColor} strokeWidth="0.5" />
            <line x1="80" y1="20" x2="50" y2="50" stroke={lineColor} strokeWidth="0.5" />
            <line x1="50" y1="90" x2="50" y2="50" stroke={lineColor} strokeWidth="0.5" />
          </svg>
        )}

        {/* Soft cosmic glow cloud */}
        <div 
          className="absolute w-48 h-48 rounded-full filter blur-[50px] opacity-15"
          style={{
            background: lineColor,
            boxShadow: `0 0 60px ${lineGlow}px ${lineColor}`
          }}
        />

        {/* Monogram display as core star */}
        <div 
          className="relative z-10 w-24 h-24 rounded-full border border-yellow-500/20 bg-black/60 flex items-center justify-center"
          style={{
            boxShadow: `0 0 25px ${lineGlow / 10}px ${lineColor}`
          }}
        >
          <span 
            className="text-4xl font-serif font-bold"
            style={{ color: lineColor }}
          >
            {monogramInitial}
          </span>
        </div>

        {/* Connected star vertices */}
        <div className="absolute top-[20%] left-[20%] rounded-full bg-white animate-ping" style={{ width: `${starSize}px`, height: `${starSize}px` }} />
        <div className="absolute top-[10%] left-[50%] rounded-full bg-white" style={{ width: `${starSize + 2}px`, height: `${starSize + 2}px`, boxShadow: `0 0 8px ${lineColor}` }} />
        <div className="absolute top-[20%] left-[80%] rounded-full bg-white" style={{ width: `${starSize}px`, height: `${starSize}px` }} />
        <div className="absolute top-[50%] left-[90%] rounded-full bg-white" style={{ width: `${starSize + 1}px`, height: `${starSize + 1}px` }} />
        <div className="absolute top-[90%] left-[50%] rounded-full bg-white" style={{ width: `${starSize + 3}px`, height: `${starSize + 3}px`, boxShadow: `0 0 10px ${lineColor}` }} />
        <div className="absolute top-[50%] left-[10%] rounded-full bg-white" style={{ width: `${starSize}px`, height: `${starSize}px` }} />
      </div>

      {/* Couple details */}
      <div className="text-center mt-8 space-y-4 px-6 z-15 pointer-events-none">
        <h1 
          className="text-3xl md:text-5xl font-serif text-white tracking-widest"
          style={{ textShadow: `0 0 10px ${lineColor}` }}
        >
          {primaryName} & {secondaryName}
        </h1>
        <p className="text-xs tracking-[0.3em] uppercase text-yellow-100/50">{semanticData?.eventTitle}</p>
      </div>
    </div>
  );
}
