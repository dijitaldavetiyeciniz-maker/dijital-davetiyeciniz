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
    const filter = searchParams.get('filter') || 'all';
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // If table doesn't exist yet, return empty list safely
      return NextResponse.json({ success: true, messages: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 0 } });
    }

    let list = messages || [];

    if (search) {
      list = list.filter(m =>
        m.name.toLowerCase().includes(search) ||
        m.email.toLowerCase().includes(search) ||
        m.subject.toLowerCase().includes(search) ||
        m.message.toLowerCase().includes(search)
      );
    }

    if (filter === 'new') {
      list = list.filter(m => m.status === 'new');
    } else if (filter === 'read') {
      list = list.filter(m => m.status === 'read');
    } else if (filter === 'archived') {
      list = list.filter(m => m.status === 'archived');
    }

    const totalCount = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      messages: paginated,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
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
    const { id, action, status } = await req.json();
    if (!id || !action) {
      return NextResponse.json({ error: 'Geçersiz parametreler.' }, { status: 400 });
    }

    if (action === 'set_status') {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: `Mesaj durumu güncellendi: ${status}` });
    } else if (action === 'delete') {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Mesaj silindi.' });
    }

    return NextResponse.json({ error: 'Bilinmeyen aksiyon.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
