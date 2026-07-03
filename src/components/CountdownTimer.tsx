'use client';
import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
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

  return (
    <div className="flex gap-4 justify-center items-center my-8">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl font-bold text-rose-600 shadow-sm border border-rose-100">
          {timeLeft.days}
        </div>
        <span className="text-xs text-slate-500 mt-2 uppercase tracking-widest">Gün</span>
      </div>
      <div className="text-2xl text-rose-300 font-light pb-6">:</div>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl font-bold text-rose-600 shadow-sm border border-rose-100">
          {timeLeft.hours}
        </div>
        <span className="text-xs text-slate-500 mt-2 uppercase tracking-widest">Saat</span>
      </div>
      <div className="text-2xl text-rose-300 font-light pb-6">:</div>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl font-bold text-rose-600 shadow-sm border border-rose-100">
          {timeLeft.minutes}
        </div>
        <span className="text-xs text-slate-500 mt-2 uppercase tracking-widest">Dakika</span>
      </div>
      <div className="text-2xl text-rose-300 font-light pb-6">:</div>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl font-bold text-rose-600 shadow-sm border border-rose-100">
          {timeLeft.seconds}
        </div>
        <span className="text-xs text-slate-500 mt-2 uppercase tracking-widest">Saniye</span>
      </div>
    </div>
  );
}
