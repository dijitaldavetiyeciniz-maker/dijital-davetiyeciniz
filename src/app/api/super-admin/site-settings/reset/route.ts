import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';
import { defaultSiteConfig } from '@/lib/site-settings';
import { logAuditEvent } from '@/lib/audit-logger';
import { invalidateGlobalSiteSettingsCache } from '@/lib/cache-invalidation';

export const dynamic = 'force-dynamic';

export async function POST() {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 'global',
        draft_config: defaultSiteConfig,
        updated_at: new Date().toISOString(),
        updated_by: 'Super Admin'
      });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await logAuditEvent({
      action: 'site.settings.reset_defaults',
      targetType: 'settings',
      targetId: 'global',
      details: { resetTo: 'defaultSiteConfig' }
    });

    return NextResponse.json({
      success: true,
      message: 'Taslak ayarlar varsayılan fabrika ayarlarına sıfırlandı.',
      draft: defaultSiteConfig
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
