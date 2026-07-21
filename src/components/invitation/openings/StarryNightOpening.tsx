import React from "react";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type StarryNightOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  styleConfig: EntranceAnimationStyle;
};

export function StarryNightOpening({
  opened,
  brideName,
  groomName,
  styleConfig,
}: StarryNightOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}${groomName.charAt(0) || 'D'}`;

  const orbStyle = {
    background: `radial-gradient(circle, #ffffff 30%, ${styleConfig.palette.secondary} 80%)`,
    boxShadow: `0 0 35px ${styleConfig.palette.accent}`,
  };

  const bubbleStyle = {
    borderColor: `${styleConfig.palette.accent}40`,
    background: `${styleConfig.palette.primary}20`,
  };

  return (
    <div className={`starry-opening-stage ${opened ? "opened" : ""} w-full h-full flex items-center justify-center`}>
      <div style={orbStyle} className="moon-orb" />
      <div className="z-10 text-center select-none p-6">
        <div 
          style={bubbleStyle}
          className="w-16 h-16 rounded-full border flex items-center justify-center backdrop-blur-xs mx-auto mb-4"
        >
          <span 
            style={{ color: styleConfig.palette.accent }}
            className="font-serif text-xl font-bold tracking-widest"
          >
            {initials}
          </span>
        </div>
        <h3 
          style={{ color: styleConfig.palette.accent }}
          className="font-serif text-xl md:text-2xl drop-shadow-md"
        >
          {brideName} & {groomName}
        </h3>
      </div>
    </div>
  );
}

