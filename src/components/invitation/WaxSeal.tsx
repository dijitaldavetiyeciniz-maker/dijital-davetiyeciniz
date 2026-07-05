import React from 'react';

type WaxSealProps = {
  style: string;
  initials: string;
  onClick?: () => void;
};

export function WaxSeal({ style, initials, onClick }: WaxSealProps) {
  return (
    <div className={`wax-seal seal-${style}`} onClick={onClick}>
      <span>{initials}</span>
    </div>
  );
}
