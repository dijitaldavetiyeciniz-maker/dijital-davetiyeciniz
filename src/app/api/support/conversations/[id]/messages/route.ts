import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Geçersiz talep numarası.' }, { status: 400 });
    }

    const { data: conv, error: convErr } = await supabase
      .from('support_conversations')
      .select('*')
      .eq('id', id)
      .single();

    if (convErr || !conv) {
      return NextResponse.json({ success: false, error: 'Talep bulunamadı.' }, { status: 404 });
    }

    const { data: messages, error: msgErr } = await supabase
      .from('support_messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (msgErr) {
      return NextResponse.json({ success: false, error: msgErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      conversation: conv,
      messages: messages || []
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`support_msg:${id}:${ip}`, { maxRequests: 10, intervalMs: 60000 });
    if (!rateCheck.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Çok hızlı mesaj gönderiyorsunuz. Lütfen biraz bekleyin.'
      }, { status: 429 });
    }

    const body = await req.json();
    const { message, sender_name, sender_type } = body;

    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: 'Mesaj içeriği boş olamaz.' }, { status: 400 });
    }

    const { data: conv, error: convErr } = await supabase
      .from('support_conversations')
      .select('*')
      .eq('id', id)
      .single();

    if (convErr || !conv) {
      return NextResponse.json({ success: false, error: 'Talep bulunamadı.' }, { status: 404 });
    }

    const isUserSender = sender_type !== 'admin';

    // 1. Insert message
    const { data: msg, error: msgErr } = await supabase
      .from('support_messages')
      .insert({
        conversation_id: id,
        sender_type: isUserSender ? 'user' : 'admin',
        sender_name: sender_name?.trim() || (isUserSender ? 'Kullanıcı' : 'Müşteri Temsilcisi'),
        message: message.trim()
      })
      .select()
      .single();

    if (msgErr || !msg) {
      return NextResponse.json({ success: false, error: msgErr?.message || 'Mesaj kaydedilemedi.' }, { status: 500 });
    }

    // 2. Update conversation metadata
    await supabase
      .from('support_conversations')
      .update({
        last_message_at: new Date().toISOString(),
        unread_admin: isUserSender ? true : false,
        unread_user: isUserSender ? false : true,
        status: isUserSender ? 'waiting_admin' : 'waiting_user',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      message: 'Mesajınız iletildi.',
      newMessage: msg
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
