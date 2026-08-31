'use client';

import React, { useState } from 'react';
import {
  entranceAnimationTypes,
  getAnimationCapabilities,
  getAnimationDefaults,
  EntranceAnimationType,
  AnimationControlField
} from '@/data/openingAnimations';
import { Sparkles, RotateCcw, Play, Search, Sliders, Check, X } from 'lucide-react';
import EntranceAnimation from '../invitation/EntranceAnimation';

interface AnimationCustomizerProps {
  selectedAnimation: string;
  recommendedAnimationId?: string;
  onAnimationChange: (animationId: string) => void;
  animationSettings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
  onResetToRecommended: () => void;
  onReplayPreview: () => void;
}

export default function AnimationCustomizer({
  selectedAnimation,
  recommendedAnimationId = 'wax-seal-starfield',
  onAnimationChange,
  animationSettings,
  onSettingsChange,
  onResetToRecommended,
  onReplayPreview
}: AnimationCustomizerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(true);
  const [previewAnimId, setPreviewAnimId] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [hasCompletedPreview, setHasCompletedPreview] = useState(false);

  const capabilities = getAnimationCapabilities(selectedAnimation);
  const currentSettings = animationSettings[selectedAnimation] || getAnimationDefaults(selectedAnimation);

  const handleFieldChange = (fieldId: string, value: any) => {
    const updated = {
      ...animationSettings,
      [selectedAnimation]: {
        ...currentSettings,
        [fieldId]: value
      }
    };
    onSettingsChange(updated);
  };

  const filterCategories = [
    { id: 'all', label: 'Tüm Animasyonlar' },
    { id: 'recommended', label: 'Önerilenler ⭐' },
    { id: 'luxury', label: 'Premium / Lüks 💎' },
    { id: 'romantic', label: 'Romantik 🌹' },
    { id: 'floral', label: 'Çiçekli 🌿' },
    { id: 'cinematic', label: 'Sinematik 🎬' },
    { id: 'minimal', label: 'Minimalist 📐' },
    { id: 'traditional', label: 'Geleneksel 🕌' },
    { id: 'fantasy', label: 'Fantezi ✨' },
    { id: 'modern', label: 'Modern 📽️' },
    { id: 'fun', label: 'Eğlenceli 🧸' }
  ];

  const animMatchesCategory = (anim: EntranceAnimationType, catId: string) => {
    if (catId === 'all') return true;
    if (catId === 'recommended') return anim.id === recommendedAnimationId;
    if (catId === 'luxury') return !!anim.isPremium;
    if (catId === 'romantic') return anim.family === 'ELEGANT_CLASSICAL';
    if (catId === 'floral') return anim.family === 'DESTINATION' || anim.id.includes('botanical') || anim.id.includes('bloom') || anim.id.includes('flower') || anim.id.includes('watercolor');
    if (catId === 'cinematic') return anim.family === 'CINEMATIC' || anim.id.includes('car-journey');
    if (catId === 'minimal') return anim.family === 'EDITORIAL_FASHION' || anim.family === 'CORPORATE' || anim.id.includes('minimal') || anim.id.includes('glass') || anim.id === 'none';
    if (catId === 'traditional') return anim.family === 'CULTURAL' || anim.id.includes('ottoman') || anim.id.includes('traditional');
    if (catId === 'fantasy') return anim.family === 'FANTASY_MYTHOLOGICAL' || anim.id.includes('star') || anim.id.includes('celestial') || anim.id.includes('moon') || anim.id.includes('eclipse');
    if (catId === 'modern') return anim.family === 'CORPORATE' || anim.family === 'EDITORIAL_FASHION';
    if (catId === 'fun') return anim.family === 'PLAYFUL' || anim.id.includes('storybook') || anim.id.includes('balloon') || anim.id.includes('box');
    return false;
  };

  const filteredAnimations = entranceAnimationTypes.filter(anim => {
    const matchesCategory = animMatchesCategory(anim, activeCategory);
    const matchesSearch = !searchTerm || 
      anim.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      anim.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeAnimObj = entranceAnimationTypes.find(a => a.id === selectedAnimation) || entranceAnimationTypes[0];

  // Visual Identity Thumbnail renderer for premium cards
  const renderCardThumbnail = (animId: string) => {
    const norm = animId.toLowerCase().replace(/[-_]/g, '');
    
    if (norm === 'none') {
      return (
        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-lg border border-slate-200">
          🚫
        </div>
      );
    }
    if (norm.includes('car')) {
      return (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white text-lg">
          🚗
        </div>
      );
    }
    if (norm.includes('eclipse') || norm.includes('constellation') || norm.includes('starfield') || norm.includes('night')) {
      return (
        <div className="w-12 h-12 rounded-lg bg-slate-950 flex items-center justify-center text-yellow-300 text-lg border border-slate-800">
          ✨
        </div>
      );
    }
    if (norm.includes('curtain') || norm.includes('opera')) {
      return (
        <div className="w-12 h-12 rounded-lg bg-red-800 flex items-center justify-center text-white text-lg border border-red-900">
          🎭
        </div>
      );
    }
    if (norm.includes('door') || norm.includes('gate') || norm.includes('palace')) {
      return (
        <div className="w-12 h-12 rounded-lg bg-amber-950 flex items-center justify-center text-yellow-400 text-lg border border-amber-800">
          🏛️
        </div>
      );
    }
    if (norm.includes('envelope') || norm.includes('box')) {
      return (
        <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 text-lg border border-amber-200">
          ✉️
        </div>
      );
    }
    // Default fallback thumbnail
    return (
      <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 text-lg border border-purple-100">
        ✨
      </div>
    );
  };

  return (
    <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      {/* Header Panel */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Açılış Animasyonu Kütüphanesi</h4>
            <p className="text-[11px] text-slate-400">Üstün prestijli premium açılış sahneleri kütüphanesi</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReplayPreview}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-purple-600" />
            <span>Test Et / Oynat</span>
          </button>

          <button
            type="button"
            onClick={onResetToRecommended}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer text-reset-template-opening"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Şablonun Önerdiği Animasyona Dön</span>
          </button>
        </div>
      </div>

      {/* Category Chips Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {filterCategories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-lg text-[10px] font-semibold tracking-wider whitespace-nowrap transition cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Premium açılış animasyonu ara (örn: Car Journey, Gatsby, Tutulma, Zarf, Çiçek)..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-400"
        />
      </div>

      {/* Grid of Animation Cards */}
      <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-slate-50/70 rounded-2xl border border-slate-200/50">
        {filteredAnimations.map(anim => {
          const isSelected = selectedAnimation === anim.id;
          const isRecommended = anim.id === recommendedAnimationId;

          return (
            <div
              key={anim.id}
              data-testid={`anim-card-${anim.id}`}
              onClick={() => onAnimationChange(anim.id)}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-3 bg-white cursor-pointer ${
                isSelected
                  ? 'border-purple-600 ring-2 ring-purple-100 shadow-sm bg-purple-50/5'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Top: Thumbnail + Text */}
              <div className="flex items-start gap-3">
                {renderCardThumbnail(anim.id)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-800 truncate">{anim.name}</span>
                    {isRecommended && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                        Önerilen
                      </span>
                    )}
                    {anim.isPremium && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{anim.description}</p>
                </div>
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                <span className="text-[9px] text-slate-400 font-semibold tracking-wider bg-slate-100 px-2 py-0.5 rounded uppercase">
                  {anim.family.replace('_', ' ')}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Mini Preview button */}
                  {anim.id !== 'none' && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewAnimId(anim.id);
                        setPreviewKey(prev => prev + 1);
                        setHasCompletedPreview(false);
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-semibold transition cursor-pointer"
                    >
                      Önizle
                    </button>
                  )}

                  {/* Select button */}
                  <button
                    type="button"
                    onClick={() => onAnimationChange(anim.id)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                    }`}
                  >
                    {isSelected ? <><Check className="w-3 h-3" /> Seçildi</> : 'Seç'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini Preview Modal Wrapper */}
      {previewAnimId && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-lg h-[60vh] relative flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Açılış Sahnesi Önizlemesi</h3>
              <button 
                type="button"
                onClick={() => setPreviewAnimId(null)} 
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Live Animation Mount Container */}
            <div className="flex-1 relative bg-slate-950">
              <EntranceAnimation
                animationType={previewAnimId}
                brideName="Ahmet"
                groomName="Nesrin"
                eventType="wedding"
                initials="A&N"
                onComplete={() => {
                  setHasCompletedPreview(true);
                }}
                key={previewKey}
              />
              {hasCompletedPreview && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-[10000] gap-4">
                  <p className="text-sm font-semibold tracking-wider">Açılış Tamamlandı</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewKey(prev => prev + 1);
                        setHasCompletedPreview(false);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Tekrar Oynat
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onAnimationChange(previewAnimId);
                        setPreviewAnimId(null);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg animate-pulse"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Seç ve Kapat
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animation-Specific Custom Configuration Panel */}
      {selectedAnimation !== 'none' && (
        <div className="border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              <span>Bu Animasyonu Özelleştir ({activeAnimObj?.name})</span>
            </div>
            <span className="text-slate-400 text-[10px]">{isCustomizeOpen ? '▲ Gizle' : '▼ Göster'}</span>
          </button>

          {isCustomizeOpen && (
            <div className="mt-3 p-4 bg-purple-50/30 rounded-xl border border-purple-100 space-y-3">
              <div className="text-[11px] text-slate-500 font-medium">
                Aşağıdaki kontroller yalnızca <span className="font-bold text-purple-900">{activeAnimObj?.name}</span> animasyonuna özel olarak çalışır:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capabilities.customControls.map((ctrl: AnimationControlField) => {
                  const value = currentSettings[ctrl.id] !== undefined ? currentSettings[ctrl.id] : ctrl.defaultValue;

                  return (
                    <div key={ctrl.id} className="space-y-1">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        {ctrl.label}
                      </label>

                      {ctrl.type === 'color' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            data-testid={`anim-field-${ctrl.id}`}
                            value={value || ctrl.defaultValue}
                            onChange={e => handleFieldChange(ctrl.id, e.target.value)}
                            className="w-9 h-8 rounded-lg cursor-pointer border border-slate-200 bg-white"
                          />
                          <span className="text-xs font-mono text-slate-600 uppercase">{value || ctrl.defaultValue}</span>
                        </div>
                      )}

                      {ctrl.type === 'text' && (
                        <input
                          type="text"
                          data-testid={`anim-field-${ctrl.id}`}
                          value={value || ''}
                          onChange={e => handleFieldChange(ctrl.id, e.target.value)}
                          placeholder={ctrl.description || ctrl.label}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                      )}

                      {ctrl.type === 'select' && ctrl.options && (
                        <select
                          data-testid={`anim-field-${ctrl.id}`}
                          value={value || ctrl.defaultValue}
                          onChange={e => handleFieldChange(ctrl.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-purple-400"
                        >
                          {ctrl.options.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {ctrl.type === 'range' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            data-testid={`anim-field-${ctrl.id}`}
                            min={ctrl.min ?? 0}
                            max={ctrl.max ?? 100}
                            step={ctrl.step ?? 1}
                            value={value ?? ctrl.defaultValue}
                            onChange={e => handleFieldChange(ctrl.id, Number(e.target.value))}
                            className="flex-1 accent-purple-600"
                          />
                          <span className="text-xs font-bold text-slate-700 min-w-[36px] text-right">
                            {value} {ctrl.unit || ''}
                          </span>
                        </div>
                      )}

                      {ctrl.type === 'boolean' && (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            data-testid={`anim-field-${ctrl.id}`}
                            id={`ctrl-${ctrl.id}`}
                            checked={!!value}
                            onChange={e => handleFieldChange(ctrl.id, e.target.checked)}
                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor={`ctrl-${ctrl.id}`} className="text-xs text-slate-600 cursor-pointer">
                            Aktif
                          </label>
                        </div>
                      )}

                      {ctrl.description && ctrl.type !== 'text' && (
                        <p className="text-[10px] text-slate-400">{ctrl.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
