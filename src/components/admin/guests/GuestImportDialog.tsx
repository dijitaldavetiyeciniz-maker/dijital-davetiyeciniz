'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default function GuestImportDialog({ 
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
  const [results, setResults] = useState<any>(null);

  const processFile = (file: File) => {
    setLoading(true);
    setError(null);
    setResults(null);

    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          handleData(results.data);
        },
        error: (err: any) => {
          setError(err.message);
          setLoading(false);
        }
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        handleData(jsonData);
      };
      reader.onerror = () => {
        setError('Dosya okunamadı.');
        setLoading(false);
      };
      reader.readAsBinaryString(file);
    } else {
      setError('Sadece CSV ve XLSX dosyaları desteklenir.');
      setLoading(false);
    }
  };

  const handleData = async (data: any[]) => {
    try {
      const guests = data.map(row => ({
        first_name: row['Ad'] || row['Adı'] || row['first_name'] || '',
        last_name: row['Soyad'] || row['Soyadı'] || row['last_name'] || '',
        phone: row['Telefon'] || row['phone'] || null,
        email: row['E-posta'] || row['email'] || null,
        plus_ones_allowed: parseInt(row['Yetişkin'] || row['plus_ones'] || '0', 10) || 0,
        children_count: parseInt(row['Çocuk'] || row['children'] || '0', 10) || 0,
        notes: row['Not'] || null
      })).filter(g => g.first_name && g.last_name); // Basic validation

      if (guests.length === 0) {
        setError('Dosyada geçerli veri bulunamadı. Sütun isimlerini kontrol edin (Ad, Soyad).');
        setLoading(false);
        return;
      }

      if (guests.length > 500) {
        setError('Tek seferde en fazla 500 misafir eklenebilir.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wedding_id: weddingId, guests })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'İçe aktarma başarısız oldu.');
      }

      setResults({ success: true, count: guests.length });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Misafir İçe Aktar</h3>
        
        {results ? (
          <div>
            <div className="text-green-600 mb-4">{results.count} misafir başarıyla eklendi!</div>
            <button onClick={onSuccess} className="w-full py-2 bg-slate-900 text-white rounded">Kapat</button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-600 mb-4">
              Desteklenen formatlar: CSV, XLSX. Sütun isimleri: "Ad", "Soyad", "Telefon", "E-posta", "Yetişkin", "Çocuk", "Not".
            </p>
            <input 
              type="file" 
              accept=".csv, .xlsx, .xls" 
              onChange={(e) => e.target.files && processFile(e.target.files[0])}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
            />
            {loading && <div className="text-blue-600 text-sm mb-4">İşleniyor... Lütfen bekleyin.</div>}
            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
            
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={onClose} className="px-4 py-2 border rounded" disabled={loading}>İptal</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
