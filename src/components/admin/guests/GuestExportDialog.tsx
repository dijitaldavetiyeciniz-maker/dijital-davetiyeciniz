'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import { Guest } from './types';

export const sanitizeCell = (value: any) => {
  if (typeof value === 'string' && /^[=+\-@]/.test(value)) {
    return `'${value}`;
  }
  return value;
};

export default function GuestExportDialog({ 
  guests, 
  onClose 
}: { 
  guests: Guest[], 
  onClose: () => void 
}) {
  const [includeTokens, setIncludeTokens] = useState(false);
  const [format, setFormat] = useState<'csv' | 'xlsx'>('xlsx');

  const handleExport = async () => {
    // Audit log request to server for sensitive export
    if (includeTokens) {
      if (!confirm('DİKKAT: Özel davetiye linklerini dışa aktarmak üzeresiniz. Bu bağlantılar, davetlilerinizin kişisel giriş bağlantılarıdır. Devam etmek istiyor musunuz?')) {
        return;
      }
      // Assuming an API endpoint could log this, but we'll do it on the client side since it's just a file generation for now.
    }

    const dataToExport = guests.map(g => ({
      'Ad': sanitizeCell(g.first_name),
      'Soyad': sanitizeCell(g.last_name),
      'Telefon': sanitizeCell(g.phone || ''),
      'E-posta': sanitizeCell(g.email || ''),
      'Yetişkin Sayısı': g.plus_ones_allowed,
      'Çocuk Sayısı': g.children_count,
      'LCV Durumu': g.rsvp_status || 'Bekliyor',
      'Özel Not': sanitizeCell(g.notes || ''),
      ...(includeTokens ? { 'Özel Link': g.token_revoked_at ? 'İptal Edildi' : (g.tokenUrl ? `${window.location.origin}/${window.location.pathname.split('/')[1]}?guest=${g.tokenUrl}` : '') } : {})
    }));

    if (format === 'csv') {
      const csv = Papa.unparse(dataToExport, { header: true });
      const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Turkish chars
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `misafir_listesi_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Misafirler');
      
      const columns = Object.keys(dataToExport[0]).map(key => ({ header: key, key }));
      worksheet.columns = columns;
      worksheet.addRows(dataToExport);

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `misafir_listesi_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Dışa Aktar</h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Format</label>
            <select 
              value={format} 
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full border rounded p-2 text-sm"
            >
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="csv">CSV (.csv)</option>
            </select>
          </div>
          
          <div className="flex items-start space-x-2">
            <input 
              type="checkbox" 
              id="include_tokens" 
              checked={includeTokens} 
              onChange={(e) => setIncludeTokens(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="include_tokens" className="text-sm">
              <span className="font-semibold text-red-600 block">Hassas Veri: Özel Bağlantıları Dahil Et</span>
              <span className="text-slate-500 text-xs">Misafirlerinize özel oluşturulan güvenli giriş bağlantılarını listeye ekler. Dosyayı güvenli bir şekilde sakladığınızdan emin olun.</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded text-sm">İptal</button>
          <button onClick={handleExport} className="px-4 py-2 bg-slate-900 text-white rounded text-sm">İndir</button>
        </div>
      </div>
    </div>
  );
}
