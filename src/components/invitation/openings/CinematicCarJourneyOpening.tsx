'use client';
import React from 'react';
import { OpeningProps } from './GrandOperaOpening';

export function CinematicCarJourneyOpening({ opened, semanticData, wedding }: OpeningProps) {
  const animSettings = wedding?.custom_overrides?.animation_settings?.['cinematic-car-journey'] || {};
  const vehicleType = animSettings.vehicleType ?? 'classic-convertible';
  const vehicleColor = animSettings.vehicleColor ?? '#ef4444';
  const roadAtmosphere = animSettings.roadAtmosphere ?? 'coastal-cliff';
  const dayNightPhase = animSettings.dayNightPhase ?? 'sunset';
  const namesStyle = animSettings.namesStyle ?? 'road-paint';
  const cameraSpeed = animSettings.cameraSpeed ?? 3;
  const lightIntensity = animSettings.lightIntensity ?? 70;

  const primaryName = semanticData?.primaryName || 'Gelin';
  const secondaryName = semanticData?.secondaryName || 'Damat';

  // Get background gradients for the sky based on time phase
  const getSkyBg = () => {
    switch (dayNightPhase) {
      case 'day': return 'linear-gradient(to bottom, #7dd3fc 0%, #bae6fd 60%, #e0f2fe 100%)';
      case 'night': return 'linear-gradient(to bottom, #020617 0%, #0f172a 70%, #1e293b 100%)';
      case 'sunset':
      default:
        return 'linear-gradient(to bottom, #f97316 0%, #f43f5e 40%, #881337 100%)';
    }
  };

  // Get vehicle emoji or simple stylized svg representation
  const getVehicleEmoji = () => {
    switch (vehicleType) {
      case 'retro-vespa': return '🛵';
      case 'modern-sport': return '🏎️';
      case 'vintage-beetle': return '🚗';
      case 'classic-convertible':
      default:
        return '🚘';
    }
  };

  return (
    <div
      data-testid="car-journey-stage"
      data-vehicle-type={vehicleType}
      data-vehicle-color={vehicleColor}
      data-road-atmosphere={roadAtmosphere}
      data-day-night-phase={dayNightPhase}
      className={`absolute inset-0 flex flex-col items-center justify-between overflow-hidden transition-all duration-1000 z-50 ${
        opened ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{ background: getSkyBg() }}
    >
      {/* Stars if night */}
      {dayNightPhase === 'night' && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-[10%] left-[15%] w-1 h-1 bg-white rounded-full animate-ping" />
          <div className="absolute top-[20%] left-[65%] w-1.5 h-1.5 bg-yellow-100 rounded-full animate-pulse" />
          <div className="absolute top-[35%] left-[80%] w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[15%] left-[40%] w-0.5 h-0.5 bg-white rounded-full" />
        </div>
      )}

      {/* Environment Background Elements */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-end">
        {/* Mountains / Sea Horizon */}
        {roadAtmosphere === 'coastal-cliff' && (
          <div className="w-full h-[25vh] bg-blue-900/30 backdrop-blur-[1px] relative">
            <div className="absolute bottom-0 w-full h-[4px] bg-sky-200/20" />
            <div className="absolute bottom-0 w-full h-[30%] bg-blue-950/40" />
          </div>
        )}
        {roadAtmosphere === 'forest-highway' && (
          <div className="w-full h-[30vh] flex items-end justify-between px-6 opacity-30">
            <span className="text-6xl text-emerald-800">🌲</span>
            <span className="text-8xl text-emerald-900 mb-2">🌲</span>
            <span className="text-7xl text-emerald-700">🌲</span>
            <span className="text-8xl text-emerald-900">🌲</span>
          </div>
        )}
        {roadAtmosphere === 'city-lights' && (
          <div className="w-full h-[25vh] bg-slate-950/50 relative border-t border-slate-700/20">
            <div className="absolute inset-0 flex items-end justify-around px-8 opacity-25">
              <div className="w-12 h-32 bg-slate-800 rounded-t-sm" />
              <div className="w-16 h-48 bg-slate-900 rounded-t-md" />
              <div className="w-10 h-28 bg-slate-800 rounded-t-sm" />
              <div className="w-14 h-40 bg-slate-900 rounded-t-md" />
            </div>
          </div>
        )}
      </div>

      {/* Road Perspective */}
      <div 
        className="relative w-full h-[40vh] flex flex-col items-center justify-end z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(20,24,33,0.9) 100%)'
        }}
      >
        {/* Asphalt Road Canvas */}
        <div 
          className="w-full h-full relative overflow-hidden flex justify-center"
          style={{
            clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
            background: 'linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)',
            boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          {/* Dashboard road lines with camera speed simulation */}
          <div 
            className="absolute top-0 w-2 h-full bg-yellow-400 opacity-60"
            style={{
              backgroundImage: 'linear-gradient(to bottom, transparent 50%, #facc15 50%)',
              backgroundSize: '10px 40px',
              animation: `roadLinesMove ${10 / cameraSpeed}s linear infinite`
            }}
          />
        </div>

        {/* Names display integration */}
        {namesStyle === 'road-paint' && (
          <div 
            className="absolute top-[20%] text-center select-none pointer-events-none z-20"
            style={{ transform: 'perspective(200px) rotateX(25deg)' }}
          >
            <h2 className="text-white/20 font-mono tracking-widest text-2xl uppercase border-y border-white/5 px-6 font-bold">
              {primaryName} & {secondaryName}
            </h2>
          </div>
        )}

        {/* Vehicle element */}
        <div 
          className="absolute bottom-6 flex flex-col items-center z-30"
          style={{
            animation: 'carVibration 0.15s ease-in-out infinite alternate',
            textShadow: `0 0 10px ${vehicleColor}`
          }}
        >
          {/* Headlights beams based on intensity */}
          <div className="absolute -left-12 -top-4 w-24 h-40 bg-gradient-to-t from-yellow-100/0 to-yellow-200/10 pointer-events-none rounded-full"
            style={{ 
              transform: 'rotate(-30deg)', 
              opacity: (lightIntensity / 100) * 0.4,
              display: dayNightPhase === 'day' ? 'none' : 'block'
            }} 
          />
          <div className="absolute -right-12 -top-4 w-24 h-40 bg-gradient-to-t from-yellow-100/0 to-yellow-200/10 pointer-events-none rounded-full"
            style={{ 
              transform: 'rotate(30deg)', 
              opacity: (lightIntensity / 100) * 0.4,
              display: dayNightPhase === 'day' ? 'none' : 'block'
            }} 
          />

          <span 
            className="text-8xl select-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-300"
            style={{ color: vehicleColor }}
          >
            {getVehicleEmoji()}
          </span>
        </div>
      </div>

      {/* Floating names header if not road-paint */}
      {namesStyle !== 'road-paint' && (
        <div className="relative z-10 text-center space-y-4 pointer-events-none px-6 pt-16 flex-1 flex flex-col justify-center">
          <h1 
            className="text-4xl md:text-6xl font-serif text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] font-bold transition-all duration-500"
            style={{
              textShadow: namesStyle === 'sky-constellation' ? `0 0 20px rgba(255,255,255,0.8), 0 0 40px ${vehicleColor}` : '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            {primaryName} & {secondaryName}
          </h1>
          <p className="text-sm tracking-[0.3em] uppercase text-white/70 font-semibold">{semanticData?.eventTitle}</p>
        </div>
      )}

      {/* Styles for road keyframes */}
      <style jsx global>{`
        @keyframes roadLinesMove {
          0% { background-position-y: 0px; }
          100% { background-position-y: 400px; }
        }
        @keyframes carVibration {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-2px) scale(1.01); }
        }
      `}</style>
    </div>
  );
}
