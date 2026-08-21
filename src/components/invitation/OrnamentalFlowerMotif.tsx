'use client';
import React from 'react';

interface OrnamentalFlowerMotifProps {
  palette?: 'silver' | 'amber' | 'gold';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-top';
  className?: string;
  size?: number;
}

export default function OrnamentalFlowerMotif({
  palette = 'silver',
  position = 'top-left',
  className = '',
  size = 120
}: OrnamentalFlowerMotifProps) {
  // Gradient definitions based on palette
  const isSilver = palette === 'silver';
  const primaryStroke = isSilver ? '#D8DCE0' : '#C98A3E';
  const secondaryStroke = isSilver ? '#A9AEB4' : '#E5A958';
  const highlightStroke = isSilver ? '#F2F4F6' : '#FCE7C8';
  const shadowFilter = isSilver 
    ? 'drop-shadow(0px 1px 1px rgba(0,0,0,0.6)) drop-shadow(0px -0.5px 0.5px rgba(255,255,255,0.7))'
    : 'drop-shadow(0px 1px 1px rgba(0,0,0,0.7)) drop-shadow(0px -0.5px 0.5px rgba(254,243,199,0.8))';

  let rotationStyle: React.CSSProperties = {};
  if (position === 'top-right') rotationStyle = { transform: 'scaleX(-1)' };
  else if (position === 'bottom-left') rotationStyle = { transform: 'scaleY(-1)' };
  else if (position === 'bottom-right') rotationStyle = { transform: 'scale(-1, -1)' };
  else if (position === 'center-top') rotationStyle = { transform: 'none' };

  return (
    <div 
      className={`pointer-events-none select-none transition-opacity duration-700 ${className}`}
      style={{
        width: size,
        height: size * 0.75,
        filter: shadowFilter,
        ...rotationStyle
      }}
      aria-hidden="true"
    >
      <svg 
        viewBox="0 0 160 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={`metallic-grad-${palette}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={highlightStroke} />
            <stop offset="35%" stopColor={primaryStroke} />
            <stop offset="70%" stopColor={secondaryStroke} />
            <stop offset="100%" stopColor={highlightStroke} />
          </linearGradient>

          {/* Slow shining shimmer animation sweep across the engraving */}
          <linearGradient id={`shimmer-grad-${palette}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            <animate 
              attributeName="x1" 
              from="-100%" 
              to="200%" 
              dur="12s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="x2" 
              from="0%" 
              to="300%" 
              dur="12s" 
              repeatCount="indefinite" 
            />
          </linearGradient>

          <mask id={`motif-mask-${palette}`}>
            <g stroke="white" strokeWidth="1.6" fill="none">
              {/* Botanical vines and blooming petals */}
              <path d="M10,10 Q60,15 90,65 Q115,105 150,110" />
              <path d="M10,10 Q35,50 60,75 Q85,100 120,115" />
              <path d="M45,25 C45,15 65,15 65,25 C65,35 45,35 45,25 Z" fill="white" />
              <path d="M75,50 C80,35 98,42 92,58 C86,70 70,60 75,50 Z" fill="white" />
              <path d="M105,78 C115,68 128,76 122,88 C116,98 100,90 105,78 Z" fill="white" />
              <path d="M30,12 Q45,2 52,18 Q40,25 30,12 Z" fill="white" />
              <path d="M15,28 Q28,25 32,38 Q18,42 15,28 Z" fill="white" />
              <circle cx="10" cy="10" r="3.5" fill="white" />
              <circle cx="90" cy="65" r="2.5" fill="white" />
              <circle cx="150" cy="110" r="3" fill="white" />
            </g>
          </mask>
        </defs>

        {/* Base Engraved Motif */}
        <g stroke={`url(#metallic-grad-${palette})`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Main Arched Stem */}
          <path d="M10,10 Q60,15 90,65 Q115,105 150,110" />
          <path d="M10,10 Q35,50 60,75 Q85,100 120,115" />
          
          {/* Detailed Engraved Foliage Leaves */}
          <path d="M45,25 C45,15 65,15 65,25 C65,35 45,35 45,25 Z" fill={`url(#metallic-grad-${palette})`} fillOpacity="0.3" />
          <path d="M75,50 C80,35 98,42 92,58 C86,70 70,60 75,50 Z" fill={`url(#metallic-grad-${palette})`} fillOpacity="0.3" />
          <path d="M105,78 C115,68 128,76 122,88 C116,98 100,90 105,78 Z" fill={`url(#metallic-grad-${palette})`} fillOpacity="0.3" />
          
          {/* Secondary Buds */}
          <path d="M30,12 Q45,2 52,18 Q40,25 30,12 Z" fill={`url(#metallic-grad-${palette})`} fillOpacity="0.4" />
          <path d="M15,28 Q28,25 32,38 Q18,42 15,28 Z" fill={`url(#metallic-grad-${palette})`} fillOpacity="0.4" />
          
          {/* Filigree accents */}
          <path d="M55,30 Q65,42 58,50" strokeWidth="1" />
          <path d="M85,62 Q95,72 88,80" strokeWidth="1" />
          <path d="M22,18 Q26,30 20,36" strokeWidth="0.8" />
          
          {/* Subtle Starlight Dots */}
          <circle cx="10" cy="10" r="3.5" fill={highlightStroke} />
          <circle cx="90" cy="65" r="2.5" fill={highlightStroke} />
          <circle cx="150" cy="110" r="3" fill={highlightStroke} />
        </g>

        {/* Shimmer Sweep Overlay Masked to Motif */}
        <rect 
          x="0" 
          y="0" 
          width="160" 
          height="120" 
          fill={`url(#shimmer-grad-${palette})`} 
          mask={`url(#motif-mask-${palette})`} 
          className="mix-blend-overlay"
        />
      </svg>
    </div>
  );
}
