'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Info, Sparkles, Megaphone, ArrowRight, X } from 'lucide-react';
import { defaultSiteConfig, SiteAnnouncementConfig } from '@/lib/site-settings';

export default function PlatformAnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<SiteAnnouncementConfig>(defaultSiteConfig.announcement);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/site-settings/public')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.announcement) {
          setAnnouncement(data.settings.announcement);
        }
      })
      .catch(() => {});
  }, []);

  if (!announcement || !announcement.enabled || !announcement.text || dismissed) {
    return null;
  }

  const toneStyles: Record<string, string> = {
    rose: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-500/30',
    amber: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-500/30',
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500/30',
    indigo: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500/30',
    dark: 'bg-slate-900 text-slate-100 border-slate-800'
  };

  const currentToneClass = toneStyles[announcement.tone || 'rose'] || toneStyles.rose;

  return (
    <aside
      aria-label="Platform Duyurusu"
      className={`relative z-50 py-2.5 px-4 text-xs font-semibold backdrop-blur-md border-b flex items-center justify-between shadow-sm transition-all ${currentToneClass} ${announcement.showOnMobile === false ? 'hidden sm:flex' : ''} ${announcement.showOnDesktop === false ? 'sm:hidden' : ''}`}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3 text-center sm:text-left justify-center flex-1">
        <Megaphone className="w-4 h-4 shrink-0 animate-pulse" />
        <span className="leading-tight">{announcement.text}</span>
        {announcement.ctaText && announcement.ctaUrl && (
          <Link
            href={announcement.ctaUrl}
            target={announcement.openInNewTab ? '_blank' : '_self'}
            rel={announcement.openInNewTab ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:opacity-90 transition-opacity ml-1"
          >
            <span>{announcement.ctaText}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      {announcement.dismissible !== false && (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md hover:bg-black/20 text-white/80 hover:text-white transition-all cursor-pointer shrink-0 ml-2"
          title="Kapat"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </aside>
  );
}
