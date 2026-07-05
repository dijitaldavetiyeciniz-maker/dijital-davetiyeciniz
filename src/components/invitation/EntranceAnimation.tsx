'use client';
import { useEffect, useState } from "react";
import "@/styles/invitation-animations.css";
import "@/styles/opening-animations.css";
import { openingAnimations, OpeningAnimation } from "@/data/openingAnimations";

// Import opening family components
import { EnvelopeOpening } from "./openings/EnvelopeOpening";
import { CurtainOpening } from "./openings/CurtainOpening";
import { DoorOpening } from "./openings/DoorOpening";
import { GardenGateOpening } from "./openings/GardenGateOpening";
import { BookOpening } from "./openings/BookOpening";
import { LuxuryBoxOpening } from "./openings/LuxuryBoxOpening";
import { TreasureChestOpening } from "./openings/TreasureChestOpening";
import { GlassRevealOpening } from "./openings/GlassRevealOpening";
import { MirrorRevealOpening } from "./openings/MirrorRevealOpening";
import { CinematicZoomOpening } from "./openings/CinematicZoomOpening";
import { SpotlightOpening } from "./openings/SpotlightOpening";
import { StarryNightOpening } from "./openings/StarryNightOpening";
import { ElevatorDoorOpening } from "./openings/ElevatorDoorOpening";
import { RoyalHallOpening } from "./openings/RoyalHallOpening";
import { MinimalFadeOpening } from "./openings/MinimalFadeOpening";

type EntranceAnimationProps = {
  animationType: string; // matches id in openingAnimations
  initials: string;
  brideName?: string;
  groomName?: string;
  eventDate?: string;
  onComplete?: () => void;
  // Backward compatibility:
  envelopeStyle?: string;
  sealStyle?: string;
  backgroundAnimation?: string;
};

// Reusable Particle components
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
  initials,
  brideName = "Gelin",
  groomName = "Damat",
  eventDate,
  onComplete,
}: EntranceAnimationProps) {
  const [opened, setOpened] = useState(false);

  // Find the selected opening animation configuration
  const config: OpeningAnimation =
    openingAnimations.find((a) => a.id === animationType) ||
    openingAnimations[0]; // fallback to first item

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
        }, config.duration);
      }
    }, 2200);

    return () => {
      clearTimeout(autoOpenTimer);
      clearTimeout(completeTimer);
    };
  }, [animationType, config.duration, onComplete]);

  const handleManualOpen = () => {
    if (opened) return;
    setOpened(true);
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, config.duration);
    }
  };

  // Extract particle details from effects list
  const hasRosePetals = config.effects.includes("rosePetals");
  const hasGoldParticles =
    config.effects.includes("goldParticles") ||
    config.effects.includes("goldDust") ||
    config.effects.includes("sparkleDust");
  const hasPearlParticles =
    config.effects.includes("pearlLight") ||
    config.effects.includes("pearlParticles");

  // Choose display text helper
  const getPromptText = () => {
    switch (config.family) {
      case "envelope":
        return "✉️ AÇMAK İÇİN DOKUNUN ✉️";
      case "curtain":
        return "🎭 PERDEYİ AÇMAK İÇİN DOKUNUN 🎭";
      case "door":
      case "elevator":
        return "🚪 KAPILARI AÇMAK İÇİN DOKUNUN 🚪";
      case "gardenGate":
        return "🌿 GEÇİŞ İÇİN DOKUNUN 🌿";
      case "book":
        return "📖 KİTABI AÇMAK İÇİN DOKUNUN 📖";
      case "luxuryBox":
        return "🎁 KUTUYU AÇMAK İÇİN DOKUNUN 🎁";
      case "treasureChest":
        return "👑 HAZİNEYİ AÇMAK İÇİN DOKUNUN 👑";
      case "glass":
      case "mirror":
        return "🔮 YANSIMAYI AÇMAK İÇİN DOKUNUN 🔮";
      default:
        return "✨ DEVAM ETMEK İÇİN DOKUNUN ✨";
    }
  };

  // Helper function to render correct opening family layout
  const renderFamily = () => {
    const commonProps = {
      opened,
      initials,
      brideName,
      groomName,
      eventDate,
      theme: config.theme,
      motion: config.motion,
      palette: config.palette,
      effects: config.effects,
    };

    switch (config.family) {
      case "envelope":
        return <EnvelopeOpening {...commonProps} />;
      case "curtain":
        return <CurtainOpening {...commonProps} />;
      case "door":
        return <DoorOpening {...commonProps} />;
      case "gardenGate":
        return <GardenGateOpening {...commonProps} />;
      case "book":
        return <BookOpening {...commonProps} />;
      case "luxuryBox":
        return <LuxuryBoxOpening {...commonProps} />;
      case "treasureChest":
        return <TreasureChestOpening {...commonProps} />;
      case "glass":
        return <GlassRevealOpening {...commonProps} />;
      case "mirror":
        return <MirrorRevealOpening {...commonProps} />;
      case "cinematicZoom":
        return <CinematicZoomOpening {...commonProps} />;
      case "spotlight":
        return <SpotlightOpening {...commonProps} />;
      case "starryNight":
        return <StarryNightOpening {...commonProps} />;
      case "elevator":
        return <ElevatorDoorOpening {...commonProps} />;
      case "royalHall":
        return <RoyalHallOpening {...commonProps} />;
      case "minimal":
      default:
        return <MinimalFadeOpening {...commonProps} />;
    }
  };

  return (
    <div 
      className={`opening-stage-container opening-family-${config.family} opening-theme-${config.theme} overflow-hidden w-full h-full relative`}
      onClick={handleManualOpen}
    >
      {/* Render Particles */}
      {hasRosePetals && <FloatingPetals />}
      {hasGoldParticles && <GoldenParticles />}
      {hasPearlParticles && <PearlParticles />}

      {/* Render selected family layout */}
      {renderFamily()}

      {/* Manual action prompt */}
      {!opened && (
        <div className="absolute bottom-10 left-0 right-0 text-center animate-pulse z-20 pointer-events-none select-none">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-extrabold drop-shadow-md bg-white/40 inline-block px-5 py-2.5 rounded-full backdrop-blur-xs border border-white/20">
            {getPromptText()}
          </p>
        </div>
      )}
    </div>
  );
}
export default EntranceAnimation;
