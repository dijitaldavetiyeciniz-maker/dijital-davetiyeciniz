'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface EnvelopeProps {
  children: React.ReactNode;
  brideName: string;
  groomName: string;
}

export default function Envelope({ children, brideName, groomName }: EnvelopeProps) {
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

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center overflow-hidden z-50">
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
            <div className="absolute inset-0 bg-[#e6d5c3] rounded-sm shadow-2xl overflow-hidden border border-[#d4c1aa]">
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
                background: 'linear-gradient(to bottom right, transparent 49%, #f0e4d4 50%)',
                clipPath: 'polygon(0 0, 50% 50%, 0 100%)'
              }}
            />
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom left, transparent 49%, #ebd9c8 50%)',
                clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)'
              }}
            />
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: '#f4ebd8',
                clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)'
              }}
            />

            {/* Zarfın Üst Kapağı (Flap) */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-full pointer-events-none origin-top z-20 drop-shadow-xl"
              style={{
                background: '#e6d5c3',
                clipPath: 'polygon(0 0, 50% 55%, 100% 0)',
                borderTop: '1px solid #fff'
              }}
              initial={{ rotateX: 0 }}
              animate={isOpened ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            {/* Mühür (Wax Seal) */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] md:-translate-y-[10%] z-30 w-16 h-16 md:w-20 md:h-20 bg-rose-800 rounded-full flex items-center justify-center shadow-lg cursor-pointer border-2 border-rose-900/50"
              style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.3)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 1, scale: 1 }}
              animate={isOpened ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-rose-700/50 flex items-center justify-center bg-rose-800/80">
                <Sparkles className="w-6 h-6 text-rose-200/80" />
              </div>
              <div className="absolute -bottom-6 w-32 text-center text-white/50 text-xs font-medium tracking-widest uppercase">
                Açmak için dokunun
              </div>
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
