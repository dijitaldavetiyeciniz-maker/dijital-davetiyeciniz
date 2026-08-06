'use client';

import React, { useState } from 'react';

export default function GuestFormDialog({ 
  weddingId, 
  onClose, 
  onSuccess,
  initialData,
  groups 
}: { 
  weddingId: string, 
  onClose: () => void, 
  onSuccess: () => void,
  initialData?: any,
  groups?: any[]
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState(initialData?.first_name || '');
  const [lastName, setLastName] = useState(initialData?.last_name || '');
  const [plusOnes, setPlusOnes] = useState(initialData?.plus_ones_allowed || 0);
  const [children, setChildren] = useState(initialData?.children_count || 0);
  const [groupId, setGroupId] = useState<string>(initialData?.group_id || '');

  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [mealPreference, setMealPreference] = useState(initialData?.meal_preference || '');
  const [allergyNotes, setAllergyNotes] = useState(initialData?.allergy_notes || '');
  const [specialNeeds, setSpecialNeeds] = useState(initialData?.special_needs || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = initialData ? `/api/guests/${initialData.id}` : '/api/guests';
      const method = initialData ? 'PUT' : 'POST';

      const payloadData = {
        first_name: firstName, 
        last_name: lastName, 
        plus_ones_allowed: plusOnes, 
        children_count: children, 
        group_id: groupId || null,
        phone: phone || null,
        email: email || null,
        meal_preference: mealPreference || null,
        allergy_notes: allergyNotes || null,
        special_needs: specialNeeds || null,
        notes: notes || null
      };

      const payload = initialData 
        ? payloadData
        : {
            wedding_id: weddingId,
            guests: [payloadData]
          };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'İşlem başarısız oldu.');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{initialData ? 'Misafiri Düzenle' : 'Yeni Misafir Ekle'}</h3>
          <button onClick={onClose} className="text-xl">&times;</button>
        </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Telefon</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="0555..." />
            </div>
            <div>
              <label className="block text-sm mb-1">E-posta</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="ornek@mail.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Yemek Tercihi</label>
              <input type="text" value={mealPreference} onChange={e => setMealPreference(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="Örn: Vejetaryen, Et" />
            </div>
            <div>
              <label className="block text-sm mb-1">Alerji Notu</label>
              <input type="text" value={allergyNotes} onChange={e => setAllergyNotes(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="Örn: Fıstık, Süt" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Özel İhtiyaçlar</label>
              <input type="text" value={specialNeeds} onChange={e => setSpecialNeeds(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="Örn: Tekerlekli sandalye" />
            </div>
            <div>
              <label className="block text-sm mb-1">Ek Notlar</label>
              <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="Misafir hakkında ek not" />
            </div>
          </div>
          
          {groups && groups.length > 0 && (
            <div>
              <label className="block text-sm mb-1">Grup</label>
              <select 
                value={groupId} 
                onChange={e => setGroupId(e.target.value)} 
                className="w-full border rounded p-2 text-sm"
              >
                <option value="">Grup Seçin (İsteğe bağlı)</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">İptal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? 'Kaydediliyor...' : (initialData ? 'Güncelle' : 'Ekle')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
