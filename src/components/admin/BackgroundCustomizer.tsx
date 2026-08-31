'use client';

import React from 'react';
import { Palette, RotateCcw, Image as ImageIcon, Sparkles, Layers, Paintbrush } from 'lucide-react';

export interface BackgroundSettings {
  mode: 'template' | 'solid' | 'gradient' | 'premium' | 'image';
  solidColor?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientDirection?: string;
  premiumBgId?: string;
  imageUrl?: string;
}

export interface ColorSettings {
  primaryColor: string;
  textColor: string;
  accentColor?: string;
  titleColor?: string;
}

interface BackgroundCustomizerProps {
  backgroundSettings: BackgroundSettings;
  onBackgroundSettingsChange: (settings: BackgroundSettings) => void;
  colorSettings: ColorSettings;
  onColorSettingsChange: (colors: ColorSettings) => void;
  onResetToTemplate: () => void;
  templateDefaultBg?: string;
}

export const premiumBackgroundList = [
  { id: 'marble-white', label: 'Beyaz Altın Mermer', preview: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', desc: 'Lüks altın damarlı mermer' },
  { id: 'marble-black', label: 'Siyah Zümrüt Mermer', preview: 'linear-gradient(135deg, #09090b, #18181b)', desc: 'Koyu asil mermer' },
  { id: 'paper-kraft', label: 'Rustik Doğal Kraft', preview: '#f5e6d3', desc: 'Sıcak bohem kağıt dokusu' },
  { id: 'solid-burgundy', label: 'Bordo Kadife Saray', preview: 'linear-gradient(135deg, #4c0519, #881337)', desc: 'Kına ve asil gece zemin' },
  { id: 'solid-sage', label: 'Botanik Adaçayı', preview: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', desc: 'Ferah kır bahçesi yeşili' },
  { id: 'solid-midnight', label: 'Gece Mavisi & Yıldız', preview: 'linear-gradient(135deg, #020617, #0f172a)', desc: 'Derin gökyüzü mavisi' },
  { id: 'solid-blush', label: 'Pudra Pembe Romance', preview: 'linear-gradient(135deg, #fff1f2, #ffe4e6)', desc: 'Romantik pastel pembe' },
  { id: 'solid-ivory', label: 'Fildişi Zarafet', preview: '#fffbf5', desc: 'Klasik sade ve temiz' }
];

export default function BackgroundCustomizer({
  backgroundSettings,
  onBackgroundSettingsChange,
  colorSettings,
  onColorSettingsChange,
  onResetToTemplate
}: BackgroundCustomizerProps) {
  const currentMode = backgroundSettings.mode || 'template';

  const setMode = (mode: BackgroundSettings['mode']) => {
    onBackgroundSettingsChange({
      ...backgroundSettings,
      mode
    });
  };

  return (
    <div className="space-y-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Arka Plan & Renk Paleti</h4>
            <p className="text-[11px] text-slate-400">Davetiyenizin sahne zeminini, renklerini ve kontrastını yönetin</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetToTemplate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          title="Şablonun orijinal arka plan ve renklerine döner"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Şablon Arka Planına Dön</span>
        </button>
      </div>

      {/* Background Mode Tabs */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700">Arka Plan Türü</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'template', label: 'Şablon Önerisi', icon: Sparkles },
            { id: 'solid', label: 'Düz Renk', icon: Paintbrush },
            { id: 'gradient', label: 'Gradyan', icon: Layers },
            { id: 'premium', label: 'Premium Doku', icon: Palette },
            { id: 'image', label: 'Özel Görsel', icon: ImageIcon }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = currentMode === tab.id;
            return (
              <button
                key={tab.id}
                data-testid={`bg-mode-${tab.id}`}
                type="button"
                onClick={() => setMode(tab.id as any)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mode 1: Şablon Önerisi */}
        {currentMode === 'template' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Şablonun kendi özgün sanatsal arka plan tasarımı aktif.</span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
              Şablon Varsayılanı
            </span>
          </div>
        )}

        {/* Mode 2: Düz Renk */}
        {currentMode === 'solid' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Düz Zemin Rengi</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={backgroundSettings.solidColor || '#f8fafc'}
                onChange={e => onBackgroundSettingsChange({ ...backgroundSettings, solidColor: e.target.value })}
                className="w-12 h-10 rounded-xl cursor-pointer border border-slate-300 bg-white"
              />
              <input
                type="text"
                value={backgroundSettings.solidColor || '#f8fafc'}
                onChange={e => onBackgroundSettingsChange({ ...backgroundSettings, solidColor: e.target.value })}
                className="px-3 py-1.5 text-xs font-mono border rounded-lg bg-white w-32 uppercase"
              />
            </div>
          </div>
        )}

        {/* Mode 3: Gradyan */}
        {currentMode === 'gradient' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Başlangıç Rengi</label>
                <input
                  type="color"
                  value={backgroundSettings.gradientColor1 || '#ffe4e6'}
                  onChange={e => onBackgroundSettingsChange({ ...backgroundSettings, gradientColor1: e.target.value })}
                  className="w-full h-8 rounded-lg cursor-pointer border bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bitiş Rengi</label>
                <input
                  type="color"
                  value={backgroundSettings.gradientColor2 || '#fce7f3'}
                  onChange={e => onBackgroundSettingsChange({ ...backgroundSettings, gradientColor2: e.target.value })}
                  className="w-full h-8 rounded-lg cursor-pointer border bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Gradyan Açısı</label>
                <select
                  value={backgroundSettings.gradientDirection || '135deg'}
                  onChange={e => onBackgroundSettingsChange({ ...backgroundSettings, gradientDirection: e.target.value })}
                  className="w-full border p-1.5 text-xs bg-white rounded-lg"
                >
                  <option value="135deg">Çapraz (135°)</option>
                  <option value="180deg">Yukarıdan Aşağı (180°)</option>
                  <option value="90deg">Soldan Sağa (90°)</option>
                  <option value="45deg">Köşeden Köşeye (45°)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Mode 4: Premium Doku */}
        {currentMode === 'premium' && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {premiumBackgroundList.map(bg => {
                const isSelected = (backgroundSettings.premiumBgId || 'marble-white') === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => onBackgroundSettingsChange({ ...backgroundSettings, premiumBgId: bg.id })}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-white ring-1 ring-amber-400 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-full h-8 rounded-lg mb-2 border border-black/5" style={{ background: bg.preview }} />
                    <span className="text-xs font-bold text-slate-800">{bg.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{bg.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mode 5: Özel Görsel */}
        {currentMode === 'image' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Görsel URL Adresi</label>
            <input
              type="url"
              placeholder="https://... veya yüklenen görsel linki"
              value={backgroundSettings.imageUrl || ''}
              onChange={e => onBackgroundSettingsChange({ ...backgroundSettings, imageUrl: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
            />
          </div>
        )}
      </div>

      {/* Typography Color Palette Controls */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <label className="block text-xs font-bold text-slate-700">Yazı & Vurgu Renkleri</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ana Vurgu Rengi</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colorSettings.primaryColor || '#f43f5e'}
                onChange={e => onColorSettingsChange({ ...colorSettings, primaryColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border bg-white"
              />
              <span className="text-[11px] font-mono uppercase">{colorSettings.primaryColor || '#f43f5e'}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Gövde Metin Rengi</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colorSettings.textColor || '#1e293b'}
                onChange={e => onColorSettingsChange({ ...colorSettings, textColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border bg-white"
              />
              <span className="text-[11px] font-mono uppercase">{colorSettings.textColor || '#1e293b'}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Başlık Rengi</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colorSettings.titleColor || colorSettings.textColor || '#0f172a'}
                onChange={e => onColorSettingsChange({ ...colorSettings, titleColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border bg-white"
              />
              <span className="text-[11px] font-mono uppercase">{colorSettings.titleColor || colorSettings.textColor || '#0f172a'}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">İkincil / Vurgu 2</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colorSettings.accentColor || colorSettings.primaryColor || '#c9a84c'}
                onChange={e => onColorSettingsChange({ ...colorSettings, accentColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border bg-white"
              />
              <span className="text-[11px] font-mono uppercase">{colorSettings.accentColor || colorSettings.primaryColor || '#c9a84c'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
