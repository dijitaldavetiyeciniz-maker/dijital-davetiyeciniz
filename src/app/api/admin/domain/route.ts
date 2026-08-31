import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdminCookie } from '@/lib/auth-cookie';
import { getUserEntitlements } from '@/lib/entitlements';
import { getDomainProvider } from '@/lib/domain-provider';
import { normalizeHostname, isValidHostname, isPlatformDomain } from '@/lib/domain-utils';

/**
 * Helper to authenticate admin for wedding ownership
 */
async function authenticateWeddingAdmin(weddingId: string): Promise<{ authorized: boolean; wedding?: any }> {
  try {
    const supabase = getSupabaseAdmin();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(weddingId);
    
    let query = supabase.from('weddings').select('id, slug, user_id, is_paid');
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
 * GET: Retrieve custom domains connected to wedding
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get('wedding_id');

    if (!weddingId) {
      return NextResponse.json({ error: 'wedding_id parametresi gereklidir', code: 'MISSING_PARAM' }, { status: 400 });
    }

    const { authorized, wedding } = await authenticateWeddingAdmin(weddingId);
    if (!authorized || !wedding) {
      return NextResponse.json({ error: 'Yetkisiz erişim', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data: domains, error } = await supabase
      .from('custom_domains')
      .select('id, wedding_id, hostname, status, ssl_status, is_primary, verified_at, verification_error, created_at, updated_at')
      .eq('wedding_id', wedding.id)
      .order('is_primary', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Veritabanı hatası', code: 'DATABASE_ERROR' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      domains: domains || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Sunucu hatası', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

/**
 * POST: Connect a custom domain to wedding (with plan entitlement & canonical normalization)
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

    // 2. Entitlement Gate: Verify custom domain feature is allowed for this tenant's plan
    const entitlements = await getUserEntitlements(wedding.user_id);
    if (!entitlements.allowCustomDomain && !wedding.is_paid) {
      return NextResponse.json(
        {
          error: 'Özel alan adı (Custom Domain) özelliği seçili planınızda aktif değildir. Lütfen paketinizi yükseltin.',
          code: 'ENTITLEMENT_DENIED',
        },
        { status: 403 }
      );
    }

    // 3. Hostname Normalization & Validation
    const { hostname: normalized, error: normErr } = normalizeHostname(rawHostname);
    if (normErr || !isValidHostname(normalized)) {
      return NextResponse.json(
        { error: normErr || 'Geçersiz alan adı formatı (örn: davet.example.com)', code: 'INVALID_HOSTNAME' },
        { status: 400 }
      );
    }

    // 4. Platform Host Rejection
    if (isPlatformDomain(normalized)) {
      return NextResponse.json(
        { error: 'Platforma ait veya rezerve alan adları kullanılamaz.', code: 'RESERVED_HOSTNAME' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 5. Database Uniqueness Check
    const { data: existingDomain } = await supabase
      .from('custom_domains')
      .select('id, wedding_id')
      .eq('hostname', normalized)
      .maybeSingle();

    if (existingDomain && existingDomain.wedding_id !== wedding.id) {
      return NextResponse.json(
        { error: 'Bu alan adı başka bir davetiyeye tanımlıdır.', code: 'DOMAIN_ALREADY_EXISTS' },
        { status: 409 }
      );
    }

    // 6. Provider Registration
    const provider = getDomainProvider();
    const providerRes = await provider.addDomain(normalized);

    if (!providerRes.success) {
      return NextResponse.json(
        { error: providerRes.errorMessage || 'Sağlayıcıya alan adı eklenemedi', code: providerRes.errorCode || 'PROVIDER_ERROR' },
        { status: 502 }
      );
    }

    // 7. Persist to custom_domains table
    const verificationToken =
      providerRes.verificationRequirements?.find((r) => r.type === 'TXT')?.value || null;

    const domainRecord = {
      wedding_id: wedding.id,
      hostname: normalized,
      status: providerRes.status || 'pending',
      ssl_status: providerRes.sslStatus || 'pending',
      verification_token: verificationToken,
      provider: 'vercel',
      provider_domain_id: providerRes.domainId || normalized,
      is_primary: true,
      updated_at: new Date().toISOString(),
    };

    const { data: savedDomain, error: dbError } = await supabase
      .from('custom_domains')
      .upsert(domainRecord, { onConflict: 'hostname' })
      .select('id, wedding_id, hostname, status, ssl_status, is_primary, verified_at, verification_error, created_at, updated_at')
      .single();

    if (dbError) {
      // Rollback provider registration on DB failure
      await provider.removeDomain(normalized).catch(() => {});
      return NextResponse.json({ error: 'Veritabanı kayıt hatası', code: 'DATABASE_ERROR' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      domain: savedDomain,
      verificationRequirements: providerRes.verificationRequirements || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Sunucu hatası', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

/**
 * DELETE: Remove custom domain from wedding
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawWeddingId = searchParams.get('wedding_id');
    const rawHostname = searchParams.get('hostname');

    if (!rawWeddingId || !rawHostname) {
      return NextResponse.json({ error: 'wedding_id ve hostname zorunludur', code: 'MISSING_PARAM' }, { status: 400 });
    }

    const { authorized, wedding } = await authenticateWeddingAdmin(rawWeddingId);
    if (!authorized || !wedding) {
      return NextResponse.json({ error: 'Yetkisiz erişim', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const { hostname: normalized } = normalizeHostname(rawHostname);
    const supabase = getSupabaseAdmin();

    // 1. Fetch domain record
    const { data: domain } = await supabase
      .from('custom_domains')
      .select('id, hostname')
      .eq('wedding_id', wedding.id)
      .eq('hostname', normalized)
      .maybeSingle();

    if (!domain) {
      return NextResponse.json({ error: 'Silinecek alan adı bulunamadı', code: 'DOMAIN_NOT_FOUND' }, { status: 404 });
    }

    // 2. Remove from provider first (with idempotent handling)
    const provider = getDomainProvider();
    const removeRes = await provider.removeDomain(normalized);

    if (!removeRes.success) {
      // Mark state as error/removing rather than silently deleting DB row without provider sync
      await supabase
        .from('custom_domains')
        .update({ status: 'error', verification_error: removeRes.errorMessage || 'Provider deletion failed' })
        .eq('id', domain.id);

      return NextResponse.json(
        { error: removeRes.errorMessage || 'Alan adı sağlayıcıdan silinemedi', code: removeRes.errorCode || 'PROVIDER_ERROR' },
        { status: 502 }
      );
    }

    // 3. Delete from custom_domains table (DB trigger in W2 handles weddings.custom_domain cleanup automatically)
    const { error: dbError } = await supabase
      .from('custom_domains')
      .delete()
      .eq('id', domain.id);

    if (dbError) {
      return NextResponse.json({ error: 'Veritabanı silme hatası', code: 'DATABASE_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Alan adı başarıyla kaldırıldı' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Sunucu hatası', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
