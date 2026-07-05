import React from "react";

type StarryNightOpeningProps = {
  opened: boolean;
  brideName: string;
  groomName: string;
};

export function StarryNightOpening({
  opened,
  brideName,
  groomName,
}: StarryNightOpeningProps) {
  const initials = `${brideName.charAt(0) || 'G'}${groomName.charAt(0) || 'D'}`;

  return (
    <div className={`starry-opening-stage ${opened ? "opened" : ""} w-full h-full flex items-center justify-center`}>
      <div className="moon-orb" />
      <div className="z-10 text-center select-none text-white p-6">
        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-xs mx-auto mb-4">
          <span className="font-serif text-[#dfc384] text-xl font-bold tracking-widest">{initials}</span>
        </div>
        <h3 className="font-serif text-white text-xl md:text-2xl drop-shadow-md">
          {brideName} & {groomName}
        </h3>
      </div>
    </div>
  );
}
export default StarryNightOpening;
