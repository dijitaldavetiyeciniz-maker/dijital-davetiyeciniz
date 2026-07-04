'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Crown, Leaf } from 'lucide-react';

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
}

export default function Envelope({ 
  children, 
  brideName, 
  groomName, 
  primaryColor = '#9f1239', 
  envelopeColor = '#e6d5c3',
  envelopeBgColor = 'slate',
  envelopeFlapType = 'triangle',
  sealType = 'sparkles',
  sealColor
}: EnvelopeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleOpen = () => {
    setIsOpened(true);
    // Zarf açıldıktan 1.5 saniye sonra içeriği göster
    setTimeout(() => {
      setShowContent(true);
    }, 1500);
  };

  if (showContent) {
    return <>{children}</>;
  }

  // Get initials for Monogram
  const brideInitial = brideName ? brideName.trim().charAt(0).toUpperCase() : 'G';
  const groomInitial = groomName ? groomName.trim().charAt(0).toUpperCase() : 'D';
  const monogramText = `${brideInitial} & ${groomInitial}`;

  // Envelope background rendering style
  let bgClass = 'bg-slate-900';
  let bgStyle: React.CSSProperties = {};
  
  if (envelopeBgColor.startsWith('#')) {
    bgStyle = { backgroundColor: envelopeBgColor };
  } else {
    switch (envelopeBgColor) {
      case 'wood':
        bgStyle = {
          backgroundColor: '#5c3e21',
          backgroundImage: 'radial-gradient(circle, #6f4c2c 0%, #3d2510 100%)',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.6)'
        };
        break;
      case 'linen':
        bgStyle = {
          backgroundColor: '#eae6df',
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 0), radial-gradient(rgba(0,0,0,0.03) 1px, transparent 0)',
          backgroundSize: '12px 12px',
          backgroundPosition: '0 0, 6px 6px',
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.15)'
        };
        break;
      case 'marble':
        bgStyle = {
          backgroundColor: '#fafafc',
          backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(0,0,0,0.02) 0%, transparent 70%), radial-gradient(circle at 100% 100%, rgba(212,175,55,0.04) 0%, transparent 60%)',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.05)'
        };
        break;
      case 'concrete':
        bgStyle = {
          backgroundColor: '#8e9099',
          backgroundImage: 'radial-gradient(circle, #a1a3ac 0%, #6e7077 100%)',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.4)'
        };
        break;
      default:
        bgClass = 'bg-slate-900';
        break;
    }
  }

  // Wax seal rendering icon/component
  const currentSealColor = sealColor || primaryColor;
  let sealIcon = <Sparkles className="w-6 h-6 text-white/80" />;
  
  switch (sealType) {
    case 'heart':
      sealIcon = <Heart className="w-6 h-6 text-white/90 fill-white/20" />;
      break;
    case 'crown':
      sealIcon = <Crown className="w-6 h-6 text-white/90" />;
      break;
    case 'leaf':
      sealIcon = <Leaf className="w-6 h-6 text-white/90" />;
      break;
    case 'rose':
      sealIcon = (
        <svg className="w-7 h-7 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
        </svg>
      );
      break;
    case 'monogram':
      sealIcon = (
        <span className="font-serif text-white/90 font-bold text-xs tracking-wider md:text-sm select-none">
          {monogramText}
        </span>
      );
      break;
  }

  // Flap styling and structure
  let flapStyle: React.CSSProperties = { backgroundColor: envelopeColor };
  let flapClass = 'absolute top-0 left-0 right-0 origin-top z-20 drop-shadow-xl';

  if (envelopeFlapType === 'rounded') {
    flapStyle = { 
      ...flapStyle, 
      height: '55%', 
      borderRadius: '0 0 180px 180px / 0 0 100px 100px', 
      border: '1px solid rgba(255,255,255,0.1)'
    };
  } else if (envelopeFlapType === 'square') {
    flapStyle = { 
      ...flapStyle, 
      height: '45%', 
      borderRadius: '0 0 8px 8px', 
      border: '1px solid rgba(255,255,255,0.1)'
    };
  } else {
    // default: triangle
    flapStyle = { 
      ...flapStyle, 
      height: '100%', 
      clipPath: 'polygon(0 0, 50% 55%, 100% 0)',
      borderTop: '1px solid rgba(255,255,255,0.5)'
    };
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center overflow-hidden z-50 ${bgClass}`} style={bgStyle}>
      <AnimatePresence>
        {!showContent && (
          <motion.div 
            className="relative w-[340px] h-[240px] md:w-[500px] md:h-[350px] cursor-pointer perspective-1000"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            onClick={!isOpened ? handleOpen : undefined}
          >
            {/* Zarfın Arka Yüzü (Gövde) */}
            <div className="absolute inset-0 rounded-sm shadow-2xl overflow-hidden border border-black/10" style={{ backgroundColor: envelopeColor }}>
              {/* Zarfın İçindeki Davetiye (Gözüken Kısım) */}
              <motion.div 
                className="absolute inset-4 bg-white rounded-sm shadow-inner flex flex-col items-center justify-center p-4 border border-slate-100"
                initial={{ y: 20 }}
                animate={isOpened ? { y: -100 } : { y: 20 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
              >
                <div className="text-center">
                  <div className="text-xl md:text-3xl font-serif text-slate-800 mb-2">{brideName} & {groomName}</div>
                  <div className="w-16 h-[1px] bg-rose-300 mx-auto mb-2"></div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest">Davetiyeniz</div>
                </div>
              </motion.div>
            </div>

            {/* Zarfın Sol ve Sağ Kanatları */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom right, transparent 49%, rgba(0,0,0,0.05) 50%)',
                clipPath: 'polygon(0 0, 50% 55%, 0 100%)'
              }}
            />
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom left, transparent 49%, rgba(0,0,0,0.1) 50%)',
                clipPath: 'polygon(100% 0, 50% 55%, 100% 100%)'
              }}
            />
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                clipPath: 'polygon(0 100%, 50% 55%, 100% 100%)'
              }}
            />

            {/* Zarfın Üst Kapağı (Flap) */}
            <motion.div 
              className={flapClass}
              style={flapStyle}
              initial={{ rotateX: 0 }}
              animate={isOpened ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            {/* Mühür (Wax Seal) */}
            <motion.div 
              className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg cursor-pointer border-2"
              style={{ 
                backgroundColor: currentSealColor,
                borderColor: 'rgba(0,0,0,0.2)',
                boxShadow: 'inset 0 0 12px rgba(0,0,0,0.6), 0 5px 15px rgba(0,0,0,0.4)' 
              }}
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
                Dokun ve Aç
              </div>
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
