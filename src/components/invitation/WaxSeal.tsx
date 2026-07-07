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

  const validInsignias = ['crown', 'rose', 'heart', 'ring', 'floral', 'infinity', 'swan', 'olive'];
  const isCustomText = insignia !== 'none' && !validInsignias.includes(insignia);

  return (
    <div 
      className={`wax-seal seal-${style} ${insignia !== 'none' && !isCustomText ? `seal-insignia-${insignia}` : ''}`} 
      onClick={onClick}
    >
      {(insignia === 'none' || isCustomText) && (
        <span className="font-serif text-[9px] md:text-[10px] font-bold tracking-widest uppercase select-none" style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
          {isCustomText ? insignia : initials}
        </span>
      )}
    </div>
  );
}
