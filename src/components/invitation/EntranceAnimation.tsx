'use client';
import { useEffect, useState } from "react";
import "@/styles/invitation-animations.css";
import { EnvelopeCover } from "./EnvelopeCover";
import { InvitationCard } from "./InvitationCard";
import { WaxSeal } from "./WaxSeal";
import { entranceAnimations } from "@/data/entranceAnimations";

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
  brideName = "Gelin",
  groomName = "Damat",
  eventDate,
  onComplete,
}: EntranceAnimationProps) {
  const [opened, setOpened] = useState(false);

  // Find unified preset if exists
  const preset = entranceAnimations.find(p => p.id === animationType);

  const actualAnimationType = preset ? preset.animationType : animationType;
  const actualEnvelopeStyle = preset ? preset.envelopeStyle : envelopeStyle;
  const actualSealStyle = preset ? preset.sealStyle : sealStyle;
  const actualBackgroundAnimation = preset ? preset.backgroundAnimation : backgroundAnimation;
  const actualSealInsignia = preset ? preset.sealInsignia : 'none';

  useEffect(() => {
    setOpened(false);
    let autoOpenTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    // Auto-open after 2.2 seconds if they don't click manually
    autoOpenTimer = setTimeout(() => {
      setOpened(true);
      if (onComplete) {
        completeTimer = setTimeout(() => {
          onComplete();
        }, 3500);
      }
    }, 2200);

    return () => {
      clearTimeout(autoOpenTimer);
      clearTimeout(completeTimer);
    };
  }, [animationType, actualAnimationType, actualEnvelopeStyle, actualSealStyle, actualBackgroundAnimation, onComplete]);

  const handleManualOpen = () => {
    if (opened) return;
    setOpened(true);
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, 3500);
    }
  };

  const shouldShowPetals =
    actualBackgroundAnimation === "petals" ||
    actualAnimationType === "floral-bloom" ||
    actualAnimationType === "petal-rain";

  const shouldShowGold =
    actualBackgroundAnimation === "golden" ||
    actualAnimationType === "royal-seal-premium" ||
    actualAnimationType === "golden-dust-reveal" ||
    actualAnimationType === "satin-ribbon-unfold";

  const shouldShowPearl =
    actualBackgroundAnimation === "pearl" ||
    actualAnimationType === "pearl-light" ||
    actualAnimationType === "glass-shimmer";

  // Check if non-envelope style
  const isCurtains = actualAnimationType.startsWith("theater-curtains");
  const isCosmic = actualAnimationType === "cosmic-star-portal";
  const isBook = actualAnimationType === "book-page-flip";

  return (
    <div className={`entrance-root bg-${actualBackgroundAnimation}`}>
      {shouldShowPetals && <FloatingPetals />}
      {shouldShowGold && <GoldenParticles />}
      {shouldShowPearl && <PearlParticles />}

      {/* 1. Curtains (Perde) Layout */}
      {isCurtains && (
        <div 
          onClick={handleManualOpen}
          className={`curtains-stage ${actualAnimationType === 'theater-curtains-gold' ? 'curtains-gold' : ''} ${opened ? "is-opened" : ""} cursor-pointer w-full h-full`}
        >
          <div className="curtain-panel curtain-left flex items-center justify-end pr-8 select-none">
            <span className="curtain-logo font-serif text-2xl md:text-4xl text-right leading-tight">
              {brideName}
            </span>
          </div>
          <div className="curtain-panel curtain-right flex items-center justify-start pl-8 select-none">
            <span className="curtain-logo font-serif text-2xl md:text-4xl text-left leading-tight">
              {groomName}
            </span>
          </div>
        </div>
      )}

      {/* 2. Cosmic Portal Layout */}
      {isCosmic && (
        <div 
          onClick={handleManualOpen}
          className={`cosmic-stage ${opened ? "is-opened" : ""} cursor-pointer w-full h-full`}
        >
          <div className="cosmic-portal-ring select-none">
            <div className="cosmic-logo font-serif text-xl md:text-2xl">
              {initials}
            </div>
          </div>
        </div>
      )}

      {/* 3. Luxury Book Page Flip Layout */}
      {isBook && (
        <div 
          onClick={handleManualOpen}
          className={`book-stage ${opened ? "is-opened" : ""} cursor-pointer w-full h-full`}
        >
          <div className="book-cover select-none">
            <span className="book-badge font-sans">DÜĞÜN DAVETİYESİ</span>
            <div className="book-ornament" />
            <h2 className="book-names font-serif">
              {brideName} <br /> & <br /> {groomName}
            </h2>
            <div className="book-ornament" />
            {eventDate && <span className="text-xs tracking-wider opacity-85 mt-2">{eventDate}</span>}
          </div>
        </div>
      )}

      {/* 4. Default Envelope Layout */}
      {!isCurtains && !isCosmic && !isBook && (
        <div 
          onClick={handleManualOpen}
          className={`entrance-stage animation-${actualAnimationType} ${opened ? "is-opened" : ""} cursor-pointer`}
        >
          <EnvelopeCover style={actualEnvelopeStyle}>
            <InvitationCard 
              brideName={brideName} 
              groomName={groomName} 
              eventDate={eventDate} 
            />
            {actualAnimationType === "satin-ribbon-unfold" && (
              <div className="satin-ribbon" aria-hidden="true" />
            )}
            <WaxSeal style={actualSealStyle} initials={initials} insignia={actualSealInsignia} />
          </EnvelopeCover>
        </div>
      )}

      {!opened && (
        <div className="absolute bottom-10 left-0 right-0 text-center animate-pulse z-20 pointer-events-none">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-extrabold drop-shadow-md select-none bg-white/40 inline-block px-4 py-2 rounded-full backdrop-blur-xs border border-white/20">
            {isCurtains ? "🎭 AÇMAK İÇİN DOKUNUN 🎭" : isCosmic ? "🌌 GEÇİŞ İÇİN DOKUNUN 🌌" : isBook ? "📖 AÇMAK İÇİN DOKUNUN 📖" : "✉️ AÇMAK İÇİN DOKUNUN ✉️"}
          </p>
        </div>
      )}
    </div>
  );
}
export default EntranceAnimation;
