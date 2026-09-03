import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { checkDistributedRateLimit } from '@/lib/rate-limiter';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const SupportMessageSchema = z.object({
  message: z.string().trim().min(1).max(5000),
  sender_name: z.string().trim().max(100).optional(),
  sender_type: z.enum(['user', 'admin']).default('user')
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || !z.string().uuid().safeParse(id).success) {
      return NextResponse.json({ success: false, error: 'Geçersiz talep numarası.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: conv, error: convErr } = await supabase
      .from('support_conversations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (convErr || !conv) {
      return NextResponse.json({ success: false, error: 'Talep bulunamadı.' }, { status: 404 });
    }

    const { data: messages, error: msgErr } = await supabase
      .from('support_messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (msgErr) {
      return NextResponse.json({ success: false, error: 'Mesajlar getirilemedi.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      conversation: conv,
      messages: messages || []
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || !z.string().uuid().safeParse(id).success) {
      return NextResponse.json({ success: false, error: 'Geçersiz talep numarası.' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateCheck = await checkDistributedRateLimit(`support_msg:${id}:${ip}`, { 
      maxRequests: 10, 
      intervalMs: 60000 
    });

    if (!rateCheck.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Çok hızlı mesaj gönderiyorsunuz. Lütfen biraz bekleyin.'
      }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = SupportMessageSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Geçersiz mesaj verisi.'
      }, { status: 400 });
    }

    const { message, sender_name, sender_type } = parseResult.data;
    const supabase = getSupabaseAdmin();

    const { data: conv, error: convErr } = await supabase
      .from('support_conversations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

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
      return NextResponse.json({ success: false, error: 'Mesaj kaydedilemedi.' }, { status: 500 });
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
  } catch {
    return NextResponse.json({ success: false, error: 'Mesaj gönderilirken sunucu hatası oluştu.' }, { status: 500 });
  }
}
