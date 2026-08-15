'use client';
import { useEffect, useRef, useState } from 'react';

export function useSceneProgress(
  containerRef: React.RefObject<HTMLElement | null>,
  sceneCount: number = 5
) {
  const [progress, setProgress] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const rafIdRef = useRef<number | null>(null);
  const lastProgressRef = useRef<number>(-1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const totalHeight = rect.height - viewportHeight;
        
        if (totalHeight <= 0) return;

        // Calculate progress based on how far the container has scrolled past the viewport top
        const currentScroll = -rect.top;
        const pct = Math.max(0, Math.min(1, currentScroll / totalHeight));

        // Set the CSS Custom Property on the container for CSS-based GPU-accelerated transitions
        el.style.setProperty('--scroll-progress', pct.toFixed(4));
        el.style.setProperty('--scroll-progress-pct', `${(pct * 100).toFixed(2)}%`);

        // Determine which scene is active based on the scroll range
        const sceneIndex = Math.min(
          sceneCount - 1,
          Math.floor(pct * sceneCount)
        );

        // Only update React state if the change is significant (helps prevent re-renders)
        if (Math.abs(pct - lastProgressRef.current) > 0.002) {
          lastProgressRef.current = pct;
          setProgress(pct);
          setActiveScene(sceneIndex);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [containerRef, sceneCount]);

  return { progress, activeScene };
}
