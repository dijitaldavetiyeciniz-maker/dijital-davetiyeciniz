import React from 'react';

type WaxSealProps = {
  style: string;
  initials: string;
  insignia?: string;
  onClick?: () => void;
  customColor?: string;
};

export function WaxSeal({ style, initials, insignia = 'none', onClick, customColor }: WaxSealProps) {
  // If style is none or if we shouldn't render a seal, return null
  if (style === 'none') return null;

  const validInsignias = ['crown', 'rose', 'heart', 'ring', 'floral', 'infinity', 'swan', 'olive'];
  const isCustomText = insignia !== 'none' && !validInsignias.includes(insignia);

  const inlineStyle = customColor ? { backgroundColor: customColor, backgroundImage: 'none' } : {};

  return (
    <div 
      className={`wax-seal seal-${style} ${insignia !== 'none' && !isCustomText ? `seal-insignia-${insignia}` : ''}`} 
      onClick={onClick}
      style={inlineStyle}
    >
      {(insignia === 'none' || isCustomText) && (
        <span className="font-serif text-[9px] md:text-[10px] font-bold tracking-widest uppercase select-none" style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
          {isCustomText ? insignia : initials}
        </span>
      )}
    </div>
  );
}
