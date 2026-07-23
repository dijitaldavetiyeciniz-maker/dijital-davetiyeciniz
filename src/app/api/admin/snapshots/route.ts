import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

// Sadece güvenilir, izin verilen snapshot dosyaları
const allowedSnapshots = new Set([
  "cinematic-poster-desktop-chromium.png",
  "cinematic-poster-mobile-chromium.png",
  "royal-letter-desktop-chromium.png",
  "royal-letter-mobile-chromium.png",
  "polaroid-story-desktop-chromium.png",
  "polaroid-story-mobile-chromium.png",
  "constellation-night-desktop-chromium.png",
  "constellation-night-mobile-chromium.png",
]);

export async function GET(request: Request) {
  // Geliştirme bayrağı veya Production kontrolü
  const isDevBypass = process.env.NODE_ENV === 'development' && process.env.ENABLE_TEMPLATE_SHOWCASE === 'true';
  
  if (!isDevBypass) {
    // Production'da ise Supabase auth check gerekli. 
    // Ancak test dosyalarını hiçbir şekilde production'a sunmuyoruz (sunucuya gitmemeli).
    // O yüzden development dışı her durumda 403.
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file || !allowedSnapshots.has(file)) {
    return NextResponse.json({ error: 'File not found or not allowed' }, { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), 'tests/template-showcase.spec.ts-snapshots', file);
    const fileBuffer = readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Snapshot not found. Run Playwright tests first.' }, { status: 404 });
  }
}
