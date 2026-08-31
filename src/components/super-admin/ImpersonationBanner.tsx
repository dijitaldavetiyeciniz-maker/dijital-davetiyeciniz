'use client';

import React, { useState } from 'react';
import { ShieldAlert, LogOut, Lock, Unlock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ImpersonationBannerProps {
  targetEmail?: string;
  weddingSlug?: string;
  accessLevel?: 'read_only' | 'full_support';
  expiresAt?: string;
}

export default function ImpersonationBanner({
  targetEmail = 'Kullanıcı',
  weddingSlug,
  accessLevel = 'read_only',
  expiresAt
}: ImpersonationBannerProps) {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = async () => {
    setIsExiting(true);
    try {
      await fetch('/api/super-admin/impersonate', { method: 'DELETE' });
      window.location.href = '/super-admin';
    } catch {
      window.location.href = '/super-admin';
    }
  };

  return (
    <div
      role="banner"
      aria-label="Teknik Destek Modu"
      className="w-full bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-md sticky top-0 z-[100] border-b border-amber-600 animate-in slide-in-from-top duration-200"
    >
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-slate-950 shrink-0" />
        <span>
          TEKNİK DESTEK MODU: <span className="underline">{targetEmail}</span> hesabını görüntülüyorsunuz.
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950 text-amber-400 text-[10px]">
          {accessLevel === 'read_only' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          <span>{accessLevel === 'read_only' ? 'Salt Okunur' : 'Tam Yetkili'}</span>
        </span>
      </div>

      <button
        type="button"
        onClick={handleExit}
        disabled={isExiting}
        className="px-3 py-1 bg-slate-950 text-white rounded-lg text-[11px] font-extrabold hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
      >
        <LogOut className="w-3 h-3" />
        <span>{isExiting ? 'Çıkılıyor...' : 'Destek Modundan Çık'}</span>
      </button>
    </div>
  );
}
