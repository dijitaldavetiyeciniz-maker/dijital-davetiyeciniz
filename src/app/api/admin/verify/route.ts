import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { verifyAdminCookie } from '@/lib/auth-cookie';

const supabaseAdmin = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
  if (!key) throw new Error("SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY is missing");
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
})();

export async function POST(req: Request) {
  try {
    const { wedding_id } = await req.json();
    if (!wedding_id) {
      return NextResponse.json({ authenticated: false });
    }

    const cookieStore = await cookies();
    const storedCookie = cookieStore.get(`admin_auth_${wedding_id}`)?.value;

    if (storedCookie && verifyAdminCookie(wedding_id, storedCookie)) {
      return NextResponse.json({ authenticated: true });
    }

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
  } catch (e: any) {
    return NextResponse.json({ authenticated: false });
  }
}
