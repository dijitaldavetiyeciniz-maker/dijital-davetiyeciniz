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
    const query = (searchParams.get('q') || '').trim().toLowerCase();
    if (!query || query.length < 2) {
      return NextResponse.json({ users: [], invitations: [] });
    }

    // 1. Search in weddings
    const { data: weddings } = await supabase
      .from('weddings')
      .select('id, slug, bride_name, groom_name, user_email, event_type, is_paid, is_active, created_at')
      .order('created_at', { ascending: false });

    const filteredWeddings = (weddings || [])
      .filter(w => 
        (w.slug && w.slug.toLowerCase().includes(query)) ||
        (w.bride_name && w.bride_name.toLowerCase().includes(query)) ||
        (w.groom_name && w.groom_name.toLowerCase().includes(query)) ||
        (w.user_email && w.user_email.toLowerCase().includes(query))
      )
      .slice(0, 8)
      .map(w => ({
        id: w.id,
        title: w.bride_name && w.groom_name ? `${w.bride_name} & ${w.groom_name}` : w.bride_name || 'Davetiye',
        slug: w.slug,
        email: w.user_email,
        event_type: w.event_type || 'Düğün',
        is_paid: w.is_paid
      }));

    // 2. Search in profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, phone, city, created_at')
      .order('created_at', { ascending: false });

    const filteredProfiles = (profiles || [])
      .filter(p =>
        (p.first_name && p.first_name.toLowerCase().includes(query)) ||
        (p.last_name && p.last_name.toLowerCase().includes(query)) ||
        (p.email && p.email.toLowerCase().includes(query)) ||
        (p.phone && p.phone.toLowerCase().includes(query)) ||
        (p.city && p.city.toLowerCase().includes(query))
      )
      .slice(0, 8)
      .map(p => ({
        id: p.id,
        name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.email?.split('@')[0] || 'İsimsiz Üye',
        email: p.email,
        phone: p.phone,
        city: p.city
      }));

    return NextResponse.json({
      success: true,
      users: filteredProfiles,
      invitations: filteredWeddings
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
