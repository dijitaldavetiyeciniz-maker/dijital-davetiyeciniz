'use client';

import React, { useState } from 'react';
import {
  entranceAnimationTypes,
  getAnimationCapabilities,
  getAnimationDefaults,
  EntranceAnimationType,
  AnimationControlField
} from '@/data/openingAnimations';
import { Sparkles, RotateCcw, Play, Search, Sliders, Check, Settings2 } from 'lucide-react';

interface AnimationCustomizerProps {
  selectedAnimation: string;
  onAnimationChange: (animationId: string) => void;
  animationSettings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
  onResetToRecommended: () => void;
  onReplayPreview: () => void;
}

export default function AnimationCustomizer({
  selectedAnimation,
  onAnimationChange,
  animationSettings,
  onSettingsChange,
  onResetToRecommended,
  onReplayPreview
}: AnimationCustomizerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFamily, setActiveFamily] = useState<string>('all');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(true);

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

  const filteredAnimations = entranceAnimationTypes.filter(anim => {
    const matchesFamily = activeFamily === 'all' || anim.family === activeFamily;
    const matchesSearch = !searchTerm || anim.name.toLowerCase().includes(searchTerm.toLowerCase()) || anim.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFamily && matchesSearch;
  });

  const activeAnimObj = entranceAnimationTypes.find(a => a.id === selectedAnimation) || entranceAnimationTypes[0];

  return (
    <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Açılış Animasyonu & Deneyim Stüdyosu</h4>
            <p className="text-[11px] text-slate-400">Her animasyona özel parametreler ve görsel ayarlar</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReplayPreview}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            title="Animasyonu önizlemede tekrar oynatır"
          >
            <Play className="w-3.5 h-3.5 fill-purple-600" />
            <span>Test Et / Oynat</span>
          </button>

          <button
            type="button"
            onClick={onResetToRecommended}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            title="Şablonun önerdiği açılış animasyonuna geri döner"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Önerilen Animasyona Dön</span>
          </button>
        </div>
      </div>

      {/* Animation Selection Card Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700">Seçili Açılış Deneyimi</label>
          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
            {activeAnimObj?.name || selectedAnimation}
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Açılış animasyonu ara (örn: Zarf, Perde, Saray, Yıldızlı Gece, Masal)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>

        {/* Animation Picker Carousel / Grid */}
        <div className="max-h-[220px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 bg-slate-50/70 rounded-xl">
          {filteredAnimations.map(anim => {
            const isSelected = selectedAnimation === anim.id;
            return (
              <button
                key={anim.id}
                data-testid={`anim-card-${anim.id}`}
                type="button"
                onClick={() => onAnimationChange(anim.id)}
                className={`p-2.5 rounded-xl border text-left transition flex items-start justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'border-purple-500 bg-white ring-1 ring-purple-400 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{anim.name}</span>
                    {anim.isPremium && (
                      <span className="text-[9px] px-1 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 rounded">
                        Lüks
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{anim.description}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animation-Specific Custom Configuration Panel */}
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
    </div>
  );
}
