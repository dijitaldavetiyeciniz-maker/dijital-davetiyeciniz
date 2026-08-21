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
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const filter = searchParams.get('filter') || 'all';
    const eventType = searchParams.get('eventType') || 'all';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const { data: weddings, error } = await supabase
      .from('weddings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    let list = (weddings || []).filter(w => !w.deleted_at);

    // Search
    if (search) {
      list = list.filter(w =>
        (w.slug && w.slug.toLowerCase().includes(search)) ||
        (w.bride_name && w.bride_name.toLowerCase().includes(search)) ||
        (w.groom_name && w.groom_name.toLowerCase().includes(search)) ||
        (w.user_email && w.user_email.toLowerCase().includes(search)) ||
        (w.venue_name && w.venue_name.toLowerCase().includes(search))
      );
    }

    // Filter by Status
    if (filter === 'published') {
      list = list.filter(w => w.is_paid && w.is_active);
    } else if (filter === 'draft') {
      list = list.filter(w => !w.is_paid);
    } else if (filter === 'inactive') {
      list = list.filter(w => w.is_active === false);
    }

    // Filter by Event Type
    if (eventType !== 'all') {
      list = list.filter(w => (w.event_type || 'Düğün').toLowerCase() === eventType.toLowerCase());
    }

    // Sorting
    if (sort === 'newest') {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === 'oldest') {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sort === 'date') {
      list.sort((a, b) => {
        if (!a.wedding_date) return 1;
        if (!b.wedding_date) return -1;
        return new Date(a.wedding_date).getTime() - new Date(b.wedding_date).getTime();
      });
    }

    const totalCount = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      invitations: paginated,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Davetiyeler alınırken hata oluştu.' }, { status: 500 });
  }
}

// POST endpoint for updating wedding status / deleting
export async function POST(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const { id, action, payload } = await req.json();
    if (!id || !action) {
      return NextResponse.json({ error: 'Geçersiz parametreler.' }, { status: 400 });
    }

    if (action === 'toggle_publish') {
      const { is_paid } = payload;
      const { error } = await supabase
        .from('weddings')
        .update({ is_paid })
        .eq('id', id);

      if (error) throw error;

      await supabase.from('super_admin_audit_logs').insert([
        { action: is_paid ? 'invitation_published' : 'invitation_unpublished', details: { id } }
      ]);

      return NextResponse.json({ success: true, message: `Yayın durumu güncellendi: ${is_paid ? 'Yayında' : 'Taslak'}` });
    } else if (action === 'delete') {
      const { error } = await supabase
        .from('weddings')
        .update({ deleted_at: new Date().toISOString(), is_active: false })
        .eq('id', id);

      if (error) throw error;

      await supabase.from('super_admin_audit_logs').insert([
        { action: 'invitation_soft_deleted', details: { id } }
      ]);

      return NextResponse.json({ success: true, message: 'Davetiye silindi.' });
    } else if (action === 'update') {
      const { error } = await supabase
        .from('weddings')
        .update(payload)
        .eq('id', id);

      if (error) throw error;

      await supabase.from('super_admin_audit_logs').insert([
        { action: 'invitation_updated', details: { id, fields: Object.keys(payload) } }
      ]);

      return NextResponse.json({ success: true, message: 'Davetiye bilgileri güncellendi.' });
    }

    return NextResponse.json({ error: 'Bilinmeyen aksiyon.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
