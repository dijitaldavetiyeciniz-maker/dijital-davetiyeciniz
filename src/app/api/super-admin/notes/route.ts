import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ notes: [] });
    }

    const { data: notes, error } = await supabase
      .from('user_internal_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ notes: [] });
    }

    return NextResponse.json({ notes: notes || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const { userId, note } = await req.json();
    if (!userId || !note || !note.trim()) {
      return NextResponse.json({ error: 'Not içeriği gereklidir.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('user_internal_notes')
      .insert([
        {
          user_id: userId,
          note: note.trim(),
          author_email: 'Super Admin'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    await supabase.from('super_admin_audit_logs').insert([
      {
        action: 'user_internal_note_added',
        actor_email: 'Super Admin',
        details: { userId }
      }
    ]);

    return NextResponse.json({ success: true, note: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
