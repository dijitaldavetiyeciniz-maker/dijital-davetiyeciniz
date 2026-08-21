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

  const STAR_DATA = [
    { x: 12, y: 14, s: 2, delay: 0.2, dur: 3.2 },
    { x: 26, y: 9, s: 3, delay: 1.1, dur: 4.0 },
    { x: 38, y: 20, s: 1.5, delay: 0.5, dur: 2.8 },
    { x: 50, y: 11, s: 2.5, delay: 1.8, dur: 3.5 },
    { x: 64, y: 16, s: 2, delay: 0.9, dur: 4.2 },
    { x: 78, y: 8, s: 3, delay: 2.1, dur: 3.0 },
    { x: 90, y: 22, s: 1.5, delay: 0.4, dur: 2.6 },
    { x: 8, y: 34, s: 2.5, delay: 1.4, dur: 3.8 },
    { x: 18, y: 46, s: 1.5, delay: 0.7, dur: 4.5 },
    { x: 86, y: 40, s: 3, delay: 2.3, dur: 3.3 },
    { x: 94, y: 52, s: 2, delay: 1.0, dur: 2.9 },
    { x: 14, y: 66, s: 2.5, delay: 0.3, dur: 3.6 },
    { x: 22, y: 80, s: 1.5, delay: 1.6, dur: 4.1 },
    { x: 34, y: 90, s: 3, delay: 0.8, dur: 3.4 },
    { x: 48, y: 84, s: 2, delay: 2.0, dur: 2.7 },
    { x: 62, y: 88, s: 2.5, delay: 1.2, dur: 3.9 },
    { x: 76, y: 76, s: 1.5, delay: 0.6, dur: 4.3 },
    { x: 88, y: 86, s: 2.5, delay: 1.9, dur: 3.1 }
  ];

  return (
    <div 
      className={`fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden transition-all duration-700 ${
        opened ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      style={{
        background: isBurgundy
          ? "radial-gradient(ellipse at center, #38120b 0%, #2b0f0b 60%, #170705 100%)"
          : "radial-gradient(ellipse at center, #16233b 0%, #0d1626 65%, #050a12 100%)"
      }}
    >
      {/* 1. Twinkling Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {STAR_DATA.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.s}px`,
              height: `${star.s}px`,
              backgroundColor: isBurgundy ? "#f5e6d8" : "#f2f4f6",
              boxShadow: `0 0 6px ${isBurgundy ? "rgba(245,230,216,0.9)" : "rgba(242,244,246,0.9)"}`,
              animation: `twinkle ${star.dur}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* 2. 3D Envelope Container */}
      <div
        className="relative w-[320px] h-[220px] md:w-[460px] md:h-[310px] rounded-2xl shadow-2xl flex items-center justify-center transition-transform duration-700"
        style={{
          perspective: 1200,
          transformStyle: "preserve-3d",
          backgroundColor: isBurgundy ? "#240d09" : "#0e1728",
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
            backgroundColor: isBurgundy ? "#240d09" : "#0e1728",
            backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.3), rgba(255,255,255,0.03))"
          }}
        />
        <div
          className="absolute inset-0 z-20 pointer-events-none rounded-2xl overflow-hidden"
          style={{
            clipPath: "polygon(100% 0, 50% 50%, 100% 100%)",
            backgroundColor: isBurgundy ? "#240d09" : "#0e1728",
            backgroundImage: "linear-gradient(to left, rgba(0,0,0,0.3), rgba(255,255,255,0.03))"
          }}
        />

        {/* 5. Bottom Fold */}
        <div
          className="absolute inset-0 z-25 pointer-events-none rounded-2xl overflow-hidden"
          style={{
            clipPath: "polygon(0 100%, 50% 50%, 100% 100%)",
            backgroundColor: isBurgundy ? "#240d09" : "#0e1728",
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
            backgroundColor: isBurgundy ? "#2e100c" : "#142036",
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
                background: isBurgundy
                  ? "radial-gradient(circle at 35% 35%, #fce7c8 0%, #e5a958 35%, #c98a3e 70%, #78350f 100%)"
                  : "radial-gradient(circle at 35% 35%, #ffffff 0%, #d8dce0 35%, #a9aeb4 70%, #686c72 100%)",
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
                  {monogram}
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
