export function HennaPalaceOpening({ opened, initials, brideName, groomName, eventDate, introText, wedding }: any) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100 scale-100 blur-0"}`}>
      <div className="absolute inset-0 bg-slate-900 backdrop-blur-md" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-serif text-white/90 drop-shadow-2xl">{brideName} & {groomName}</h1>
        <p className="text-sm tracking-[0.3em] uppercase text-white/50">{introText}</p>
        <p className="text-sm tracking-[0.3em] uppercase text-white/50">{eventDate}</p>
      </div>
    </div>
  );
}
