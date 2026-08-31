import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerServiceRoleClient } from '@/server/supabaseClient';

export async function POST(req: Request) {
  try {
    const { wedding_id } = await req.json();
    if (!wedding_id) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    const sClient = createServerServiceRoleClient();
    const { data: w } = await sClient
      .from('weddings')
      .select('id, slug')
      .or(`id.eq.${wedding_id},slug.eq.${wedding_id}`)
      .maybeSingle();

    const cookieStore = await cookies();
    if (w) {
      cookieStore.delete(`admin_auth_${w.id}`);
      if (w.slug) {
        cookieStore.delete(`admin_auth_${w.slug}`);
      }
    } else {
      cookieStore.delete(`admin_auth_${wedding_id}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
