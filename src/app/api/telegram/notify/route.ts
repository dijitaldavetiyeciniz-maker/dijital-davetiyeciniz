import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { wedding_id, guest_name, is_attending, guest_count, child_count = 0, message } = await request.json();

    if (!wedding_id || !guest_name) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 });
    }

    // 1. Düğün bilgilerini ve Telegram ayarlarını çek
    const { data: wedding, error } = await supabase
      .from('weddings')
      .select('bride_name, groom_name, telegram_bot_token, telegram_chat_id')
      .eq('id', wedding_id)
      .single();

    if (error || !wedding) {
      return NextResponse.json({ error: 'Düğün bulunamadı' }, { status: 404 });
    }

    const isCustomBot = wedding.telegram_bot_token && wedding.telegram_bot_token.includes(':');
    const botToken = isCustomBot ? wedding.telegram_bot_token : process.env.TELEGRAM_BOT_TOKEN;

    // Eğer Telegram ayarları yoksa işlemi iptal et
    if (!wedding.telegram_chat_id) {
      return NextResponse.json({ success: true, message: 'Telegram chat ID tanımlanmamış, bildirim atlanıldı.' });
    }

    if (!botToken) {
      return NextResponse.json({ success: false, error: 'Telegram Bot Token (TELEGRAM_BOT_TOKEN env değişkeni) sunucuda veya .env.local dosyasında tanımlı değil!' }, { status: 400 });
    }

    // 2. Telegram Mesajını Hazırla
    const statusText = is_attending ? '✅ KATILACAK' : '❌ KATILAMAYACAK';
    const countText = is_attending ? `\n👥 Yetişkin Sayısı: ${guest_count}` : '';
    const childText = is_attending && child_count > 0 ? `\n👶 Çocuk Sayısı: ${child_count}` : '';
    const msgText = message ? `\n💬 Mesaj: "${message}"` : '';
    
    const telegramMessage = `🎉 *YENİ LCV YANITI!*\n\n👤 *İsim:* ${guest_name}\n📌 *Durum:* ${statusText}${countText}${childText}${msgText}\n\n💍 Davetiye: ${wedding.bride_name} ${wedding.groom_name ? '& ' + wedding.groom_name : ''}`;

    // 3. Telegram API'ye Gönder
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: wedding.telegram_chat_id,
        text: telegramMessage,
        parse_mode: 'Markdown'
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('Telegram Hatası:', result);
      return NextResponse.json({ error: 'Telegram API Hatası' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('Sunucu Hatası:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
