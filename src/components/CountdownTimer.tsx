'use client';
import { useState, useEffect } from 'react';

export default function CountdownTimer({ 
  targetDate, 
  primaryColor = '#f43f5e',
  styleType = 'glass' 
}: { 
  targetDate: string;
  primaryColor?: string;
  styleType?: 'glass' | 'minimal' | 'neon' | 'elegant';
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
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
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isPast) return null;

  const renderTimerBlock = (value: number, label: string) => {
    switch (styleType) {
      case 'minimal':
        return (
          <div className="flex flex-col items-center">
            <div className="text-3xl sm:text-4xl font-light" style={{ color: primaryColor }}>
              {value.toString().padStart(2, '0')}
            </div>
            <span className="text-[10px] mt-1 uppercase tracking-widest opacity-50">{label}</span>
          </div>
        );
      case 'neon':
        return (
          <div className="flex flex-col items-center">
            <div 
              className="text-2xl sm:text-3xl font-bold font-mono" 
              style={{ 
                color: primaryColor,
                textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}` 
              }}
            >
              {value.toString().padStart(2, '0')}
            </div>
            <span className="text-[10px] mt-2 uppercase tracking-widest text-white/50">{label}</span>
          </div>
        );
      case 'elegant':
        return (
          <div className="flex flex-col items-center">
            <div 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-serif"
              style={{ border: `1px solid ${primaryColor}50`, color: primaryColor }}
            >
              {value.toString().padStart(2, '0')}
            </div>
            <span className="text-[9px] mt-2 uppercase tracking-widest opacity-70" style={{ color: primaryColor }}>{label}</span>
          </div>
        );
      case 'glass':
      default:
        return (
          <div className="flex flex-col items-center">
            <div 
              className="w-14 h-14 sm:w-16 sm:h-16 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-sm"
              style={{ color: primaryColor, border: `1px solid ${primaryColor}20` }}
            >
              {value.toString().padStart(2, '0')}
            </div>
            <span className="text-[10px] mt-2 uppercase tracking-widest opacity-60">{label}</span>
          </div>
        );
    }
  };

  const getSeparator = () => {
    if (styleType === 'elegant' || styleType === 'minimal') {
      return <div className="text-xl sm:text-2xl font-light opacity-30 pb-4" style={{ color: primaryColor }}>/</div>;
    }
    if (styleType === 'neon') {
      return <div className="text-xl sm:text-2xl font-bold font-mono pb-4" style={{ color: primaryColor, textShadow: `0 0 10px ${primaryColor}` }}>:</div>;
    }
    return <div className="text-xl sm:text-2xl font-light pb-6" style={{ color: primaryColor }}>:</div>;
  };

  return (
    <div className="flex gap-2 sm:gap-4 justify-center items-center my-4">
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
