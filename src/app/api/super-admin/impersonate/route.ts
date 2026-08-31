import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';
import { logAuditEvent } from '@/lib/audit-logger';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const IMPERSONATION_COOKIE_NAME = 'support_impersonation_token';

export async function POST(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { target_wedding_id, target_user_id, reason, access_level = 'read_only' } = body;

    if (!reason || reason.trim().length < 5) {
      return NextResponse.json({
        success: false,
        error: 'Teknik destek oturumu başlatmak için geçerli bir açıklama/gerekçe zorunludur.'
      }, { status: 400 });
    }

    if (!target_wedding_id && !target_user_id) {
      return NextResponse.json({
        success: false,
        error: 'Hedef davetiye veya kullanıcı belirtilmelidir.'
      }, { status: 400 });
    }

    // 30-minute validity
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const rawToken = `imp_${crypto.randomUUID()}_${Date.now()}`;
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const { error: insertErr } = await supabase
      .from('support_impersonation_sessions')
      .insert({
        token_hash: tokenHash,
        super_admin_email: 'superadmin@dijitaldavetiyeciniz.com',
        target_user_id: target_user_id || null,
        target_wedding_id: target_wedding_id || null,
        reason: reason.trim(),
        access_level: access_level === 'full_support' ? 'full_support' : 'read_only',
        expires_at: expiresAt
      });

    if (insertErr) {
      return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 });
    }

    const cookieStore = await cookies();
    cookieStore.set(IMPERSONATION_COOKIE_NAME, rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 60
    });

    await logAuditEvent({
      action: 'support.impersonation.started',
      targetType: target_wedding_id ? 'wedding' : 'user',
      targetId: target_wedding_id || target_user_id,
      details: {
        reason: reason.trim(),
        accessLevel: access_level,
        expiresAt
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Teknik destek modu başlatıldı.',
      session: {
        targetWeddingId: target_wedding_id,
        targetUserId: target_user_id,
        accessLevel: access_level,
        expiresAt
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const cookieStore = await cookies();
    cookieStore.delete(IMPERSONATION_COOKIE_NAME);

    await logAuditEvent({
      action: 'support.impersonation.ended',
      targetType: 'system'
    });

    return NextResponse.json({
      success: true,
      message: 'Destek modundan çıkıldı.'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
