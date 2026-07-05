'use client';
import { useEffect, useState } from "react";
import "@/styles/invitation-animations.css";
import { EnvelopeCover } from "./EnvelopeCover";
import { InvitationCard } from "./InvitationCard";
import { WaxSeal } from "./WaxSeal";

type EntranceAnimationProps = {
  animationType: string;
  envelopeStyle: string;
  sealStyle: string;
  backgroundAnimation: string;
  initials: string;
  brideName?: string;
  groomName?: string;
  eventDate?: string;
  onComplete?: () => void;
};

function FloatingPetals() {
  return (
    <div className="floating-petals" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, index) => (
        <span key={index} style={{ "--i": index } as React.CSSProperties} />
      ))}
    </div>
  );
}

function GoldenParticles() {
  return (
    <div className="golden-particles" aria-hidden="true">
      {Array.from({ length: 26 }).map((_, index) => (
        <span key={index} style={{ "--i": index } as React.CSSProperties} />
      ))}
    </div>
  );
}

function PearlParticles() {
  return (
    <div className="pearl-particles" aria-hidden="true">
      {Array.from({ length: 20 }).map((_, index) => (
        <span key={index} style={{ "--i": index } as React.CSSProperties} />
      ))}
    </div>
  );
}

export function EntranceAnimation({
  animationType,
  envelopeStyle,
  sealStyle,
  backgroundAnimation,
  initials,
  brideName,
  groomName,
  eventDate,
  onComplete,
}: EntranceAnimationProps) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(false);

    const timer = setTimeout(() => {
      setOpened(true);
      onComplete?.();
    }, 3800);

    return () => clearTimeout(timer);
  }, [animationType, envelopeStyle, sealStyle, backgroundAnimation, onComplete]);

  const shouldShowPetals =
    backgroundAnimation === "petals" ||
    animationType === "floral-bloom" ||
    animationType === "petal-rain";

  const shouldShowGold =
    backgroundAnimation === "golden" ||
    animationType === "royal-seal-premium" ||
    animationType === "golden-dust-reveal" ||
    animationType === "satin-ribbon-unfold";

  const shouldShowPearl =
    backgroundAnimation === "pearl" ||
    animationType === "pearl-light" ||
    animationType === "glass-shimmer";

  return (
    <div className={`entrance-root bg-${backgroundAnimation}`}>
      {shouldShowPetals && <FloatingPetals />}
      {shouldShowGold && <GoldenParticles />}
      {shouldShowPearl && <PearlParticles />}

      <div className={`entrance-stage animation-${animationType} ${opened ? "is-opened" : ""}`}>
        <EnvelopeCover style={envelopeStyle}>
          <InvitationCard 
            brideName={brideName} 
            groomName={groomName} 
            eventDate={eventDate} 
          />
          {animationType === "satin-ribbon-unfold" && (
            <div className="satin-ribbon" aria-hidden="true" />
          )}
          <WaxSeal style={sealStyle} initials={initials} />
        </EnvelopeCover>
      </div>
    </div>
  );
}
export default EntranceAnimation;
