'use client';
import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundMusicProps {
  url: string | null | undefined;
  isEnvelopeOpened: boolean;
  autoplay?: boolean;
  primaryColor?: string;
}

export default function BackgroundMusic({ 
  url, 
  isEnvelopeOpened, 
  autoplay = true,
  primaryColor = '#f43f5e'
}: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!url) return;

    // Instantiate HTML5 audio
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.5; // Moderate volume
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [url]);

  // Handle autoplay when envelope opens
  useEffect(() => {
    if (!audioRef.current || !url) return;

    if (isEnvelopeOpened && autoplay && !isMuted && !isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          })
          .catch(error => {
            console.log('Autoplay was blocked by the browser. Waiting for interaction.', error);
          });
      }
    }
  }, [isEnvelopeOpened, autoplay, url]);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsMuted(true);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
          setHasInteracted(true);
        })
        .catch(err => console.log('Playback error:', err));
    }
  };

  // If no URL is provided, don't render anything
  if (!url) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {isEnvelopeOpened && (
          <motion.button
            onClick={togglePlayback}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border relative group backdrop-blur-md overflow-visible"
            style={{ 
              backgroundColor: isPlaying ? `${primaryColor}15` : 'rgba(255,255,255,0.8)',
              borderColor: isPlaying ? primaryColor : 'rgba(0,0,0,0.1)',
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isPlaying ? 'Müziği Sustur' : 'Müziği Başlat'}
          >
            {/* Pulsing soundwave rings when playing */}
            {isPlaying && (
              <>
                <span className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping pointer-events-none" style={{ animationDuration: '2s' }}></span>
                <span className="absolute -inset-2 rounded-full border border-rose-500/10 animate-pulse pointer-events-none" style={{ animationDuration: '3s' }}></span>
              </>
            )}

            {/* Floating vinyl / note animation container */}
            <motion.div
              className="w-full h-full rounded-full flex items-center justify-center"
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={isPlaying ? { duration: 5, repeat: Infinity, ease: 'linear' } : { duration: 0.5 }}
            >
              {isPlaying ? (
                <Volume2 className="w-5 h-5" style={{ color: primaryColor }} />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
            </motion.div>

            {/* Tiny floating note icon when playing */}
            {isPlaying && (
              <motion.div
                className="absolute -top-2 -right-1 text-xs"
                style={{ color: primaryColor }}
                animate={{ y: [-5, -15, -5], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Music className="w-3 h-3" />
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
