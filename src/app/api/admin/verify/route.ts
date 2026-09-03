import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminCookie } from '@/lib/auth-cookie';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { wedding_id } = body;
    if (!wedding_id || typeof wedding_id !== 'string') {
      return NextResponse.json({ authenticated: false });
    }

    const cookieStore = await cookies();
    const storedCookie = cookieStore.get(`admin_auth_${wedding_id}`)?.value;

    if (storedCookie && verifyAdminCookie(wedding_id, storedCookie)) {
      return NextResponse.json({ authenticated: true });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(wedding_id);
    let query = supabaseAdmin.from('weddings').select('id, slug');
    if (isUuid) {
      query = query.eq('id', wedding_id);
    } else {
      query = query.eq('slug', wedding_id);
    }
    const { data } = await query.maybeSingle();

    if (data) {
      const c1 = cookieStore.get(`admin_auth_${data.id}`)?.value;
      if (c1 && verifyAdminCookie(data.id, c1)) {
        return NextResponse.json({ authenticated: true });
      }
      if (data.slug) {
        const c2 = cookieStore.get(`admin_auth_${data.slug}`)?.value;
        if (c2 && (verifyAdminCookie(data.id, c2) || verifyAdminCookie(data.slug, c2))) {
          return NextResponse.json({ authenticated: true });
        }
      }
    }

    return NextResponse.json({ authenticated: false });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
