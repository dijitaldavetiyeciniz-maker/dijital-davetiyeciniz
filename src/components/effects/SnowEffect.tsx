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
  const [snowflakes] = useState<SnowProps[]>(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 10 + 5, // 5px - 15px
      left: Math.random() * 100, // %0 - %100
      animationDuration: Math.random() * 8 + 7, // 7s - 15s
      animationDelay: Math.random() * 10, // 0s - 10s
      opacity: Math.random() * 0.5 + 0.3, // 0.3 - 0.8
    }))
  );

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
