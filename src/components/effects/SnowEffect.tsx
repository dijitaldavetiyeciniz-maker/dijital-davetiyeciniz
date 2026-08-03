'use client';
import { Snowflake } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SnowProps {
  id: number;
  size: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  opacity: number;
}

export default function SnowEffect() {
  const [snowflakes] = useState<SnowProps[]>(() => {
    const rand = (seed: number, offset: number) => { 
      const x = Math.sin(seed * 12.9898 + offset * 78.233) * 43758.5453; 
      return x - Math.floor(x); 
    };
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: rand(i, 1) * 10 + 5, // 5px - 15px
      left: rand(i, 2) * 100, // %0 - %100
      animationDuration: rand(i, 3) * 8 + 7, // 7s - 15s
      animationDelay: rand(i, 4) * 10, // 0s - 10s
      opacity: rand(i, 5) * 0.5 + 0.3, // 0.3 - 0.8
    }));
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {snowflakes.map((snow) => (
        <div
          key={snow.id}
          className="absolute top-[-50px] animate-snow text-white"
          style={{
            left: `${snow.left}%`,
            width: `${snow.size}px`,
            height: `${snow.size}px`,
            opacity: snow.opacity,
            animationDuration: `${snow.animationDuration}s`,
            animationDelay: `${snow.animationDelay}s`,
          }}
        >
          <Snowflake style={{ width: '100%', height: '100%' }} />
        </div>
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes snow-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(50vh) translateX(20px) rotate(180deg);
          }
          100% {
            transform: translateY(120vh) translateX(-20px) rotate(360deg);
          }
        }
        .animate-snow {
          animation-name: snow-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      ` }} />
    </div>
  );
}
