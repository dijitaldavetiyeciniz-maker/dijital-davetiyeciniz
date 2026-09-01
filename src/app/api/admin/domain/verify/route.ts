import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdminCookie } from '@/lib/auth-cookie';
import { getDomainProvider } from '@/lib/domain-provider';
import { normalizeHostname } from '@/lib/domain-utils';
import { publishActiveDomainMapping } from '@/lib/host-resolution-store';

/**
 * Helper to authenticate admin for wedding ownership
 */
async function authenticateWeddingAdmin(weddingId: string): Promise<{ authorized: boolean; wedding?: any }> {
  try {
    const supabase = getSupabaseAdmin();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(weddingId);
    
    let query = supabase.from('weddings').select('id, slug');
    if (isUuid) {
      query = query.eq('id', weddingId);
    } else {
      query = query.eq('slug', weddingId);
    }

    const { data: wedding, error } = await query.maybeSingle();
    if (error || !wedding) {
      return { authorized: false };
    }

    const cookieStore = await cookies();
    const c1 = cookieStore.get(`admin_auth_${wedding.id}`)?.value;
    if (c1 && verifyAdminCookie(wedding.id, c1)) {
      return { authorized: true, wedding };
    }

    if (wedding.slug) {
      const c2 = cookieStore.get(`admin_auth_${wedding.slug}`)?.value;
      if (c2 && (verifyAdminCookie(wedding.id, c2) || verifyAdminCookie(wedding.slug, c2))) {
        return { authorized: true, wedding };
      }
    }

    return { authorized: false };
  } catch (err) {
    return { authorized: false };
  }
}

/**
 * POST: Trigger DNS / SSL verification on a custom domain
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { wedding_id: rawWeddingId, hostname: rawHostname } = body;

    if (!rawWeddingId || !rawHostname) {
      return NextResponse.json({ error: 'wedding_id ve hostname zorunludur', code: 'MISSING_PARAM' }, { status: 400 });
    }

    // 1. Authorization: Verify admin cookie for wedding ownership
    const { authorized, wedding } = await authenticateWeddingAdmin(rawWeddingId);
    if (!authorized || !wedding) {
      return NextResponse.json({ error: 'Yetkisiz erişim', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const { hostname: normalized } = normalizeHostname(rawHostname);
    const supabase = getSupabaseAdmin();

    // 2. Fetch custom_domains record
    const { data: domain, error: fetchErr } = await supabase
      .from('custom_domains')
      .select('*')
      .eq('wedding_id', wedding.id)
      .eq('hostname', normalized)
      .maybeSingle();

    if (fetchErr || !domain) {
      return NextResponse.json({ error: 'Doğrulanacak alan adı bulunamadı', code: 'DOMAIN_NOT_FOUND' }, { status: 404 });
    }

    // 3. Query provider verification
    const provider = getDomainProvider();
    const verifyRes = await provider.verifyDomain(normalized);

    const isVerified = Boolean(verifyRes.verified || verifyRes.status === 'active');
    const updatedStatus = isVerified ? 'active' : 'pending';
    const updatedSslStatus = isVerified ? 'active' : 'pending';

    // 4. Update DB state machine
    const { data: updatedDomain, error: updateErr } = await supabase
      .from('custom_domains')
      .update({
        status: updatedStatus,
        ssl_status: updatedSslStatus,
        verified_at: isVerified ? new Date().toISOString() : domain.verified_at,
        verification_error: isVerified ? null : verifyRes.errorMessage || 'DNS yayılımı bekleniyor',
        updated_at: new Date().toISOString(),
      })
      .eq('id', domain.id)
      .select('id, wedding_id, hostname, status, ssl_status, is_primary, verified_at, verification_error, created_at, updated_at')
      .single();

    if (updateErr) {
      return NextResponse.json({ error: 'Veritabanı güncelleme hatası', code: 'DATABASE_ERROR' }, { status: 500 });
    }

    // 5. Control Plane -> Data Plane: Publish active mapping to Shared Host Store
    if (isVerified) {
      try {
        await publishActiveDomainMapping(wedding.id, wedding.slug || wedding.id, normalized);
      } catch (err) {
        console.warn('[DomainVerify] Failed to publish active mapping to shared host store:', err);
      }
    }

    return NextResponse.json({
      success: isVerified,
      domain: updatedDomain,
      message: isVerified
        ? 'Alan adınız başarıyla doğrulandı ve aktif edildi.'
        : verifyRes.errorMessage || 'DNS kayıtları henüz tespit edilemedi. DNS yayılımı birkaç saat sürebilir.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Sunucu hatası', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
