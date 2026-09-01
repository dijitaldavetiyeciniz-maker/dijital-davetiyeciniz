'use client';
import React, { useEffect, useState, useRef, useCallback } from "react";
import "@/styles/invitation-animations.css";
import "@/styles/opening-animations.css";
import { entranceAnimationTypes, entranceAnimationStyles, EntranceAnimationStyle } from "@/data/openingAnimations";
import { getOpeningSemanticData } from "@/data/eventTypeConfig";
import BackgroundAnimation from "@/components/BackgroundAnimation";

// Dynamic Opening Animation Registry (0 static imports for high-performance lazy loading)
import { dynamicOpeningRegistry } from "./openings/dynamicRegistry";

type EntranceAnimationProps = {
  animationType: string; // matches id in entranceAnimationTypes
  initials: string;
  brideName?: string;
  groomName?: string;
  eventDate?: string;
  eventType?: string;
  onComplete?: () => void;
  // Backward compatibility:
  envelopeStyle?: string; // used as animationStyle if passed
  animationStyle?: string; // matches id in entranceAnimationStyles
  sealStyle?: string;
  sealType?: string;
  backgroundAnimation?: string;
  backgroundDesign?: string;
  wedding?: any;
};

// Guvenlik agi: 17 ozel acilis bilesenden BIRINDE bir render hatasi
// olursa (ornegin eksik/beklenmedik bir veri yuzunden), React'in
// varsayilan davranisi TUM SAYFAYI beyaz/bos birakmaktir - misafir
// hicbir sey goremez, hicbir yere tiklayamaz, tamamen sikismis kalir.
// Bu boundary, hatayi yakalayip konsola loglar VE otomatik olarak
// onComplete() cagirip kullaniciyi DOGRUDAN davetiyeye gecirir -
// acilis animasyonu olmadan da olsa, misafir asla bos ekranda kalmaz.
class OpeningErrorBoundary extends React.Component<
  { onError: () => void; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { onError: () => void; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[EntranceAnimation] Açılış animasyonu hata verdi, davetiyeye doğrudan geçiliyor:', error, info);
    this.props.onError();
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

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

function CinematicTextOpening({ opened, initials, eventDate }: any) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? 'opacity-0 scale-110 blur-xl pointer-events-none' : 'opacity-100 scale-100 blur-0'}`}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none">
        <h1 className="text-5xl md:text-7xl font-serif text-white/90 drop-shadow-2xl">{initials}</h1>
        <p className="text-sm tracking-[0.3em] uppercase text-white/50" suppressHydrationWarning>{eventDate || 'YAKINDA'}</p>
      </div>
    </div>
  );
}

function PhotoCoverOpening({ opened, initials, eventDate }: any) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? 'opacity-0 scale-110 blur-xl pointer-events-none' : 'opacity-100 scale-100 blur-0'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none" />
      <div className="relative z-10 text-center space-y-6 pointer-events-none">
        <h1 className="text-5xl md:text-7xl font-serif text-white/90 drop-shadow-2xl">{initials}</h1>
        <p className="text-sm tracking-[0.3em] uppercase text-white/70" suppressHydrationWarning>{eventDate || 'YAKINDA'}</p>
      </div>
    </div>
  );
}

function SealOnlyOpening({ opened, initials }: any) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 z-50 ${opened ? 'opacity-0 scale-150 blur-xl pointer-events-none' : 'opacity-100 scale-100 blur-0'}`}>
      <div className="relative z-10 hover:scale-110 transition-transform duration-500 cursor-pointer drop-shadow-2xl pointer-events-auto">
         <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-red-800 to-red-950 border-4 border-yellow-600/40 shadow-2xl">
           <span className="text-4xl text-yellow-500/90 font-serif">{initials || 'M'}</span>
         </div>
      </div>
    </div>
  );
}

