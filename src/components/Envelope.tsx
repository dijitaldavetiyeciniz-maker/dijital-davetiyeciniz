'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Crown, Leaf } from 'lucide-react';
import { getBackgroundStyle } from '@/lib/backgrounds';

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
  fontFamily = 'Montserrat'
}: EnvelopeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [ribbonUntied, setRibbonUntied] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isShattered, setIsShattered] = useState(false);

  const handleOpen = () => {
    if (entranceType === 'ribbon' && !ribbonUntied) {
      setRibbonUntied(true);
      setTimeout(() => {
        setIsOpened(true);
        setTimeout(() => {
          setShowContent(true);
        }, 1500);
      }, 600);
    } else if (entranceType === 'wax-seal-press') {
      setIsPressed(true);
      setTimeout(() => {
        setIsOpened(true);
        setTimeout(() => {
          setShowContent(true);
        }, 1200);
      }, 1000);
    } else if (entranceType === 'glass-shatter') {
      setIsShattered(true);
      setTimeout(() => {
        setShowContent(true);
      }, 800);
    } else {
      setIsOpened(true);
      const delay = entranceType === 'card' || entranceType === 'flower-bloom' ? 800 : entranceType === 'heart-fade' ? 1000 : 1500;
      setTimeout(() => {
        setShowContent(true);
      }, delay);
    }
  };

  if (showContent) {
    return <>{children}</>;
  }

  // Dynamic Google Font Injection
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap`;

  // Get initials for Monogram
  const brideInitial = brideName ? brideName.trim().charAt(0).toUpperCase() : 'G';
  const groomInitial = groomName ? groomName.trim().charAt(0).toUpperCase() : 'D';
  const monogramText = `${brideInitial} & ${groomInitial}`;

  // Get shared background styles from helper
  const bgStyle = getBackgroundStyle(envelopeBgColor);

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

  // 1. ANIMATION: ENVELOPE (Zarf)
  const renderEnvelope = (hasRibbon = false) => {
    let flapStyle: React.CSSProperties = { backgroundColor: envelopeColor };
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
        <div className="absolute inset-0 rounded-sm shadow-2xl overflow-hidden border border-black/10" style={{ backgroundColor: envelopeColor }}>
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

        <motion.div className={flapClass} style={flapStyle} initial={{ rotateX: 0 }} animate={isOpened ? { rotateX: 180 } : { rotateX: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} />

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
          style={{ backgroundColor: currentSealColor, borderColor: 'rgba(255,255,255,0.2)', boxShadow: 'inset 0 0 12px rgba(0,0,0,0.6), 0 5px 15px rgba(0,0,0,0.4)' }}
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
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 100%), linear-gradient(135deg, ${envelopeColor} 0%, rgba(0,0,0,0.1) 100%)`,
            backgroundColor: envelopeColor
          }}
        >
          <div className="absolute inset-3 border border-double border-[#dfc384]/40 rounded-md pointer-events-none" />
          
          <div className="text-center z-10 px-8">
            <Crown className="w-10 h-10 mx-auto mb-4 text-[#dfc384] filter drop-shadow-md" />
            <h3 className="text-xl md:text-2xl tracking-wide mb-1 text-white" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>{brideName.charAt(0)} & {groomName.charAt(0)}</h3>
            <p className="text-[9px] text-[#dfc384] tracking-[0.3em] uppercase">Kutuyu Açmak İçin Dokunun</p>
          </div>

          <div 
            className="absolute -bottom-6 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border shadow-lg cursor-pointer"
            style={{ backgroundColor: currentSealColor, borderColor: 'rgba(255,255,255,0.2)', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}
          >
            {sealIcon}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // 3. ANIMATION: CURTAIN
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
                className="w-24 h-24 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl relative"
                style={{ 
                  backgroundColor: currentSealColor,
                  borderColor: '#dfc384',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.5)'
                }}
              >
                <div className="absolute -bottom-8 w-2 h-8 bg-amber-500 rounded-b-md shadow-md" />
                <span className="text-white text-xl md:text-2xl font-bold tracking-widest mb-1" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>{monogramText}</span>
                <span className="text-[7px] text-[#dfc384] tracking-[0.2em] uppercase font-bold mt-1">Perdeyi Aç</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // 4. ANIMATION: GATE
  const renderGate = () => {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center perspective-2000 cursor-pointer overflow-hidden" 
        onClick={!isOpened ? handleOpen : undefined}
      >
        <motion.div 
          className="w-1/2 h-full bg-[#1b212c] border-r-4 border-[#dfc384] relative z-20 shadow-2xl flex items-center justify-end"
          style={{
            originX: 0,
            backgroundImage: `radial-gradient(circle at 100% 50%, rgba(255,255,255,0.02) 0%, transparent 100%), linear-gradient(135deg, ${envelopeColor} 0%, rgba(0,0,0,0.2) 100%)`,
            backgroundColor: envelopeColor
          }}
          animate={isOpened ? { rotateY: -105, opacity: 0 } : { rotateY: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.6, 0.01, -0.05, 0.95] }}
        >
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
            backgroundImage: `radial-gradient(circle at 0% 50%, rgba(255,255,255,0.02) 0%, transparent 100%), linear-gradient(225deg, ${envelopeColor} 0%, rgba(0,0,0,0.2) 100%)`,
            backgroundColor: envelopeColor
          }}
          animate={isOpened ? { rotateY: 105, opacity: 0 } : { rotateY: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.6, 0.01, -0.05, 0.95] }}
        >
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
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.7), 0 5px 25px rgba(0,0,0,0.5)'
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
            style={{ backgroundColor: currentSealColor }}
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
                  border: '3px solid #dfc384'
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

  // 7. ANIMATION: FLOWER-BLOOM (Çiçek Açma)
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
              {/* Watercolor flower outline SVGs */}
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

  // 8. ANIMATION: WAX-SEAL-PRESS (Mühür Basımı)
  const renderWaxSealPress = () => {
    return (
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer overflow-hidden z-50 bg-[#151210]"
        onClick={!isOpened ? handleOpen : undefined}
      >
        {/* Sliding background container */}
        <motion.div 
          className="w-full h-full flex flex-col items-center justify-center text-center relative"
          animate={isOpened ? { y: '-100%', opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
        >
          {/* Ornate Gold Border */}
          <div className="absolute inset-10 border border-double border-[#dfc384]/40 rounded-xl" />
          
          <div className="max-w-sm px-6">
            <span className="text-[10px] text-[#dfc384] tracking-[0.3em] uppercase block mb-4">Kraliyet Mektubu</span>
            <h2 className="text-3xl text-white tracking-wide" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>{brideInitial} & {groomInitial}</h2>
            <div className="w-16 h-px bg-[#dfc384]/35 mx-auto my-6" />
            <p className="text-xs text-white/50 mb-10 italic">Düğün Töreni Resmi Davetiyesi</p>
          </div>

          {/* Stamping Wax Seal */}
          <motion.div 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 flex items-center justify-center shadow-2xl relative"
            style={{ 
              backgroundColor: currentSealColor,
              borderColor: '#dfc384',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)'
            }}
            animate={isPressed ? { scale: [1, 0.85, 1.05, 1], rotate: [0, 5, -5, 0] } : { scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {sealIcon}
            <div className="absolute -bottom-6 w-32 text-[#dfc384] text-[8px] font-bold tracking-widest uppercase text-center">
              {isPressed ? 'Mühürleniyor...' : 'Mühürle ve Aç'}
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  };

  // 9. ANIMATION: GLASS-SHATTER (Buzlu Cam Kırılması)
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
  }

  // Viewport background wrapper
  const renderBackground = () => {
    // Fullscreen backdrops
    const fsAnimations = ['curtain', 'gate', 'heart-fade', 'flower-bloom', 'wax-seal-press', 'glass-shatter'];
    if (fsAnimations.includes(entranceType)) {
      return (
        <>
          <link href={fontUrl} rel="stylesheet" />
          {entranceComponent}
        </>
      );
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden z-50" style={bgStyle}>
        <link href={fontUrl} rel="stylesheet" />
        <AnimatePresence>
          {!showContent && entranceComponent}
        </AnimatePresence>
      </div>
    );
  };

  return renderBackground();
}
