'use client';
import { useState, useEffect } from 'react';
import { AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function PlatformAnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<{
    enabled: boolean;
    message: string;
    type: 'info' | 'maintenance' | 'important';
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/super-admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.announcement_enabled && data.settings?.announcement_message) {
          setAnnouncement({
            enabled: true,
            message: data.settings.announcement_message,
            type: data.settings.announcement_type || 'info'
          });
        }
      })
      .catch(() => {});
  }, []);

  if (!announcement || !announcement.enabled || dismissed) return null;

  const bgStyles = {
    info: 'bg-indigo-600/90 text-white border-indigo-500/30',
    maintenance: 'bg-amber-600/90 text-white border-amber-500/30',
    important: 'bg-rose-600/90 text-white border-rose-500/30'
  };

  const icons = {
    info: <Info className="w-4 h-4 shrink-0" />,
    maintenance: <AlertTriangle className="w-4 h-4 shrink-0" />,
    important: <AlertCircle className="w-4 h-4 shrink-0" />
  };

  return (
    <aside aria-label="Duyuru" className={`relative z-50 py-2.5 px-4 text-xs font-semibold backdrop-blur-md border-b flex items-center justify-between shadow-sm ${bgStyles[announcement.type] || bgStyles.info}`}>
      <div className="max-w-7xl mx-auto flex items-center gap-2.5 text-center sm:text-left justify-center flex-1">
        {icons[announcement.type]}
        <span>{announcement.message}</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-md hover:bg-black/20 text-white/80 hover:text-white transition-all cursor-pointer shrink-0"
        title="Kapat"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
