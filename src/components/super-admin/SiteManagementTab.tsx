'use client';

import React, { useState, useEffect } from 'react';
import { SiteGlobalConfig, defaultSiteConfig, isSafeUrl } from '@/lib/site-settings';
import {
  Globe,
  Palette,
  Megaphone,
  LayoutTemplate,
  Sliders,
  Wrench,
  Image as ImageIcon,
  Save,
  Rocket,
  RotateCcw,
  Eye,
  Check,
  AlertCircle,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Trash2,
  Upload,
  ExternalLink
} from 'lucide-react';

export default function SiteManagementTab() {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'announcement' | 'header' | 'footer' | 'homepage' | 'media' | 'maintenance'>('general');
  const [config, setConfig] = useState<SiteGlobalConfig>(defaultSiteConfig);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'published' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Load configuration on mount
  useEffect(() => {
    fetchConfig();
    fetchMedia();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/super-admin/site-settings');
      const data = await res.json();
      if (data.success && data.draft) {
        setConfig(data.draft);
      }
    } catch {
      // Fallback
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/super-admin/media');
      const data = await res.json();
      if (data.success) {
        setMediaList(data.media || []);
      }
    } catch {
      // Fallback
    }
  };

  const handleSaveDraft = async () => {
    setSaveStatus('saving');
    setStatusMessage('Taslak kaydediliyor...');
    try {
      const res = await fetch('/api/super-admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft: config })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Taslak kaydedilemedi.');
      }
      setSaveStatus('saved');
      setStatusMessage('Taslak ayarlar başarıyla kaydedildi.');
      setHasUnsavedChanges(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setSaveStatus('error');
      setStatusMessage(err.message || 'Hata oluştu.');
    }
  };

  const handlePublish = async () => {
    setSaveStatus('saving');
    setStatusMessage('Ayarlar yayına alınıyor...');
    try {
      // Save draft first
      await fetch('/api/super-admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft: config })
      });

      const res = await fetch('/api/super-admin/site-settings', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Yayınlama başarısız.');
      }
      setSaveStatus('published');
      setStatusMessage(data.message || 'Site ayarları başarıyla yayınlandı!');
      setHasUnsavedChanges(false);
      setTimeout(() => setSaveStatus('idle'), 4000);
    } catch (err: any) {
      setSaveStatus('error');
      setStatusMessage(err.message || 'Hata oluştu.');
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Tüm taslak ayarları varsayılan fabrika ayarlarına sıfırlamak istediğinize emin misiniz?')) {
      return;
    }
    try {
      const res = await fetch('/api/super-admin/site-settings/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.draft) {
        setConfig(data.draft);
        setHasUnsavedChanges(false);
        setSaveStatus('saved');
        setStatusMessage('Ayarlar varsayılana sıfırlandı.');
      }
    } catch (err: any) {
      setSaveStatus('error');
      setStatusMessage(err.message || 'Sıfırlama hatası.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/super-admin/media', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Yükleme başarısız.');
      }
      fetchMedia();
      setStatusMessage('Görsel başarıyla yüklendi.');
    } catch (err: any) {
      alert(err.message || 'Yükleme hatası.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (fileName: string) => {
    if (!window.confirm(`"${fileName}" dosyasını silmek istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/super-admin/media?fileName=${encodeURIComponent(fileName)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchMedia();
      }
    } catch {
      // Ignore
    }
  };

  const moveHomepageSection = (index: number, direction: 'up' | 'down') => {
    const sections = [...config.homepage.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const temp = sections[index];
    sections[index] = sections[targetIndex];
    sections[targetIndex] = temp;

    // Re-assign order numbers
    const updated = sections.map((s, idx) => ({ ...s, order: idx + 1 }));
    setConfig(prev => ({
      ...prev,
      homepage: { ...prev.homepage, sections: updated }
    }));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Title & Action Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Site Yönetimi & Global CMS</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Marka, ana sayfa içeriği, duyuru bandı, header, footer ve bakım modunu kod deploy etmeden yönetin.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {saveStatus !== 'idle' && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
              saveStatus === 'saving' ? 'bg-amber-100 text-amber-800' :
              saveStatus === 'saved' ? 'bg-emerald-100 text-emerald-800' :
              saveStatus === 'published' ? 'bg-indigo-100 text-indigo-800 font-extrabold' : 'bg-rose-100 text-rose-800'
            }`}>
              {saveStatus === 'saving' && <Sliders className="w-3 h-3 animate-spin" />}
              {saveStatus === 'saved' && <Check className="w-3 h-3" />}
              {saveStatus === 'published' && <Sparkles className="w-3 h-3" />}
              {saveStatus === 'error' && <AlertCircle className="w-3 h-3" />}
              <span>{statusMessage}</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Varsayılana Dön</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Taslağı Kaydet</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="px-4 py-2 text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Yayına Al</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'general', label: 'Genel & Marka', icon: Palette },
          { id: 'announcement', label: 'Duyuru Bandı', icon: Megaphone },
          { id: 'header', label: 'Header', icon: LayoutTemplate },
          { id: 'homepage', label: 'Ana Sayfa CMS', icon: Sliders },
          { id: 'footer', label: 'Footer', icon: Globe },
          { id: 'media', label: 'Medya Kütüphanesi', icon: ImageIcon },
          { id: 'maintenance', label: 'Bakım Modu', icon: Wrench }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB TAB 1: GENEL & MARKA */}
      {activeSubTab === 'general' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Palette className="w-4 h-4 text-rose-600" />
            <span>Marka Kimliği & Görsel Ayarlar</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Site Adı / Marka</label>
              <input
                type="text"
                value={config.branding.siteName}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, branding: { ...prev.branding, siteName: e.target.value } }));
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ana Marka Rengi</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.branding.primaryBrandColor || '#e11d48'}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, branding: { ...prev.branding, primaryBrandColor: e.target.value } }));
                    setHasUnsavedChanges(true);
                  }}
                  className="w-9 h-9 rounded-xl border border-slate-200 p-0.5 cursor-pointer"
                />
                <input
                  type="text"
                  value={config.branding.primaryBrandColor || '#e11d48'}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, branding: { ...prev.branding, primaryBrandColor: e.target.value } }));
                    setHasUnsavedChanges(true);
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Logo URL</label>
              <input
                type="text"
                value={config.branding.logoUrl || ''}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, branding: { ...prev.branding, logoUrl: e.target.value } }));
                  setHasUnsavedChanges(true);
                }}
                placeholder="/images/logo.png veya https://..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Varsayılan Paylaşım Görseli (OG Image)</label>
              <input
                type="text"
                value={config.branding.defaultShareImage || ''}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, branding: { ...prev.branding, defaultShareImage: e.target.value } }));
                  setHasUnsavedChanges(true);
                }}
                placeholder="https://.../og-image.jpg"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: DUYURU BANDI */}
      {activeSubTab === 'announcement' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-rose-600" />
              <span>Üst Duyuru Bandı Ayarları</span>
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.announcement.enabled}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, announcement: { ...prev.announcement, enabled: e.target.checked } }));
                  setHasUnsavedChanges(true);
                }}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span className="text-xs font-bold text-slate-800">Duyuru Bandı Aktif</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duyuru Metni</label>
              <input
                type="text"
                value={config.announcement.text}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, announcement: { ...prev.announcement, text: e.target.value } }));
                  setHasUnsavedChanges(true);
                }}
                placeholder="Örn: Yeni Sezon İndirimleri Başladı!"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Buton / Link Metni</label>
                <input
                  type="text"
                  value={config.announcement.ctaText || ''}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, announcement: { ...prev.announcement, ctaText: e.target.value } }));
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="İncele"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hedef URL</label>
                <input
                  type="text"
                  value={config.announcement.ctaUrl || ''}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, announcement: { ...prev.announcement, ctaUrl: e.target.value } }));
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="/sablonlar veya https://..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.announcement.dismissible}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, announcement: { ...prev.announcement, dismissible: e.target.checked } }));
                    setHasUnsavedChanges(true);
                  }}
                  className="w-3.5 h-3.5 text-rose-600 rounded"
                />
                <span>Kullanıcı tarafından kapatılabilir (Dismissible)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.announcement.showOnMobile !== false}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, announcement: { ...prev.announcement, showOnMobile: e.target.checked } }));
                    setHasUnsavedChanges(true);
                  }}
                  className="w-3.5 h-3.5 text-rose-600 rounded"
                />
                <span>Mobilde Göster</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 3: HEADER */}
      {activeSubTab === 'header' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-rose-600" />
            <span>Üst Menü (Header) Navigasyonu</span>
          </h3>

          <div className="space-y-3">
            {config.header.navItems.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={item.isVisible}
                  onChange={(e) => {
                    const navs = [...config.header.navItems];
                    navs[idx].isVisible = e.target.checked;
                    setConfig(prev => ({ ...prev, header: { ...prev.header, navItems: navs } }));
                    setHasUnsavedChanges(true);
                  }}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const navs = [...config.header.navItems];
                    navs[idx].label = e.target.value;
                    setConfig(prev => ({ ...prev, header: { ...prev.header, navItems: navs } }));
                    setHasUnsavedChanges(true);
                  }}
                  className="w-40 px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                />
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => {
                    const navs = [...config.header.navItems];
                    navs[idx].url = e.target.value;
                    setConfig(prev => ({ ...prev, header: { ...prev.header, navItems: navs } }));
                    setHasUnsavedChanges(true);
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: HOMEPAGE CMS */}
      {activeSubTab === 'homepage' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-600" />
            <span>Ana Sayfa İçeriği & Bölüm Sıralaması</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Başlığı</label>
              <input
                type="text"
                value={config.homepage.heroHeadline}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, homepage: { ...prev.homepage, heroHeadline: e.target.value } }));
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Açıklama Metni</label>
              <textarea
                value={config.homepage.heroSubtitle}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, homepage: { ...prev.homepage, heroSubtitle: e.target.value } }));
                  setHasUnsavedChanges(true);
                }}
                rows={2}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none"
              />
            </div>

            {/* Sections Reordering */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">Bölüm Görünürlüğü ve Sıralaması</label>
              <div className="space-y-2">
                {config.homepage.sections.map((sec, idx) => (
                  <div key={sec.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={sec.isVisible}
                        onChange={(e) => {
                          const secs = [...config.homepage.sections];
                          secs[idx].isVisible = e.target.checked;
                          setConfig(prev => ({ ...prev, homepage: { ...prev.homepage, sections: secs } }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-4 h-4 text-rose-600 rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">{sec.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveHomepageSection(idx, 'up')}
                        className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === config.homepage.sections.length - 1}
                        onClick={() => moveHomepageSection(idx, 'down')}
                        className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 5: FOOTER */}
      {activeSubTab === 'footer' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-rose-600" />
              <span>Alt Bilgi (Footer) & İletişim</span>
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.footer.enabled}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, footer: { ...prev.footer, enabled: e.target.checked } }));
                  setHasUnsavedChanges(true);
                }}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span className="text-xs font-bold text-slate-800">Tam Footer Aktif</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Şirket / Marka Ünvanı</label>
              <input
                type="text"
                value={config.footer.companyName}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, footer: { ...prev.footer, companyName: e.target.value } }));
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Destek E-posta</label>
              <input
                type="email"
                value={config.footer.contactEmail}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, footer: { ...prev.footer, contactEmail: e.target.value } }));
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Kısa Tanıtım Açıklaması</label>
              <textarea
                value={config.footer.description}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, footer: { ...prev.footer, description: e.target.value } }));
                  setHasUnsavedChanges(true);
                }}
                rows={2}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 6: MEDYA KÜTÜPHANESİ */}
      {activeSubTab === 'media' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-rose-600" />
              <span>Genel Görsel & Medya Kütüphanesi</span>
            </h3>
            <label className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Yükleniyor...' : 'Görsel Yükle'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {mediaList.map((m) => (
              <div key={m.name} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 group relative">
                <div className="h-28 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center mb-2">
                  <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                </div>
                <p className="text-[11px] font-bold text-slate-800 truncate">{m.name}</p>
                <p className="text-[10px] text-slate-400">{(m.size / 1024).toFixed(0)} KB</p>

                <button
                  type="button"
                  onClick={() => handleDeleteMedia(m.name)}
                  className="absolute top-4 right-4 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-rose-700"
                  aria-label="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 7: BAKIM MODU */}
      {activeSubTab === 'maintenance' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-rose-600" />
              <span>Bakım Modu Yönetimi</span>
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.maintenance.enabled}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, maintenance: { ...prev.maintenance, enabled: e.target.checked } }));
                  setHasUnsavedChanges(true);
                }}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span className={`text-xs font-bold ${config.maintenance.enabled ? 'text-rose-600' : 'text-slate-800'}`}>
                {config.maintenance.enabled ? '⚠️ Bakım Modu AKTİF' : 'Bakım Modu Kapalı'}
              </span>
            </label>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-bold">Önemli Güvenlik Notu:</p>
            <p>
              Bakım modu aktif edildiğinde ziyaretçiler bakım sayfasına yönlendirilir. Super Admin paneli (/super-admin), health check endpoints (/api/health) ve kritik webhooklar her zaman erişilebilir kalır.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bakım Başlığı</label>
              <input
                type="text"
                value={config.maintenance.title}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, maintenance: { ...prev.maintenance, title: e.target.value } }));
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Açıklama</label>
              <textarea
                value={config.maintenance.description}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, maintenance: { ...prev.maintenance, description: e.target.value } }));
                  setHasUnsavedChanges(true);
                }}
                rows={3}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tahmini Bitiş Süresi</label>
                <input
                  type="text"
                  value={config.maintenance.estimatedReturn || ''}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, maintenance: { ...prev.maintenance, estimatedReturn: e.target.value } }));
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="Örn: 30 dakika"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destek E-posta Adresi</label>
                <input
                  type="email"
                  value={config.maintenance.supportEmail || ''}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, maintenance: { ...prev.maintenance, supportEmail: e.target.value } }));
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/bakim?preview=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Bakım Ekranını Canlı Önizle</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
