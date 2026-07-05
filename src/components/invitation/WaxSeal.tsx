import React from 'react';

type WaxSealProps = {
  style: string;
  initials: string;
  insignia?: string;
  onClick?: () => void;
};

export function WaxSeal({ style, initials, insignia = 'none', onClick }: WaxSealProps) {
  // If style is none or if we shouldn't render a seal, return null
  if (style === 'none') return null;

  return (
    <div 
      className={`wax-seal seal-${style} ${insignia !== 'none' ? `seal-insignia-${insignia}` : ''}`} 
      onClick={onClick}
    >
      {insignia === 'none' && <span>{initials}</span>}
    </div>
  );
}
