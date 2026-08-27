import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createServerServiceRoleClient } from '@/server/supabaseClient';

const eventSchema = z.object({
  wedding_id: z.string().uuid(),
  type: z.string().min(1),
  title: z.string().min(1),
  start_time: z.string().min(1),
  end_time: z.string().optional().nullable(),
  timezone: z.string().default('Europe/Istanbul'),
  venue_name: z.string().optional().nullable(),
  venue_address: z.string().optional().nullable(),
  google_maps_url: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  is_primary: z.boolean().default(false)
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
    
    // Auth Check
    let isAuthorized = false;
    if (session?.user) {
      const { data: wedding } = await supabase
        .from('weddings')
        .select('id')
        .eq('id', weddingId)
        .eq('user_id', session.user.id)
        .single();
      if (wedding) isAuthorized = true;
    }

    if (!isAuthorized) {
      const cookieStore = await import('next/headers').then(m => m.cookies());
      const storedCookie = cookieStore.get(`admin_auth_${weddingId}`)?.value;
      const { verifyAdminCookie } = await import('@/lib/auth-cookie');
      if (storedCookie && verifyAdminCookie(weddingId, storedCookie)) {
        isAuthorized = true;
      } else {
        const serviceRoleClient = createServerServiceRoleClient();
        const { data: w } = await serviceRoleClient.from('weddings').select('id, slug').or(`id.eq.${weddingId},slug.eq.${weddingId}`).maybeSingle();
        if (w) {
          const c1 = cookieStore.get(`admin_auth_${w.id}`)?.value;
          const c2 = w.slug ? cookieStore.get(`admin_auth_${w.slug}`)?.value : null;
          if ((c1 && verifyAdminCookie(w.id, c1)) || (c2 && (verifyAdminCookie(w.id, c2) || verifyAdminCookie(w.slug, c2)))) {
            isAuthorized = true;
          }
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const serviceRoleClient = createServerServiceRoleClient();
    const { data, error } = await serviceRoleClient
      .from('invitation_events')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = eventSchema.parse(body);
    const weddingId = validatedData.wedding_id;

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    let isAuthorized = false;
    if (session?.user) {
      const { data: wedding } = await supabase
        .from('weddings')
        .select('id')
        .eq('id', weddingId)
        .eq('user_id', session.user.id)
        .single();
      if (wedding) isAuthorized = true;
    }

    if (!isAuthorized) {
      const cookieStore = await import('next/headers').then(m => m.cookies());
      const storedCookie = cookieStore.get(`admin_auth_${weddingId}`)?.value;
      const { verifyAdminCookie } = await import('@/lib/auth-cookie');
      if (storedCookie && verifyAdminCookie(weddingId, storedCookie)) {
        isAuthorized = true;
      } else {
        const serviceRoleClient = createServerServiceRoleClient();
        const { data: w } = await serviceRoleClient.from('weddings').select('id, slug').or(`id.eq.${weddingId},slug.eq.${weddingId}`).maybeSingle();
        if (w) {
          const c1 = cookieStore.get(`admin_auth_${w.id}`)?.value;
          const c2 = w.slug ? cookieStore.get(`admin_auth_${w.slug}`)?.value : null;
          if ((c1 && verifyAdminCookie(w.id, c1)) || (c2 && (verifyAdminCookie(w.id, c2) || verifyAdminCookie(w.slug, c2)))) {
            isAuthorized = true;
          }
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const serviceRoleClient = createServerServiceRoleClient();
    const { data, error } = await serviceRoleClient
      .from('invitation_events')
      .insert(validatedData)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Geçersiz veri', details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
