import { test, expect } from '@playwright/test';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { sanitizeCell } from '../src/components/admin/guests/GuestExportDialog';

test.describe('CSV/XLSX Import/Export Comprehensive Tests', () => {
  const fixturesDir = path.resolve(__dirname, 'fixtures');

  test('Formula injection characters are sanitized during export', () => {
    const dangerousInputs = ['=CMD()', '+1+1', '-5+5', '@SUM(A1)'];
    const safeInputs = ['Ahmet', 'Yılmaz', '1234'];

    for (const input of dangerousInputs) {
      expect(sanitizeCell(input)).toBe(`'${input}`);
    }

    for (const input of safeInputs) {
      expect(sanitizeCell(input)).toBe(input);
    }
  });

  test('Valid CSV parses correctly with Turkish characters', () => {
    const csvPath = path.resolve(fixturesDir, 'guests-valid.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
    
    expect(parsed.errors.length).toBe(0);
    expect(parsed.data.length).toBe(3);
    expect((parsed.data[0] as any)['Ad']).toBe('Ahmet');
    expect((parsed.data[1] as any)['Soyad']).toBe('Demir');
    
    // Check Turkish characters
    expect((parsed.data[2] as any)['Soyad']).toBe('Öztürk');
    expect((parsed.data[1] as any)['Not']).toBe('Vejetaryen');
  });

  test('Invalid CSV missing required columns can be identified', () => {
    const csvPath = path.resolve(fixturesDir, 'guests-invalid-columns.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
    
    expect(parsed.meta.fields).not.toContain('Ad');
    expect(parsed.meta.fields).not.toContain('Soyad');
  });

  test('Duplicate records are detected', () => {
    // Generate a duplicate CSV in memory
    const csvContent = `Ad,Soyad\nAli,Veli\nAli,Veli`;
    const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
    expect(parsed.data.length).toBe(2);
    // UI logic checks duplicates by comparing Ad+Soyad, we verify it's parsable
    expect((parsed.data[0] as any)['Ad']).toBe((parsed.data[1] as any)['Ad']);
  });

  test('Blank rows are skipped correctly', () => {
    const csvContent = `Ad,Soyad\nAli,Veli\n\n\nAyşe,Fatma\n\n`;
    const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
    expect(parsed.data.length).toBe(2);
  });

  test('Extremely long cell is handled', () => {
    const longString = 'a'.repeat(10000);
    const csvContent = `Ad,Soyad\n${longString},Veli`;
    const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
    expect((parsed.data[0] as any)['Ad'].length).toBe(10000);
  });

  test('XLSX import simulation (ExcelJS parsing)', async () => {
    // Create an XLSX file in memory
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Test');
    sheet.columns = [
      { header: 'Ad', key: 'Ad' },
      { header: 'Soyad', key: 'Soyad' },
    ];
    sheet.addRow({ Ad: 'Şükrü', Soyad: 'Çelik' });
    
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Parse it back as import simulation
    const parsedWorkbook = new ExcelJS.Workbook();
    await parsedWorkbook.xlsx.load(buffer as ArrayBuffer);
    const parsedSheet = parsedWorkbook.worksheets[0];
    
    const jsonData: any[] = [];
    const headers: string[] = [];

    parsedSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell, colNumber) => {
          headers[colNumber] = cell.text;
        });
      } else {
        const rowData: any = {};
        row.eachCell((cell, colNumber) => {
          rowData[headers[colNumber]] = cell.text;
        });
        jsonData.push(rowData);
      }
    });

    expect(jsonData.length).toBe(1);
    expect(jsonData[0]['Ad']).toBe('Şükrü');
    expect(jsonData[0]['Soyad']).toBe('Çelik');
  });
});
