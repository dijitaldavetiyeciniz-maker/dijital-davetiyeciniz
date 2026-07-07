import React from "react";
import { EnvelopeCover } from "../EnvelopeCover";
import { WaxSeal } from "../WaxSeal";
import { InvitationCard } from "../InvitationCard";
import { EntranceAnimationStyle } from "@/data/openingAnimations";

type EnvelopeOpeningProps = {
  opened: boolean;
  initials: string;
  brideName: string;
  groomName: string;
  eventDate?: string;
  styleConfig: EntranceAnimationStyle;
  customSealStyle?: string;
  customSealType?: string;
};

export function EnvelopeOpening({
  opened,
  initials,
  brideName,
  groomName,
  eventDate,
  styleConfig,
  customSealStyle,
  customSealType,
}: EnvelopeOpeningProps) {
  // Determine envelope cover style based on selected theme style
  let envelopeStyle = "classic";
  if (styleConfig.id === "marble-gold") envelopeStyle = "marble-texture";
  else if (styleConfig.id === "black-gold-premium") envelopeStyle = "black-premium";
  else if (styleConfig.id === "royal-burgundy") envelopeStyle = "velvet-burgundy";
  else if (styleConfig.id === "pastel-floral") envelopeStyle = "romantic-flowers";
  else if (styleConfig.id === "bohemian-garden") envelopeStyle = "kraft-natural";
  else if (styleConfig.id === "champagne-gold" || styleConfig.id === "navy-gold") envelopeStyle = "gold-edge";
  else if (styleConfig.id === "minimal-white") envelopeStyle = "minimal-white";
  else if (styleConfig.id === "glass-modern") envelopeStyle = "glass-effect";

  // Determine wax seal style
  let sealStyle = customSealStyle || "gold";
  if (!customSealStyle) {
    if (styleConfig.id === "royal-burgundy") sealStyle = "burgundy";
    else if (styleConfig.id === "minimal-white" || styleConfig.id === "glass-modern") sealStyle = "silver";
    else if (styleConfig.id === "rose-gold-romantic" || styleConfig.id === "pastel-floral") sealStyle = "rose-gold";
  }

  // Determine wax seal insignia
  let insignia = customSealType || "crown";
  if (!customSealType) {
    if (styleConfig.id === "rose-gold-romantic" || styleConfig.id === "pastel-floral") insignia = "rose";
    else if (styleConfig.id === "bohemian-garden") insignia = "olive";
    else if (styleConfig.id === "minimal-white") insignia = "infinity";
  }

  return (
    <div className={`envelope-opening-stage ${opened ? "is-opened" : ""}`}>
      <EnvelopeCover style={envelopeStyle}>
        <InvitationCard 
          brideName={brideName} 
          groomName={groomName} 
          eventDate={eventDate} 
        />
        {styleConfig.id === "champagne-gold" && (
          <div className="satin-ribbon" aria-hidden="true" />
        )}
        <WaxSeal style={sealStyle} initials={initials} insignia={insignia} />
      </EnvelopeCover>
    </div>
  );
}
export default EnvelopeOpening;
