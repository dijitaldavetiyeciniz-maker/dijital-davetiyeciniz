import React from "react";

type ElevatorDoorOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
  theme: string;
};

export function ElevatorDoorOpening({
  opened,
  brideName,
  groomName,
  theme,
}: ElevatorDoorOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}${groomName.charAt(0) || 'D'}`;

  return (
    <div className={`elevator-opening-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div className={`elevator-door-left elevator-door-theme-${theme} flex items-center justify-end pr-8 select-none`}>
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/10">
          <span className="font-sans text-white text-sm font-bold">{initials.charAt(0)}</span>
        </div>
      </div>
      <div className={`elevator-door-right elevator-door-theme-${theme} flex items-center justify-start pl-8 select-none`}>
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/10">
          <span className="font-sans text-white text-sm font-bold">{initials.charAt(1)}</span>
        </div>
      </div>
    </div>
  );
}
export default ElevatorDoorOpening;
