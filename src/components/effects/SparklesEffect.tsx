'use client';
import { useEffect, useState } from 'react';

export default function SparklesEffect({ color = '#d4af37' }: { color?: string }) {
  const [sparkles, setSparkles] = useState<any[]>([]);

  useEffect(() => {
    const createSparkles = () => {
      const rand = (seed: number, offset: number) => { 
        const x = Math.sin(seed * 12.9898 + offset * 78.233) * 43758.5453; 
        return x - Math.floor(x); 
      };
      const newSparkles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: rand(i, 1) * 100 + '%',
        top: rand(i, 2) * 100 + '%',
        size: rand(i, 3) * 4 + 1 + 'px',
        animationDuration: rand(i, 4) * 3 + 1 + 's',
        animationDelay: rand(i, 5) * 5 + 's',
      }));
      setSparkles(newSparkles);
    };
    createSparkles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute rounded-full animate-sparkle"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
            animationDuration: sparkle.animationDuration,
            animationDelay: sparkle.animationDelay,
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-sparkle {
          animation-name: sparkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      ` }} />
    </div>
  );
}
