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
  const [hearts, setHearts] = useState<HeartProps[]>([]);

  useEffect(() => {
    // Sadece client tarafında rastgele değerler oluştur (hydration uyumsuzluğunu önlemek için)
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 20 + 10, // 10px - 30px
      left: Math.random() * 100, // %0 - %100
      animationDuration: Math.random() * 10 + 10, // 10s - 20s
      animationDelay: Math.random() * 5, // 0s - 5s
      color: color,
    }));
    setHearts(newHearts);
  }, [color]);

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
      <style jsx>{`
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
      `}</style>
    </div>
  );
}
