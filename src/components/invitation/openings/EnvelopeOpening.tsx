import React from "react";
import { EnvelopeCover } from "../EnvelopeCover";
import { WaxSeal } from "../WaxSeal";
import { InvitationCard } from "../InvitationCard";

type EnvelopeOpeningProps = {
  opened: boolean;
  initials: string;
  brideName: string;
  groomName: string;
  eventDate?: string;
  theme: string;
  motion: string;
  palette: string;
  effects: string[];
};

export function EnvelopeOpening({
  opened,
  initials,
  brideName,
  groomName,
  eventDate,
  theme,
  motion,
  palette,
  effects,
}: EnvelopeOpeningProps) {
  // Determine envelope color style based on theme
  let envelopeStyle = "classic";
  if (theme.includes("marble")) envelopeStyle = "marble-texture";
  else if (theme.includes("black")) envelopeStyle = "black-premium";
  else if (theme.includes("velvet")) envelopeStyle = "velvet-burgundy";
  else if (theme.includes("floral")) envelopeStyle = "romantic-flowers";
  else if (theme.includes("kraft")) envelopeStyle = "kraft-natural";
  else if (theme.includes("gold-foil") || theme.includes("luxury-gold-border")) envelopeStyle = "gold-edge";

  // Determine wax seal style
  let sealStyle = "gold";
  if (palette.includes("burgundy")) sealStyle = "burgundy";
  else if (palette.includes("silver")) sealStyle = "silver";
  else if (palette.includes("rose")) sealStyle = "rose-gold";

  // Determine insignia stamp motif
  let insignia = "crown";
  if (theme.includes("romantic") || theme.includes("blush")) insignia = "rose";
  else if (theme.includes("boho") || theme.includes("kraft")) insignia = "olive";
  else if (theme.includes("glass")) insignia = "infinity";

  return (
    <div className={`envelope-opening-stage animation-${motion} ${opened ? "is-opened" : ""}`}>
      <EnvelopeCover style={envelopeStyle}>
        <InvitationCard 
          brideName={brideName} 
          groomName={groomName} 
          eventDate={eventDate} 
        />
        {theme === "satin-ribbon-envelope" && (
          <div className="satin-ribbon" aria-hidden="true" />
        )}
        <WaxSeal style={sealStyle} initials={initials} insignia={insignia} />
      </EnvelopeCover>
    </div>
  );
}
export default EnvelopeOpening;
