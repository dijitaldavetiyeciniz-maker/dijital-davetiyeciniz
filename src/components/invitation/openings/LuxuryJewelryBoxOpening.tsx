'use client';
import React from 'react';
import { OpeningProps } from './GrandOperaOpening';

export function LuxuryJewelryBoxOpening({ opened, semanticData, wedding }: OpeningProps) {
  const animSettings = wedding?.custom_overrides?.animation_settings?.['luxury-jewelry-box'] || {};
  const boxMaterial = animSettings.boxMaterial ?? 'classic-leather';
  const velvetTone = animSettings.velvetTone ?? '#881337';
  const metallicDetails = animSettings.metallicDetails ?? 'brass';
  const openSpeed = animSettings.openSpeed ?? 1.8;
  const sparkleIntensity = animSettings.sparkleIntensity ?? 75;

  const primaryName = semanticData?.primaryName || 'Gelin';
  const secondaryName = semanticData?.secondaryName || 'Damat';

  // Get metallic details color
  const getMetalColor = () => {
    return metallicDetails === 'platinum' ? '#cbd5e1' : '#eab308';
  };

  return (
    <div
      data-testid="jewelry-box-stage"
      data-box-material={boxMaterial}
      data-velvet-tone={velvetTone}
      data-metallic-details={metallicDetails}
      data-open-speed={openSpeed}
      data-sparkle-intensity={sparkleIntensity}
      className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 z-50 ${
        opened ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: '#0f172a'
      }}
    >
      {/* 3D Jewelry Box Visualizer */}
      <div 
        className="relative w-80 h-80 rounded-2xl flex flex-col overflow-hidden shadow-2xl border"
        style={{
          backgroundColor: velvetTone,
          borderColor: getMetalColor() + '40',
          boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9), inset 0 0 40px rgba(0,0,0,0.6)`
        }}
      >
        {/* Box Lid - Hinged Top Wing */}
        <div 
          className="absolute top-0 left-0 right-0 h-1/2 bg-slate-900 border-b relative flex items-center justify-center z-20 transition-transform origin-top ease-in-out"
          style={{
            borderColor: getMetalColor() + '50',
            transform: opened ? `rotateX(-110deg) translateY(-20px)` : 'rotateX(0deg)',
            transitionDuration: `${openSpeed}s`,
            backgroundImage: boxMaterial === 'mahogany-wood'
              ? 'linear-gradient(to right, #451a03 0%, #78350f 50%, #451a03 100%)'
              : 'radial-gradient(circle, #1e293b 0%, #0f172a 100%)'
          }}
        >
          {/* Metal Clasp / Latch */}
          <div 
            className="absolute bottom-0 w-8 h-4 rounded-t-md"
            style={{ backgroundColor: getMetalColor(), border: '1px solid rgba(0,0,0,0.2)' }}
          />
        </div>

        {/* Box Bottom Velvet Lining with sparkles and couple names inside */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
          {/* Sparkling glimmers inside box */}
          {sparkleIntensity > 0 && (
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute top-[20%] left-[30%] w-2 h-2 bg-white rounded-full animate-ping" />
              <div className="absolute top-[60%] left-[75%] w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse" />
              <div className="absolute top-[40%] left-[15%] w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
            </div>
          )}

          <div 
            className="w-16 h-16 rounded-full border flex items-center justify-center mb-4"
            style={{ borderColor: getMetalColor() + '40', backgroundColor: 'rgba(0,0,0,0.3)' }}
          >
            <span className="text-xl font-bold" style={{ color: getMetalColor() }}>
              {semanticData?.monogram || `${primaryName[0]}${secondaryName[0]}`}
            </span>
          </div>

          <h2 className="text-xl font-serif text-white tracking-wide font-bold">
            {primaryName} & {secondaryName}
          </h2>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mt-2">
            {semanticData?.eventTitle}
          </p>
        </div>
      </div>
    </div>
  );
}
