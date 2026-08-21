import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim. Super Admin yetkisi gereklidir.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const filter = searchParams.get('filter') || 'all';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // 1. Fetch all weddings to aggregate user invitation counts
    const { data: weddings } = await supabase
      .from('weddings')
      .select('id, user_id, user_email, slug, bride_name, groom_name, event_type, template_id, is_paid, is_active, deleted_at, created_at, venue_address')
      .order('created_at', { ascending: false });

    const activeWeddings = (weddings || []).filter(w => !w.deleted_at);

    // Map weddings by user_id and user_email
    const userWeddingsMap: Record<string, any[]> = {};
    activeWeddings.forEach(w => {
      if (w.user_id) {
        userWeddingsMap[w.user_id] = userWeddingsMap[w.user_id] || [];
        userWeddingsMap[w.user_id].push(w);
      }
      if (w.user_email) {
        const emailKey = w.user_email.toLowerCase();
        userWeddingsMap[emailKey] = userWeddingsMap[emailKey] || [];
        userWeddingsMap[emailKey].push(w);
      }
    });

    // 2. Fetch Profiles from Database
    let profilesList: any[] = [];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profiles) {
      profilesList = profiles;
    }

    // Also synthesize member items for users in weddings who don't have explicit profile row yet
    const knownIds = new Set(profilesList.map(p => p.id));
    const knownEmails = new Set(profilesList.map(p => p.email?.toLowerCase()).filter(Boolean));

    activeWeddings.forEach(w => {
      if (w.user_id && !knownIds.has(w.user_id)) {
        knownIds.add(w.user_id);
        profilesList.push({
          id: w.user_id,
          email: w.user_email || 'Kullanıcı',
          first_name: (w.bride_name || 'Üye').split(' ')[0],
          last_name: (w.groom_name || '').split(' ')[0] || '',
          phone: null,
          country: 'Türkiye',
          city: w.venue_address ? w.venue_address.split(',')[0] : 'İstanbul',
          address: w.venue_address || null,
          created_at: w.created_at,
          updated_at: w.created_at,
          is_suspended: false
        });
      }
    });

    // Compute stats for each member
    let members = profilesList.map(p => {
      const userWedsById = p.id ? (userWeddingsMap[p.id] || []) : [];
      const userWedsByEmail = p.email ? (userWeddingsMap[p.email.toLowerCase()] || []) : [];
      
      // Deduplicate
      const combinedWedsMap = new Map();
      [...userWedsById, ...userWedsByEmail].forEach(w => combinedWedsMap.set(w.id, w));
      const userWeds = Array.from(combinedWedsMap.values());

      const totalInvitations = userWeds.length;
      const publishedInvitations = userWeds.filter(w => w.is_paid && w.is_active).length;
      const draftInvitations = totalInvitations - publishedInvitations;

      return {
        id: p.id,
        email: p.email || '-',
        first_name: p.first_name || '',
        last_name: p.last_name || '',
        full_name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.email?.split('@')[0] || 'İsimsiz Üye',
        phone: p.phone || null,
        country: p.country || 'Türkiye',
        city: p.city || '-',
        address: p.address || null,
        created_at: p.created_at,
        updated_at: p.updated_at,
        is_suspended: p.is_suspended || false,
        total_invitations: totalInvitations,
        published_invitations: publishedInvitations,
        draft_invitations: draftInvitations,
        invitations: userWeds.map(w => ({
          id: w.id,
          slug: w.slug,
          title: w.bride_name && w.groom_name ? `${w.bride_name} & ${w.groom_name}` : w.bride_name || 'Davetiye',
          event_type: w.event_type || 'Düğün',
          template_id: w.template_id,
          is_paid: w.is_paid,
          is_active: w.is_active,
          created_at: w.created_at
        }))
      };
    });

    // Search filter
    if (search) {
      members = members.filter(m => 
        m.full_name.toLowerCase().includes(search) ||
        m.email.toLowerCase().includes(search) ||
        (m.phone && m.phone.toLowerCase().includes(search)) ||
        m.city.toLowerCase().includes(search)
      );
    }

    // Category Filter
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    if (filter === 'new') {
      members = members.filter(m => new Date(m.created_at).getTime() >= sevenDaysAgo);
    } else if (filter === 'has_invitations') {
      members = members.filter(m => m.total_invitations > 0);
    } else if (filter === 'no_invitations') {
      members = members.filter(m => m.total_invitations === 0);
    } else if (filter === 'has_published') {
      members = members.filter(m => m.published_invitations > 0);
    } else if (filter === 'last30days') {
      members = members.filter(m => new Date(m.created_at).getTime() >= thirtyDaysAgo);
    } else if (filter === 'suspended') {
      members = members.filter(m => m.is_suspended);
    }

    // Sorting
    if (sort === 'newest') {
      members.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === 'oldest') {
      members.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sort === 'most_invitations') {
      members.sort((a, b) => b.total_invitations - a.total_invitations);
    } else if (sort === 'name') {
      members.sort((a, b) => a.full_name.localeCompare(b.full_name, 'tr'));
    }

    const totalCount = members.length;
    const startIndex = (page - 1) * limit;
    const paginatedMembers = members.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      users: paginatedMembers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Üyeler yüklenirken hata oluştu.' }, { status: 500 });
  }
}

// POST endpoint for Super Admin to toggle user suspension
export async function POST(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const { userId, action, reason } = await req.json();
    if (!userId || !action) {
      return NextResponse.json({ error: 'Geçersiz parametreler.' }, { status: 400 });
    }

    const isSuspended = action === 'suspend';

    // Update profile
    await supabase
      .from('profiles')
      .update({
        is_suspended: isSuspended,
        suspension_reason: reason || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    // Record audit log
    await supabase.from('super_admin_audit_logs').insert([
      {
        action: isSuspended ? 'user_suspended' : 'user_reactivated',
        details: { userId, reason }
      }
    ]);

    return NextResponse.json({ success: true, message: `Kullanıcı ${isSuspended ? 'askıya alındı' : 'aktif edildi'}.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
