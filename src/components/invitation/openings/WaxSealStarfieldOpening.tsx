'use client';
import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type WaxSealStarfieldOpeningProps = {
  opened: boolean;
  initials: string;
  brideName: string;
  groomName: string;
  eventDate?: string;
  styleConfig: EntranceAnimationStyle;
  customSealStyle?: string;
  customSealType?: string;
  wedding?: any;
  semanticData?: any;
};

export function WaxSealStarfieldOpening({
  opened,
  initials,
  brideName,
  groomName,
  eventDate,
  wedding,
  semanticData
}: WaxSealStarfieldOpeningProps) {
  const isBurgundy = wedding?.background_design === 'burgundy-amber-night' || wedding?.template_id === 'burgundy-amber-night';
  const primaryName = semanticData?.primaryName || brideName || 'Gelin';
  const secondaryName = semanticData?.secondaryName || groomName || 'Damat';
  const monogram = semanticData?.monogram || initials || `${primaryName[0]} & ${secondaryName[0]}`;

  // Extract dynamic animation settings
  const animSettings = wedding?.custom_overrides?.animation_settings?.['wax-seal-starfield'] || {};
  const starDensity = animSettings.starDensity ?? 70;
  const celestialBody = animSettings.celestialBody ?? 'crescent-star';
  const sparkleColor = animSettings.sparkleColor ?? '#fde047';
  const envelopeColor = animSettings.envelopeColor;
  const waxColor = animSettings.waxColor;
  const displayMonogram = animSettings.sealInitial || monogram;

  // Dynamically generate stars based on user controls
  const stars = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < starDensity; i++) {
      list.push({
        x: (i * 17 + 12) % 100, // deterministic random positions
        y: (i * 23 + 9) % 100,
        s: (i % 3) + 1.5, // sizes 1.5 - 3.5px
        delay: (i * 0.3) % 2,
        dur: ((i * 0.7) % 3) + 2.5 // durations 2.5 - 5.5s
      });
    }
    return list;
  }, [starDensity]);

  return (
    <div 
      data-testid="wax-seal-starfield-stage"
      data-celestial-body={celestialBody}
      data-sparkle-color={sparkleColor}
      data-star-count={stars.length}
      data-envelope-color={envelopeColor || (isBurgundy ? "#240d09" : "#0e1728")}
      data-wax-color={waxColor || (isBurgundy ? "#c98a3e" : "#a9aeb4")}
      data-seal-initial={displayMonogram}
      className={`fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden transition-all duration-700 ${
        opened ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      style={{
        background: isBurgundy
          ? "radial-gradient(ellipse at center, #38120b 0%, #2b0f0b 60%, #170705 100%)"
          : "radial-gradient(ellipse at center, #16233b 0%, #0d1626 65%, #050a12 100%)"
      }}
    >
      {/* 1. Twinkling Stars (dynamically controlled count and color) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" data-testid="starfield-container" data-star-count={stars.length}>
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full star-element"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.s}px`,
              height: `${star.s}px`,
              backgroundColor: sparkleColor,
              boxShadow: `0 0 6px ${sparkleColor}`,
              animation: `twinkle ${star.dur}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Celestial Body Theme Element */}
      <div 
        data-testid="celestial-body" 
        data-theme={celestialBody}
        className="absolute top-10 right-10 w-16 h-16 pointer-events-none z-10"
      >
        {celestialBody === 'full-moon' && (
          <div className="w-12 h-12 rounded-full bg-slate-100 opacity-80 blur-[1px]" style={{ boxShadow: `0 0 20px ${sparkleColor}` }} />
        )}
        {celestialBody === 'crescent-star' && (
          <div className="w-10 h-10 rounded-full bg-transparent border-r-[4px] border-slate-200" style={{ transform: 'rotate(-25deg)', boxShadow: `0 0 8px ${sparkleColor}` }} />
        )}
        {celestialBody === 'cosmic-nebula' && (
          <div className="w-24 h-24 rounded-full bg-purple-500/20 blur-xl" style={{ boxShadow: `0 0 45px ${sparkleColor}` }} />
        )}
      </div>

      {/* 2. 3D Envelope Container */}
      <div
        className="relative w-[320px] h-[220px] md:w-[460px] md:h-[310px] rounded-2xl shadow-2xl flex items-center justify-center transition-transform duration-700"
        style={{
          perspective: 1200,
          transformStyle: "preserve-3d",
          backgroundColor: envelopeColor || (isBurgundy ? "#240d09" : "#0e1728"),
          border: `1px solid ${isBurgundy ? "rgba(201,138,62,0.45)" : "rgba(216,220,224,0.45)"}`,
          boxShadow: "0 30px 80px -15px rgba(0,0,0,0.85), 0 0 35px rgba(0,0,0,0.5)"
        }}
      >
        {/* Inner Border */}
        <div
          className="absolute inset-2.5 rounded-xl border pointer-events-none z-10"
          style={{
            borderColor: isBurgundy ? "rgba(201,138,62,0.4)" : "rgba(216,220,224,0.4)",
            opacity: 0.55
          }}
        />

        {/* 3. Rising Ivory Card */}
        <div
          className={`absolute inset-4 rounded-xl flex flex-col items-center justify-between p-6 text-center z-15 shadow-md transition-all duration-700 ${
            opened ? "-translate-y-24 scale-105 opacity-100" : "translate-y-0 opacity-80"
          }`}
          style={{
            backgroundColor: "#f7f3e8",
            border: `1px solid ${isBurgundy ? "#c98a3e" : "#a9aeb4"}`,
            color: "#1e293b"
          }}
        >
          <span className="text-[8px] tracking-[0.25em] font-serif uppercase text-slate-500">
            Özel Davetiye
          </span>

          <div className="my-auto space-y-1">
            <div 
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-slate-800 text-lg md:text-2xl font-serif"
              style={{ fontFamily: '"Great Vibes", cursive, serif' }}
            >
              <span className="text-right truncate">{primaryName}</span>
              <span className="text-sm font-sans text-amber-700/60 px-1">&</span>
              <span className="text-left truncate">{secondaryName}</span>
            </div>
            {eventDate && (
              <p className="text-[9px] tracking-widest text-slate-500 uppercase font-serif pt-1">
                {eventDate}
              </p>
            )}
          </div>

          <span className="text-[8px] tracking-[0.2em] text-slate-400 uppercase">
            Dijital Davetiye
          </span>
        </div>

        {/* 4. Left & Right Flaps */}
        <div
          className="absolute inset-0 z-20 pointer-events-none rounded-2xl overflow-hidden"
          style={{
            clipPath: "polygon(0 0, 50% 50%, 0 100%)",
            backgroundColor: envelopeColor || (isBurgundy ? "#240d09" : "#0e1728"),
            backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.3), rgba(255,255,255,0.03))"
          }}
        />
        <div
          className="absolute inset-0 z-20 pointer-events-none rounded-2xl overflow-hidden"
          style={{
            clipPath: "polygon(100% 0, 50% 50%, 100% 100%)",
            backgroundColor: envelopeColor || (isBurgundy ? "#240d09" : "#0e1728"),
            backgroundImage: "linear-gradient(to left, rgba(0,0,0,0.3), rgba(255,255,255,0.03))"
          }}
        />

        {/* 5. Bottom Fold */}
        <div
          className="absolute inset-0 z-25 pointer-events-none rounded-2xl overflow-hidden"
          style={{
            clipPath: "polygon(0 100%, 50% 50%, 100% 100%)",
            backgroundColor: envelopeColor || (isBurgundy ? "#240d09" : "#0e1728"),
            backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(255,255,255,0.05))"
          }}
        />

        {/* 6. Top Flap with 3D RotateX */}
        <div
          className={`absolute top-0 left-0 right-0 h-1/2 z-30 origin-top rounded-t-2xl overflow-hidden pointer-events-none transition-all duration-700 ${
            opened ? "[transform:rotateX(180deg)] opacity-10 z-10" : "[transform:rotateX(0deg)] opacity-100 z-30"
          }`}
          style={{
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
            backgroundColor: envelopeColor || (isBurgundy ? "#2e100c" : "#142036"),
            backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.35) 100%)",
            transformStyle: "preserve-3d"
          }}
        />

        {/* 7. Organic Wax Seal */}
        {!opened && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105">
            <div
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl"
              style={{
                background: waxColor
                  ? `radial-gradient(circle at 35% 35%, #ffffff 0%, ${waxColor} 45%, ${waxColor} 75%, #000 100%)`
                  : (isBurgundy
                      ? "radial-gradient(circle at 35% 35%, #fce7c8 0%, #e5a958 35%, #c98a3e 70%, #78350f 100%)"
                      : "radial-gradient(circle at 35% 35%, #ffffff 0%, #d8dce0 35%, #a9aeb4 70%, #686c72 100%)"),
                boxShadow: isBurgundy
                  ? "inset 0 0 12px rgba(255,255,255,0.7), 0 10px 30px rgba(0,0,0,0.8), 0 0 25px rgba(201,138,62,0.5)"
                  : "inset 0 0 12px rgba(255,255,255,0.8), 0 10px 30px rgba(0,0,0,0.8), 0 0 25px rgba(216,220,224,0.5)",
                border: "1.5px solid rgba(255,255,255,0.3)"
              }}
            >
              <div className="w-15 h-15 md:w-18 md:h-18 rounded-full border border-black/15 flex items-center justify-center">
                <span
                  className="font-serif font-bold text-sm md:text-base tracking-widest select-none"
                  style={{
                    color: isBurgundy ? "#3b140b" : "#1e293b",
                    textShadow: isBurgundy
                      ? "0 1px 1px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.5)"
                      : "0 1px 1px rgba(255,255,255,0.9), 0 -1px 1px rgba(0,0,0,0.6)"
                  }}
                >
                  {displayMonogram}
                </span>
              </div>
            </div>

            <span
              className="mt-3 text-[9px] font-bold tracking-[0.25em] uppercase"
              style={{ color: isBurgundy ? "#f5e6d8" : "#d8dce0" }}
            >
              Açmak İçin Dokunun
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
