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
      .select('id, user_id, user_email, bride_name, groom_name, is_paid, is_active, deleted_at, event_type, template_id, created_at')
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

    // Combine distinct users
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
      .select('id, name, email, subject, status, created_at')
      .order('created_at', { ascending: false });

    if (messages) {
      totalMessagesCount = messages.length;
      unreadMessagesCount = messages.filter(m => m.status === 'new').length;
    }

    // 6. Email Verifications & Delivery Stats
    let totalVerifications = 0;
    let pendingVerifications = 0;
    let verifiedCount = 0;
    const { data: verifications } = await supabase
      .from('email_verifications')
      .select('id, email, status, created_at');

    if (verifications) {
      totalVerifications = verifications.length;
      pendingVerifications = verifications.filter(v => v.status === 'pending').length;
      verifiedCount = verifications.filter(v => v.status === 'verified').length;
    }

    let emailDeliveryTotal = 0;
    let emailDeliverySuccess = 0;
    let emailDeliveryFailed = 0;
    const { data: deliveryLogs } = await supabase
      .from('email_delivery_logs')
      .select('id, status');

    if (deliveryLogs) {
      emailDeliveryTotal = deliveryLogs.length;
      emailDeliverySuccess = deliveryLogs.filter(d => d.status === 'sent').length;
      emailDeliveryFailed = deliveryLogs.filter(d => d.status === 'failed').length;
    }

    // 7. Platform Settings
    let platformSettings = {
      maintenance_enabled: false,
      maintenance_scope: 'platform',
      maintenance_message: '',
      announcement_enabled: false,
      announcement_message: '',
      contact_email: 'dijitaldavetiyeciniz@gmail.com',
      contact_phone: '+90 555 000 0000',
      contact_address: 'Levent, Büyükdere Cad. No: 199, Şişli / İstanbul',
      allow_signup: true,
      allow_invitation_creation: true,
      contact_form_enabled: true
    };

    const { data: settings } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (settings) {
      platformSettings = { ...platformSettings, ...settings };
    }

    // 8. Unified Real Recent Activity Feed
    const recentActivities: any[] = [];

    (profilesList || []).slice(0, 6).forEach(p => {
      recentActivities.push({
        id: `user-${p.id}`,
        type: 'user_registered',
        title: 'Yeni Üye Kaydı',
        description: `${p.first_name || ''} ${p.last_name || ''} (${p.email}) sisteme kaydoldu.`.trim(),
        timestamp: p.created_at,
        category: 'members'
      });
    });

    (activeWeddings || []).slice(0, 6).forEach(w => {
      recentActivities.push({
        id: `wed-${w.id}`,
        type: w.is_paid ? 'invitation_published' : 'invitation_created',
        title: w.is_paid ? 'Davetiye Yayınlandı' : 'Yeni Davetiye Oluşturuldu',
        description: `${w.bride_name && w.groom_name ? `${w.bride_name} & ${w.groom_name}` : 'Davetiye'} (${w.event_type || 'Düğün'})`,
        timestamp: w.created_at,
        category: 'invitations'
      });
    });

    (messages || []).slice(0, 6).forEach(m => {
      recentActivities.push({
        id: `msg-${m.id}`,
        type: 'contact_message',
        title: 'Yeni İletişim Mesajı',
        description: `${m.name}: ${m.subject || 'Konu belirtilmedi'}`,
        timestamp: m.created_at,
        category: 'contacts'
      });
    });

    recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      success: true,
      stats: {
        totalMembers: totalMembersCount,
        todayMembers: todayUsersCount,
        last7DaysMembers: last7DaysUsersCount,
        last30DaysMembers: last30DaysUsersCount,
        verifiedMembers: verifiedCount,
        totalInvitations: activeWeddings.length,
        publishedInvitations: publishedWeddings.length,
        draftInvitations: draftWeddings.length,
        todayInvitations,
        last30DaysInvitations,
        unreadMessages: unreadMessagesCount,
        totalMessages: totalMessagesCount,
        totalVerifications,
        pendingVerifications,
        emailDeliveryTotal,
        emailDeliverySuccess,
        emailDeliveryFailed,
        eventTypeDistribution: eventTypeCounts,
        topTemplates,
        platformSettings,
        platformHealth: {
          database: 'operational',
          email: emailDeliveryFailed > 5 ? 'degraded' : 'operational',
          maintenance: platformSettings.maintenance_enabled ? 'maintenance' : 'live',
          publicSite: 'operational'
        },
        recentActivities: recentActivities.slice(0, 15)
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'İstatistikler alınırken hata oluştu.' }, { status: 500 });
  }
}
