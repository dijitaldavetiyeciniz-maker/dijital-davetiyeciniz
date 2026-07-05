import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { wedding_id, bot_token } = await request.json();

    if (!wedding_id || !bot_token) {
      return NextResponse.json({ error: 'wedding_id ve bot_token gerekli' }, { status: 400 });
    }

    // 1. Telegram getMe API ile token'ı doğrula
    const getMeRes = await fetch(`https://api.telegram.org/bot${bot_token}/getMe`);
    const getMeData = await getMeRes.json();

    if (!getMeData.ok) {
      return NextResponse.json({ 
        error: 'Geçersiz Bot Token. Lütfen BotFather\'dan aldığınız token\'ı kontrol edin.',
        telegram_error: getMeData.description 
      }, { status: 400 });
    }

    const botUsername = getMeData.result.username;
    const botName = getMeData.result.first_name;

    // 2. Token'ı DB'ye kaydet
    const { error: saveError } = await supabase
      .from('weddings')
      .update({ telegram_bot_token: bot_token, telegram_chat_id: null })
      .eq('id', wedding_id);

    if (saveError) {
      return NextResponse.json({ error: 'Token kaydedilemedi: ' + saveError.message }, { status: 500 });
    }

    // 3. Bu bot için webhook'u kaydet
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dijital-davetiyeciniz.vercel.app';
    const webhookUrl = `${siteUrl}/api/telegram/webhook?wid=${wedding_id}`;

    const setWebhookRes = await fetch(`https://api.telegram.org/bot${bot_token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        url: webhookUrl,
        allowed_updates: ['message'],
        drop_pending_updates: true
      })
    });
    const setWebhookData = await setWebhookRes.json();

    if (!setWebhookData.ok) {
      // Webhook kaydı başarısız olsa bile token kaydedildi, uyar ama devam et
      return NextResponse.json({ 
        success: true, 
        bot_name: botName,
        bot_username: botUsername,
        webhook_warning: 'Webhook kaydedilemedi: ' + setWebhookData.description + '. Localhost ortamında bu normaldir.'
      });
    }

    return NextResponse.json({ 
      success: true, 
      bot_name: botName,
      bot_username: botUsername,
      webhook_url: webhookUrl
    });

  } catch (err: any) {
    console.error('SetWebhook hatası:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
