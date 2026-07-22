'use client';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeartProps {
  id: number;
  size: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  color: string;
}

export default function HeartsEffect({ color = '#ef4444' }: { color?: string }) {
  const [hearts] = useState<HeartProps[]>(() =>
    Array.from({ length: 15 }).map((_, i) => {
      const seed1 = i * 19 + 7.89;
      const seed2 = i * 31 + 4.56;
      const seed3 = i * 47 + 1.23;
      return {
        id: i,
        size: (Math.abs(Math.sin(seed1)) * 20) + 10,
        left: Math.abs(Math.sin(seed2)) * 100,
        animationDuration: (Math.abs(Math.sin(seed3)) * 10) + 10,
        animationDelay: Math.abs(Math.sin(i * 13)) * 5,
        color: color,
      };
    })
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-[-50px] animate-heart opacity-40"
          style={{
            left: `${heart.left}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            animationDuration: `${heart.animationDuration}s`,
            animationDelay: `${heart.animationDelay}s`,
          }}
        >
          <Heart 
            fill={heart.color} 
            color={heart.color} 
            style={{ width: '100%', height: '100%' }} 
          />
        </div>
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes heart-float {
          0% {
            transform: translateY(0) scale(1) rotate(-10deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            transform: translateY(-50vh) scale(1.2) rotate(10deg);
          }
          100% {
            transform: translateY(-120vh) scale(1.5) rotate(-10deg);
            opacity: 0;
          }
        }
        .animate-heart {
          animation-name: heart-float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      ` }} />
    </div>
  );
}
