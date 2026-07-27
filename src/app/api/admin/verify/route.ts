import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { wedding_id } = await req.json();
    if (!wedding_id) {
      return NextResponse.json({ authenticated: false });
    }

    const cookieStore = await cookies();
    const storedPassword = cookieStore.get(`admin_auth_${wedding_id}`)?.value;

    if (!storedPassword) {
      return NextResponse.json({ authenticated: false });
    }

    const { data, error } = await supabase
      .from('weddings')
      .select('admin_password')
      .eq('id', wedding_id)
      .single();

    if (error || !data) {
      return NextResponse.json({ authenticated: false });
    }

    if (data.admin_password === storedPassword) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false });
  } catch (e: any) {
    return NextResponse.json({ authenticated: false });
  }
}
