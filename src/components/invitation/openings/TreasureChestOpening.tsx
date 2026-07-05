import React from "react";

type TreasureChestOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
};

export function TreasureChestOpening({
  opened,
  brideName,
  groomName,
}: TreasureChestOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}${groomName.charAt(0) || 'D'}`;

  return (
    <div className={`chest-opening-stage ${opened ? "opened" : ""} w-full h-full`}>
      <div className="chest-lid select-none flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#dfb758] flex items-center justify-center bg-black/30 mt-6 shadow-lg">
          <span className="font-serif text-[#dfb758] text-sm font-bold">{initials}</span>
        </div>
      </div>
    </div>
  );
}
export default TreasureChestOpening;
