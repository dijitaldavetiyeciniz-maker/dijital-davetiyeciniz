'use client';
import React from 'react';
import BackgroundParticles from './BackgroundParticles';

export default function BackgroundAnimation({ type, disableDefault }: { type: string, disableDefault?: boolean }) {
  if (disableDefault && !type) return null;
  return <BackgroundParticles animationType={type} />;
}
