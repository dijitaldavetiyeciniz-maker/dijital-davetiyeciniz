import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const wid = url.searchParams.get('wid'); // Per-bot webhook: wedding_id from query param

    const update = await request.json();
    console.log('Telegram Webhook Received:', JSON.stringify(update).substring(0, 200));

    const message = update.message || update.channel_post;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text.trim();
    const chatId = message.chat.id.toString();

    // ── CASE 1: Per-bot webhook with wid query param (/bagla command) ──
    if (wid) {
      const isBaglaCommand = /^\/bagla(?:@\w+)?(\s.*)?$/i.test(text);
      if (isBaglaCommand) {
        // Fetch wedding to get bot token
        const { data: wedding, error } = await supabase
          .from('weddings')
          .select('id, bride_name, groom_name, telegram_bot_token')
          .eq('id', wid)
          .single();

        if (wedding && !error) {
          // Save the chat_id
          await supabase
            .from('weddings')
            .update({ telegram_chat_id: chatId })
            .eq('id', wedding.id);

          // Send confirmation using the custom bot token
          const botToken = wedding.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN;
          if (botToken) {
            const eventNames = `${wedding.bride_name}${wedding.groom_name ? ' & ' + wedding.groom_name : ''}`;
            const replyText = `🎉 *Tebrikler!* Grubunuz başarıyla *Dijital Davetiyeciniz* sistemine bağlandı!\n\n💍 *Davetiye:* ${eventNames}\n📸 Misafirlerinizin yüklediği fotoğraflar artık bu gruba anlık olarak düşecektir.\n\n✅ Panele dönüp *Test Bildirimi Gönder* butonuna basabilirsiniz.`;

            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: replyText,
                parse_mode: 'Markdown'
              })
            });
          }
        }
      }
      return NextResponse.json({ ok: true });
    }

    // ── CASE 2: Global bot webhook — legacy /start TOKEN support ──
    const match = text.match(/^\/start(?:@\w+)?\s+(.+)$/i);
    if (match) {
      const token = match[1].trim();
      if (token) {
        const { data: wedding, error } = await supabase
          .from('weddings')
          .select('id, bride_name, groom_name')
          .eq('telegram_bot_token', token)
          .single();

        if (wedding && !error) {
          const { error: updateError } = await supabase
            .from('weddings')
            .update({ telegram_chat_id: chatId })
            .eq('id', wedding.id);

          if (!updateError) {
            const globalBotToken = process.env.TELEGRAM_BOT_TOKEN;
            if (globalBotToken) {
              const replyText = `🎉 Tebrikler! *Dijital Davetiyeciniz* bağlantısı başarıyla kuruldu.\n\n💍 *Davet Sahipleri:* ${wedding.bride_name}${wedding.groom_name ? ' & ' + wedding.groom_name : ''}\n📌 LCV bildirimleri ve fotoğraf yüklemeleri bu sohbet alanına anlık olarak iletilecektir.`;

              await fetch(`https://api.telegram.org/bot${globalBotToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: replyText,
                  parse_mode: 'Markdown'
                })
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
