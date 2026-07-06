'use client';
import { useState } from 'react';
import EntranceAnimation from './EntranceAnimation';
import { getInitials } from '@/utils/getInitials';
import BackgroundMusic from '@/components/BackgroundMusic';

type WeddingClientWrapperProps = {
  wedding: any;
  children: React.ReactNode;
};

export function WeddingClientWrapper({ wedding, children }: WeddingClientWrapperProps) {
  const [showEntrance, setShowEntrance] = useState(true);

  return (
    <>
      {showEntrance ? (
        <EntranceAnimation
          animationType={wedding.entrance_animation || "royal-seal-premium"}
          envelopeStyle={wedding.envelope_style || "classic"}
          sealStyle={wedding.seal_style || "burgundy"}
          backgroundAnimation={wedding.background_animation || "golden"}
          initials={getInitials(wedding.bride_name, wedding.groom_name)}
          brideName={wedding.bride_name}
          groomName={wedding.groom_name}
          eventDate={(() => {
            if (!wedding.wedding_date) return undefined;
            const d = new Date(wedding.wedding_date);
            return isNaN(d.getTime()) ? undefined : d.toLocaleDateString('tr-TR');
          })()}
          onComplete={() => setShowEntrance(false)}
        />
      ) : (
        <>
          {children}
          
          {/* Replay Animation Floating Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <button
              type="button"
              onClick={() => setShowEntrance(true)}
              className="bg-slate-900/90 text-white font-semibold text-xs tracking-wider uppercase px-4 py-3 rounded-full hover:bg-slate-800 transition-all shadow-2xl backdrop-blur-sm border border-slate-700/50 cursor-pointer active:scale-95"
            >
              🔄 Animasyonu Tekrar Oynat
            </button>
          </div>
        </>
      )}
    </>
  );
}
export default WeddingClientWrapper;
