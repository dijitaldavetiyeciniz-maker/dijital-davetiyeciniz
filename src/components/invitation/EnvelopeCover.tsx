import React from 'react';

type EnvelopeCoverProps = {
  style: string;
  children?: React.ReactNode;
};

export function EnvelopeCover({ style, children }: EnvelopeCoverProps) {
  return (
    <div className={`envelope envelope-${style}`}>
      <div className="envelope-back" />
      {children}
      <div className="envelope-flap envelope-flap-top" />
      <div className="envelope-flap envelope-flap-left" />
      <div className="envelope-flap envelope-flap-right" />
      <div className="envelope-flap envelope-flap-bottom" />
    </div>
  );
}
