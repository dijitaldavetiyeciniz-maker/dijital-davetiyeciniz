'use client';
import React from 'react';
import { OpeningProps } from './GrandOperaOpening';

export function MinimalArchitecturalLinesOpening({ opened, semanticData, wedding }: OpeningProps) {
  const animSettings = wedding?.custom_overrides?.animation_settings?.['minimal-architectural-lines'] || {};
  const lineWeight = animSettings.lineWeight ?? 2;
  const strokeAnimationSpeed = animSettings.strokeAnimationSpeed ?? 2.2;
  const geometryBaseShape = animSettings.geometryBaseShape ?? 'grid';
  const accentColorTone = animSettings.accentColorTone ?? '#4b5563';

  const primaryName = semanticData?.primaryName || 'Gelin';
  const secondaryName = semanticData?.secondaryName || 'Damat';

  return (
    <div
      data-testid="minimal-architectural-stage"
      data-line-weight={lineWeight}
      data-stroke-animation-speed={strokeAnimationSpeed}
      data-geometry-base-shape={geometryBaseShape}
      data-accent-color-tone={accentColorTone}
      className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 z-50 ${
        opened ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: '#f8fafc'
      }}
    >
      {/* Fine architectural CAD-style line work overlay */}
      <div className="relative w-80 h-80 flex items-center justify-center pointer-events-none opacity-40">
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100"
          style={{
            stroke: accentColorTone,
            strokeWidth: `${lineWeight / 2}px`
          }}
        >
          {geometryBaseShape === 'grid' && (
            <>
              {/* Drafting grid background */}
              <line x1="10" y1="0" x2="10" y2="100" />
              <line x1="30" y1="0" x2="30" y2="100" />
              <line x1="50" y1="0" x2="50" y2="100" />
              <line x1="70" y1="0" x2="70" y2="100" />
              <line x1="90" y1="0" x2="90" y2="100" />
              <line x1="0" y1="10" x2="100" y2="10" />
              <line x1="0" y1="30" x2="100" y2="30" />
              <line x1="0" y1="50" x2="100" y2="50" />
              <line x1="0" y1="70" x2="100" y2="70" />
              <line x1="0" y1="90" x2="100" y2="90" />
            </>
          )}

          {geometryBaseShape === 'isometric' && (
            <>
              {/* Isometric box lines */}
              <path d="M 50,20 L 80,35 L 50,50 L 20,35 Z" fill="none" />
              <path d="M 20,35 L 20,70 L 50,85 L 50,50" fill="none" />
              <path d="M 80,35 L 80,70 L 50,85" fill="none" />
            </>
          )}

          {geometryBaseShape === 'minimal-arch' && (
            <>
              {/* Circular arcs/dome lines */}
              <circle cx="50" cy="50" r="40" fill="none" />
              <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" />
              <line x1="50" y1="10" x2="50" y2="90" />
              <line x1="10" y1="50" x2="90" y2="50" />
            </>
          )}
        </svg>
      </div>

      {/* Structured Minimal Typography */}
      <div className="relative z-10 text-center space-y-6 max-w-md px-6 text-slate-800 pointer-events-none">
        <span className="text-[10px] tracking-[0.4em] uppercase text-slate-400 font-mono">
          Açılış Bölümü
        </span>

        <h1 className="text-3xl md:text-5xl font-light tracking-wide uppercase">
          {primaryName}
          <span className="block text-xl my-2 text-slate-400 font-light">&</span>
          {secondaryName}
        </h1>

        <p className="text-[10px] tracking-[0.3em] uppercase text-slate-500 font-mono pt-6 border-t border-slate-200">
          {semanticData?.eventTitle}
        </p>
      </div>
    </div>
  );
}
