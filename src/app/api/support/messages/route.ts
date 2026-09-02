import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

function getClient() {
  try {
    return getSupabaseAdmin();
  } catch {
    return supabase;
  }
}

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

    const db = getClient();

    // 1. Create conversation record
    const { data: conv, error: convErr } = await db
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
      // Fallback to contact_messages if support_conversations table is not present
      try {
        const { data: contactMsg, error: cErr } = await db
          .from('contact_messages')
          .insert({
            name: name.trim(),
            email: email.trim(),
            subject: ticketSubject,
            message: message.trim(),
            status: 'new'
          })
          .select()
          .single();

        if (!cErr && contactMsg) {
          return NextResponse.json({
            success: true,
            ticket_id: contactMsg.id,
            message: 'Destek talebiniz başarıyla iletildi. Ekibimiz en kısa sürede dönüş yapacaktır.'
          }, { status: 201 });
        }
      } catch {
        // Fallthrough to error response
      }

      return NextResponse.json({
        success: false,
        error: convErr?.message || 'Destek talebi oluşturulamadı.'
      }, { status: 500 });
    }

    // 2. Insert the initial message
    const { data: msg, error: msgErr } = await db
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

    if (msgErr) {
      return NextResponse.json({
        success: false,
        error: msgErr.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ticket_id: conv.id,
      message: 'Destek talebiniz başarıyla iletildi. Ekibimiz en kısa sürede dönüş yapacaktır.'
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Sunucu hatası oluştu.'
    }, { status: 500 });
  }
}
