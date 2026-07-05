import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const update = await request.json();
    console.log('Telegram Webhook Received:', update);

    const message = update.message || update.channel_post;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text.trim();
    const chatId = message.chat.id.toString();

    // Match "/start TOKEN" or "/start@BotName TOKEN"
    const match = text.match(/^\/start(?:@\w+)?\s+(.+)$/i);
    
    if (match) {
      const token = match[1].trim();

      if (token) {
        // Find the wedding with this token in telegram_bot_token field
        const { data: wedding, error } = await supabase
          .from('weddings')
          .select('id, bride_name, groom_name')
          .eq('telegram_bot_token', token)
          .single();

        if (wedding && !error) {
          // Update the wedding record with the telegram_chat_id
          const { error: updateError } = await supabase
            .from('weddings')
            .update({ telegram_chat_id: chatId })
            .eq('id', wedding.id);

          if (!updateError) {
            // Send confirmation message to the group/chat
            const globalBotToken = process.env.TELEGRAM_BOT_TOKEN;
            if (globalBotToken) {
              const replyText = `🎉 Tebrikler! *Dijital Davetiyeciniz* bağlantısı başarıyla kuruldu.\n\n💍 *Davet Sahipleri:* ${wedding.bride_name} ${wedding.groom_name ? '& ' + wedding.groom_name : ''}\n📌 LCV bildirimleri ve fotoğraf yüklemeleri bu sohbet alanına anlık olarak iletilecektir.`;
              
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
