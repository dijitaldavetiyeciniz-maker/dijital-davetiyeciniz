import React from "react";

type LuxuryBoxOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  theme: string;
};

export function LuxuryBoxOpening({
  opened,
  brideName,
  groomName,
  theme,
}: LuxuryBoxOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}&${groomName.charAt(0) || 'D'}`;

  return (
    <div className={`box-opening-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div className={`box-lid box-lid-theme-${theme} select-none`}>
        <div className="box-ribbon box-ribbon-h" />
        <div className="box-ribbon box-ribbon-v" />
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center z-10 shadow-lg">
          <span className="font-serif text-white text-xl font-bold tracking-widest">{initials}</span>
        </div>
      </div>
    </div>
  );
}
export default LuxuryBoxOpening;
