import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const targetType = searchParams.get('targetType');

    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(150);

    if (action && action !== 'all') {
      query = query.eq('action', action);
    }

    if (targetType && targetType !== 'all') {
      query = query.eq('target_type', targetType);
    }

    const { data: logs, error } = await query;

    if (error) {
      // Fallback to legacy super_admin_audit_logs if new table not yet queried
      const { data: legacyLogs } = await supabase
        .from('super_admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      return NextResponse.json({
        success: true,
        logs: (legacyLogs || []).map(l => ({
          id: l.id,
          action: l.action,
          actor_email: l.actor_email || 'Super Admin',
          details: l.details || {},
          created_at: l.created_at
        }))
      });
    }

    return NextResponse.json({
      success: true,
      logs: logs || []
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
