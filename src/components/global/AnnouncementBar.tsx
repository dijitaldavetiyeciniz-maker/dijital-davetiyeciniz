'use client';

import React, { useState, useEffect } from 'react';
import { SiteAnnouncementConfig } from '@/lib/site-settings';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface AnnouncementBarProps {
  config: SiteAnnouncementConfig;
}

export default function AnnouncementBar({ config }: AnnouncementBarProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && config.dismissible) {
      const dismissed = sessionStorage.getItem('announcement_dismissed');
      if (dismissed === config.text) {
        setIsDismissed(true);
      }
    }
  }, [config.text, config.dismissible]);

  if (!config.enabled || isDismissed || !config.text) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('announcement_dismissed', config.text);
    }
  };

  const toneBgClass = {
    rose: 'bg-rose-600 text-white',
    amber: 'bg-amber-500 text-white',
    emerald: 'bg-emerald-600 text-white',
    indigo: 'bg-indigo-600 text-white',
    dark: 'bg-slate-900 text-white'
  }[config.tone || 'rose'] || 'bg-rose-600 text-white';

  const visibilityClass = `${config.showOnMobile === false ? 'hidden sm:flex' : 'flex'} ${
    config.showOnDesktop === false ? 'sm:hidden' : ''
  }`;

  return (
    <div
      role="region"
      aria-label="Duyuru Bandı"
      className={`w-full py-2 px-4 ${toneBgClass} text-xs font-medium justify-between items-center z-50 transition-all ${visibilityClass}`}
    >
      <div className="flex-1 flex items-center justify-center gap-2 text-center">
        <Sparkles className="w-3.5 h-3.5 shrink-0 opacity-90" />
        <span>{config.text}</span>
        {config.ctaText && config.ctaUrl && (
          <Link
            href={config.ctaUrl}
            target={config.openInNewTab ? '_blank' : '_self'}
            rel={config.openInNewTab ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-1 font-bold underline ml-1.5 hover:opacity-90 transition"
          >
            <span>{config.ctaText}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {config.dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-md hover:bg-black/10 transition cursor-pointer text-white/90 hover:text-white"
          aria-label="Duyuruyu Kapat"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
