import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { verifyAdminCookie } from '@/lib/auth-cookie';

export async function POST(req: Request) {
  try {
    const { wedding_id } = await req.json();
    if (!wedding_id) {
      return NextResponse.json({ authenticated: false });
    }

    const cookieStore = await cookies();
    const storedCookie = cookieStore.get(`admin_auth_${wedding_id}`)?.value;

    if (!storedCookie) {
      return NextResponse.json({ authenticated: false });
    }

    if (verifyAdminCookie(wedding_id, storedCookie)) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false });
  } catch (e: any) {
    return NextResponse.json({ authenticated: false });
  }
}
