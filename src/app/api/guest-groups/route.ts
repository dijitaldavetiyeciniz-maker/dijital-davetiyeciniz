import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createServerServiceRoleClient } from '@/server/supabaseClient';

const groupSchema = z.object({
  wedding_id: z.string().uuid(),
  name: z.string().min(1, 'Grup adı boş olamaz').max(100)
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weddingId = searchParams.get('wedding_id');

    if (!weddingId) {
      return NextResponse.json({ error: 'wedding_id gerekli' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();

    let isAuthorized = false;
    let authMethod = 'session';

    if (session?.user) {
      const { data: wedding } = await supabase
        .from('weddings')
        .select('id, user_id')
        .eq('id', weddingId)
        .eq('user_id', session.user.id)
        .single();
      
      if (wedding) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      const cookieStore = await import('next/headers').then(m => m.cookies());
      const storedCookie = cookieStore.get(`admin_auth_${weddingId}`)?.value;
      const { verifyAdminCookie } = await import('@/lib/auth-cookie');
      
      if (storedCookie && verifyAdminCookie(weddingId, storedCookie)) {
        isAuthorized = true;
        authMethod = 'cookie';
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const dbClient = authMethod === 'session' ? supabase : createServerServiceRoleClient();

    const { data: groups, error } = await dbClient
      .from('guest_groups')
      .select('id, wedding_id, name, created_at, updated_at')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ groups: groups || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = groupSchema.parse(body);
    const { wedding_id: weddingId, name } = validatedData;

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();

    let isAuthorized = false;
    let authMethod = 'session';

    if (session?.user) {
      const { data: wedding } = await supabase
        .from('weddings')
        .select('id, user_id')
        .eq('id', weddingId)
        .eq('user_id', session.user.id)
        .single();
      
      if (wedding) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      const cookieStore = await import('next/headers').then(m => m.cookies());
      const storedCookie = cookieStore.get(`admin_auth_${weddingId}`)?.value;
      const { verifyAdminCookie } = await import('@/lib/auth-cookie');
      
      if (storedCookie && verifyAdminCookie(weddingId, storedCookie)) {
        isAuthorized = true;
        authMethod = 'cookie';
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const dbClient = authMethod === 'session' ? supabase : createServerServiceRoleClient();

    const { data: group, error } = await dbClient
      .from('guest_groups')
      .insert({ wedding_id: weddingId, name })
      .select('id, wedding_id, name, created_at, updated_at')
      .single();

    if (error) throw error;

    return NextResponse.json({ group });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Geçersiz veri', details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
