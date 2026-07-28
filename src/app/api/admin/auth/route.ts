import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { signAdminCookie } from '@/lib/auth-cookie';

export async function POST(req: Request) {
  try {
    const { wedding_id, password } = await req.json();
    if (!wedding_id || !password) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('weddings')
      .select('admin_password')
      .eq('id', wedding_id)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Wedding not found' }, { status: 404 });
    }

    if (data.admin_password === password) {
      const cookieStore = await cookies();
      const signedValue = signAdminCookie(wedding_id);
      cookieStore.set(`admin_auth_${wedding_id}`, signedValue, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
