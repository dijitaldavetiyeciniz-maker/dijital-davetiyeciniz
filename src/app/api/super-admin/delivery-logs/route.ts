import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const { data: logs, error } = await supabase
      .from('email_delivery_logs')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ success: true, logs: [] });
    }

    return NextResponse.json({ success: true, logs: logs || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
