'use client';
import { useState, useEffect } from 'react';

export default function CountdownTimer({ 
  targetDate, 
  primaryColor = '#f43f5e',
  styleType = 'glass' 
}: { 
  targetDate: string;
  primaryColor?: string;
  styleType?: 'glass' | 'minimal' | 'digital' | 'circular' | 'neon' | 'elegant';
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    if (!targetDate) {
      setIsPast(true);
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();

      if (isNaN(target)) {
        clearInterval(timer);
        setIsPast(true);
        return;
      }

      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        setIsPast(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
        setIsPast(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isPast) {
    return (
      <div className="text-center py-4 px-6 rounded-2xl border border-dashed bg-white/30 backdrop-blur-xs font-serif text-xs font-bold uppercase tracking-[0.2em] max-w-[280px] mx-auto animate-pulse" style={{ borderColor: `${primaryColor}40`, color: primaryColor }}>
        🎉 Etkinlik Gerçekleşti!
      </div>
    );
  }

  const renderTimerBlock = (value: number, label: string) => {
    const paddedValue = value.toString().padStart(2, '0');
    switch (styleType) {
      case 'minimal': // Minimal Çizgisel (Thin lines, clean numbers)
        return (
          <div className="flex flex-col items-center px-1 sm:px-3 relative shrink-0">
            <div className="text-2xl sm:text-4xl font-light tracking-tight pb-1" style={{ color: primaryColor }}>
              {paddedValue}
            </div>
            <div className="w-6 sm:w-8 h-[2px] rounded-full" style={{ backgroundColor: `${primaryColor}40` }}></div>
            <span className="text-[8px] sm:text-[9px] mt-1 uppercase tracking-widest opacity-60 text-slate-500 font-sans">{label}</span>
          </div>
        );
      case 'digital': // Klasik Dijital (High-tech digital display style)
        return (
          <div className="flex flex-col items-center shrink-0">
            <div 
              className="px-2 py-1 sm:px-3 sm:py-2 bg-slate-950/90 text-red-500 rounded-lg border border-slate-800 shadow-inner font-mono text-xl sm:text-3xl font-bold tracking-widest min-w-[40px] sm:min-w-[56px] text-center" 
              style={{ 
                color: primaryColor,
                textShadow: `0 0 8px ${primaryColor}` 
              }}
            >
              {paddedValue}
            </div>
            <span className="text-[8px] sm:text-[9px] mt-1.5 uppercase tracking-widest opacity-50 font-sans font-bold text-slate-500">{label}</span>
          </div>
        );
      case 'circular': // Zarif Yuvarlaklar İçinde
      case 'elegant':
        return (
          <div className="flex flex-col items-center shrink-0">
            <div 
              className="w-12 h-12 sm:w-18 sm:h-18 rounded-full flex flex-col items-center justify-center border shadow-sm bg-white/40 backdrop-blur-xs transition-transform hover:scale-105"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              <span className="text-lg sm:text-3xl font-serif font-medium leading-none">{paddedValue}</span>
            </div>
            <span className="text-[8px] sm:text-[9px] mt-1.5 uppercase tracking-widest font-semibold font-sans opacity-70" style={{ color: primaryColor }}>{label}</span>
          </div>
        );
      case 'neon':
        return (
          <div className="flex flex-col items-center shrink-0">
            <div 
              className="text-2xl sm:text-4xl font-bold font-mono" 
              style={{ 
                color: primaryColor,
                textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}` 
              }}
            >
              {paddedValue}
            </div>
            <span className="text-[8px] sm:text-[10px] mt-1.5 uppercase tracking-widest text-white/50">{label}</span>
          </div>
        );
      case 'glass':
      default:
        return (
          <div className="flex flex-col items-center shrink-0">
            <div 
              className="w-11 h-11 sm:w-16 sm:h-16 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-lg sm:text-2xl font-bold shadow-xs border"
              style={{ color: primaryColor, borderColor: `${primaryColor}20` }}
            >
              {paddedValue}
            </div>
            <span className="text-[8px] sm:text-[10px] mt-1.5 uppercase tracking-widest opacity-60">{label}</span>
          </div>
        );
    }
  };

  const getSeparator = () => {
    if (styleType === 'circular' || styleType === 'elegant' || styleType === 'minimal') {
      return <div className="text-lg sm:text-2xl font-light opacity-30 px-0.5 sm:px-1 self-center -mt-4 sm:-mt-6" style={{ color: primaryColor }}>/</div>;
    }
    if (styleType === 'digital' || styleType === 'neon') {
      return <div className="text-lg sm:text-2xl font-bold font-mono px-0.5 sm:px-1 self-center -mt-4 sm:-mt-6 animate-pulse" style={{ color: primaryColor, textShadow: styleType === 'neon' ? `0 0 10px ${primaryColor}` : 'none' }}>:</div>;
    }
    return <div className="text-lg sm:text-2xl font-light px-0.5 sm:px-1 self-center -mt-4 sm:-mt-6" style={{ color: primaryColor }}>:</div>;
  };

  return (
    <div className="flex gap-1.5 sm:gap-3 justify-center items-center my-4 flex-nowrap w-full max-w-full overflow-hidden select-none">
      {renderTimerBlock(timeLeft.days, 'Gün')}
      {getSeparator()}
      {renderTimerBlock(timeLeft.hours, 'Saat')}
      {getSeparator()}
      {renderTimerBlock(timeLeft.minutes, 'Dakika')}
      {getSeparator()}
      {renderTimerBlock(timeLeft.seconds, 'Saniye')}
    </div>
  );
}
