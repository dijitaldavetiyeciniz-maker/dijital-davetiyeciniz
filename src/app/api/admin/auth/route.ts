import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { signAdminCookie } from '@/lib/auth-cookie';

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
    const { wedding_id, password } = await req.json();
    if (!wedding_id || !password) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(wedding_id);
    let query = supabaseAdmin.from('weddings').select('id, slug, admin_password');
    if (isUuid) {
      query = query.eq('id', wedding_id);
    } else {
      query = query.eq('slug', wedding_id);
    }
    const { data, error } = await query.single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Wedding not found' }, { status: 404 });
    }

    if (data.admin_password === password) {
      const cookieStore = await cookies();
      const signedValue = signAdminCookie(data.id);
      cookieStore.set(`admin_auth_${data.id}`, signedValue, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });
      if (data.slug) {
        cookieStore.set(`admin_auth_${data.slug}`, signedValue, { 
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production', 
          path: '/',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7
        });
      }
      return NextResponse.json({ success: true, wedding_id: data.id });
    }

    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
