import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, category, message, wedding_id, user_id } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Lütfen isim, e-posta ve mesaj alanlarını eksiksiz doldurun.'
      }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({
        success: false,
        error: 'Lütfen geçerli bir e-posta adresi girin.'
      }, { status: 400 });
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
        user_id: user_id || null,
        wedding_id: wedding_id || null,
        unread_admin: true,
        unread_user: false,
        last_message_at: new Date().toISOString()
      })
      .select()
      .single();

    if (convErr || !conv) {
      return NextResponse.json({
        success: false,
        error: convErr?.message || 'Destek talebi oluşturulamadı.'
      }, { status: 500 });
    }

    // 2. Insert the initial message
    const { data: msg, error: msgErr } = await supabase
      .from('support_messages')
      .insert({
        conversation_id: conv.id,
        sender_type: user_id ? 'user' : 'guest',
        sender_id: user_id || null,
        sender_name: name.trim(),
        message: message.trim()
      })
      .select()
      .single();

    if (msgErr || !msg) {
      return NextResponse.json({
        success: false,
        error: msgErr?.message || 'Mesaj kaydedilemedi.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Destek talebiniz başarıyla alındı. Ekibimiz en kısa sürede e-posta ile dönüş yapacaktır.',
      ticket_id: conv.id
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Sunucu hatası.'
    }, { status: 500 });
  }
}
