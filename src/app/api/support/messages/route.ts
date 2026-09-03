import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { checkDistributedRateLimit } from '@/lib/rate-limiter';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const PublicSupportMessageSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(200).optional(),
  category: z.string().trim().max(50).optional(),
  message: z.string().trim().min(5).max(5000),
  wedding_id: z.string().uuid().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    
    // Distributed Rate Limit: 5 submissions per 5 minutes per IP
    const rateCheck = await checkDistributedRateLimit(`support_pub_msg:${ip}`, {
      maxRequests: 5,
      intervalMs: 5 * 60 * 1000
    });

    if (!rateCheck.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Çok fazla destek talebi gönderdiniz. Lütfen birkaç dakika sonra tekrar deneyin.'
      }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = PublicSupportMessageSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Lütfen isim, geçerli e-posta ve mesaj alanlarını eksiksiz doldurun.'
      }, { status: 400 });
    }

    const { name, email, subject, category, message, wedding_id } = parseResult.data;

    const supabase = getSupabaseAdmin();

    // Verify user identity server-side if authenticated token provided
    let verifiedUserId: string | null = null;
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        verifiedUserId = user.id;
      }
    }

    const ticketSubject = subject?.trim() || `${category || 'Destek'} Talebi - ${name.trim()}`;
    const ticketCategory = category?.trim() || 'Genel Soru';

    // 1. Create conversation record
    const { data: conv, error: convErr } = await supabase
      .from('support_conversations')
      .insert({
        guest_name: name.trim(),
        guest_email: email.trim(),
        subject: ticketSubject,
        category: ticketCategory,
        status: 'open',
        priority: 'normal',
        user_id: verifiedUserId,
        wedding_id: wedding_id || null,
        unread_admin: true,
        unread_user: false,
        last_message_at: new Date().toISOString()
      })
      .select()
      .single();

    if (convErr || !conv) {
      console.error('[Support API] Error creating conversation in messages route:', convErr);
      return NextResponse.json({
        success: false,
        error: 'Destek talebi oluşturulamadı. Lütfen daha sonra tekrar deneyiniz.'
      }, { status: 500 });
    }

    // 2. Insert the initial message
    const { data: msg, error: msgErr } = await supabase
      .from('support_messages')
      .insert({
        conversation_id: conv.id,
        sender_type: 'user',
        sender_name: name.trim(),
        message: message.trim(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (msgErr || !msg) {
      console.error('[Support API] Error creating initial message, rolling back:', msgErr);
      await supabase.from('support_conversations').delete().eq('id', conv.id);
      return NextResponse.json({
        success: false,
        error: 'Mesaj kaydedilemedi. Lütfen tekrar deneyiniz.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ticket_id: conv.id,
      message: 'Destek talebiniz başarıyla iletildi. Ekibimiz en kısa sürede dönüş yapacaktır.'
    }, { status: 201 });
  } catch (err: any) {
    console.error('[Support API] Exception in support messages route:', err);
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası oluştu.'
    }, { status: 500 });
  }
}
