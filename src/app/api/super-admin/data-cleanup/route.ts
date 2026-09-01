import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { logAuditEvent } from '@/lib/audit-logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    let authUserIds = new Set<string>();
    let authUserEmails = new Set<string>();
    let totalAuthUsersCount = 0;

    try {
      const adminClient = getSupabaseAdmin();
      const { data: uData } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (uData?.users) {
        totalAuthUsersCount = uData.users.length;
        uData.users.forEach(u => {
          authUserIds.add(u.id);
          if (u.email) authUserEmails.add(u.email.toLowerCase());
        });
      }
    } catch {}

    const { data: allWeddings, error } = await supabase
      .from('weddings')
      .select('id, slug, created_at, is_paid, is_active, bride_name, groom_name, is_quarantined, deleted_at, user_id, user_email')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const total = (allWeddings || []).length;
    let registeredUserWeddings = 0;
    let legacyUnauthenticatedWeddings = 0;
    let testRecords = 0;
    let demoRecords = 0;
    let orphanRecords = 0;
    let quarantinedRecords = 0;
    let ambiguousRecords = 0;

    const classified = (allWeddings || []).map(w => {
      const slug = (w.slug || '').toLowerCase();
      const bride = (w.bride_name || '').toLowerCase();
      const groom = (w.groom_name || '').toLowerCase();
      const email = (w.user_email || '').toLowerCase();
      const userId = w.user_id;

      const hasAuthOwner = (userId && authUserIds.has(userId)) || (email && authUserEmails.has(email));

      const isHighConfidenceTest = (
        slug.startsWith('test-') ||
        slug.startsWith('c12-') ||
        slug.startsWith('c13-') ||
        slug.startsWith('e2e-') ||
        slug.startsWith('playwright-') ||
        slug.includes('-test-') ||
        slug.includes('test_') ||
        bride.includes('test fixture') ||
        groom.includes('regression test') ||
        email.endsWith('@test.com') ||
        email.endsWith('@example.com')
      ) && !w.is_paid;

      const isDemo = slug.startsWith('demo-') || slug.includes('demo');

      if (w.is_quarantined) {
        quarantinedRecords++;
        return { ...w, category: 'QUARANTINED', reason: 'Kullanıcı veya sistem tarafından karantinaya alındı' };
      }

      if (isHighConfidenceTest) {
        testRecords++;
        return { ...w, category: 'TEST_FIXTURE', reason: 'Otomasyon test paketi tarafından oluşturuldu' };
      }

      if (isDemo) {
        demoRecords++;
        return { ...w, category: 'DEMO', reason: 'Tanıtım / Demo şablon davetiyesi' };
      }

      if (hasAuthOwner) {
        registeredUserWeddings++;
        return { ...w, category: 'REGISTERED_USER_OWNED', reason: 'Kayıtlı ve doğrulanmış kullanıcıya ait davetiye' };
      }

      if (userId && !authUserIds.has(userId)) {
        orphanRecords++;
        return { ...w, category: 'ORPHAN', reason: 'Kullanıcı hesabı silinmiş yetim kayıt' };
      }

      // Legacy unauthenticated (created before mandatory login)
      legacyUnauthenticatedWeddings++;
      return { ...w, category: 'LEGACY_UNAUTHENTICATED', reason: 'Üyeliksiz / Eski sistemden aktarılan davetiye' };
    });

    return NextResponse.json({
      success: true,
      summary: {
        total,
        totalAuthUsers: totalAuthUsersCount,
        registeredUserWeddings,
        legacyUnauthenticatedWeddings,
        testRecords,
        demoRecords,
        orphanRecords,
        quarantinedRecords,
        ambiguousRecords,
        primaryTotal: registeredUserWeddings + legacyUnauthenticatedWeddings + testRecords + demoRecords + orphanRecords + quarantinedRecords,
        deleteCandidates: testRecords,
        quarantineCandidates: orphanRecords,
        keepCandidates: registeredUserWeddings + legacyUnauthenticatedWeddings,
        productionDeletionExecuted: false
      },
      records: classified.slice(0, 100)
    });
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
    const { action, wedding_ids, typed_confirmation, reason } = body;

    // Reset Analytics Action
    if (action === 'reset_analytics') {
      if (typed_confirmation !== 'SIFIRLA' && typed_confirmation !== 'RESET') {
        return NextResponse.json({
          success: false,
          error: 'Analitik sıfırlama işlemi için onay kutusuna "SIFIRLA" veya "RESET" yazılması zorunludur.'
        }, { status: 400 });
      }

      try {
        await supabase.from('analytics_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch {}

      await logAuditEvent({
        action: 'analytics.reset',
        targetType: 'analytics',
        details: { resetBy: 'Super Admin', confirmation: typed_confirmation }
      });

      return NextResponse.json({
        success: true,
        message: 'Kullanım ve test analitik verileri başarıyla sıfırlandı. Denetim logları korundu.'
      });
    }

    if (!wedding_ids || !Array.isArray(wedding_ids) || wedding_ids.length === 0) {
      return NextResponse.json({ success: false, error: 'İşlem yapılacak davetiyeler seçilmedi.' }, { status: 400 });
    }

    if (action === 'quarantine') {
      const { error } = await supabase
        .from('weddings')
        .update({
          is_quarantined: true,
          quarantined_at: new Date().toISOString(),
          deletion_reason: reason?.trim() || 'Super Admin karantinası'
        })
        .in('id', wedding_ids);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      await logAuditEvent({
        action: 'wedding.quarantined',
        targetType: 'wedding',
        details: { count: wedding_ids.length, weddingIds: wedding_ids, reason }
      });

      return NextResponse.json({
        success: true,
        message: `${wedding_ids.length} kayıt güvenli şekilde karantinaya alındı.`
      });
    }

    if (action === 'restore') {
      const { error } = await supabase
        .from('weddings')
        .update({
          is_quarantined: false,
          quarantined_at: null,
          deleted_at: null,
          deletion_reason: null
        })
        .in('id', wedding_ids);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      await logAuditEvent({
        action: 'wedding.restored',
        targetType: 'wedding',
        details: { count: wedding_ids.length, weddingIds: wedding_ids }
      });

      return NextResponse.json({
        success: true,
        message: `${wedding_ids.length} kayıt karantinadan geri yüklendi.`
      });
    }

    if (action === 'hard_delete') {
      if (typed_confirmation !== 'SIL' && typed_confirmation !== 'DELETE') {
        return NextResponse.json({
          success: false,
          error: 'Kalıcı silme işlemi için onay kutusuna "SIL" veya "DELETE" yazılması zorunludur.'
        }, { status: 400 });
      }

      const { error } = await supabase
        .from('weddings')
        .delete()
        .in('id', wedding_ids);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      await logAuditEvent({
        action: 'wedding.hard_deleted',
        targetType: 'wedding',
        details: { count: wedding_ids.length, weddingIds: wedding_ids, confirmation: typed_confirmation }
      });

      return NextResponse.json({
        success: true,
        message: `${wedding_ids.length} test kaydı veritabanından kalıcı olarak silindi.`
      });
    }

    return NextResponse.json({ success: false, error: 'Geçersiz temizlik eylemi.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
