'use client';

import React, { useState } from 'react';
import { Guest } from './types';
import { Edit2, Trash2, Copy, RefreshCw, Ban, Undo2 } from 'lucide-react';

export default function GuestTokenActions({ 
  guest, 
  onRenew, 
  onRevoke,
  onEdit,
  onDelete
}: { 
  guest: Guest, 
  onRenew: (id: string) => void,
  onRevoke: (id: string) => void,
  onEdit: (guest: Guest) => void,
  onDelete: (id: string) => void
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
        <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-1 rounded">Erişim İptal Edildi</span>
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              if (confirm('Erişimi yeniden etkinleştirmek için yeni bir bağlantı oluşturulacak. Emin misiniz?')) {
                onRenew(guest.id);
              }
            }}
            className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 py-1 rounded"
            title="Yeniden Etkinleştir (Yeni Link)"
          >
            <Undo2 className="w-3 h-3 mr-1" />
            Aç
          </button>
          <button 
            onClick={() => onEdit(guest)} 
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            title="Düzenle"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              if (confirm('Bu misafiri tamamen silmek istediğinize emin misiniz?')) {
                onDelete(guest.id);
              }
            }} 
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            title="Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end space-y-2">
      <div className="flex items-center space-x-1 bg-slate-50 border rounded-md p-1">
        <button 
          onClick={handleCopy}
          className={`p-1.5 rounded-md transition-colors ${copied ? 'bg-green-100 text-green-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title={copied ? 'Kopyalandı!' : 'Linki Kopyala'}
        >
          <Copy className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-300 mx-1"></div>
        <button 
          onClick={() => onEdit(guest)} 
          className="p-1.5 text-slate-600 hover:bg-blue-100 hover:text-blue-700 rounded-md transition-colors"
          title="Düzenle"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onRenew(guest.id)} 
          className="p-1.5 text-slate-600 hover:bg-orange-100 hover:text-orange-700 rounded-md transition-colors"
          title="Eski linki iptal edip yeni link üretir (Yenile)"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button 
          onClick={() => {
            if (confirm('Bu misafirin davetiye erişimini iptal etmek istediğinize emin misiniz?')) {
              onRevoke(guest.id);
            }
          }} 
          className="p-1.5 text-slate-600 hover:bg-red-100 hover:text-red-700 rounded-md transition-colors"
          title="Erişimi İptal Et"
        >
          <Ban className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-300 mx-1"></div>
        <button 
          onClick={() => {
            if (confirm('Bu misafiri tamamen silmek istediğinize emin misiniz?')) {
              onDelete(guest.id);
            }
          }} 
          className="p-1.5 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-colors"
          title="Sil"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
