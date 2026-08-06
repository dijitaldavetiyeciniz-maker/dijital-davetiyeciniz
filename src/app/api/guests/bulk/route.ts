import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createServerServiceRoleClient } from '@/server/supabaseClient';
import { generateGuestToken } from '@/server/guestTokens';
import crypto from 'crypto';

const bulkActionSchema = z.object({
  wedding_id: z.string().uuid(),
  guest_ids: z.array(z.string().uuid()).min(1),
  action: z.enum(['bulk_delete', 'bulk_renew', 'bulk_assign_group']),
  group_id: z.string().uuid().optional().nullable() // Sadece bulk_assign_group için
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = bulkActionSchema.parse(body);
    const { wedding_id: weddingId, guest_ids: guestIds, action, group_id } = validatedData;

    const supabase = await createAdminClient();
    const { data: { session } } = await supabase.auth.getSession();

    let isAuthorized = false;
    let authMethod = 'session';

    if (session?.user) {
      const { data: wedding } = await supabase
        .from('weddings')
        .select('id, user_id, slug')
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

    // Sadece bu düğüne ait olan ve silinmemiş misafirleri filtrele (güvenlik)
    const { data: validGuests, error: validationError } = await dbClient
      .from('guests')
      .select('id, token_version')
      .eq('wedding_id', weddingId)
      .is('deleted_at', null)
      .in('id', guestIds);

    if (validationError) throw validationError;

    const validGuestIds = validGuests?.map(g => g.id) || [];

    if (validGuestIds.length === 0) {
      return NextResponse.json({ error: 'İşlem yapılacak geçerli misafir bulunamadı' }, { status: 400 });
    }

    if (action === 'bulk_delete') {
      const { error } = await dbClient
        .from('guests')
        .update({ deleted_at: new Date().toISOString() })
        .in('id', validGuestIds);
      if (error) throw error;
    } 
    else if (action === 'bulk_assign_group') {
      const { error } = await dbClient
        .from('guests')
        .update({ group_id: group_id || null })
        .in('id', validGuestIds);
      if (error) throw error;
    } 
    else if (action === 'bulk_renew') {
      // Her misafir için ayrı ayrı token version arttırma işlemi yapmamız gerekiyor
      // Toplu update için Promise.all kullanacağız
      const updatePromises = validGuests.map(guest => {
        const newVersion = (guest.token_version || 0) + 1;
        const newPublicId = crypto.randomBytes(16).toString('hex');
        
        return dbClient
          .from('guests')
          .update({ 
            token_version: newVersion, 
            public_id: newPublicId,
            token_revoked_at: null 
          })
          .eq('id', guest.id);
      });
      
      await Promise.all(updatePromises);
    }

    return NextResponse.json({ success: true, processed_count: validGuestIds.length });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Geçersiz veri', details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
