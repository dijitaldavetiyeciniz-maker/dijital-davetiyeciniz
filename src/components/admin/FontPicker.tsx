'use client';

import React, { useState, useEffect } from 'react';
import { fontCategories, fontOptionsList, FontOption, getFontFamilyUrl } from '@/data/fontOptions';
import { Type, RotateCcw, Check, Sparkles, Search } from 'lucide-react';

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
  sampleNames = 'Anıl & Ayşe'
}: FontPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTarget, setActiveTarget] = useState<'title' | 'body'>('title');

  // Dynamically inject Google Fonts stylesheets for previewing fonts
  useEffect(() => {
    const loadedFonts = new Set<string>();
    fontOptionsList.forEach(font => {
      if (!loadedFonts.has(font.id)) {
        loadedFonts.add(font.id);
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = getFontFamilyUrl(font.id);
        document.head.appendChild(link);
      }
    });
  }, []);

  const filteredFonts = fontOptionsList.filter(f => {
    const matchesCat = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch = !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const currentSelectedFont = activeTarget === 'title' ? titleFont : bodyFont;

  return (
    <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Yazı Tipi & Tipografi Stüdyosu</h4>
            <p className="text-[11px] text-slate-400">Başlık ve gövde fontlarını canlı isim önizlemesiyle seçin</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetToTemplate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          title="Şablonun orijinal font kombinasyonunu geri yükler"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Şablonun Önerdiği Fontlara Dön</span>
        </button>
      </div>

      {/* Target Selector (Title Font vs Body Font) */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTarget('title')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTarget === 'title'
              ? 'bg-white text-rose-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Başlık Fontu:</span>
          <span className="font-serif italic truncate max-w-[120px]">{titleFont || 'Varsayılan'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTarget('body')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTarget === 'body'
              ? 'bg-white text-rose-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Gövde Fontu:</span>
          <span className="font-sans truncate max-w-[120px]">{bodyFont || 'Varsayılan'}</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Yazı tipi ara (örn: Cormorant, Great Vibes, Outfit)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
        </div>

        {/* Categories scrollable pill bar */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {fontCategories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Cards Grid with Live Render */}
      <div className="max-h-[280px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1">
        {filteredFonts.map(font => {
          const isSelected = currentSelectedFont === font.id;
          return (
            <button
              key={font.id}
              type="button"
              onClick={() => {
                if (activeTarget === 'title') {
                  onTitleFontChange(font.id);
                } else {
                  onBodyFontChange(font.id);
                }
              }}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-rose-500 bg-rose-50/30 ring-1 ring-rose-400'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-700">{font.name}</span>
                {isSelected ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600">
                    <Check className="w-3 h-3" /> Seçildi
                  </span>
                ) : font.isPopular ? (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                    Popüler
                  </span>
                ) : null}
              </div>

              {/* Live Preview Text with Actual Font */}
              <div
                className="text-lg text-slate-900 truncate py-1"
                style={{ fontFamily: `'${font.id}', serif, sans-serif` }}
              >
                {sampleNames}
              </div>

              <div className="text-[10px] text-slate-400 capitalize">
                {font.category.replace('-', ' ')}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
