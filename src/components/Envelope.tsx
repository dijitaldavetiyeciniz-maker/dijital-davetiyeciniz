'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Crown, Leaf } from 'lucide-react';
import { getBackgroundStyle } from '@/lib/backgrounds';
import BackgroundMusic from './BackgroundMusic';
import BackgroundParticles from './BackgroundParticles';

interface EnvelopeProps {
  children: React.ReactNode;
  brideName: string;
  groomName: string;
  primaryColor?: string;
  envelopeColor?: string;
  envelopeBgColor?: string;
  envelopeFlapType?: string;
  sealType?: string;
  sealColor?: string;
  entranceType?: string;
  fontFamily?: string;
  musicUrl?: string | null;
  musicAutoplay?: boolean;
  backgroundAnimation?: string;
}

export default function Envelope({ 
  children, 
  brideName, 
  groomName, 
  primaryColor = '#9f1239', 
  envelopeColor = '#e6d5c3',
  envelopeBgColor = 'solid-ivory',
  envelopeFlapType = 'triangle',
  sealType = 'sparkles',
  sealColor,
  entranceType = 'envelope',
  fontFamily = 'Montserrat',
  musicUrl,
  musicAutoplay = true,
  backgroundAnimation = 'none'
}: EnvelopeProps) {
  const [isOpened, setIsOpened] = useState(() => {
    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');
    if (isPreview && typeof window !== 'undefined' && window.sessionStorage.getItem('preview_envelope_opened') === 'true') {
      return true;
    }
    return false;
  });
  const [showContent, setShowContent] = useState(() => {
    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');
    if (isPreview && typeof window !== 'undefined' && window.sessionStorage.getItem('preview_envelope_opened') === 'true') {
      return true;
    }
    return false;
  });
  const [ribbonUntied, setRibbonUntied] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isShattered, setIsShattered] = useState(false);
  // Royal Seal Premium phase states (0=waiting, 1=seal glow, 2=ribbon untie, 3=flap open, 4=card rise, 5=names appear)
  const [royalPhase, setRoyalPhase] = useState(0);

  const handleOpen = () => {
    // Play music immediately on user click to bypass browser autoplay restrictions
    if (typeof document !== 'undefined') {
      const audio = document.getElementById('bg-audio') as HTMLAudioElement;
      if (audio) {
        audio.play().catch(err => console.log('Autoplay play error:', err));
      }
    }

    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');
    
    if (entranceType === 'ribbon' && !ribbonUntied) {
      setRibbonUntied(true);
      setTimeout(() => {
        setIsOpened(true);
        if (isPreview && typeof window !== 'undefined') {
          window.sessionStorage.setItem('preview_envelope_opened', 'true');
        }
        setTimeout(() => {
          setShowContent(true);
        }, 1500);
      }, 600);
    } else if (entranceType === 'wax-seal-press') {
      setIsPressed(true);
      setTimeout(() => {
        setIsOpened(true);
        if (isPreview && typeof window !== 'undefined') {
          window.sessionStorage.setItem('preview_envelope_opened', 'true');
        }
        setTimeout(() => {
          setShowContent(true);
        }, 1200);
      }, 1000);
    } else if (entranceType === 'glass-shatter') {
      setIsShattered(true);
      if (isPreview && typeof window !== 'undefined') {
        window.sessionStorage.setItem('preview_envelope_opened', 'true');
      }
      setTimeout(() => {
        setShowContent(true);
      }, 800);
    } else if (entranceType === 'royal-seal-premium') {
      // 5-phase royal sequence
      if (isPreview && typeof window !== 'undefined') {
        window.sessionStorage.setItem('preview_envelope_opened', 'true');
      }
      setRoyalPhase(1); // Seal glow
      setTimeout(() => setRoyalPhase(2), 1800); // Ribbon untie
      setTimeout(() => {
        setRoyalPhase(3); // Flap open
        setIsOpened(true);
      }, 3200);
      setTimeout(() => setRoyalPhase(4), 4800); // Card rise + gold dust
      setTimeout(() => setRoyalPhase(5), 6000); // Names cinematic reveal
      setTimeout(() => setShowContent(true), 7500); // Full content
    } else {
      setIsOpened(true);
      if (isPreview && typeof window !== 'undefined') {
        window.sessionStorage.setItem('preview_envelope_opened', 'true');
      }
      const delay = entranceType === 'card' || entranceType === 'flower-bloom' ? 800 : entranceType === 'heart-fade' ? 1000 : 1500;
      setTimeout(() => {
        setShowContent(true);
      }, delay);
    }
  };

  // Dynamic Google Font Injection
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap`;

  // Get initials for Monogram
  const brideInitial = brideName ? brideName.trim().charAt(0).toUpperCase() : 'G';
  const groomInitial = groomName ? groomName.trim().charAt(0).toUpperCase() : 'D';
  const monogramText = `${brideInitial} & ${groomInitial}`;

  // Get shared background styles from helper
  const bgStyle = getBackgroundStyle(envelopeBgColor);

  // Wax seal rendering icon/component
  let currentSealColor = sealColor || primaryColor;
  let sealIcon = <Sparkles className="w-6 h-6 text-white/80" />;
  let sealBgStyle: React.CSSProperties = {};

  // For preset metallic wax colors:
  if (sealType === 'gold') {
    currentSealColor = '#d4af37';
    sealBgStyle = {
      background: 'radial-gradient(circle, #f5e0a3 0%, #d4af37 60%, #aa7c11 100%)',
      boxShadow: 'inset 0 0 10px rgba(255,255,255,0.7), 0 4px 10px rgba(0,0,0,0.35)'
    };
  } else if (sealType === 'silver') {
    currentSealColor = '#c0c0c0';
    sealBgStyle = {
      background: 'radial-gradient(circle, #f0f0f0 0%, #c0c0c0 60%, #8c8c8c 100%)',
      boxShadow: 'inset 0 0 10px rgba(255,255,255,0.7), 0 4px 10px rgba(0,0,0,0.35)'
    };
  } else if (sealType === 'rose-gold') {
    currentSealColor = '#b76e79';
    sealBgStyle = {
      background: 'radial-gradient(circle, #eecbc2 0%, #b76e79 60%, #8c4c54 100%)',
      boxShadow: 'inset 0 0 10px rgba(255,255,255,0.7), 0 4px 10px rgba(0,0,0,0.35)'
    };
  } else if (sealType === 'burgundy' || sealType === 'bordo-wax') {
    currentSealColor = '#600519';
    sealBgStyle = {
      background: 'radial-gradient(circle, #991b1b 0%, #600519 75%, #450a0a 100%)',
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.35)'
    };
  }

  switch (sealType) {
    case 'gold':
      sealIcon = <Crown className="w-6 h-6 text-white/95 filter drop-shadow" />;
      break;
    case 'silver':
      sealIcon = <Sparkles className="w-6 h-6 text-white/95 filter drop-shadow" />;
      break;
    case 'rose-gold':
      sealIcon = <Heart className="w-6 h-6 text-white/95 fill-white/15 filter drop-shadow" />;
      break;
    case 'burgundy':
    case 'bordo-wax':
      sealIcon = (
        <svg className="w-7 h-7 text-white/95 filter drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
        </svg>
      );
      break;
    case 'monogram':
    case 'double-initials':
      sealIcon = (
        <span className="font-serif text-white/95 font-bold text-xs tracking-wider md:text-sm select-none filter drop-shadow">
          {monogramText}
        </span>
      );
      break;
    case 'minimal-monogram':
      sealIcon = (
        <span className="font-sans text-white/95 font-light text-sm tracking-widest select-none filter drop-shadow">
          {brideInitial}{groomInitial}
        </span>
      );
      break;
    case 'heart':
    case 'heart-icon':
      sealIcon = <Heart className="w-6 h-6 text-white/90 fill-white/20 filter drop-shadow" />;
      break;
    case 'ring':
    case 'ring-icon':
      sealIcon = (
        <svg className="w-7 h-7 text-white/95 filter drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="8.5" cy="12" r="4.5" />
          <circle cx="15.5" cy="12" r="4.5" />
        </svg>
      );
      break;
    case 'flower':
    case 'flower-icon':
      sealIcon = (
        <svg className="w-7 h-7 text-white/95 filter drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      );
      break;
    case 'royal-crest':
    case 'crown':
      sealIcon = <Crown className="w-6 h-6 text-white/95 filter drop-shadow" />;
      break;
  }

  const getEnvelopeStyle = (colorOrPreset: string): { body: React.CSSProperties, flap: React.CSSProperties, extraBody?: React.ReactNode, extraFlap?: React.ReactNode } => {
    const isHex = colorOrPreset && colorOrPreset.startsWith('#');
    const type = isHex ? 'classic' : colorOrPreset;
    const fallbackColor = isHex ? colorOrPreset : '#e6d5c3';

    switch (type) {
      case 'gold-edge':
        return {
          body: { backgroundColor: '#1e293b', border: '3px solid #d4af37' },
          flap: { backgroundColor: '#1e293b', borderBottom: '3px solid #d4af37' },
          extraBody: <div className="absolute inset-2 border border-[#d4af37]/40 pointer-events-none" />,
          extraFlap: <div className="absolute inset-1 border-b border-[#d4af37]/40 pointer-events-none" />
        };
      case 'marble-texture':
        return {
          body: { 
            backgroundImage: 'url(/backgrounds/marble-gold-light.png)',
            backgroundSize: 'cover',
            backgroundColor: '#fafafa'
          },
          flap: { 
            backgroundImage: 'url(/backgrounds/marble-gold-light.png)',
            backgroundSize: 'cover',
            backgroundColor: '#fafafa'
          }
        };
      case 'minimal-white':
        return {
          body: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0' },
          flap: { backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }
        };
      case 'black-premium':
        return {
          body: { backgroundColor: '#111111', border: '1px solid #333333' },
          flap: { backgroundColor: '#111111', borderBottom: '1px solid #333333' },
          extraBody: <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        };
      case 'kraft-natural':
        return {
          body: { backgroundColor: '#cbb593', backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 100%)' },
          flap: { backgroundColor: '#cbb593' }
        };
      case 'romantic-flowers':
        return {
          body: { 
            backgroundColor: '#fff1f2',
            backgroundImage: 'radial-gradient(rgba(244,63,94,0.1) 1px, transparent 0), radial-gradient(rgba(244,63,94,0.1) 1px, transparent 0)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px'
          },
          flap: { 
            backgroundColor: '#fff1f2',
            backgroundImage: 'radial-gradient(rgba(244,63,94,0.1) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }
        };
      case 'velvet-burgundy':
        return {
          body: { backgroundColor: '#5c0618', backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.2) 100%)' },
          flap: { backgroundColor: '#5c0618' }
        };
      case 'glass-effect':
        return {
          body: { backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)' },
          flap: { backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.25)' }
        };
      case 'modern-gradient':
        return {
          body: { backgroundImage: 'linear-gradient(135deg, #f43f5e 0%, #6366f1 100%)' },
          flap: { backgroundImage: 'linear-gradient(135deg, #f43f5e 0%, #6366f1 100%)' }
        };
      case 'classic':
      default:
        return {
          body: { backgroundColor: fallbackColor },
          flap: { backgroundColor: fallbackColor }
        };
    }
  };

  // 1. ANIMATION: ENVELOPE (Zarf)
  const renderEnvelope = (hasRibbon = false) => {
    const envStyle = getEnvelopeStyle(envelopeColor);
    let flapStyle: React.CSSProperties = { ...envStyle.flap };
    let flapClass = 'absolute top-0 left-0 right-0 origin-top z-20 drop-shadow-xl';

    // 9 envelope flap shapes:
    switch (envelopeFlapType) {
      case 'rounded':
        flapStyle = { 
          ...flapStyle, 
          height: '55%', 
          borderRadius: '0 0 180px 180px / 0 0 100px 100px', 
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        };
        break;
      case 'square':
        flapStyle = { 
          ...flapStyle, 
          height: '45%', 
          borderRadius: '0 0 8px 8px', 
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        };
        break;
      case 'trapezoid':
        flapStyle = { 
          ...flapStyle, 
          height: '45%', 
          clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        };
        break;
      case 'asymmetric':
        flapStyle = { 
          ...flapStyle, 
          height: '60%', 
          clipPath: 'polygon(0 0, 100% 0, 75% 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        };
        break;
      case 'wavy':
        flapStyle = { 
          ...flapStyle, 
          height: '50%', 
          clipPath: 'polygon(0 0, 100% 0, 100% 70%, 85% 100%, 70% 70%, 50% 100%, 30% 70%, 15% 100%, 0 70%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        };
        break;
      case 'pointed-oval':
        flapStyle = { 
          ...flapStyle, 
          height: '58%', 
          borderRadius: '0 0 50% 50% / 0 0 100% 100%',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        };
        break;
      case 'double-curve':
        flapStyle = { 
          ...flapStyle, 
          height: '50%', 
          clipPath: 'polygon(0 0, 100% 0, 100% 50%, 80% 90%, 50% 60%, 20% 90%, 0 50%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        };
        break;
      case 'heart':
        flapStyle = { 
          ...flapStyle, 
          height: '55%', 
          clipPath: 'polygon(0 0, 100% 0, 100% 30%, 75% 70%, 50% 100%, 25% 70%, 0 30%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        };
        break;
      default: // triangle
        flapStyle = { 
          ...flapStyle, 
          height: '100%', 
          clipPath: 'polygon(0 0, 50% 55%, 100% 0)',
          borderTop: '1px solid rgba(255,255,255,0.5)'
        };
        break;
    }

    return (
      <motion.div 
        className="relative w-[340px] h-[240px] md:w-[500px] md:h-[350px] cursor-pointer perspective-1000"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
        transition={{ duration: 1, ease: "easeOut" }}
        onClick={(!isOpened && (!hasRibbon || ribbonUntied)) ? handleOpen : (hasRibbon && !ribbonUntied) ? handleOpen : undefined}
      >
        <div className="absolute inset-0 rounded-sm shadow-2xl overflow-hidden border border-black/10" style={envStyle.body}>
          {envStyle.extraBody}
          <motion.div 
            className="absolute inset-4 bg-white rounded-sm shadow-inner flex flex-col items-center justify-center p-4 border border-slate-100"
            initial={{ y: 20 }}
            animate={isOpened ? { y: -100 } : { y: 20 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
          >
            <div className="text-center">
              <div className="text-xl md:text-3xl text-slate-800 mb-2" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>{brideName} & {groomName}</div>
              <div className="w-16 h-[1px] bg-rose-300 mx-auto mb-2"></div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Davetiyeniz</div>
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom right, transparent 49%, rgba(0,0,0,0.05) 50%)', clipPath: 'polygon(0 0, 50% 55%, 0 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom left, transparent 49%, rgba(0,0,0,0.1) 50%)', clipPath: 'polygon(100% 0, 50% 55%, 100% 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(255,255,255,0.08)', clipPath: 'polygon(0 100%, 50% 55%, 100% 100%)' }} />

        <motion.div className={flapClass} style={flapStyle} initial={{ rotateX: 0 }} animate={isOpened ? { rotateX: 180 } : { rotateX: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
          {envStyle.extraFlap}
        </motion.div>

        {/* Ribbon layer */}
        {hasRibbon && (
          <>
            <motion.div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-8 z-25 pointer-events-none" 
              style={{ width: '50%', backgroundColor: currentSealColor, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
              animate={ribbonUntied ? { x: -200, opacity: 0 } : { x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeIn" }}
            />
            <motion.div 
              className="absolute right-0 top-1/2 -translate-y-1/2 h-8 z-25 pointer-events-none" 
              style={{ width: '50%', backgroundColor: currentSealColor, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
              animate={ribbonUntied ? { x: 200, opacity: 0 } : { x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeIn" }}
            />
          </>
        )}

        <motion.div 
          className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg cursor-pointer border-2"
          style={{ backgroundColor: currentSealColor, borderColor: 'rgba(255,255,255,0.2)', boxShadow: 'inset 0 0 12px rgba(0,0,0,0.6), 0 5px 15px rgba(0,0,0,0.4)', ...sealBgStyle }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 1, scale: 1 }}
          animate={isOpened ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border flex items-center justify-center" style={{ borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(0,0,0,0.15)' }}>
            {sealIcon}
          </div>
          <div className="absolute -bottom-6 w-32 text-center text-white/50 text-[10px] font-semibold tracking-widest uppercase">
            {hasRibbon && !ribbonUntied ? 'Kurdeleyi Çöz' : 'Dokun ve Aç'}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // 2. ANIMATION: BOX
  const renderBox = () => {
    const envStyle = getEnvelopeStyle(envelopeColor);
    return (
      <motion.div 
        className="relative w-[340px] h-[340px] md:w-[450px] md:h-[450px] cursor-pointer"
        initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        transition={{ duration: 1, ease: "easeOut" }}
        onClick={!isOpened ? handleOpen : undefined}
      >
        <div className="absolute inset-4 bg-[#fbfaf8] border-8 border-[#dfc384] shadow-2xl rounded-lg flex flex-col items-center justify-center p-6 text-center">
          <div className="w-full h-full border border-[#dfc384]/30 flex flex-col items-center justify-center p-4">
            <span className="text-amber-600 font-serif tracking-[0.2em] text-xs uppercase mb-2">Özel Davet</span>
            <h2 className="text-2xl md:text-3xl text-slate-800 my-4 leading-relaxed" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>{brideName} & {groomName}</h2>
            <div className="w-12 h-[1px] bg-amber-500 my-2"></div>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase">Düğün Törenimize Davetlisiniz</p>
          </div>
        </div>

        <motion.div 
          className="absolute inset-0 bg-slate-900 border-8 border-slate-950 rounded-lg shadow-2xl flex flex-col items-center justify-center z-20"
          animate={isOpened ? { y: -500, opacity: 0, rotate: -5 } : { y: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          style={{ 
            backgroundImage: envStyle.body.backgroundImage || `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 100%), linear-gradient(135deg, ${envStyle.body.backgroundColor || envelopeColor} 0%, rgba(0,0,0,0.1) 100%)`,
            backgroundColor: envStyle.body.backgroundColor || envelopeColor,
            border: envStyle.body.border || undefined
          }}
        >
          {envStyle.extraBody}
          <div className="absolute inset-3 border border-double border-[#dfc384]/40 rounded-md pointer-events-none" />
          
          <div className="text-center z-10 px-8">
            <Crown className="w-10 h-10 mx-auto mb-4 text-[#dfc384] filter drop-shadow-md" />
            <h3 className="text-xl md:text-2xl tracking-wide mb-1 text-white" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>{brideName.charAt(0) || 'G'} & {groomName.charAt(0) || 'D'}</h3>
            <p className="text-[9px] text-[#dfc384] tracking-[0.3em] uppercase">Kutuyu Açmak İçin Dokunun</p>
          </div>

          <div 
            className="absolute -bottom-6 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border shadow-lg cursor-pointer"
            style={{ backgroundColor: currentSealColor, borderColor: 'rgba(255,255,255,0.2)', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)', ...sealBgStyle }}
          >
            {sealIcon}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // 3. ANIMATION: CURTAIN (Implementation moved below)

  // 4. ANIMATION: GATE
  const renderGate = () => {
    const envStyle = getEnvelopeStyle(envelopeColor);
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center perspective-2000 cursor-pointer overflow-hidden" 
        onClick={!isOpened ? handleOpen : undefined}
      >
        <motion.div 
          className="w-1/2 h-full bg-[#1b212c] border-r-4 border-[#dfc384] relative z-20 shadow-2xl flex items-center justify-end"
          style={{
            originX: 0,
            backgroundImage: envStyle.body.backgroundImage || `radial-gradient(circle at 100% 50%, rgba(255,255,255,0.02) 0%, transparent 100%), linear-gradient(135deg, ${envStyle.body.backgroundColor || envelopeColor} 0%, rgba(0,0,0,0.2) 100%)`,
            backgroundColor: envStyle.body.backgroundColor || envelopeColor,
            border: envStyle.body.border || undefined
          }}
          animate={isOpened ? { rotateY: -105, opacity: 0 } : { rotateY: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.6, 0.01, -0.05, 0.95] }}
        >
          {envStyle.extraBody}
          <div className="absolute inset-6 border border-[#dfc384]/30 rounded-l-2xl pointer-events-none" />
          <div className="absolute inset-10 border-2 border-double border-[#dfc384]/20 rounded-l-xl pointer-events-none" />
          <div className="mr-6 text-right select-none opacity-40">
            <span className="text-2xl font-serif block text-[#dfc384]">{brideInitial}</span>
          </div>
        </motion.div>

        <motion.div 
          className="w-1/2 h-full bg-[#1b212c] border-l-4 border-[#dfc384] relative z-20 shadow-2xl flex items-center justify-start"
          style={{
            originX: 1,
            backgroundImage: envStyle.body.backgroundImage || `radial-gradient(circle at 0% 50%, rgba(255,255,255,0.02) 0%, transparent 100%), linear-gradient(225deg, ${envStyle.body.backgroundColor || envelopeColor} 0%, rgba(0,0,0,0.2) 100%)`,
            backgroundColor: envStyle.body.backgroundColor || envelopeColor,
            border: envStyle.body.border || undefined
          }}
          animate={isOpened ? { rotateY: 105, opacity: 0 } : { rotateY: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.6, 0.01, -0.05, 0.95] }}
        >
          {envStyle.extraBody}
          <div className="absolute inset-6 border border-[#dfc384]/30 rounded-r-2xl pointer-events-none" />
          <div className="absolute inset-10 border-2 border-double border-[#dfc384]/20 rounded-r-xl pointer-events-none" />
          <div className="ml-6 text-left select-none opacity-40">
            <span className="text-2xl font-serif block text-[#dfc384]">{groomInitial}</span>
          </div>
        </motion.div>

        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-full border-4 shadow-2xl cursor-pointer"
              exit={{ opacity: 0, scale: 0.5, filter: 'blur(5px)' }}
              transition={{ duration: 0.6 }}
              style={{
                backgroundColor: currentSealColor,
                borderColor: '#dfc384',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.7), 0 5px 25px rgba(0,0,0,0.5)',
                ...sealBgStyle
              }}
            >
              <div className="text-center">
                <Crown className="w-5 h-5 mx-auto text-[#dfc384] mb-1" />
                <span className="text-white text-base md:text-xl font-bold tracking-widest" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>{monogramText}</span>
                <span className="text-[7px] text-[#dfc384] tracking-[0.25em] block uppercase mt-1 font-bold">Kapıyı Aç</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // 5. ANIMATION: CARD
  const renderCard = () => {
    return (
      <motion.div 
        className="w-[340px] md:w-[480px] p-10 bg-white border border-[#dfc384] shadow-2xl rounded-2xl text-center relative cursor-pointer"
        initial={{ y: 150, opacity: 0, scale: 0.95 }}
        animate={isOpened ? { y: -100, opacity: 0, scale: 0.9 } : { y: 0, opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: -200, filter: 'blur(5px)' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        onClick={!isOpened ? handleOpen : undefined}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 40px rgba(223,195,132,0.1)'
        }}
      >
        <div className="absolute inset-3 border border-double border-[#dfc384]/35 rounded-xl pointer-events-none" />
        
        <div className="py-6 px-4">
          <span className="text-[10px] text-amber-600 font-serif tracking-[0.25em] uppercase mb-4 block">Özel Davet</span>
          
          <h2 className="text-3xl md:text-4xl text-slate-800 my-6 font-normal tracking-wide" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>
            {brideName} <span className="text-amber-500 block my-2">&</span> {groomName}
          </h2>
          
          <div className="w-16 h-px bg-amber-500/40 mx-auto my-6"></div>
          
          <p className="text-slate-500 font-light text-sm italic px-6 mb-8">
            En özel günümüze, sevgimize şahitlik etmeye davetlisiniz.
          </p>

          <span 
            className="inline-block px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase text-white rounded-lg shadow-md transition-all hover:scale-105"
            style={{ backgroundColor: currentSealColor, ...sealBgStyle }}
          >
            Giriş Yap
          </span>
        </div>
      </motion.div>
    );
  };

  // 6. ANIMATION: HEART-FADE
  const renderHeartFade = () => {
    return (
      <div className="absolute inset-0 flex items-center justify-center cursor-pointer overflow-hidden z-50 bg-[#0c0a09]" onClick={!isOpened ? handleOpen : undefined}>
        <AnimatePresence>
          {!isOpened ? (
            <motion.div 
              className="flex flex-col items-center relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0, filter: 'blur(12px)' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.div 
                className="w-48 h-48 md:w-60 md:h-60 rounded-full flex flex-col items-center justify-center relative shadow-2xl"
                style={{ 
                  backgroundColor: currentSealColor,
                  boxShadow: `0 0 60px ${currentSealColor}80, inset 0 0 30px rgba(0,0,0,0.5)`,
                  border: '3px solid #dfc384',
                  ...sealBgStyle
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart className="w-12 h-12 text-[#dfc384] mb-2 fill-[#dfc384]/20" />
                <span className="text-white text-lg font-bold tracking-widest" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>{monogramText}</span>
                <span className="text-[8px] text-[#dfc384] tracking-[0.2em] uppercase font-bold mt-2">DOKUN VE GİR</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="absolute inset-0 bg-[#0c0a09] pointer-events-none flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Sparkles className="w-24 h-24 text-[#dfc384] animate-ping" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // 7. ANIMATION: FLOWER-BLOOM
  const renderFlowerBloom = () => {
    return (
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer overflow-hidden z-50 bg-[#faf8f5]"
        onClick={!isOpened ? handleOpen : undefined}
      >
        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              className="text-center p-8 max-w-sm border-2 border-double border-emerald-800/20 rounded-full w-80 h-80 flex flex-col items-center justify-center relative bg-white shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0, rotate: 10, filter: 'blur(8px)' }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute top-2 w-full text-center text-xl opacity-60">🌸 🌺 🌸</div>
              <div className="absolute bottom-2 w-full text-center text-xl opacity-60">🌸 🌺 🌸</div>
              
              <span className="text-emerald-800 font-serif text-[10px] tracking-[0.2em] uppercase mb-4">Gül Bahçesi Davet</span>
              <h2 className="text-2xl text-slate-800 font-normal my-2" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>{monogramText}</h2>
              <div className="w-12 h-px bg-emerald-700/30 my-3"></div>
              <p className="text-[8px] text-slate-400 tracking-widest uppercase font-bold">Davetiyeyi Açmak İçin Dokunun</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderCurtain = () => {
    return (
      <div className="absolute inset-0 flex overflow-hidden cursor-pointer" onClick={!isOpened ? handleOpen : undefined}>
        <motion.div 
          className="w-1/2 h-full bg-[#800020] relative z-20 shadow-2xl flex items-center justify-end"
          animate={isOpened ? { x: '-100%' } : { x: 0 }}
          transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          style={{
            backgroundImage: 'linear-gradient(to right, #4a0012, #800020 70%, #9a0028 95%, #3a000d 100%)',
            boxShadow: '5px 0 25px rgba(0,0,0,0.5)'
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[size:24px_100%] opacity-40 pointer-events-none" />
        </motion.div>

        <motion.div 
          className="w-1/2 h-full bg-[#800020] relative z-20 shadow-2xl flex items-center justify-start"
          animate={isOpened ? { x: '100%' } : { x: 0 }}
          transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          style={{
            backgroundImage: 'linear-gradient(to left, #4a0012, #800020 70%, #9a0028 95%, #3a000d 100%)',
            boxShadow: '-5px 0 25px rgba(0,0,0,0.5)'
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[size:24px_100%] opacity-40 pointer-events-none" />
        </motion.div>

        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <div 
                className="mb-4 px-6 py-2 rounded-full border text-[10px] font-bold tracking-[0.2em] uppercase bg-white/90 shadow-md select-none text-center"
                style={{ borderColor: `${primaryColor}40`, color: '#6b5a3e' }}
              >
                DAVETİYEYİ AÇMAK İÇİN
              </div>
              <div 
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border flex items-center justify-center shadow-2xl relative select-none"
                style={{ 
                  backgroundColor: currentSealColor,
                  borderColor: '#dfc384',
                  borderWidth: '3px',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5), 0 10px 25px rgba(0,0,0,0.3)',
                  ...sealBgStyle
                }}
              >
                <div className="w-14 h-14 md:w-18 md:h-18 rounded-full border flex items-center justify-center" style={{ borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(0,0,0,0.15)' }}>
                  {sealIcon}
                </div>
              </div>
              <div 
                className="mt-4 px-6 py-2 rounded-full border text-[10px] font-bold tracking-[0.2em] uppercase bg-white/90 shadow-md select-none text-center"
                style={{ borderColor: `${primaryColor}40`, color: '#6b5a3e' }}
              >
                BURAYA TIKLAYINIZ.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderWaxSealPress = () => {
    return (
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer overflow-hidden z-50"
        style={bgStyle}
        onClick={!isOpened ? handleOpen : undefined}
      >
        <motion.div 
          className="w-full h-full flex flex-col items-center justify-center text-center relative"
          animate={isOpened ? { y: '-100%', opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
        >
          <div 
            className="mb-4 px-6 py-2 rounded-full border text-[10px] font-bold tracking-[0.2em] uppercase bg-white/90 shadow-md select-none text-center"
            style={{ borderColor: `${primaryColor}40`, color: '#6b5a3e' }}
          >
            DAVETİYEYİ AÇMAK İÇİN
          </div>
          <div 
            className="w-full bg-white/80 backdrop-blur-sm py-8 border-y flex items-center justify-center gap-10 md:gap-14 relative"
            style={{ borderColor: `${primaryColor}20` }}
          >
            <div className="flex items-center gap-1.5 text-2xl font-light opacity-50 select-none" style={{ color: '#c5a870' }}>
              <span>&gt;</span>
              <span>&gt;</span>
              <span>&gt;</span>
            </div>
            <motion.div 
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border flex items-center justify-center shadow-2xl relative select-none"
              style={{ 
                backgroundColor: currentSealColor,
                borderColor: '#dfc384',
                borderWidth: '3px',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5), 0 10px 25px rgba(0,0,0,0.15)',
                ...sealBgStyle
              }}
              animate={isPressed ? { scale: [1, 0.85, 1.05, 1], rotate: [0, 5, -5, 0] } : { scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-full border flex items-center justify-center" style={{ borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(0,0,0,0.15)' }}>
                {sealIcon}
              </div>
            </motion.div>
            <div className="flex items-center gap-1.5 text-2xl font-light opacity-50 select-none" style={{ color: '#c5a870' }}>
              <span>&lt;</span>
              <span>&lt;</span>
              <span>&lt;</span>
            </div>
          </div>
          <div 
            className="mt-4 px-6 py-2 rounded-full border text-[10px] font-bold tracking-[0.2em] uppercase bg-white/90 shadow-md select-none text-center"
            style={{ borderColor: `${primaryColor}40`, color: '#6b5a3e' }}
          >
            BURAYA TIKLAYINIZ.
          </div>
        </motion.div>
      </div>
    );
  };

  // 9. ANIMATION: GLASS-SHATTER
  const renderGlassShatter = () => {
    return (
      <div className="absolute inset-0 flex items-center justify-center cursor-pointer overflow-hidden z-50 bg-slate-900/50">
        <AnimatePresence>
          {!isShattered ? (
            <motion.div 
              className="absolute inset-0 backdrop-blur-2xl bg-white/10 flex flex-col items-center justify-center p-8 text-center"
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(15px)' }}
              transition={{ duration: 0.7 }}
              onClick={handleOpen}
            >
              <div className="absolute inset-8 border border-white/20 rounded-2xl" />
              <div className="z-10 max-w-sm">
                <Sparkles className="w-10 h-10 text-white/80 mx-auto mb-6 animate-pulse" />
                <h1 className="text-3xl text-white font-light tracking-wider" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>{brideName} & {groomName}</h1>
                <div className="w-12 h-px bg-white/20 mx-auto my-6" />
                <p className="text-[9px] text-white/60 tracking-[0.25em] uppercase font-bold">Ekranı Kırmak İçin Dokunun</p>
              </div>
            </motion.div>
          ) : (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-transparent">
              <Sparkles className="w-16 h-16 text-[#dfc384] animate-ping" />
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ==========================================
  // ROYAL SEAL PREMIUM — 5-Phase Cinematic Opening
  // ==========================================
  const renderRoyalSealPremium = () => {
    const goldColor = '#d4af37';
    const phase = royalPhase;
    
    return (
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden z-50 cursor-pointer"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a1208 0%, #0a0805 100%)' }}
        onClick={phase === 0 ? handleOpen : undefined}
      >
        {/* Gold dust particles always visible in royal mode */}
        <BackgroundParticles animationType="gold-dust" primaryColor={goldColor} />

        {/* Phase 0: Initial invitation prompt */}
        <AnimatePresence>
          {phase === 0 && (
            <motion.div
              className="flex flex-col items-center gap-6 text-center px-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-amber-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <p className="text-[10px] tracking-[0.4em] uppercase text-amber-400/60 font-semibold">Özel Davetiyeniz</p>
              <motion.div
                className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 flex items-center justify-center relative"
                style={{
                  borderColor: goldColor,
                  background: `radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(0,0,0,0.8) 100%)`,
                  boxShadow: `0 0 40px ${goldColor}40, inset 0 0 20px rgba(0,0,0,0.6)`,
                  ...sealBgStyle
                }}
                animate={{ boxShadow: [`0 0 20px ${goldColor}30`, `0 0 50px ${goldColor}60`, `0 0 20px ${goldColor}30`] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border flex items-center justify-center" style={{ borderColor: 'rgba(212,175,55,0.3)' }}>
                  {sealIcon}
                </div>
                {/* Rotating ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: `${goldColor}40`, borderStyle: 'dashed' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
              <p className="text-xs text-amber-300/50 tracking-widest uppercase">Dokunun</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 1+: The envelope appears and seal glows */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Envelope body */}
              <motion.div
                className="relative w-[300px] h-[210px] md:w-[460px] md:h-[320px] rounded-sm shadow-2xl"
                style={{
                  backgroundColor: '#1c1208',
                  border: `2px solid ${goldColor}`,
                  boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 40px ${goldColor}20`
                }}
              >
                {/* Inner gold border */}
                <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: `${goldColor}30` }} />

                {/* Envelope flap */}
                <motion.div
                  className="absolute top-0 left-0 right-0 origin-top z-20"
                  style={{
                    height: '55%',
                    clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
                    backgroundColor: '#24180a',
                    borderBottom: `1px solid ${goldColor}60`
                  }}
                  animate={phase >= 3 ? { rotateX: 180, opacity: 0 } : { rotateX: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />

                {/* Names inside envelope (rises up when opened) */}
                <motion.div
                  className="absolute inset-4 bg-[#f5f0e8] flex flex-col items-center justify-center text-center"
                  animate={phase >= 3 ? { y: -180, opacity: 0 } : { y: 20 }}
                  transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
                >
                  <div className="text-slate-800 text-lg md:text-2xl" style={{ fontFamily: `"${fontFamily}", serif` }}>
                    {brideName} & {groomName}
                  </div>
                  <div className="w-12 h-px mx-auto my-2" style={{ backgroundColor: goldColor }} />
                  <div className="text-[9px] text-slate-400 tracking-widest uppercase">Düğün Davetiyesi</div>
                </motion.div>

                {/* Side shadows */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom right, transparent 49%, rgba(0,0,0,0.1) 50%)', clipPath: 'polygon(0 0, 50% 60%, 0 100%)' }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom left, transparent 49%, rgba(0,0,0,0.15) 50%)', clipPath: 'polygon(100% 0, 50% 60%, 100% 100%)' }} />
              </motion.div>

              {/* RIBBON — Phase 1: visible, Phase 2: slides out */}
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-7 z-30 pointer-events-none"
                style={{ width: '50%', background: `linear-gradient(to right, ${goldColor}cc, ${goldColor})`, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                animate={phase >= 2 ? { x: '-110%', opacity: 0 } : { x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeIn' }}
              />
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 h-7 z-30 pointer-events-none"
                style={{ width: '50%', background: `linear-gradient(to left, ${goldColor}cc, ${goldColor})`, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                animate={phase >= 2 ? { x: '110%', opacity: 0 } : { x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeIn' }}
              />

              {/* SEAL — glows in phase 1, fades in phase 2 */}
              <motion.div
                className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2"
                style={{
                  backgroundColor: currentSealColor,
                  borderColor: goldColor,
                  boxShadow: phase >= 1
                    ? `inset 0 0 12px rgba(0,0,0,0.6), 0 5px 15px rgba(0,0,0,0.4), 0 0 30px ${goldColor}80`
                    : 'inset 0 0 12px rgba(0,0,0,0.6), 0 5px 15px rgba(0,0,0,0.4)',
                  ...sealBgStyle
                }}
                animate={phase >= 2
                  ? { opacity: 0, scale: 0, y: -20 }
                  : phase === 1
                    ? { scale: [1, 1.08, 1], boxShadow: [`0 0 20px ${goldColor}50`, `0 0 50px ${goldColor}99`, `0 0 20px ${goldColor}50`] }
                    : { scale: 1 }
                }
                transition={phase === 1 ? { duration: 1.5, repeat: 1 } : { duration: 0.5 }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border flex items-center justify-center" style={{ borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(0,0,0,0.15)' }}>
                  {sealIcon}
                </div>
              </motion.div>

              {/* PHASE 4+: Invitation card rises up from envelope */}
              <AnimatePresence>
                {phase >= 4 && (
                  <motion.div
                    className="absolute -top-48 md:-top-60 w-[280px] md:w-[420px] bg-[#faf6ee] rounded-xl shadow-2xl p-6 md:p-8 text-center border z-50"
                    style={{ borderColor: `${goldColor}40`, boxShadow: `0 -20px 60px rgba(0,0,0,0.4), 0 0 40px ${goldColor}20` }}
                    initial={{ y: 80, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="absolute inset-3 border pointer-events-none rounded-lg" style={{ borderColor: `${goldColor}30` }} />
                    <Crown className="w-6 h-6 mx-auto mb-3" style={{ color: goldColor }} />
                    <p className="text-[9px] tracking-[0.3em] uppercase mb-4" style={{ color: goldColor }}>Özel Davet</p>
                    {/* Phase 5: Names appear letter by letter */}
                    <motion.h2
                      className="text-2xl md:text-3xl text-slate-800 font-normal"
                      style={{ fontFamily: `"${fontFamily}", serif` }}
                      initial={{ opacity: 0, letterSpacing: '0.5em' }}
                      animate={phase >= 5 ? { opacity: 1, letterSpacing: '0.05em' } : { opacity: 0 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    >
                      {brideName}
                    </motion.h2>
                    <motion.div
                      className="w-8 h-px mx-auto my-2"
                      style={{ backgroundColor: goldColor }}
                      initial={{ scaleX: 0 }}
                      animate={phase >= 5 ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                    <motion.div
                      className="text-lg md:text-xl text-slate-500 font-light"
                      initial={{ opacity: 0 }}
                      animate={phase >= 5 ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >&</motion.div>
                    <motion.div
                      className="w-8 h-px mx-auto my-2"
                      style={{ backgroundColor: goldColor }}
                      initial={{ scaleX: 0 }}
                      animate={phase >= 5 ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    />
                    <motion.h2
                      className="text-2xl md:text-3xl text-slate-800 font-normal"
                      style={{ fontFamily: `"${fontFamily}", serif` }}
                      initial={{ opacity: 0, letterSpacing: '0.5em' }}
                      animate={phase >= 5 ? { opacity: 1, letterSpacing: '0.05em' } : { opacity: 0 }}
                      transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
                    >
                      {groomName}
                    </motion.h2>
                    <motion.p
                      className="text-[9px] tracking-widest uppercase mt-4 text-slate-400"
                      initial={{ opacity: 0 }}
                      animate={phase >= 5 ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 1, delay: 1.2 }}
                    >
                      Düğün Törenimize Davetlisiniz
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Switch animation components based on entranceType
  let entranceComponent = renderEnvelope();
  
  switch (entranceType) {
    case 'box':
      entranceComponent = renderBox();
      break;
    case 'curtain':
      entranceComponent = renderCurtain();
      break;
    case 'gate':
      entranceComponent = renderGate();
      break;
    case 'card':
      entranceComponent = renderCard();
      break;
    case 'ribbon':
      entranceComponent = renderEnvelope(true);
      break;
    case 'heart-fade':
      entranceComponent = renderHeartFade();
      break;
    case 'flower-bloom':
      entranceComponent = renderFlowerBloom();
      break;
    case 'wax-seal-press':
      entranceComponent = renderWaxSealPress();
      break;
    case 'glass-shatter':
      entranceComponent = renderGlassShatter();
      break;
    case 'royal-seal-premium':
      entranceComponent = renderRoyalSealPremium();
      break;
  }

  // Viewport background wrapper & music placement
  return (
    <>
      <link href={fontUrl} rel="stylesheet" />
      
      {/* 1. Invitation Content (rendered underneath or directly) */}
      <div className="w-full min-h-screen relative">
        {/* Background particles on the invitation itself */}
        {showContent && backgroundAnimation && backgroundAnimation !== 'none' && (
          <BackgroundParticles animationType={backgroundAnimation} primaryColor={primaryColor} />
        )}
        {children}
      </div>

      {/* 2. Entrance Animation Overlay (fades out on open) */}
      <AnimatePresence>
        {!showContent && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" 
            style={entranceType === 'royal-seal-premium' ? {} : bgStyle}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {entranceComponent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Background Music Player (never unmounts!) */}
      <BackgroundMusic 
        url={musicUrl} 
        isEnvelopeOpened={isOpened} 
        autoplay={musicAutoplay}
        primaryColor={primaryColor}
      />
    </>
  );
}
