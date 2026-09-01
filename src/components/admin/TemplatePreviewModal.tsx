'use client';

import React, { useEffect, useRef } from 'react';
import { X, Check, Sparkles, Calendar, MapPin, Heart, Flower2, Crown, Compass, Feather } from 'lucide-react';
import { TemplatePreset } from '@/lib/themes';
import { getFontFamilyUrl } from '@/data/fontOptions';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  theme: TemplatePreset | null;
  wedding: any;
  brideName: string;
  groomName: string;
  weddingDate: string;
  venueName: string;
  onClose: () => void;
  onSelect: (theme: TemplatePreset) => void;
}

export default function TemplatePreviewModal({
  isOpen,
  theme,
  wedding,
  brideName,
  groomName,
  weddingDate,
  venueName,
  onClose,
  onSelect
}: TemplatePreviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      // Focus modal on open
      const focusable = modalRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        triggerRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && theme) {
      const fontsToLoad = [theme.names_font_family, theme.font_family].filter(Boolean);
      fontsToLoad.forEach(fontId => {
        if (!fontId) return;
        const existing = document.querySelector(`link[data-preview-font="${fontId}"]`);
        if (!existing) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.setAttribute('data-preview-font', fontId);
          link.href = getFontFamilyUrl(fontId);
          document.head.appendChild(link);
        }
      });
    }
  }, [isOpen, theme]);

  if (!isOpen || !theme) return null;

  const displayBride = brideName || 'Ayşe';
  const displayGroom = groomName || 'Mehmet';
  const displayVenue = venueName || 'Çırağan Sarayı Balo Salonu';
  const displayDate = weddingDate ? new Date(weddingDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '15 Eylül 2027';

  const primaryColor = theme.primary_color || '#d4af37';
  const textColor = theme.text_color || '#1e293b';
  const fontFamily = theme.font_family || 'Cormorant Garamond';
  const namesFont = theme.names_font_family || 'Playfair Display';

  // Distinct composition archetype based on theme identity & category
  const themeId = (theme.id || '').toLowerCase();
  const category = (theme.category || '').toLowerCase();

  const isLuxuryRoyal = themeId.includes('gold') || themeId.includes('royal') || category.includes('luxury') || category.includes('luxe');
  const isBotanical = themeId.includes('botanical') || themeId.includes('flower') || themeId.includes('garden') || category.includes('floral');
  const isDarkNight = themeId.includes('dark') || themeId.includes('midnight') || themeId.includes('night') || (theme as any).background_color === '#0f172a';
  const isMinimal = themeId.includes('minimal') || category.includes('minimal') || category.includes('modern');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <h3 id="preview-modal-title" className="text-sm font-bold text-slate-800">
                {theme.name}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                {theme.category || theme.eventType || 'Şablon'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Canlı şablon ve tipografi önizlemesi</p>
          </div>

          <button
            type="button"
            data-testid="preview-modal-close"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
            aria-label="Önizlemeyi Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Faithful Template Stage with Distinct Composition */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center min-h-[340px]">
          <div
            className={`w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-10 text-center relative overflow-hidden transition-all ${
              isDarkNight ? 'bg-slate-950 text-white' : 'bg-white'
            }`}
            style={{
              borderColor: `${primaryColor}40`,
              boxShadow: `0 20px 40px -15px ${primaryColor}25`,
              borderWidth: isLuxuryRoyal ? '3px' : '1px',
              borderStyle: isLuxuryRoyal ? 'double' : 'solid'
            }}
          >
            {/* Template Archetype Top Accent */}
            <div className="flex justify-center mb-6">
              {isLuxuryRoyal ? (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-xs"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  <Crown className="w-5 h-5 fill-current opacity-90" />
                </div>
              ) : isBotanical ? (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border shadow-xs"
                  style={{ borderColor: primaryColor, color: primaryColor, backgroundColor: `${primaryColor}15` }}
                >
                  <Flower2 className="w-5 h-5" />
                </div>
              ) : isMinimal ? (
                <div className="w-10 h-0.5" style={{ backgroundColor: primaryColor }} />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-xs"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  <Heart className="w-5 h-5 fill-current opacity-80" />
                </div>
              )}
            </div>

            {/* Event Header Note */}
            <div
              className={`text-[11px] font-semibold uppercase mb-3 ${
                isMinimal ? 'tracking-[0.3em] font-sans' : 'tracking-widest'
              } ${isDarkNight ? 'text-slate-400' : 'text-slate-500'}`}
            >
              {theme.category?.toUpperCase() || 'DÜĞÜN DAVETİYESİ'}
            </div>

            {/* Couple Names in Target Typography & Composition */}
            <h2
              className={`font-bold mb-4 tracking-tight ${
                isMinimal ? 'text-xl sm:text-2xl uppercase' : 'text-2xl sm:text-3xl'
              }`}
              style={{
                fontFamily: `'${namesFont}', serif`,
                color: isDarkNight ? '#ffffff' : textColor
              }}
            >
              {displayBride} <span style={{ color: primaryColor }}>&</span> {displayGroom}
            </h2>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-2 my-4 opacity-60">
              <div className="w-10 h-px" style={{ backgroundColor: primaryColor }} />
              {isLuxuryRoyal ? (
                <Crown className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              ) : isBotanical ? (
                <Feather className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              ) : (
                <Sparkles className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              )}
              <div className="w-10 h-px" style={{ backgroundColor: primaryColor }} />
            </div>

            {/* Invitation Message in Template Typography */}
            <p
              className={`text-xs sm:text-sm mb-6 max-w-xs mx-auto leading-relaxed ${
                isMinimal ? 'font-sans text-slate-500 font-normal' : 'italic text-slate-600'
              } ${isDarkNight ? '!text-slate-300' : ''}`}
              style={{ fontFamily: `'${fontFamily}', serif, sans-serif` }}
            >
              "Bu mutlu günümüzde siz değerli dostlarımızı aramızda görmekten onur ve mutluluk duyarız."
            </p>

            {/* Date & Venue Box */}
            <div
              className="p-3.5 rounded-xl border space-y-2 text-xs"
              style={{
                backgroundColor: isDarkNight ? `${primaryColor}15` : `${primaryColor}08`,
                borderColor: `${primaryColor}30`,
                color: isDarkNight ? '#ffffff' : textColor
              }}
            >
              <div className="flex items-center justify-center gap-1.5 font-bold">
                <Calendar className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>{displayDate}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{displayVenue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-5 py-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Kapat
          </button>

          <button
            type="button"
            data-testid="use-template-btn"
            onClick={() => {
              onSelect(theme);
              onClose();
            }}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>✨ Bu Şablonu Kullan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
