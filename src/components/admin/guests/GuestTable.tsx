'use client';

import React, { useState } from 'react';
import { Guest } from './types';
import GuestTokenActions from './GuestTokenActions';

export default function GuestTable({ 
  guests, 
  onRenew, 
  onRevoke 
}: { 
  guests: Guest[], 
  onRenew: (id: string) => void,
  onRevoke: (id: string) => void
}) {
  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3">Misafir</th>
            <th className="px-4 py-3">İletişim</th>
            <th className="px-4 py-3">Durum</th>
            <th className="px-4 py-3 text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {guests.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Kayıtlı misafir bulunamadı.</td>
            </tr>
          ) : (
            guests.map((guest) => (
              <tr key={guest.id} className={guest.token_revoked_at ? 'bg-red-50/30 opacity-70' : ''}>
                <td className="px-4 py-3">
                  <div className="font-medium">{guest.first_name} {guest.last_name}</div>
                  <div className="text-xs text-slate-500">
                    +{guest.plus_ones_allowed} Yetişkin, {guest.children_count} Çocuk
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div>{guest.phone || '-'}</div>
                  <div>{guest.email || '-'}</div>
                </td>
                <td className="px-4 py-3">
                  {guest.rsvp_status === 'attending' && <span className="text-green-600 font-medium">Katılıyor</span>}
                  {guest.rsvp_status === 'not_attending' && <span className="text-red-600 font-medium">Katılmıyor</span>}
                  {guest.rsvp_status === 'undecided' && <span className="text-orange-500 font-medium">Kararsız</span>}
                  {!guest.rsvp_status && <span className="text-slate-400">Bekliyor</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <GuestTokenActions guest={guest} onRenew={onRenew} onRevoke={onRevoke} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
