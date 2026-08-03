'use client';

import React, { useState, useEffect } from 'react';


export default function GuestManagementTab({ weddingId }: { weddingId: string }) {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');


  useEffect(() => {
    fetchGuests();
  }, [weddingId]);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/guests?wedding_id=${weddingId}`);
      if (res.ok) {
        const data = await res.json();
        setGuests(data.guests);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wedding_id: weddingId,
          guests: [{ first_name: firstName, last_name: lastName }]
        })
      });
      if (res.ok) {
        setFirstName('');
        setLastName('');
        fetchGuests();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRevokeToken = async (guestId: string) => {
    try {
      const res = await fetch(`/api/guests/${guestId}/revoke`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchGuests(); // Refresh list to get new tokenUrl
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyLink = (tokenUrl: string) => {
    // Determine the base URL dynamically based on environment
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    // Assuming the wedding slug is known, but we only have weddingId here.
    // For now, we will construct a generic link, or we'd need the wedding slug.
    // To solve this properly, we need the slug passed as a prop, or just construct a temporary link.
    // In actual app, the public url is /d/[slug].
    // If we don't have the slug in this tab, we can use a generic /d/id?guest=...
    // Let's assume the page is accessed from /d/[slug]/admin, we can get slug from URL.
    const pathParts = window.location.pathname.split('/');
    const slug = pathParts[2]; // /d/[slug]/admin -> pathParts[0]="", [1]="d", [2]="slug"
    const link = `${baseUrl}/d/${slug}?guest=${tokenUrl}`;
    navigator.clipboard.writeText(link);
    alert('Kişisel bağlantı kopyalandı:\n' + link);
  };

  if (loading) return <div>Misafirler yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Misafir Yönetimi</h2>

      <form onSubmit={handleAddGuest} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ad</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Soyad</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Misafir Ekle
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İsim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {guests.map((guest) => (
              <tr key={guest.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {guest.first_name} {guest.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {guest.rsvp_status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {guest.is_revoked ? (
                    <span className="text-red-600">İptal Edildi</span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleCopyLink(guest.tokenUrl)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Bağlantıyı Kopyala
                      </button>
                      <button
                        onClick={() => handleRevokeToken(guest.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Yenile (Revoke)
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {guests.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  Henüz misafir eklenmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
