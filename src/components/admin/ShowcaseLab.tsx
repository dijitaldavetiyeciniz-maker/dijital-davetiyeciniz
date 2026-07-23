'use client';
import React, { useState, useEffect } from 'react';
import PremiumTemplateRenderer from '@/components/templates/PremiumTemplateRenderer';
import { predefinedThemes, TemplatePreset } from '@/lib/themes';
import { AssetLoadingProvider } from '@/components/ui/AssetLoadingContext';

const showcaseInvitationData = {
  event_type: "wedding",
  event_title: "Düğün Daveti",
  bride_name: "Ayşe",
  groom_name: "Ahmet",
  invitation_text: "Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız.",
  event_date: "2027-08-25T19:00:00",
  venue_name: "Boğaz Bahçe Davet",
  venue_address: "Sarıyer, İstanbul",
  custom_overrides: {
    content: {
      bridePhotoUrl: "/showcase-assets/cinematic-couple.jpg",
      bgImageUrl: "/showcase-assets/cinematic-couple.jpg",
    }
  }
};

const longNamesData = {
  ...showcaseInvitationData,
  bride_name: "Alexandra Nazlıcan",
  groom_name: "Muhammed Abdülkerim",
  venue_name: "İstanbul Boğazı Uluslararası Kültür ve Davet Organizasyon Merkezi"
};

const photoLessData = {
  ...showcaseInvitationData,
  custom_overrides: {
    content: {
      bridePhotoUrl: null,
      bgImageUrl: null,
    }
  }
};

type GroupFilter = 'ALL' | '1A' | '1B' | '1C' | 'SIMILARITY';

