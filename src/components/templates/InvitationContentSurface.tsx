'use client';
import React from 'react';

interface InvitationContentSurfaceProps {
  children: React.ReactNode;
  surfaceStyle?: React.CSSProperties;
  className?: string;
  variant?: 'hero' | 'details' | 'actions' | 'custom';
  testId?: string;
}

/**
 * Reusable content surface component.
 * Renders a background surface with customizable cardSurfaceStyle (backgroundColor, backdropFilter, opacity)
 * while keeping children (text, buttons, icons) 100% opaque on top (relative z-10).
 */
export default function InvitationContentSurface({
  children,
  surfaceStyle,
  className = '',
  variant = 'custom',
  testId = 'invitation-content-surface'
}: InvitationContentSurfaceProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Background card surface layer */}
      <div
        aria-hidden="true"
        data-testid={testId}
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-all duration-300"
        style={surfaceStyle}
      />

      {/* Fully opaque content layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
