'use client';

import React, { useState } from 'react';
import { Guest } from './types';

export default function GuestTokenActions({ 
  guest, 
  onRenew, 
  onRevoke 
}: { 
  guest: Guest, 
  onRenew: (id: string) => void,
  onRevoke: (id: string) => void 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (guest.tokenUrl) {
      const url = `${window.location.origin}/d/${window.location.pathname.split('/')[2]}?guest=${guest.tokenUrl}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (guest.token_revoked_at) {
    return (
      <div className="flex flex-col items-end space-y-2">
        <span className="text-xs text-red-500 font-semibold">Erişim İptal Edildi</span>
        <button 
          onClick={() => {
            if (confirm('Erişimi yeniden etkinleştirmek için yeni bir bağlantı oluşturulacak. Emin misiniz?')) {
              onRenew(guest.id);
            }
          }}
          className="text-xs text-blue-600 hover:underline"
        >
          Yeniden Etkinleştir (Yeni Link)
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end space-y-2">
      <div className="flex space-x-2">
        <button 
          onClick={handleCopy}
          className="px-3 py-1 bg-slate-800 text-white text-xs rounded hover:bg-slate-700 transition-colors"
        >
          {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
        </button>
      </div>
      <div className="flex space-x-3 text-xs">
        <button onClick={() => onRenew(guest.id)} className="text-blue-600 hover:underline" title="Eski linki iptal edip yeni link üretir">
          Yenile
        </button>
        <button 
          onClick={() => {
            if (confirm('Bu misafirin davetiye erişimini tamamen iptal etmek istediğinize emin misiniz?')) {
              onRevoke(guest.id);
            }
          }} 
          className="text-red-600 hover:underline"
        >
          İptal Et
        </button>
      </div>
    </div>
  );
}
