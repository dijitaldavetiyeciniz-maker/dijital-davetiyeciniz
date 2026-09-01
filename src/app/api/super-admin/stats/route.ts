import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim. Super Admin yetkisi gereklidir.' }, { status: 401 });
  }

  try {
    // 1. Fetch Registered Auth Users via Admin API
    let authUsersList: any[] = [];
    let authUserIds = new Set<string>();
    let authUserEmails = new Set<string>();

    try {
      const adminClient = getSupabaseAdmin();
      const { data: uData } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (uData?.users) {
        authUsersList = uData.users;
        authUsersList.forEach(u => {
          authUserIds.add(u.id);
          if (u.email) authUserEmails.add(u.email.toLowerCase().trim());
        });
      }
    } catch {}

    // 2. Fetch all weddings for aggregate metrics
    const { data: weddings, error: wError } = await supabase
      .from('weddings')
      .select('id, user_id, user_email, bride_name, groom_name, is_paid, is_active, deleted_at, event_type, template_id, created_at')
      .order('created_at', { ascending: false });

    if (wError) throw wError;

    const allWeddings = weddings || [];
    const activeWeddings = allWeddings.filter(w => !w.deleted_at);
    const publishedWeddings = activeWeddings.filter(w => w.is_paid && w.is_active);
    const draftWeddings = activeWeddings.filter(w => !w.is_paid);

    let registeredOwnerWeddingsCount = 0;
    let legacyWeddingsCount = 0;

    activeWeddings.forEach(w => {
      const userId = w.user_id;
      const email = (w.user_email || '').toLowerCase().trim();
      const hasAuthOwner = (userId && authUserIds.has(userId)) || (email && authUserEmails.has(email));
      if (hasAuthOwner) registeredOwnerWeddingsCount++;
      else legacyWeddingsCount++;
    });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    const todayInvitations = activeWeddings.filter(w => new Date(w.created_at).getTime() >= startOfToday).length;
    const last30DaysInvitations = activeWeddings.filter(w => new Date(w.created_at).getTime() >= thirtyDaysAgo).length;

    // 3. Profiles List
    let profilesList: any[] = [];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profiles) profilesList = profiles;

    const totalMembersCount = Math.max(authUsersList.length, profilesList.length);
    const verifiedMembersCount = authUsersList.length > 0
      ? authUsersList.filter(u => u.email_confirmed_at).length
      : profilesList.filter(p => p.is_email_verified).length;

    const todayUsersCount = authUsersList.length > 0
      ? authUsersList.filter(u => new Date(u.created_at).getTime() >= startOfToday).length
      : profilesList.filter(p => new Date(p.created_at).getTime() >= startOfToday).length;

    const last7DaysUsersCount = authUsersList.length > 0
      ? authUsersList.filter(u => new Date(u.created_at).getTime() >= sevenDaysAgo).length
      : profilesList.filter(p => new Date(p.created_at).getTime() >= sevenDaysAgo).length;

    const last30DaysUsersCount = authUsersList.length > 0
      ? authUsersList.filter(u => new Date(u.created_at).getTime() >= thirtyDaysAgo).length
      : profilesList.filter(p => new Date(p.created_at).getTime() >= thirtyDaysAgo).length;

    // 4. Event Type Distribution
    const eventTypeCounts: Record<string, number> = {};
    activeWeddings.forEach(w => {
      const type = w.event_type || 'Düğün';
      eventTypeCounts[type] = (eventTypeCounts[type] || 0) + 1;
    });

    // 5. Template Usage Distribution
    const templateCounts: Record<string, number> = {};
    activeWeddings.forEach(w => {
      const tpl = w.template_id || 'template1';
      templateCounts[tpl] = (templateCounts[tpl] || 0) + 1;
    });

    const topTemplates = Object.entries(templateCounts)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 6. Contact Messages Count
    let unreadMessagesCount = 0;
    let totalMessagesCount = 0;
    const { data: messages } = await supabase
      .from('contact_messages')
      .select('id, name, email, subject, status, created_at')
      .order('created_at', { ascending: false });

    if (messages) {
      totalMessagesCount = messages.length;
      unreadMessagesCount = messages.filter(m => m.status === 'new').length;
    }

    // 7. Platform Settings
    let platformSettings = {
      maintenance_enabled: false,
      maintenance_scope: 'platform',
      maintenance_message: '',
      allow_registrations: true,
      max_invitations_per_user: 5,
      notification_email: 'dijitaldavetiyeniz@gmail.com'
    };

    const { data: setRow } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (setRow) {
      platformSettings = {
        maintenance_enabled: setRow.maintenance_enabled || false,
        maintenance_scope: setRow.maintenance_scope || 'platform',
        maintenance_message: setRow.maintenance_message || '',
        allow_registrations: setRow.allow_registrations ?? true,
        max_invitations_per_user: setRow.max_invitations_per_user || 5,
        notification_email: setRow.notification_email || 'dijitaldavetiyeniz@gmail.com'
      };
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalMembers: totalMembersCount,
        verifiedMembers: verifiedMembersCount,
        pendingVerifications: totalMembersCount - verifiedMembersCount,
        todayMembers: todayUsersCount,
        last7DaysMembers: last7DaysUsersCount,
        last30DaysMembers: last30DaysUsersCount,

        totalInvitations: activeWeddings.length,
        registeredOwnerInvitations: registeredOwnerWeddingsCount,
        legacyInvitations: legacyWeddingsCount,
        publishedInvitations: publishedWeddings.length,
        draftInvitations: draftWeddings.length,
        todayInvitations,
        last30DaysInvitations,

        unreadMessages: unreadMessagesCount,
        totalMessages: totalMessagesCount,

        topTemplates,
        eventTypeCounts,
        platformSettings
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
