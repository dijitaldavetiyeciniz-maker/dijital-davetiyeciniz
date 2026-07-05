import React from "react";

type DoorOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  theme: string;
};

export function DoorOpening({
  opened,
  brideName,
  groomName,
  theme,
}: DoorOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}&${groomName.charAt(0) || 'D'}`;

  return (
    <div className={`door-opening-stage door-theme-${theme} ${opened ? "opened" : ""} w-full h-full`}>
      <div className="door-panel-left flex items-center justify-end pr-6 select-none">
        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-black/10">
          <span className="font-serif text-xl text-white font-bold">{initials.charAt(0)}</span>
        </div>
      </div>
      <div className="door-panel-right flex items-center justify-start pl-6 select-none">
        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-black/10">
          <span className="font-serif text-xl text-white font-bold">{initials.slice(-1)}</span>
        </div>
      </div>
    </div>
  );
}
export default DoorOpening;
