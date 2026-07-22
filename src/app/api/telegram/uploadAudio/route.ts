import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    const wedding_id = formData.get('wedding_id') as string;

    if (!file || !wedding_id) {
      return NextResponse.json({ error: 'Müzik dosyası veya Wedding ID eksik' }, { status: 400 });
    }

    // 1. Düğün bilgilerinden Telegram Token ve Chat ID çek
    const { data: wedding, error } = await supabase
      .from('weddings')
      .select('telegram_bot_token, telegram_chat_id')
      .eq('id', wedding_id)
      .single();

    if (error || !wedding) {
      return NextResponse.json({ error: 'Bu davetiye bulunamadı.' }, { status: 404 });
    }

    const isCustomBot = wedding.telegram_bot_token && wedding.telegram_bot_token.includes(':');
    const botToken = isCustomBot ? wedding.telegram_bot_token : process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken || !wedding.telegram_chat_id) {
      return NextResponse.json({ error: 'Bu davetiye için Telegram entegrasyonu (Chat ID) yapılandırılmamış.' }, { status: 400 });
    }

    // 2. Dosyayı Telegram'a Yolla
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendAudio`;
    
    const telegramFormData = new FormData();
    telegramFormData.append('chat_id', wedding.telegram_chat_id);
    telegramFormData.append('audio', file);

    const response = await fetch(telegramUrl, {
      method: 'POST',
      body: telegramFormData,
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('Telegram Müzik Yükleme Hatası:', result);
      return NextResponse.json({ error: 'Telegram müzik dosyasını kabul etmedi.' }, { status: 500 });
    }

    const fileId = result.result.audio.file_id;
    return NextResponse.json({ success: true, file_id: fileId });

  } catch (err: any) {
    console.error('Sunucu Hatası:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
