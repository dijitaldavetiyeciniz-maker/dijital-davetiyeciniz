'use client';
import { useEffect, useState, useRef } from "react";
import "@/styles/invitation-animations.css";
import "@/styles/opening-animations.css";
import { entranceAnimationTypes, entranceAnimationStyles, EntranceAnimationStyle } from "@/data/openingAnimations";

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
  animationType: string; // matches id in entranceAnimationTypes
  initials: string;
  brideName?: string;
  groomName?: string;
  eventDate?: string;
  onComplete?: () => void;
  // Backward compatibility:
  envelopeStyle?: string; // used as animationStyle if passed
  animationStyle?: string; // matches id in entranceAnimationStyles
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

function parseLegacyAnimation(animationVal: string, styleVal: string) {
  let type = "envelope";
  let style = styleVal || "black-gold-premium";

  const val = (animationVal || "").toLowerCase();
  
  const validTypes = ["envelope", "curtain", "door", "gardenGate", "book", "luxuryBox", "treasureChest", "glass", "mirror", "cinematicZoom", "spotlight", "starryNight", "minimalFade", "royalHall", "elevator"];
  if (validTypes.includes(animationVal)) {
    return { type: animationVal, style };
  }

  if (val.includes("envelope") || val.includes("zarf")) type = "envelope";
  else if (val.includes("curtain") || val.includes("perde")) type = "curtain";
  else if (val.includes("door") || val.includes("kapı")) type = "door";
  else if (val.includes("garden") || val.includes("bahçe")) type = "gardenGate";
  else if (val.includes("book") || val.includes("kitap")) type = "book";
  else if (val.includes("box") || val.includes("kutu")) type = "luxuryBox";
  else if (val.includes("chest") || val.includes("sandık")) type = "treasureChest";
  else if (val.includes("glass") || val.includes("cam")) type = "glass";
  else if (val.includes("mirror") || val.includes("ayna")) type = "mirror";
  else if (val.includes("zoom") || val.includes("yakınlaşma")) type = "cinematicZoom";
  else if (val.includes("spotlight") || val.includes("ışığı")) type = "spotlight";
  else if (val.includes("star") || val.includes("yıldız")) type = "starryNight";
  else if (val.includes("hall") || val.includes("salon") || val.includes("koridor")) type = "royalHall";
  else if (val.includes("elevator") || val.includes("asansör")) type = "elevator";
  else if (val.includes("fade") || val.includes("sade")) type = "minimalFade";

  if (val.includes("gold") || val.includes("altın")) {
    if (val.includes("black") || val.includes("siyah")) style = "black-gold-premium";
    else if (val.includes("rose")) style = "rose-gold-romantic";
    else if (val.includes("navy") || val.includes("lacivert")) style = "navy-gold";
    else if (val.includes("champagne") || val.includes("şampanya")) style = "champagne-gold";
    else if (val.includes("marble") || val.includes("mermer")) style = "marble-gold";
    else style = "champagne-gold";
  } else if (val.includes("burgundy") || val.includes("bordo")) {
    style = "royal-burgundy";
  } else if (val.includes("white") || val.includes("beyaz")) {
    style = "minimal-white";
  } else if (val.includes("boho") || val.includes("kraft") || val.includes("rustic")) {
    style = "bohemian-garden";
  } else if (val.includes("floral") || val.includes("çiçek")) {
    style = "pastel-floral";
  } else if (val.includes("glass") || val.includes("modern")) {
    style = "glass-modern";
  }

  return { type, style };
}

export function EntranceAnimation({
  animationType,
  initials,
  brideName = "Gelin",
  groomName = "Damat",
  eventDate,
  onComplete,
  envelopeStyle,
  animationStyle,
}: EntranceAnimationProps) {
  const [opened, setOpened] = useState(false);
  
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const { type, style } = parseLegacyAnimation(animationType, animationStyle || envelopeStyle || "");

  const typeConfig = entranceAnimationTypes.find((t) => t.id === type) || entranceAnimationTypes[0];
  const styleConfig: EntranceAnimationStyle = entranceAnimationStyles.find((s) => s.id === style) || entranceAnimationStyles[0];

  useEffect(() => {
    setOpened(false);
    let autoOpenTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    // Auto-open after 2.2 seconds if they don't click manually
    autoOpenTimer = setTimeout(() => {
      setOpened(true);
      if (onCompleteRef.current) {
        completeTimer = setTimeout(() => {
          onCompleteRef.current?.();
        }, 4000); // 4 seconds duration
      }
    }, 2200);

    return () => {
      clearTimeout(autoOpenTimer);
      clearTimeout(completeTimer);
    };
  }, [animationType, style]);

  const handleManualOpen = () => {
    if (opened) return;
    setOpened(true);
    if (onCompleteRef.current) {
      setTimeout(() => {
        onCompleteRef.current?.();
      }, 4000);
    }
  };

  // Extract particle details from effects list
  const hasRosePetals = styleConfig.effects.includes("rosePetals");
  const hasGoldParticles =
    styleConfig.effects.includes("goldParticles") ||
    styleConfig.effects.includes("goldDust") ||
    styleConfig.effects.includes("sparkleDust");
  const hasPearlParticles =
    styleConfig.effects.includes("pearlLight") ||
    styleConfig.effects.includes("pearlParticles");

  // Choose display text helper
  const getPromptText = () => {
    switch (typeConfig.id) {
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

  const renderFamily = () => {
    const commonProps = {
      opened,
      initials,
      brideName,
      groomName,
      eventDate,
      styleConfig,
    };

    switch (typeConfig.id) {
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
      case "minimalFade":
      default:
        return <MinimalFadeOpening {...commonProps} />;
    }
  };

  return (
    <div 
      className="opening-stage-container overflow-hidden w-full h-full relative"
      style={{ backgroundColor: styleConfig.palette.background }}
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
