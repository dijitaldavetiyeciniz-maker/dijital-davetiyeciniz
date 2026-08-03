'use client';

import React, { useState } from 'react';

export default function GuestFormDialog({ 
  weddingId, 
  onClose, 
  onSuccess 
}: { 
  weddingId: string, 
  onClose: () => void, 
  onSuccess: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [plusOnes, setPlusOnes] = useState(0);
  const [children, setChildren] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        wedding_id: weddingId,
        guests: [{
          first_name: firstName,
          last_name: lastName,
          plus_ones_allowed: plusOnes,
          children_count: children,
        }]
      };

      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Misafir eklenemedi.');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Yeni Misafir Ekle</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Ad *</label>
              <input required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm mb-1">Soyad *</label>
              <input required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border rounded p-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Yetişkin (+1) İzni</label>
              <input type="number" min="0" max="10" value={plusOnes} onChange={e => setPlusOnes(parseInt(e.target.value) || 0)} className="w-full border rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm mb-1">Çocuk İzni</label>
              <input type="number" min="0" max="10" value={children} onChange={e => setChildren(parseInt(e.target.value) || 0)} className="w-full border rounded p-2 text-sm" />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">İptal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