function parseLegacyAnimation(animationVal: string, styleVal: string) {
  let type = "envelope";
  let style = styleVal || "black-gold-premium";

  const val = (animationVal || "").toLowerCase();
  
  const validTypes = [
    "envelope", "curtain", "door", "gardenGate", "book", "luxuryBox", 
    "treasureChest", "glass", "mirror", "cinematicZoom", "spotlight", 
    "starryNight", "minimalFade", "royalHall", "elevator", "cinematicText", 
    "photoCover", "sealOnly", "cloudBaloon", "teddyBear", "cinematicFilm", 
    "royalParchment", "botanicalBlossom", "hennaVelvetGate", "nazarDome",
    "parisianBlackTie", "grandOpera", "moonlitGarden", "vogueEditorial", 
    "mediterraneanCeramic", "ottomanIllumination", "coastalSunset", 
    "auroraGlass", "botanicalWatercolor", "filmPremiere", "swissGallery", 
    "royalPalace", "hennaPalace", "princeCeremony", "storybook", "futureSummit",
    "wax-seal-starfield", "waxSealStarfield", "none",
    "cinematic-car-journey", "celestial-eclipse", "golden-constellation",
    "art-deco-doors", "silk-fabric-reveal", "luxury-jewelry-box",
    "ocean-pearl-reveal", "minimal-architectural-lines", "ottoman-elegance",
    "lantern-night"
  ];
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
  else if (val.includes("cinematictext") || val.includes("sinematik") || (val.includes("cinematic") && !val.includes("zoom"))) type = "cinematicText";
  else if (val.includes("zoom") || val.includes("yakınlaşma")) type = "cinematicZoom";
  else if (val.includes("spotlight") || val.includes("ışığı")) type = "spotlight";
  else if (val.includes("star") || val.includes("yıldız")) type = "starryNight";
  else if (val.includes("hall") || val.includes("salon") || val.includes("koridor")) type = "royalHall";
  else if (val.includes("elevator") || val.includes("asansör")) type = "elevator";
  else if (val.includes("fade") || val.includes("sade")) type = "minimalFade";
  else if (val.includes("photo") || val.includes("foto")) type = "photoCover";
  else if (val.includes("sealonly") || val.includes("mühür")) type = "sealOnly";

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

function getInvitationIntroText(eventType?: string) {
  switch (eventType) {
    case "Düğün":
      return "Düğünümüze Davetlisiniz";
    case "Nişan":
      return "Nişanımıza Davetlisiniz";
    case "Kına":
      return "Kınamıza Davetlisiniz";
    case "Söz":
      return "Söz Törenimize Davetlisiniz";
    case "Nikah":
      return "Nikahımıza Davetlisiniz";
    case "Baby Shower":
      return "Baby Shower Davetimize Davetlisiniz";
    case "Doğum Günü":
      return "Doğum Günümüze Davetlisiniz";
    case "Kurumsal Etkinlik":
      return "Etkinliğimize Davetlisiniz";
    case "Açılış / Lansman":
      return "Açılışımıza Davetlisiniz";
    default:
      return "Davetimize Davetlisiniz";
  }
}

function EntranceAnimation({
  animationType,
  initials,
  brideName = "Gelin",
  groomName = "Damat",
  eventDate,
  eventType,
  onComplete,
  envelopeStyle,
  animationStyle,
  sealStyle,
  sealType,
  backgroundAnimation,
  backgroundDesign,
  wedding,
}: EntranceAnimationProps) {
  const [animationState, setAnimationState] = useState<'playing' | 'completed-awaiting-interaction' | 'opened'>('playing');
  const [doorOpened, setDoorOpened] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const onCompleteRef = useRef(onComplete);
  const openedRef = useRef(false);

  const semanticData = wedding ? getOpeningSemanticData(wedding) : {
    primaryName: brideName,
    secondaryName: groomName,
    eventTitle: getInvitationIntroText(eventType),
    eventDate: eventDate,
    monogram: initials,
  };

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const { type, style } = parseLegacyAnimation(animationType, animationStyle || envelopeStyle || "");

  const typeConfig = entranceAnimationTypes.find((t) => t.id === type) || { id: type };
  const styleConfig: EntranceAnimationStyle = entranceAnimationStyles.find((s) => s.id === style) || entranceAnimationStyles[0];

  // True for curtain-type animations which have a 2-phase flow:
  // Phase 1: curtain opens → door revealed (closed)
  // Phase 2: user taps → door opens → onComplete
  const isCurtainType = typeConfig.id === 'curtain';

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState(prev => prev === 'opened' ? 'opened' : 'completed-awaiting-interaction');
    }, 2800); // Wait 2.8s for main animation

    return () => clearTimeout(timer);
  }, [animationType, style]);

  const openOnce = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    
    // Play music once here if not already playing?
    // We rely on BackgroundMusic to do that via isEnvelopeOpened prop 
    // which is mapped to !showEntrance in WeddingClientWrapper, 
    // but wait! BackgroundMusic might need to start inside openOnce if it's rendered inside?
    // Let's stick to state updates.

    if (isCurtainType && !doorOpened) {
      setDoorOpened(true);
      setTimeout(() => {
        setAnimationState('opened');
        setIsFadingOut(true);
        setTimeout(() => {
          if (onCompleteRef.current) onCompleteRef.current();
        }, 300); // snappy fade out
      }, 1200);
    } else {
      setAnimationState('opened');
      setIsFadingOut(true);
      setTimeout(() => {
        if (onCompleteRef.current) onCompleteRef.current();
      }, 300); // snappy fade out
    }
  }, [doorOpened, isCurtainType]);

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
      case "cinematicText":
      case "photoCover":
      case "sealOnly":
        return "✨ İÇERİ GİRMEK İÇİN DOKUNUN ✨";
      case "cloudBaloon":
        return "☁️ BULUTA DOKUNUN ☁️";
      case "teddyBear":
        return "🧸 AYICIĞA DOKUNUN 🧸";
      case "cinematicFilm":
        return "🎬 SİNEMAYI BAŞLATMAK İÇİN DOKUNUN 🎬";
      case "royalParchment":
        return "📜 KRALİYET MÜHRÜNÜ AÇMAK İÇİN DOKUNUN 📜";
      case "botanicalBlossom":
        return "🌿 BAHÇE KAPISINI AÇMAK İÇİN DOKUNUN 🌿";
      case "hennaVelvetGate":
        return "🍷 KINA GECESİNİ AÇMAK İÇİN DOKUNUN 🍷";
      case "nazarDome":
        return "🧿 MAŞALLAH ROZETİNE DOKUNUN 🧿";
      default:
        return "✨ DEVAM ETMEK İÇİN DOKUNUN ✨";
    }
  };

  const renderFamily = () => {
    if (typeConfig.id === 'none') {
      return null;
    }

    const commonProps = {
      opened: animationState === 'opened' || animationState === 'completed-awaiting-interaction' || isFadingOut, 
      animationState,
      initials,
      brideName: brideName || '',
      groomName: groomName || '',
      eventDate,
      styleConfig,
      customSealStyle: sealStyle,
      customSealType: sealType,
      introText: getInvitationIntroText(eventType),
      wedding,
      semanticData,
      doorOpened,
    };

    if (typeConfig.id === 'cinematicText') {
      return <CinematicTextOpening {...commonProps} />;
    }
    if (typeConfig.id === 'photoCover') {
      return <PhotoCoverOpening {...commonProps} />;
    }
    if (typeConfig.id === 'sealOnly') {
      return <SealOnlyOpening {...commonProps} />;
    }

    const DynamicComponent = dynamicOpeningRegistry[typeConfig.id] || dynamicOpeningRegistry.minimalFade;
    if (DynamicComponent) {
      return <DynamicComponent {...commonProps} />;
    }

    return null;
  };

  return (
    <div 
      data-testid="opening-overlay"
      data-opening-state={animationState}
      role="button"
      tabIndex={0}
      className={`opening-stage-container overflow-hidden fixed inset-0 z-[9999] cursor-pointer transition-opacity duration-300 ${isFadingOut || animationState === 'opened' ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
      style={{ backgroundColor: styleConfig.palette.background }}
      onClick={(e) => {
        if (animationState === 'opened') return;
        openOnce();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openOnce();
        }
      }}
      aria-label="Davetiyeyi açmak için dokununuz"
    >
      {/* Render selected family layout */}
      <OpeningErrorBoundary onError={openOnce}>
        {renderFamily()}
      </OpeningErrorBoundary>

      {/* Render Particles */}
      <BackgroundAnimation type={backgroundAnimation || ""} />

      {/* "Davetiyeyi Aç" Text Overlay */}
      <div 
        className={`absolute bottom-8 left-0 right-0 z-[60] flex flex-col items-center px-6 pointer-events-none transition-opacity duration-1000 ${animationState === 'completed-awaiting-interaction' ? 'opacity-100' : 'opacity-0'}`}
        style={{ bottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        <p className="text-white/70 text-sm tracking-widest uppercase animate-pulse text-center drop-shadow-md">
          {getPromptText()}
        </p>
      </div>
    </div>
  );
}
export default EntranceAnimation;
