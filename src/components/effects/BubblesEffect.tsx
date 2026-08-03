'use client';
import { useEffect, useState } from 'react';

export default function BubblesEffect() {
  const [bubbles, setBubbles] = useState<any[]>([]);

  useEffect(() => {
    const createBubbles = () => {
      const rand = (seed: number, offset: number) => { 
        const x = Math.sin(seed * 12.9898 + offset * 78.233) * 43758.5453; 
        return x - Math.floor(x); 
      };
      const newBubbles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: rand(i, 1) * 100 + '%',
        size: rand(i, 2) * 40 + 10 + 'px',
        animationDuration: rand(i, 3) * 10 + 5 + 's',
        animationDelay: rand(i, 4) * 5 + 's',
      }));
      setBubbles(newBubbles);
    };
    createBubbles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute bottom-[-100px] rounded-full border border-white/40 bg-white/10 backdrop-blur-[2px] shadow-sm animate-bubble"
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            animationDuration: bubble.animationDuration,
            animationDelay: bubble.animationDelay,
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bubble {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) scale(1.5);
            opacity: 0;
          }
        }
        .animate-bubble {
          animation-name: bubble;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      ` }} />
    </div>
  );
}
