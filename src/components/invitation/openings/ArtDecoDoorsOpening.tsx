'use client';
import React from 'react';
import { OpeningProps } from './GrandOperaOpening';

export function ArtDecoDoorsOpening({ opened, semanticData, wedding }: OpeningProps) {
  const animSettings = wedding?.custom_overrides?.animation_settings?.['art-deco-doors'] || {};
  const geometryPattern = animSettings.geometryPattern ?? 'classic-gatsby';
  const goldShine = animSettings.goldShine ?? 80;
  const doorOpacity = animSettings.doorOpacity ?? 95;
  const shineSpeed = animSettings.shineSpeed ?? 'slow';

  const primaryName = semanticData?.primaryName || 'Gelin';
  const secondaryName = semanticData?.secondaryName || 'Damat';

  return (
    <div
      data-testid="art-deco-doors-stage"
      data-geometry-pattern={geometryPattern}
      data-gold-shine={goldShine}
      data-door-opacity={doorOpacity}
      data-shine-speed={shineSpeed}
      className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 z-50 ${
        opened ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: 'radial-gradient(circle at center, #181d24 0%, #0a0d10 100%)'
      }}
    >
      {/* 2-Winged Doors with Gatsby Pattern */}
      <div 
        className="absolute inset-0 flex"
        style={{ opacity: doorOpacity / 100 }}
      >
        {/* Left Door */}
        <div 
          className={`w-1/2 h-full border-r border-yellow-500/20 bg-slate-950/90 relative flex items-center justify-end pr-4 transition-transform duration-1000 ${
            opened ? "-translate-x-full" : "translate-x-0"
          }`}
          style={{
            backgroundImage: geometryPattern === 'classic-gatsby'
              ? 'radial-gradient(circle at 100% 50%, transparent 80%, rgba(234,179,8,0.05) 100%), linear-gradient(30deg, transparent 60%, rgba(234,179,8,0.03) 100%)'
              : 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234,179,8,0.02) 10px, rgba(234,179,8,0.02) 20px)'
          }}
        >
          {/* Ornate Gold Border Line */}
          <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-yellow-500/30" />
          <div className="absolute right-4 top-10 bottom-10 w-[1px] border-r border-dashed border-yellow-500/20" />
        </div>

        {/* Right Door */}
        <div 
          className={`w-1/2 h-full border-l border-yellow-500/20 bg-slate-950/90 relative flex items-center justify-start pl-4 transition-transform duration-1000 ${
            opened ? "translate-x-full" : "translate-x-0"
          }`}
          style={{
            backgroundImage: geometryPattern === 'classic-gatsby'
              ? 'radial-gradient(circle at 0% 50%, transparent 80%, rgba(234,179,8,0.05) 100%), linear-gradient(-30deg, transparent 60%, rgba(234,179,8,0.03) 100%)'
              : 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(234,179,8,0.02) 10px, rgba(234,179,8,0.02) 20px)'
          }}
        >
          {/* Ornate Gold Border Line */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-500/30" />
          <div className="absolute left-4 top-10 bottom-10 w-[1px] border-l border-dashed border-yellow-500/20" />
        </div>
      </div>

      {/* Central Art Deco Emblem */}
      <div 
        className={`relative z-10 text-center p-8 bg-slate-900/90 border border-yellow-500/30 rounded-lg max-w-sm transition-all duration-700 ${
          opened ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{
          boxShadow: `0 0 30px ${goldShine / 4}px rgba(234,179,8,0.15)`
        }}
      >
        <div className="text-yellow-500 text-3xl mb-4 tracking-widest font-mono">⚜️ GATSBY ⚜️</div>
        
        <h1 className="text-3xl font-serif text-yellow-400 drop-shadow-md uppercase tracking-wider font-bold">
          {primaryName}
        </h1>
        <div className="w-16 h-[1px] bg-yellow-500/30 mx-auto my-3" />
        <h1 className="text-3xl font-serif text-yellow-400 drop-shadow-md uppercase tracking-wider font-bold">
          {secondaryName}
        </h1>

        <p className="text-xs tracking-[0.25em] uppercase text-yellow-100/50 pt-4 mt-4 border-t border-yellow-500/20 font-mono">
          {semanticData?.eventTitle}
        </p>
      </div>
    </div>
  );
}
