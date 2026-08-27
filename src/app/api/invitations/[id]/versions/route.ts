import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: weddingId } = await params;

    const supabase = getSupabaseAdmin();
    // Resolve wedding id if slug provided
    const { data: wedding } = await supabase
      .from('weddings')
      .select('id, user_id, custom_overrides')
      .or(`id.eq.${weddingId},slug.eq.${weddingId}`)
      .maybeSingle();

    if (!wedding) {
      return NextResponse.json({ error: 'Davetiye bulunamadı.' }, { status: 404 });
    }

    let versions: any[] = [];
    try {
      const { data: vData, error } = await supabase
        .from('invitation_versions')
        .select('id, wedding_id, version_number, version_type, is_published, summary, created_at')
        .eq('wedding_id', wedding.id)
        .order('created_at', { ascending: false });

      if (!error && vData) {
        versions = vData;
      }
    } catch {}

    const currentPublishedVer = (wedding as any).published_version_number || wedding.custom_overrides?.published_version_number || 1;

    return NextResponse.json({
      success: true,
      current_published_version: currentPublishedVer,
      versions: versions.length > 0 ? versions : [
        {
          id: 'v-init',
          wedding_id: wedding.id,
          version_number: 1,
          version_type: 'published',
          is_published: true,
          summary: 'İlk Yayın',
          created_at: new Date().toISOString()
        }
      ]
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: weddingId } = await params;
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'restore'; // 'restore' or 'snapshot'

    const supabase = getSupabaseAdmin();
    const { data: wedding } = await supabase
      .from('weddings')
      .select('*')
      .or(`id.eq.${weddingId},slug.eq.${weddingId}`)
      .maybeSingle();

    if (!wedding) {
      return NextResponse.json({ error: 'Davetiye bulunamadı.' }, { status: 404 });
    }

    if (action === 'restore') {
      const versionId = body.version_id;
      if (!versionId) {
        return NextResponse.json({ error: 'Geri yüklenecek sürüm belirtilmedi.' }, { status: 400 });
      }

      const { data: versionRecord, error: vErr } = await supabase
        .from('invitation_versions')
        .select('*')
        .eq('id', versionId)
        .eq('wedding_id', wedding.id)
        .single();

      if (vErr || !versionRecord) {
        return NextResponse.json({ error: 'Sürüm kaydı bulunamadı.' }, { status: 404 });
      }

      // Restoring loads snapshot INTO CURRENT WORKING DRAFT (never auto-publishes)
      const restoredSnapshot = versionRecord.snapshot;

      const overrides = {
        ...(wedding.custom_overrides || {}),
        draft_data: restoredSnapshot,
        has_unpublished_changes: true
      };

      let updateErr: any = null;
      const { error: fullErr } = await supabase
        .from('weddings')
        .update({
          draft_data: restoredSnapshot,
          has_unpublished_changes: true,
          draft_revision: (wedding.draft_revision || 1) + 1,
          custom_overrides: overrides
        })
        .eq('id', wedding.id);

      if (fullErr) {
        const { error: fallbackErr } = await supabase
          .from('weddings')
          .update({
            custom_overrides: overrides
          })
          .eq('id', wedding.id);
        updateErr = fallbackErr;
      }

      if (updateErr) {
        return NextResponse.json({ error: 'Taslak geri yüklenemedi: ' + updateErr.message }, { status: 500 });
      }

      // Create history event for restore
      try {
        await supabase.from('invitation_versions').insert([
          {
            wedding_id: wedding.id,
            version_number: (wedding.published_version_number || 0) + 1,
            version_type: 'restored',
            is_published: false,
            summary: `v${versionRecord.version_number} Taslağa Geri Yüklendi`,
            snapshot: restoredSnapshot,
            created_by: wedding.user_id || null
          }
        ]);
      } catch {}

      return NextResponse.json({
        success: true,
        message: `Sürüm v${versionRecord.version_number} başarıyla taslağa geri yüklendi. Değişiklikleri yayına almak için 'Yayınla' butonunu kullanın.`,
        restored_data: restoredSnapshot
      });
    }

    return NextResponse.json({ error: 'Bilinmeyen eylem.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
