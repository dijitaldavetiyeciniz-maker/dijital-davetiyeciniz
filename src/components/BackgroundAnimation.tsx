'use client';
import React from 'react';
import BackgroundParticles from './BackgroundParticles';

export default function BackgroundAnimation({ type }: { type: string }) {
  return <BackgroundParticles animationType={type} />;
}
