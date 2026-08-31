import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';
import { logAuditEvent } from '@/lib/audit-logger';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = supabase
      .from('support_conversations')
      .select('*, support_messages(*)')
      .order('last_message_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`subject.ilike.%${search}%,guest_email.ilike.%${search}%,guest_name.ilike.%${search}%`);
    }

    const { data: conversations, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const unreadCount = (conversations || []).filter(c => c.unread_admin).length;

    return NextResponse.json({
      success: true,
      conversations: conversations || [],
      unreadCount
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, status, priority, assigned_to, mark_read } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Talep ID belirtilmedi.' }, { status: 400 });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (assigned_to !== undefined) updates.assigned_to = assigned_to;
    if (mark_read) updates.unread_admin = false;

    const { error } = await supabase
      .from('support_conversations')
      .update(updates)
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await logAuditEvent({
      action: 'support.ticket.updated',
      targetType: 'support',
      targetId: id,
      details: updates
    });

    return NextResponse.json({ success: true, message: 'Talep güncellendi.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { conversation_id, message, sender_name, status } = body;

    if (!conversation_id || !message?.trim()) {
      return NextResponse.json({ success: false, error: 'Talep ve mesaj içeriği zorunludur.' }, { status: 400 });
    }

    // 1. Insert admin message
    const { data: msg, error: msgErr } = await supabase
      .from('support_messages')
      .insert({
        conversation_id,
        sender_type: 'admin',
        sender_name: sender_name?.trim() || 'Super Admin',
        message: message.trim()
      })
      .select()
      .single();

    if (msgErr || !msg) {
      return NextResponse.json({ success: false, error: msgErr?.message || 'Mesaj kaydedilemedi.' }, { status: 500 });
    }

    // 2. Update conversation
    await supabase
      .from('support_conversations')
      .update({
        status: status || 'waiting_user',
        unread_admin: false,
        unread_user: true,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', conversation_id);

    await logAuditEvent({
      action: 'support.ticket.replied',
      targetType: 'support',
      targetId: conversation_id,
      details: { messageId: msg.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Yanıtınız başarıyla gönderildi.',
      newMessage: msg
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
