import React from "react";

type GardenGateOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
};

export function GardenGateOpening({
  opened,
  brideName,
  groomName,
}: GardenGateOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}${groomName.charAt(0) || 'D'}`;

  return (
    <div className={`garden-gate-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div className="gate-panel-left flex items-center justify-end pr-4 select-none">
        <div className="font-serif text-2xl text-[#dfc48c] font-bold opacity-80">{initials.charAt(0)}</div>
      </div>
      <div className="gate-panel-right flex items-center justify-start pl-4 select-none">
        <div className="font-serif text-2xl text-[#dfc48c] font-bold opacity-80">{initials.charAt(1)}</div>
      </div>
    </div>
  );
}
export default GardenGateOpening;
