import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { checkDistributedRateLimit } from '@/lib/rate-limiter';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES = [
  'Genel Soru',
  'Ödeme & Paketler',
  'Özel Alan Adı',
  'Tasarım & Şablonlar',
  'Teknik Destek',
  'Diğer'
] as const;

const SupportRequestSchema = z.object({
  subject: z.string().trim().min(3).max(200),
  category: z.enum(VALID_CATEGORIES).default('Genel Soru'),
  message: z.string().trim().min(5).max(5000),
  guest_email: z.string().trim().email().max(255).optional().or(z.literal('')),
  guest_name: z.string().trim().max(100).optional().or(z.literal('')),
  wedding_id: z.string().uuid().optional().nullable(),
  honeypot: z.string().max(0).optional() // Bot mitigation
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    
    // Distributed Rate Limit: 5 support requests per 5 minutes per IP
    const rateCheck = await checkDistributedRateLimit(`support_create:${ip}`, { 
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
    const parseResult = SupportRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Geçersiz destek talebi parametreleri.',
        details: parseResult.error.issues.map(i => i.message)
      }, { status: 400 });
    }

    const { subject, category, message, guest_email, guest_name, wedding_id, honeypot } = parseResult.data;

    // Honeypot spam bot mitigation
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ success: true, message: 'Destek talebiniz alındı.' });
    }

    const supabase = getSupabaseAdmin();

    // Server-side user identity check
    let verifiedUserId: string | null = null;
    let verifiedEmail = guest_email || null;
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        verifiedUserId = user.id;
        if (!verifiedEmail) verifiedEmail = user.email || null;
      }
    }

    // 1. Create conversation record
    const { data: conv, error: convErr } = await supabase
      .from('support_conversations')
      .insert({
        subject,
        category,
        guest_email: verifiedEmail,
        guest_name: guest_name || (verifiedUserId ? 'Kayıtlı Kullanıcı' : 'Ziyaretçi'),
        wedding_id: wedding_id || null,
        user_id: verifiedUserId,
        status: 'open',
        priority: 'normal',
        unread_admin: true,
        unread_user: false,
        last_message_at: new Date().toISOString()
      })
      .select()
      .single();

    if (convErr || !conv) {
      console.error('[Support API] Failed to insert support conversation:', convErr);
      return NextResponse.json({
        success: false,
        error: 'Destek talebi oluşturulamadı. Lütfen daha sonra tekrar deneyiniz.'
      }, { status: 500 });
    }

    // 2. Insert initial message (Atomic with compensating delete on failure)
    const { data: msg, error: msgErr } = await supabase
      .from('support_messages')
      .insert({
        conversation_id: conv.id,
        sender_type: 'user',
        sender_name: guest_name || (verifiedUserId ? 'Kullanıcı' : 'Ziyaretçi'),
        message: message.trim()
      })
      .select()
      .single();

    if (msgErr || !msg) {
      console.error('[Support API] Failed to insert initial support message, rolling back conversation:', msgErr);
      // Compensating cleanup to prevent orphan conversations
      await supabase.from('support_conversations').delete().eq('id', conv.id);

      return NextResponse.json({
        success: false,
        error: 'Mesaj kaydedilemedi. Lütfen tekrar deneyiniz.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Destek talebiniz başarıyla iletildi. En kısa sürede yanıtlanacaktır.',
      conversation: conv
    }, { status: 201 });
  } catch (err: any) {
    console.error('[Support API] Exception in support conversation creation:', err);
    return NextResponse.json({ 
      success: false, 
      error: 'Destek talebi işlenirken bir sunucu hatası oluştu.' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({
        success: true,
        conversations: []
      });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('support_conversations')
      .select('*, support_messages(*)')
      .eq('guest_email', email)
      .order('last_message_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: 'Talepler getirilemedi.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      conversations: data || []
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
