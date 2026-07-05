import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('photo') as File;
    const wedding_id = formData.get('wedding_id') as string;

    if (!file || !wedding_id) {
      return NextResponse.json({ error: 'Fotoğraf veya Wedding ID eksik' }, { status: 400 });
    }

    // 1. Düğün bilgilerinden Telegram Token ve Chat ID çek
    const { data: wedding, error } = await supabase
      .from('weddings')
      .select('telegram_bot_token, telegram_chat_id')
      .eq('id', wedding_id)
      .single();

    const isCustomBot = wedding.telegram_bot_token && wedding.telegram_bot_token.includes(':');
    const botToken = isCustomBot ? wedding.telegram_bot_token : process.env.TELEGRAM_BOT_TOKEN;

    if (error || !wedding || !botToken || !wedding.telegram_chat_id) {
      return NextResponse.json({ error: 'Bu davetiye için Telegram entegrasyonu (Chat ID) yapılandırılmamış.' }, { status: 400 });
    }

    // 2. Dosyayı Telegram'a Yolla
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
    
    const telegramFormData = new FormData();
    telegramFormData.append('chat_id', wedding.telegram_chat_id);
    telegramFormData.append('photo', file);

    const response = await fetch(telegramUrl, {
      method: 'POST',
      body: telegramFormData,
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('Telegram Yükleme Hatası:', result);
      return NextResponse.json({ error: 'Telegram fotoğrafı kabul etmedi.' }, { status: 500 });
    }

    // Telegram'ın döndürdüğü en büyük çözünürlüklü (son sıradaki) fotoğrafı alıyoruz
    const photos = result.result.photo;
    const largestPhoto = photos[photos.length - 1];
    const fileId = largestPhoto.file_id;

    return NextResponse.json({ success: true, file_id: fileId });

  } catch (err: any) {
    console.error('Sunucu Hatası:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
