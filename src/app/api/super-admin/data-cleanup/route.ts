import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';
import { logAuditEvent } from '@/lib/audit-logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const { data: allWeddings, error } = await supabase
      .from('weddings')
      .select('id, slug, created_at, is_paid, bride_name, groom_name, is_quarantined, deleted_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const total = allWeddings.length;
    let testRecords = 0;
    let orphanRecords = 0;
    let quarantinedRecords = 0;
    let realUserRecords = 0;

    const classified = allWeddings.map(w => {
      const slug = (w.slug || '').toLowerCase();
      const bride = (w.bride_name || '').toLowerCase();
      const groom = (w.groom_name || '').toLowerCase();

      const isTest = (
        slug.startsWith('test-') ||
        slug.startsWith('c12-') ||
        slug.startsWith('c13-') ||
        slug.startsWith('e2e-') ||
        slug.includes('-test-') ||
        bride.includes('test') ||
        groom.includes('test')
      );

      if (w.is_quarantined) {
        quarantinedRecords++;
        return { ...w, category: 'QUARANTINED', reason: 'Kullanıcı veya sistem tarafından karantinaya alındı' };
      }

      if (isTest) {
        testRecords++;
        return { ...w, category: 'TEST_FIXTURE', reason: 'Otomatik test paketi tarafından oluşturuldu' };
      }

      if (!w.bride_name && !w.groom_name) {
        orphanRecords++;
        return { ...w, category: 'ORPHAN', reason: 'İçeriksiz ve sahipsiz taslak' };
      }

      realUserRecords++;
      return { ...w, category: 'REAL_USER', reason: 'Aktif kullanıcı davetiyesi' };
    });

    return NextResponse.json({
      success: true,
      summary: {
        total,
        realUsers: realUserRecords,
        testRecords,
        orphanRecords,
        quarantinedRecords,
        deleteCandidates: testRecords,
        quarantineCandidates: orphanRecords,
        keepCandidates: realUserRecords,
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
      // Strict safety: require typed confirmation
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
