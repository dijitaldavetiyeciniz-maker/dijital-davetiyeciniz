import React from 'react';

type EnvelopeCoverProps = {
  style: string;
  children?: React.ReactNode;
  customColor?: string;
};

export function EnvelopeCover({ style, children, customColor }: EnvelopeCoverProps) {
  const inlineStyle = customColor ? { backgroundColor: customColor } : {};
  return (
    <div className={`envelope envelope-${style}`}>
      <div className="envelope-back" style={inlineStyle} />
      {children}
      <div className="envelope-flap envelope-flap-top" style={inlineStyle} />
      <div className="envelope-flap envelope-flap-left" style={inlineStyle} />
      <div className="envelope-flap envelope-flap-right" style={inlineStyle} />
      <div className="envelope-flap envelope-flap-bottom" style={inlineStyle} />
    </div>
  );
}
