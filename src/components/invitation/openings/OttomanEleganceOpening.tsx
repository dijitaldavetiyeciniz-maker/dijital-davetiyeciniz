'use client';
import React from 'react';
import { OpeningProps } from './GrandOperaOpening';

export function OttomanEleganceOpening({ opened, semanticData, wedding }: OpeningProps) {
  const animSettings = wedding?.custom_overrides?.animation_settings?.['ottoman-elegance'] || {};
  const motifDensity = animSettings.motifDensity ?? 70;
  const patternType = animSettings.patternType ?? 'rumi';
  const goldGildingStyle = animSettings.goldGildingStyle ?? 'polished';
  const domeScale = animSettings.domeScale ?? 100;

  const primaryName = semanticData?.primaryName || 'Gelin';
  const secondaryName = semanticData?.secondaryName || 'Damat';

  // Gold color based on polished/matte-antique setting
  const getGoldColor = () => {
    return goldGildingStyle === 'polished' ? '#eab308' : '#d97706';
  };

  return (
    <div
      data-testid="ottoman-elegance-stage"
      data-motif-density={motifDensity}
      data-pattern-type={patternType}
      data-gold-gilding-style={goldGildingStyle}
      data-dome-scale={domeScale}
      className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 z-50 ${
        opened ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: 'radial-gradient(circle at center, #310d14 0%, #1e050a 100%)'
      }}
    >
      {/* Traditional Ornate Border Frame */}
      <div 
        className="absolute inset-6 md:inset-10 border-2 rounded-lg pointer-events-none flex items-center justify-center"
        style={{
          borderColor: getGoldColor() + '40',
          boxShadow: `0 0 20px ${getGoldColor()}15`
        }}
      >
        {/* Corner Decors */}
        <div className="absolute top-2 left-2 text-2xl" style={{ color: getGoldColor() }}>⚜️</div>
        <div className="absolute top-2 right-2 text-2xl" style={{ color: getGoldColor() }}>⚜️</div>
        <div className="absolute bottom-2 left-2 text-2xl" style={{ color: getGoldColor() }}>⚜️</div>
        <div className="absolute bottom-2 right-2 text-2xl" style={{ color: getGoldColor() }}>⚜️</div>
      </div>

      {/* Central Dome Motif */}
      <div 
        className="relative z-10 w-64 h-64 flex flex-col items-center justify-center text-center p-6 bg-red-950/70 border border-yellow-600/20 rounded-full"
        style={{
          transform: `scale(${domeScale / 100})`,
          boxShadow: `0 20px 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.6)`
        }}
      >
        {/* Pattern Icon / Accent */}
        <div className="text-4xl mb-4" style={{ color: getGoldColor() }}>
          {patternType === 'seljuk-star' ? '✴️' : '🕌'}
        </div>

        <h1 
          className="text-2xl md:text-3xl font-serif text-amber-100 drop-shadow-md tracking-wider font-bold"
          style={{ textShadow: `0 2px 8px ${getGoldColor()}80` }}
        >
          {primaryName}
        </h1>
        <div className="w-12 h-[1px] my-2 bg-yellow-600/30 mx-auto" />
        <h1 
          className="text-2xl md:text-3xl font-serif text-amber-100 drop-shadow-md tracking-wider font-bold"
          style={{ textShadow: `0 2px 8px ${getGoldColor()}80` }}
        >
          {secondaryName}
        </h1>

        <p className="text-[10px] tracking-[0.2em] uppercase text-amber-200/50 mt-4 border-t border-yellow-600/10 pt-2 font-mono">
          {semanticData?.eventTitle}
        </p>
      </div>
    </div>
  );
}
