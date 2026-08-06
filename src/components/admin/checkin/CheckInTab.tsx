'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { QrCode, Search, UserPlus, CheckCircle2, XCircle, Clock, AlertTriangle, RefreshCcw } from 'lucide-react';

interface CheckInTabProps {
  weddingId: string;
  guests: any[];
  onRefreshGuests: () => void;
}

interface CheckInHistory {
  id: string; // guest id or token
  name: string;
  time: string;
  status: 'success' | 'error' | 'pending';
  message?: string;
  isRetry?: boolean;
}

export default function CheckInTab({ weddingId, guests, onRefreshGuests }: CheckInTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState<CheckInHistory[]>([]);
  const [retryQueue, setRetryQueue] = useState<{ id: string, token?: string, guest_id?: string, name: string, time: string }[]>([]);
  const [scannerActive, setScannerActive] = useState(false);
  const [newGuestName, setNewGuestName] = useState({ first_name: '', last_name: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [checkedInCount, setCheckedInCount] = useState<number | null>(null);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Gercek check-in sayisini cek (rsvp_status degil - once buradaki
  // sayac RSVP durumunu gosteriyordu, gercek check-in verisi degildi)
  const fetchCheckedInCount = useCallback(async () => {
    try {
      const res = await fetch(`/api/check-ins?wedding_id=${weddingId}`);
      if (res.ok) {
        const data = await res.json();
        setCheckedInCount(data.count);
      }
    } catch (e) {
      console.error('Failed to fetch check-in count', e);
    }
  }, [weddingId]);

  useEffect(() => {
    fetchCheckedInCount();
  }, [fetchCheckedInCount]);

  // Load retry queue from local storage on mount
  useEffect(() => {
    const storedQueue = localStorage.getItem(`checkin_queue_${weddingId}`);
    if (storedQueue) {
      try {
        setRetryQueue(JSON.parse(storedQueue));
      } catch (e) {
        console.error('Failed to parse stored queue');
      }
    }
  }, [weddingId]);

  // Save retry queue to local storage when it changes
  useEffect(() => {
    localStorage.setItem(`checkin_queue_${weddingId}`, JSON.stringify(retryQueue));
  }, [retryQueue, weddingId]);

  // Process check-in API call
  const processCheckIn = useCallback(async (token?: string, guestId?: string, name: string = 'Misafir') => {
    const payload = token ? { token } : { guest_id: guestId };
    const historyId = guestId || token || Date.now().toString();
    
    // Optimistic UI update
    setHistory(prev => [{
      id: historyId,
      name,
      time: new Date().toLocaleTimeString(),
      status: 'pending' as const
    }, ...prev].slice(0, 20));

    try {
      const res = await fetch('/api/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok && res.status !== 401 && res.status !== 404) {
        throw new Error(data.error || 'Server error');
      }

      if (data.alreadyCheckedIn) {
        setHistory(prev => prev.map(h => h.id === historyId ? { ...h, status: 'error', message: 'Zaten giriş yapıldı' } : h));
      } else if (data.success) {
        setHistory(prev => prev.map(h => h.id === historyId ? { ...h, status: 'success', message: 'Başarılı', name: `${data.guest?.first_name} ${data.guest?.last_name}` } : h));
        fetchCheckedInCount();
      } else {
        setHistory(prev => prev.map(h => h.id === historyId ? { ...h, status: 'error', message: data.error || 'Hata' } : h));
      }
    } catch (err: any) {
      // Network error or unexpected -> Add to retry queue
      setHistory(prev => prev.map(h => h.id === historyId ? { ...h, status: 'error', message: 'Bağlantı koptu, sıraya alındı' } : h));
      setRetryQueue(prev => {
        if (prev.find(q => q.id === historyId)) return prev;
        return [...prev, { id: historyId, token, guest_id: guestId, name, time: new Date().toLocaleTimeString() }];
      });
    }
  }, [fetchCheckedInCount]);

  // Process retry queue
  const flushRetryQueue = async () => {
    if (retryQueue.length === 0) return;
    const currentQueue = [...retryQueue];
    setRetryQueue([]); // Clear immediately, will add back if fails
    
    for (const item of currentQueue) {
      await processCheckIn(item.token, item.guest_id, item.name);
    }
  };

  // Setup Scanner
  useEffect(() => {
    if (scannerActive && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: {width: 250, height: 250},
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      }, false);
      
      let lastScanned = '';
      
      scanner.render((decodedText) => {
        if (decodedText !== lastScanned) {
          lastScanned = decodedText;
          // Assume decodedText is the token
          processCheckIn(decodedText, undefined, "QR Okutuldu...");
          // Reset last scanned after 3 seconds to allow rescanning same person if needed
          setTimeout(() => { lastScanned = ''; }, 3000);
        }
      }, (error) => {
        // silent
      });
      
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [scannerActive, processCheckIn]);

  // Handle Quick Add
  const handleQuickAdd = async () => {
    if (!newGuestName.first_name || !newGuestName.last_name) return;
    setIsAdding(true);
    
    // Ghost record fallback
    const ghostId = `ghost_${Date.now()}`;
    const name = `${newGuestName.first_name} ${newGuestName.last_name}`;
    
    try {
      // 1. Add guest
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wedding_id: weddingId,
          first_name: newGuestName.first_name,
          last_name: newGuestName.last_name,
          rsvp_status: 'attending' // implicitly attending if they are at the door
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Misafir eklenemedi');
      }

      onRefreshGuests();
      setNewGuestName({ first_name: '', last_name: '' });
      setSearchTerm('');
      
      // 2. Check-in guest
      await processCheckIn(undefined, data.guest.id, name);
      
    } catch (err: any) {
      alert(`Hata: ${err.message}. Lütfen bağlantınızı kontrol edin.`);
      // Add to retry queue as a ghost record warning
      setHistory(prev => [{
        id: ghostId,
        name: name,
        time: new Date().toLocaleTimeString(),
        status: 'error' as const,
        message: 'Kayıt eklendi ama check-in başarısız, tekrar deneyin'
      }, ...prev].slice(0, 20));
      
      // We don't have the guest_id if step 1 failed, but if step 1 succeeded and step 2 failed, 
      // processCheckIn already handled the retry queue.
    } finally {
      setIsAdding(false);
    }
  };

  const filteredGuests = guests.filter(g => 
    `${g.first_name} ${g.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const showQuickAdd = searchTerm.trim().length > 2 && filteredGuests.length === 0;

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Toplam Gelen</p>
            <h3 className="text-3xl font-bold text-slate-800">
              {checkedInCount === null ? '...' : checkedInCount}
            </h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        
        {retryQueue.length > 0 && (
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Bekleyen İşlemler</p>
              <h3 className="text-3xl font-bold text-orange-700">{retryQueue.length}</h3>
            </div>
            <button 
              onClick={flushRetryQueue}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Senkronize Et
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Actions */}
        <div className="space-y-6">
          
          {/* Scanner */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <QrCode className="w-5 h-5 mr-2 text-indigo-600" />
                Kamera ile Tarama
              </h3>
              <button
                onClick={() => setScannerActive(!scannerActive)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  scannerActive 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {scannerActive ? 'Kamerayı Kapat' : 'Kamerayı Aç'}
              </button>
            </div>
            
            {scannerActive ? (
              <div id="reader" className="w-full overflow-hidden rounded-lg border-2 border-dashed border-indigo-200"></div>
            ) : (
              <div className="w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400">
                <QrCode className="w-10 h-10 mb-2 opacity-50" />
                <p>Kamerayı açarak QR kod tarayabilirsiniz</p>
              </div>
            )}
          </div>

          {/* Manual Search */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2 text-blue-600" />
              İsimle Manuel Arama
            </h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Misafir adı veya soyadı..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {searchTerm.length > 2 && (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredGuests.map(guest => (
                  <div key={guest.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <p className="font-medium text-slate-800">{guest.first_name} {guest.last_name}</p>
                      <p className="text-xs text-slate-500">Durum: {guest.rsvp_status || 'Belirsiz'}</p>
                    </div>
                    <button
                      onClick={() => processCheckIn(undefined, guest.id, `${guest.first_name} ${guest.last_name}`)}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md text-sm font-medium transition"
                    >
                      İçeri Al
                    </button>
                  </div>
                ))}

                {/* Quick Add Fallback */}
                {showQuickAdd && (
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg text-center">
                    <p className="text-sm text-orange-800 mb-3">Bu isimde kayıtlı misafir bulunamadı.</p>
                    <div className="flex space-x-2 mb-3">
                      <input 
                        type="text" 
                        placeholder="Ad" 
                        value={newGuestName.first_name}
                        onChange={e => setNewGuestName({...newGuestName, first_name: e.target.value})}
                        className="w-1/2 px-3 py-1.5 border rounded-md text-sm"
                      />
                      <input 
                        type="text" 
                        placeholder="Soyad" 
                        value={newGuestName.last_name}
                        onChange={e => setNewGuestName({...newGuestName, last_name: e.target.value})}
                        className="w-1/2 px-3 py-1.5 border rounded-md text-sm"
                      />
                    </div>
                    <button
                      disabled={!newGuestName.first_name || !newGuestName.last_name || isAdding}
                      onClick={handleQuickAdd}
                      className="w-full flex justify-center items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition"
                    >
                      {isAdding ? 'Ekleniyor...' : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Hızlıca Ekle ve İçeri Al
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: History */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-slate-600" />
              Son İşlemler
            </h3>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
              Son 20 kayıt
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Clock className="w-12 h-12 mb-2 opacity-20" />
                <p>Henüz işlem yapılmadı</p>
              </div>
            ) : (
              history.map((h, i) => (
                <div key={`${h.id}-${i}`} className="flex items-start p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="mr-3 mt-0.5">
                    {h.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {h.status === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                    {h.status === 'pending' && <RefreshCcw className="w-5 h-5 text-blue-500 animate-spin" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-slate-800">{h.name}</p>
                      <span className="text-xs text-slate-400">{h.time}</span>
                    </div>
                    {h.message && (
                      <p className={`text-sm mt-0.5 ${h.status === 'error' ? 'text-red-600' : 'text-slate-500'}`}>
                        {h.message}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
