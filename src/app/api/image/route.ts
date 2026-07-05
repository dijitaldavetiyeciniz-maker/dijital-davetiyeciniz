import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file_id = searchParams.get('file_id');
  const wedding_id = searchParams.get('wedding_id');

  if (!file_id || !wedding_id) {
    return new NextResponse('Eksik parametre', { status: 400 });
  }

  try {
    // 1. Düğünün Bot Token bilgisini çek
    const { data: wedding } = await supabase
      .from('weddings')
      .select('telegram_bot_token')
      .eq('id', wedding_id)
      .single();

    const isCustomBot = wedding.telegram_bot_token && wedding.telegram_bot_token.includes(':');
    const token = isCustomBot ? wedding.telegram_bot_token : process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return new NextResponse('Bot token bulunamadı', { status: 404 });
    }

    // 2. Telegram'dan file_path bilgisini al
    const getFileUrl = `https://api.telegram.org/bot${token}/getFile?file_id=${file_id}`;
    const fileRes = await fetch(getFileUrl);
    const fileData = await fileRes.json();

    if (!fileData.ok) {
      return new NextResponse('Telegram dosya bulunamadı', { status: 404 });
    }

    const filePath = fileData.result.file_path;

    // 3. Dosyanın kendisini Telegram'dan indir ve doğrudan istemciye (tarayıcıya) gönder
    const imageUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
    const imageRes = await fetch(imageUrl);

    if (!imageRes.ok) {
      return new NextResponse('Fotoğraf indirilemedi', { status: 500 });
    }

    // Proxy (Aracı) olarak Telegram'dan aldığımız raw veriyi aynen döndürüyoruz
    return new NextResponse(imageRes.body, {
      status: 200,
      headers: {
        'Content-Type': imageRes.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Resim proxy hatası:', error);
    return new NextResponse('İç sunucu hatası', { status: 500 });
  }
}
