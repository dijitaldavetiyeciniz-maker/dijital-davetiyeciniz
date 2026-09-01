'use client';

import React, { useState, useMemo } from 'react';
import { TemplatePreset } from '@/lib/themes';
import { Search, Eye, Check, Sparkles, LayoutGrid, Palette, Filter } from 'lucide-react';

interface TemplateCatalogTabProps {
  themes: TemplatePreset[];
  currentTemplateId: string;
  onSelectTemplate: (theme: TemplatePreset) => void;
  onPreviewTemplate: (theme: TemplatePreset) => void;
}

export default function TemplateCatalogTab({
  themes,
  currentTemplateId,
  onSelectTemplate,
  onPreviewTemplate
}: TemplateCatalogTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [visibleCount, setVisibleCount] = useState(12);

  const styleChips = [
    { id: 'all', label: 'Tüm Stiller' },
    { id: 'Lüks', label: '✨ Lüks & Gold' },
    { id: 'Modern', label: '🌿 Modern' },
    { id: 'Klasik', label: '📜 Klasik & Asil' },
    { id: 'Minimal', label: '⚪ Minimalist' },
    { id: 'Romantik', label: '🌸 Romantik' },
    { id: 'Kültürel', label: '🧿 Kültürel' }
  ];

  const filteredThemes = useMemo(() => {
    return themes.filter(theme => {
      const query = searchTerm.toLowerCase().trim();
      const nameMatch = !query || theme.name?.toLowerCase().includes(query) || theme.id.toLowerCase().includes(query);
      const catMatch = selectedCategory === 'all' || theme.eventType === selectedCategory;
      const styleMatch =
        selectedStyle === 'all' ||
        (theme.category && theme.category.toLowerCase().includes(selectedStyle.toLowerCase()));
      return nameMatch && catMatch && styleMatch;
    });
  }, [themes, searchTerm, selectedCategory, selectedStyle]);

  return (
    <div className="space-y-4">
      {/* Search & Category Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Şablon adı veya stil ara..."
            aria-label="Şablon ara"
            data-testid="template-search-input"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setVisibleCount(12);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setVisibleCount(12);
            }}
            className="w-full border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white px-3 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-400 cursor-pointer"
          >
            <option value="all">Tüm Etkinlik Kategorileri</option>
            <option value="wedding">Düğün & Nikah</option>
            <option value="engagement">Nişan & Söz</option>
            <option value="henna">Kına Gecesi</option>
            <option value="circumcision">Sünnet Düğünü</option>
            <option value="baby_shower">Baby Shower & Doğum</option>
            <option value="birthday">Doğum Günü & Parti</option>
            <option value="corporate">Kurumsal Etkinlik</option>
            <option value="graduation">Mezuniyet Töreni</option>
          </select>
        </div>
      </div>

      {/* Style Chips Bar (Horizontal scroll-snap without ugly scrollbar) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x touch-pan-x">
        {styleChips.map(chip => (
          <button
            key={chip.id}
            type="button"
            onClick={() => {
              setSelectedStyle(chip.id);
              setVisibleCount(12);
            }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer snap-start ${
              selectedStyle === chip.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Template Grid without Nested Scrollbars (1 col mobile, 2 col sm, 3 col lg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredThemes.slice(0, visibleCount).map(theme => {
          const isSelected = currentTemplateId === theme.id;
          const primaryColor = theme.primary_color || '#d4af37';
          const bgColor = theme.backgroundDesign || theme.envelope_color || '#f8f4ee';

          return (
            <div
              key={theme.id}
              data-testid={`template-card-${theme.id}`}
              data-selected={isSelected ? 'true' : 'false'}
              className={`rounded-2xl border bg-white p-3.5 flex flex-col justify-between gap-3 transition ${
                isSelected
                  ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Lightweight Visual Thumbnail Header (Zero React Heavy Component Overhead) */}
              <div
                className="h-24 rounded-xl relative flex items-center justify-center overflow-hidden border border-slate-100/80 shadow-inner"
                style={{
                  backgroundColor: bgColor.startsWith('#') ? bgColor : '#f8f9fa',
                  backgroundImage: !bgColor.startsWith('#')
                    ? `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}35)`
                    : undefined
                }}
              >
                <div
                  className="w-16 h-12 rounded-lg bg-white/90 backdrop-blur-xs border shadow-xs flex flex-col items-center justify-center p-1"
                  style={{ borderColor: `${primaryColor}40` }}
                >
                  <div className="w-8 h-1 rounded-full mb-1" style={{ backgroundColor: primaryColor }} />
                  <div className="text-[8px] font-bold text-slate-700 uppercase tracking-tighter truncate max-w-[50px]">
                    {theme.name?.split(' ')[0] || 'Davetiye'}
                  </div>
                  <div className="w-5 h-0.5 rounded-full mt-1 bg-slate-300" />
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Check className="w-2.5 h-2.5" /> Seçili
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-800 truncate" title={theme.name}>
                    {theme.name}
                  </h4>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white shadow-xs shrink-0"
                    style={{ backgroundColor: primaryColor }}
                    title={`Tema Rengi: ${primaryColor}`}
                  />
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  <span className="capitalize">{theme.category || theme.eventType || 'Şablon'}</span>
                  <span>•</span>
                  <span>{theme.font_family || 'Serif'}</span>
                </div>
              </div>

              {/* Action Buttons: [ Önizle ] and [ Seç ] */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  data-testid={`preview-btn-${theme.id}`}
                  onClick={() => onPreviewTemplate(theme)}
                  className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3 h-3 text-slate-500" />
                  <span>Önizle</span>
                </button>

                <button
                  type="button"
                  data-testid={`template-${theme.id}`}
                  data-selected={isSelected ? 'true' : 'false'}
                  aria-pressed={isSelected}
                  onClick={() => onSelectTemplate(theme)}
                  className={`py-1.5 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50 text-rose-700 border border-rose-300 font-extrabold'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Seçili</span>
                    </>
                  ) : (
                    <span>Seç</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More Pagination Button */}
      {filteredThemes.length > visibleCount && (
        <div className="text-center pt-2">
          <button
            type="button"
            data-testid="load-more-templates"
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Daha Fazla Şablon Göster ({filteredThemes.length - visibleCount} kaldı)
          </button>
        </div>
      )}
    </div>
  );
}
