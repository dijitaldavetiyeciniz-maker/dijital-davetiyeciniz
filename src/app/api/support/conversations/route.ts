import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limiter';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`support_create:${ip}`, { maxRequests: 5, intervalMs: 60000 });
    if (!rateCheck.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Çok fazla destek talebi gönderdiniz. Lütfen birkaç dakika sonra tekrar deneyin.'
      }, { status: 429 });
    }

    const body = await req.json();
    const { subject, category, message, guest_email, guest_name, wedding_id } = body;

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Konu ve mesaj alanları zorunludur.'
      }, { status: 400 });
    }

    if (subject.length > 200 || message.length > 5000) {
      return NextResponse.json({
        success: false,
        error: 'Konu maksimum 200, mesaj maksimum 5000 karakter olabilir.'
      }, { status: 400 });
    }

    // 1. Create conversation record
    const { data: conv, error: convErr } = await supabase
      .from('support_conversations')
      .insert({
        subject: subject.trim(),
        category: category?.trim() || 'Genel Soru',
        guest_email: guest_email?.trim() || null,
        guest_name: guest_name?.trim() || null,
        wedding_id: wedding_id || null,
        status: 'open',
        priority: 'normal',
        unread_admin: true,
        unread_user: false,
        last_message_at: new Date().toISOString()
      })
      .select()
      .single();

    if (convErr || !conv) {
      return NextResponse.json({
        success: false,
        error: 'Destek talebi oluşturulamadı: ' + (convErr?.message || 'DB Error')
      }, { status: 500 });
    }

    // 2. Insert initial message
    const { error: msgErr } = await supabase
      .from('support_messages')
      .insert({
        conversation_id: conv.id,
        sender_type: 'user',
        sender_name: guest_name?.trim() || guest_email?.trim() || 'Kullanıcı',
        message: message.trim()
      });

    if (msgErr) {
      return NextResponse.json({
        success: false,
        error: 'Mesaj kaydedilemedi: ' + msgErr.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Destek talebiniz başarıyla iletildi. En kısa sürede yanıtlanacaktır.',
      conversation: conv
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({
        success: true,
        conversations: []
      });
    }

    const { data, error } = await supabase
      .from('support_conversations')
      .select('*, support_messages(*)')
      .eq('guest_email', email)
      .order('last_message_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      conversations: data || []
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
