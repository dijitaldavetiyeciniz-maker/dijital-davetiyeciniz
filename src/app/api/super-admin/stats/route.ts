import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim. Super Admin yetkisi gereklidir.' }, { status: 401 });
  }

  try {
    // 1. Fetch all weddings for aggregate metrics
    const { data: weddings, error: wError } = await supabase
      .from('weddings')
      .select('id, user_id, user_email, is_paid, is_active, deleted_at, event_type, template_id, created_at')
      .order('created_at', { ascending: false });

    if (wError) throw wError;

    const allWeddings = weddings || [];
    const activeWeddings = allWeddings.filter(w => !w.deleted_at);
    const publishedWeddings = activeWeddings.filter(w => w.is_paid && w.is_active);
    const draftWeddings = activeWeddings.filter(w => !w.is_paid);

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    const todayInvitations = activeWeddings.filter(w => new Date(w.created_at).getTime() >= startOfToday).length;
    const last30DaysInvitations = activeWeddings.filter(w => new Date(w.created_at).getTime() >= thirtyDaysAgo).length;

    // 2. Fetch Profiles for Member Metrics
    let profilesList: any[] = [];
    const { data: profiles, error: pError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!pError && profiles) {
      profilesList = profiles;
    }

    // Combine distinct users from profiles + weddings user_ids/emails
    const distinctUserIds = new Set<string>();
    profilesList.forEach(p => distinctUserIds.add(p.id));
    activeWeddings.forEach(w => {
      if (w.user_id) distinctUserIds.add(w.user_id);
      else if (w.user_email) distinctUserIds.add(w.user_email);
    });

    const totalMembersCount = Math.max(distinctUserIds.size, profilesList.length);

    const todayUsersCount = profilesList.filter(p => new Date(p.created_at).getTime() >= startOfToday).length;
    const last7DaysUsersCount = profilesList.filter(p => new Date(p.created_at).getTime() >= sevenDaysAgo).length;
    const last30DaysUsersCount = profilesList.filter(p => new Date(p.created_at).getTime() >= thirtyDaysAgo).length;

    // 3. Event Type Distribution
    const eventTypeCounts: Record<string, number> = {};
    activeWeddings.forEach(w => {
      const type = w.event_type || 'Düğün';
      eventTypeCounts[type] = (eventTypeCounts[type] || 0) + 1;
    });

    // 4. Template Usage Distribution
    const templateCounts: Record<string, number> = {};
    activeWeddings.forEach(w => {
      const tpl = w.template_id || 'template1';
      templateCounts[tpl] = (templateCounts[tpl] || 0) + 1;
    });

    const topTemplates = Object.entries(templateCounts)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 5. Contact Messages Count
    let unreadMessagesCount = 0;
    let totalMessagesCount = 0;
    const { data: messages } = await supabase
      .from('contact_messages')
      .select('id, status');

    if (messages) {
      totalMessagesCount = messages.length;
      unreadMessagesCount = messages.filter(m => m.status === 'new').length;
    }

    // 6. Platform Settings
    let platformSettings = {
      maintenance_enabled: false,
      maintenance_scope: 'platform',
      maintenance_message: '',
      announcement_enabled: false,
      announcement_message: '',
      contact_email: 'dijitaldavetiyeciniz@gmail.com',
      contact_phone: '+90 555 000 0000',
    };

    const { data: settings } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (settings) {
      platformSettings = settings;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalMembers: totalMembersCount,
        todayMembers: todayUsersCount,
        last7DaysMembers: last7DaysUsersCount,
        last30DaysMembers: last30DaysUsersCount,
        totalInvitations: activeWeddings.length,
        publishedInvitations: publishedWeddings.length,
        draftInvitations: draftWeddings.length,
        todayInvitations,
        last30DaysInvitations,
        unreadMessages: unreadMessagesCount,
        totalMessages: totalMessagesCount,
        eventTypeDistribution: eventTypeCounts,
        topTemplates,
        platformSettings
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'İstatistikler alınırken hata oluştu.' }, { status: 500 });
  }
}
