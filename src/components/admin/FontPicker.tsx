'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { fontCategories, fontOptionsList, FontOption, getFontFamilyUrl } from '@/data/fontOptions';
import { Type, RotateCcw, Check, Search, Sparkles, SlidersHorizontal } from 'lucide-react';

interface FontPickerProps {
  titleFont: string;
  bodyFont: string;
  onTitleFontChange: (font: string) => void;
  onBodyFontChange: (font: string) => void;
  onResetToTemplate: () => void;
  sampleNames?: string;
}

export default function FontPicker({
  titleFont,
  bodyFont,
  onTitleFontChange,
  onBodyFontChange,
  onResetToTemplate,
  sampleNames = 'Ayşe & Mehmet'
}: FontPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTarget, setActiveTarget] = useState<'title' | 'body'>('title');
  const [customPreviewText, setCustomPreviewText] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const displayPreviewText = customPreviewText.trim() || sampleNames || 'Ayşe & Mehmet';

  const filteredFonts = useMemo(() => {
    return fontOptionsList.filter(f => {
      const matchesCat = activeCategory === 'all' || f.category === activeCategory;
      const matchesSearch =
        !searchTerm ||
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  // Dynamically inject Google Fonts stylesheets on-demand ONLY for selected & visible fonts (prevents 60+ head injections)
  useEffect(() => {
    const fontsToLoad = new Set<string>();
    if (titleFont) fontsToLoad.add(titleFont);
    if (bodyFont) fontsToLoad.add(bodyFont);

    // Only load the currently visible page slice
    filteredFonts.slice(0, visibleCount).forEach(f => fontsToLoad.add(f.id));

    fontsToLoad.forEach(fontId => {
      const existing = document.querySelector(`link[data-font-id="${fontId}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.setAttribute('data-font-id', fontId);
        link.href = getFontFamilyUrl(fontId);
        document.head.appendChild(link);
      }
    });
  }, [filteredFonts, visibleCount, titleFont, bodyFont]);

  const currentSelectedFont = activeTarget === 'title' ? (titleFont || 'Cormorant Garamond') : (bodyFont || 'Montserrat');

  return (
    <div className="space-y-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Yazı Tipi & Tipografi Stüdyosu</h4>
            <p className="text-[11px] text-slate-400">Başlık ve gövde fontlarını canlı metin önizlemesiyle seçin</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetToTemplate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          title="Şablonun orijinal font kombinasyonunu geri yükler"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Şablonun Önerdiği Fontlara Dön</span>
          <span className="sm:hidden">Önerilene Dön</span>
        </button>
      </div>

      {/* Target Selector (Title Font vs Body Font) */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
        <button
          type="button"
          role="tab"
          aria-selected={activeTarget === 'title'}
          onClick={() => setActiveTarget('title')}
          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer ${
            activeTarget === 'title'
              ? 'bg-white text-rose-600 shadow-xs border border-rose-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="text-[11px] text-slate-400 font-normal">Başlık Yazı Tipi:</span>
          <span className="font-serif italic font-bold truncate max-w-[130px]">{titleFont || 'Cormorant Garamond'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTarget === 'body'}
          onClick={() => setActiveTarget('body')}
          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer ${
            activeTarget === 'body'
              ? 'bg-white text-rose-600 shadow-xs border border-rose-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="text-[11px] text-slate-400 font-normal">Gövde Yazı Tipi:</span>
          <span className="font-sans font-bold truncate max-w-[130px]">{bodyFont || 'Montserrat'}</span>
        </button>
      </div>

      {/* Custom Live Preview Text Input & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="relative">
          <label htmlFor="custom-font-preview-input" className="sr-only">Önizleme Metni</label>
          <input
            id="custom-font-preview-input"
            type="text"
            placeholder="Önizleme metni (örn: Ayşe & Mehmet)..."
            value={customPreviewText}
            onChange={e => setCustomPreviewText(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
        </div>

        <div className="relative">
          <label htmlFor="font-search-input" className="sr-only">Yazı Tipi Ara</label>
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            id="font-search-input"
            type="text"
            placeholder="Yazı tipi ara (örn: Playfair, Outfit, Caveat)..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setVisibleCount(12);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
        </div>
      </div>

      {/* Category Pills (Horizontal scroll-snap without ugly scrollbar) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x touch-pan-x">
        {fontCategories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setActiveCategory(cat.id);
              setVisibleCount(12);
            }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer snap-start ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Font Cards Grid with Live Render (1 col mobile, 2 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
        {filteredFonts.slice(0, visibleCount).map(font => {
          const isSelected = currentSelectedFont === font.id;
          return (
            <button
              key={font.id}
              type="button"
              data-testid={`font-card-${font.id}`}
              aria-pressed={isSelected}
              onClick={() => {
                if (activeTarget === 'title') {
                  onTitleFontChange(font.id);
                } else {
                  onBodyFontChange(font.id);
                }
              }}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-300 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-800">{font.name}</span>
                {isSelected ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Seçildi
                  </span>
                ) : font.isPopular ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                    ★ Popüler
                  </span>
                ) : null}
              </div>

              {/* Live Preview Text with Actual Font */}
              <div
                className="text-lg text-slate-900 truncate py-1 w-full"
                style={{ fontFamily: `'${font.id}', serif, sans-serif` }}
              >
                {displayPreviewText}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="capitalize">{font.category.replace('-', ' ')}</span>
                <span className="text-[9px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                  ✓ Türkçe Uyumlu
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Show More Pagination Button */}
      {filteredFonts.length > visibleCount && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Daha Fazla Yazı Tipi Göster ({filteredFonts.length - visibleCount} kaldı)
          </button>
        </div>
      )}
    </div>
  );
}
