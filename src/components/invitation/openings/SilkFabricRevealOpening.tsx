'use client';
import React from 'react';
import { OpeningProps } from './GrandOperaOpening';

export function SilkFabricRevealOpening({ opened, semanticData, wedding }: OpeningProps) {
  const animSettings = wedding?.custom_overrides?.animation_settings?.['silk-fabric-reveal'] || {};
  const fabricColor = animSettings.fabricColor ?? '#ec4899';
  const foldDensity = animSettings.foldDensity ?? 5;
  const windForce = animSettings.windForce ?? 60;
  const sweepDirection = animSettings.sweepDirection ?? 'up';

  const primaryName = semanticData?.primaryName || 'Gelin';
  const secondaryName = semanticData?.secondaryName || 'Damat';

  // Determine transition styles based on sweepDirection
  const getSweepStyles = () => {
    if (!opened) {
      return { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1 };
    }
    switch (sweepDirection) {
      case 'right':
        return {
          transform: `translateX(${100 + windForce}%) skewX(-15deg)`,
          opacity: 0
        };
      case 'diagonal':
        return {
          transform: `translate(${100 + windForce}%, -${100 + windForce}%) rotate(15deg)`,
          opacity: 0
        };
      case 'up':
      default:
        return {
          transform: `translateY(-${100 + windForce}%) skewY(5deg)`,
          opacity: 0
        };
    }
  };

  return (
    <div
      data-testid="silk-fabric-stage"
      data-fabric-color={fabricColor}
      data-fold-density={foldDensity}
      data-wind-force={windForce}
      data-sweep-direction={sweepDirection}
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden z-50 pointer-events-none"
    >
      {/* Wave fabric layer */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-auto flex flex-col items-center justify-center"
        style={{
          backgroundColor: fabricColor,
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3)',
          ...getSweepStyles()
        }}
      >
        {/* Fabric Folds (shimmering layers using linear-gradients) */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)`,
            backgroundSize: `${300 / foldDensity}px 100%`,
          }}
        />

        {/* Text Details printed on fabric */}
        <div className="relative z-10 text-center space-y-6 pointer-events-none p-10 select-none text-white">
          <div className="text-white/40 text-4xl mb-4">💨</div>
          <h1 className="text-4xl md:text-6xl font-serif drop-shadow-lg tracking-wider font-bold">
            {primaryName}
          </h1>
          {secondaryName && (
            <>
              <div className="text-2xl font-serif text-white/60">&</div>
              <h1 className="text-4xl md:text-6xl font-serif drop-shadow-lg tracking-wider font-bold">
                {secondaryName}
              </h1>
            </>
          )}
          <p className="text-xs tracking-[0.25em] uppercase text-white/70 pt-6 mt-6 border-t border-white/20">
            {semanticData?.eventTitle}
          </p>
        </div>
      </div>
    </div>
  );
}
