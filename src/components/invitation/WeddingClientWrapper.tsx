'use client';
import { useState, useEffect } from 'react';
import EntranceAnimation from './EntranceAnimation';
import { getInitials } from '@/utils/getInitials';
import { getPrimarySubjectName, getSecondarySubjectName } from '@/data/eventTypeConfig';
import BackgroundMusic from '@/components/BackgroundMusic';

import { getFontFamilyUrl } from '@/data/fontOptions';

type WeddingClientWrapperProps = {
  wedding: any;
  children: React.ReactNode;
  mode?: 'preview' | 'public';
};

export default function WeddingClientWrapper({ wedding, children, mode = 'public' }: WeddingClientWrapperProps) {
  const hasNoAnimation = wedding.entrance_animation === 'none';
  const [showEntrance, setShowEntrance] = useState(!hasNoAnimation);

  // Dynamic on-demand font injection for ONLY the active wedding's selected heading & body fonts (<= 2 families)
  useEffect(() => {
    const fontsToLoad = new Set<string>();
    if (wedding.names_font_family) fontsToLoad.add(wedding.names_font_family);
    if (wedding.font_family) fontsToLoad.add(wedding.font_family);

    fontsToLoad.forEach(fontId => {
      const existing = document.querySelector(`link[data-public-font="${fontId}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.setAttribute('data-public-font', fontId);
        link.href = getFontFamilyUrl(fontId);
        document.head.appendChild(link);
      }
    });
  }, [wedding.names_font_family, wedding.font_family]);

  useEffect(() => {
    if (hasNoAnimation) {
      setShowEntrance(false);
    } else {
      setShowEntrance(true);
    }
  }, [wedding.entrance_animation, hasNoAnimation]);

  const [isPreview] = useState(() => {
    if (mode === 'preview') return true;
    if (typeof window !== 'undefined' && window.location.search.includes('preview=true')) {
      return true;
    }
    return false;
  });

  return (
    <>
      <div 
        data-testid="wedding-content-wrapper"
        data-layout-ready={!showEntrance ? 'true' : 'false'}
        className={`w-full transition-opacity duration-1000 ${
          showEntrance ? 'opacity-0 pointer-events-none fixed inset-0 overflow-hidden' : 'opacity-100 relative'
        }`}
      >
        {children}
      </div>
      
      {showEntrance && (
        <EntranceAnimation
          animationType={wedding.entrance_animation || "royal-seal-premium"}
          envelopeStyle={wedding.envelope_style || "classic"}
          sealStyle={wedding.seal_style || "burgundy"}
          sealType={wedding.seal_type || "monogram"}
          eventType={wedding.event_type}
          backgroundAnimation={wedding.background_animation || "golden"}
          backgroundDesign={wedding.background_design || wedding.envelope_bg_color || "rose-gold-silk"}
          initials={getInitials(getPrimarySubjectName(wedding), getSecondarySubjectName(wedding))}
          brideName={getPrimarySubjectName(wedding)}
          groomName={getSecondarySubjectName(wedding)}
          wedding={wedding} // Passing the full object to extract semantic data
          eventDate={(() => {
            if (!wedding.wedding_date) return undefined;
            const d = new Date(wedding.wedding_date);
            return isNaN(d.getTime()) ? undefined : d.toLocaleDateString('tr-TR');
          })()}
          onComplete={() => setShowEntrance(false)}
        />
      )}

      {/* Replay Animation Floating Button (Only in Design Studio Emulator) */}
      {isPreview && !showEntrance && !hasNoAnimation && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-3 duration-300">
          <button
            type="button"
            onClick={() => setShowEntrance(true)}
            className="bg-slate-900/90 text-white font-semibold text-xs tracking-wider uppercase px-4 py-3 rounded-full hover:bg-slate-800 transition-all shadow-2xl backdrop-blur-sm border border-slate-700/50 cursor-pointer active:scale-95"
          >
            🔄 Animasyonu Tekrar Oynat
          </button>
        </div>
      )}
    </>
  );
}