export default function ShowcaseLab({ standaloneId }: { standaloneId?: string }) {
  const [viewMode, setViewMode] = useState<'2x2' | 'full'>('2x2');
  const [deviceMode, setDeviceMode] = useState<'1440' | '768' | '390'>('1440');
  const [renderMode, setRenderMode] = useState<'preview' | 'public'>('preview');
  const [dataType, setDataType] = useState<'normal' | 'long' | 'nophoto'>('normal');
  const [variantIndex, setVariantIndex] = useState<0 | 1>(0);
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('1A');
  const [allAssetsLoaded, setAllAssetsLoaded] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [assetReadyState, setAssetReadyState] = useState(false);
  
  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  useEffect(() => {
    if (fontsReady && assetReadyState) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAllAssetsLoaded(true);
        });
      });
    } else {
      requestAnimationFrame(() => setAllAssetsLoaded(false));
    }
  }, [fontsReady, assetReadyState]);

  const group1A = ['cinematic-poster', 'royal-letter', 'polaroid-story', 'constellation-night'];
  const group1B = ['modern-architecture', 'botanical-ceramic', 'luxury-hotel', 'destination-boarding-pass'];
  const group1C = ['fashion-magazine', 'art-deco-theater', 'mediterranean-garden', 'minimal-typographic'];

  
  const getSimilarityScore = (t1: TemplatePreset, t2: TemplatePreset) => {
    let score = 0;
    if (t1.layoutStyle === t2.layoutStyle) score += 45;
    if (t1.designSignature?.composition === t2.designSignature?.composition) score += 20;
    if (t1.designSignature?.heroElement === t2.designSignature?.heroElement) score += 20;
    if (t1.layoutMode === t2.layoutMode) score += 10;
    if (t1.eventType === t2.eventType) score += 5;
    return score;
  };

  const getMostSimilar = (preset: TemplatePreset) => {
    let highest = 0;
    let mostSimilar: TemplatePreset | null = null;
    predefinedThemes.forEach(t => {
      if (t.id === preset.id) return;
      const score = getSimilarityScore(preset, t);
      if (score > highest) {
        highest = score;
        mostSimilar = t;
      }
    });
    return { template: mostSimilar, score: highest };
  };

  const similarityPairs = [...predefinedThemes].map(t => {
    const similar = getMostSimilar(t);
    return { t, similar: similar.template, score: similar.score };
  }).sort((a, b) => b.score - a.score);

  let idsToShow: string[] = [];
  if (groupFilter === '1A') idsToShow = group1A;
  else if (groupFilter === '1B') idsToShow = group1B;
  else if (groupFilter === '1C') idsToShow = group1C;
  else if (groupFilter === 'SIMILARITY') {
    idsToShow = similarityPairs.slice(0, 10).map(p => p.t.id);
  } else {
    idsToShow = [...group1A, ...group1B, ...group1C];
  }

  // Limit to 4 templates max if not full
  if (idsToShow.length > 4) {
    idsToShow = idsToShow.slice(0, 4);
  }

  const presets = idsToShow.map(id => predefinedThemes.find(t => t.id === id)).filter(Boolean) as TemplatePreset[];

  const currentData = dataType === 'long' ? longNamesData : dataType === 'nophoto' ? photoLessData : showcaseInvitationData;

  if (standaloneId) {
    const standalonePreset = predefinedThemes.find(t => t.id === standaloneId);
    if (!standalonePreset) return <div>Template not found</div>;
    
    const testWedding = {
      ...currentData,
      custom_overrides: {
        ...currentData.custom_overrides,
        design: {
          layoutStyle: standalonePreset.layoutStyle,
          colorPalette: standalonePreset.colorPalette,
        }
      }
    };

    return (
      <AssetLoadingProvider onReadyChange={(ready) => setAssetReadyState(ready)}>
        <div className="min-h-screen bg-white" data-testid="showcase-standalone-mode">
          <PremiumTemplateRenderer
            wedding={testWedding}
            templateId={standalonePreset.id}
            mode="public"
          />
        </div>
      </AssetLoadingProvider>
    );
  }

  const getContainerClass = () => {
    if (deviceMode === '390') return 'w-[390px] mx-auto border-[8px] border-black rounded-[40px] shadow-2xl';
    if (deviceMode === '768') return 'w-[768px] mx-auto border-[8px] border-black rounded-[24px] shadow-2xl';
    return 'w-full shadow-2xl border-4 border-gray-800 rounded-xl'; // 1440
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20 text-black">
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Template Showcase Lab</h1>
            <p className="text-xs text-gray-500">Grup 1 Görsel İnceleme & Karşılaştırma</p>
          </div>
          <div className="text-xs font-mono text-gray-400" data-testid="showcase-ready" data-ready={allAssetsLoaded ? 'true' : 'false'}>
            Assets Loaded: {allAssetsLoaded ? 'Yes' : 'No'}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 text-sm">
          <div className="flex bg-gray-100 p-1 rounded">
            <button className={`px-3 py-1 rounded ${groupFilter === 'ALL' ? 'bg-white shadow' : 'hover:bg-gray-200'}`} onClick={() => setGroupFilter('ALL')}>Tümünü Göster</button>
            <button className={`px-3 py-1 rounded ${groupFilter === '1A' ? 'bg-white shadow' : 'hover:bg-gray-200'}`} onClick={() => setGroupFilter('1A')}>Grup 1A</button>
            <button className={`px-3 py-1 rounded ${groupFilter === '1B' ? 'bg-white shadow' : 'hover:bg-gray-200'}`} onClick={() => setGroupFilter('1B')}>Grup 1B</button>
            <button className={`px-3 py-1 rounded ${groupFilter === '1C' ? 'bg-white shadow' : 'hover:bg-gray-200'}`} onClick={() => setGroupFilter('1C')}>Grup 1C</button>
            <button className={`px-3 py-1 rounded text-rose-600 font-bold ${groupFilter === 'SIMILARITY' ? 'bg-white shadow' : 'hover:bg-gray-200'}`} onClick={() => setGroupFilter('SIMILARITY')}>[ En Çok Benzeyenler ]</button>
          </div>

          <div className="w-px bg-gray-300 mx-1"></div>

          <div className="flex bg-gray-100 p-1 rounded">
            <button className={`px-3 py-1 rounded ${deviceMode === '390' ? 'bg-black text-white' : 'hover:bg-gray-200'}`} onClick={() => setDeviceMode('390')}>390px Mobil</button>
            <button className={`px-3 py-1 rounded ${deviceMode === '768' ? 'bg-black text-white' : 'hover:bg-gray-200'}`} onClick={() => setDeviceMode('768')}>768px Tablet</button>
            <button className={`px-3 py-1 rounded ${deviceMode === '1440' ? 'bg-black text-white' : 'hover:bg-gray-200'}`} onClick={() => setDeviceMode('1440')}>1440px Masaüstü</button>
          </div>

          <div className="w-px bg-gray-300 mx-1"></div>
          
          <div className="flex bg-gray-100 p-1 rounded">
            <button className={`px-3 py-1 rounded ${viewMode === '2x2' ? 'bg-black text-white' : 'hover:bg-gray-200'}`} onClick={() => setViewMode('2x2')}>2x2 Grid</button>
            <button className={`px-3 py-1 rounded ${viewMode === 'full' ? 'bg-black text-white' : 'hover:bg-gray-200'}`} onClick={() => setViewMode('full')}>Alt Alta</button>
          </div>

          <div className="w-px bg-gray-300 mx-1"></div>

          <div className="flex bg-gray-100 p-1 rounded">
            <button className={`px-3 py-1 rounded ${dataType === 'normal' ? 'bg-black text-white' : 'hover:bg-gray-200'}`} onClick={() => setDataType('normal')}>Fotoğraflı</button>
            <button className={`px-3 py-1 rounded ${dataType === 'nophoto' ? 'bg-black text-white' : 'hover:bg-gray-200'}`} onClick={() => setDataType('nophoto')}>Fallback</button>
            <button className={`px-3 py-1 rounded ${dataType === 'long' ? 'bg-black text-white' : 'hover:bg-gray-200'}`} onClick={() => setDataType('long')}>Uzun İsim</button>
          </div>

          <div className="w-px bg-gray-300 mx-1"></div>

          <div className="flex bg-gray-100 p-1 rounded">
            <button className={`px-3 py-1 rounded ${variantIndex === 0 ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`} onClick={() => setVariantIndex(0)}>Renk 1</button>
            <button className={`px-3 py-1 rounded ${variantIndex === 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`} onClick={() => setVariantIndex(1)}>Renk 2</button>
          </div>
        </div>
      </div>

      <AssetLoadingProvider onReadyChange={(ready) => setAssetReadyState(ready)}>
        <div className={`p-8 max-w-[2000px] mx-auto ${viewMode === '2x2' ? 'grid grid-cols-1 xl:grid-cols-2 gap-16' : 'flex flex-col gap-24'}`}>
          {presets.map(preset => {
            const variant = variantIndex === 1 && preset.colorVariants && preset.colorVariants.length > 1 
                            ? preset.colorVariants[1] 
                            : preset.colorVariants?.[0] || { colorPalette: preset.colorPalette };
                            
            const testWedding = {
              ...currentData,
              custom_overrides: {
                ...currentData.custom_overrides,
                design: {
                  layoutStyle: preset.layoutStyle,
                  colorPalette: variant.colorPalette,
                }
              }
            };

            return (
              <div key={preset.id} className="flex flex-col gap-6" data-testid={`template-card-${preset.id}`}>
                <div className="bg-white p-6 rounded-2xl shadow-sm border text-sm flex justify-between items-start">
                  <div>
                    <h2 className="font-bold text-xl mb-3 flex items-center gap-3">
                      {preset.name}
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full uppercase tracking-wider">{preset.layoutMode}</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
                      <div><span className="text-gray-500 w-24 inline-block">ID:</span> <span className="font-mono bg-gray-100 px-1 rounded">{preset.id}</span></div>
                      <div><span className="text-gray-500 w-24 inline-block">Layout:</span> <span className="font-mono bg-gray-100 px-1 rounded">{preset.layoutStyle}</span></div>
                      <div><span className="text-gray-500 w-24 inline-block">Variant:</span> {(variant as any).name || 'Varsayılan'}</div>
                      <div data-testid="active-layout-style"><span className="text-gray-500 w-24 inline-block">Composition:</span> {preset.designSignature?.composition || 'Belirtilmedi'}</div>
                      {groupFilter === 'SIMILARITY' && (
                        <>
                          <div className="col-span-2 mt-2 pt-2 border-t border-rose-100">
                            <span className="text-rose-500 font-bold w-32 inline-block">En yakın benzer:</span> {(getMostSimilar(preset).template as any)?.name || 'Yok'}
                          </div>
                          <div className="col-span-2">
                            <span className="text-rose-500 font-bold w-32 inline-block">Benzerlik:</span> %{getMostSimilar(preset).score}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <a 
                      href={`/admin/template-showcase?standalone=${preset.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                    >
                      Tam Sayfa Aç ↗
                    </a>
                  </div>
                </div>
                
                <div className="relative">
                  <div className={`${getContainerClass()} bg-white overflow-hidden transition-all duration-500 ease-in-out`} data-testid="showcase-overflow-status">
                    <PremiumTemplateRenderer
                      wedding={testWedding}
                      templateId={preset.id}
                      mode={renderMode}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AssetLoadingProvider>
    </div>
  );
}
