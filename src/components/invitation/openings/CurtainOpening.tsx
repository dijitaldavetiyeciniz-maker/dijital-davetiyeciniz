import React from "react";

type CurtainOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  theme: string;
};

export function CurtainOpening({
  opened,
  brideName,
  groomName,
  theme,
}: CurtainOpeningProps) {
  return (
    <div className={`curtain-opening-stage curtain-theme-${theme} ${opened ? "opened" : ""} w-full h-full`}>
      <div className="curtain-opening-left flex items-center justify-end pr-8 select-none">
        <span className="font-serif text-2xl md:text-4xl text-white text-right leading-tight drop-shadow-lg">
          {brideName}
        </span>
      </div>
      <div className="curtain-opening-right flex items-center justify-start pl-8 select-none">
        <span className="font-serif text-2xl md:text-4xl text-white text-left leading-tight drop-shadow-lg">
          {groomName}
        </span>
      </div>
    </div>
  );
}
export default CurtainOpening;
