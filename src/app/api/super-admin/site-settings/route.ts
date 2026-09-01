import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { supabase } from '@/lib/supabase';
import { defaultSiteConfig, isSafeUrl, SiteGlobalConfig } from '@/lib/site-settings';
import { logAuditEvent } from '@/lib/audit-logger';
import { invalidateGlobalSiteSettingsCache } from '@/lib/cache-invalidation';

export const dynamic = 'force-dynamic';

export async function GET() {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'global')
      .single();

    if (error || !data) {
      return NextResponse.json({
        success: true,
        settings: defaultSiteConfig,
        draft: defaultSiteConfig,
        version: 1,
        is_published: true
      });
    }

    return NextResponse.json({
      success: true,
      settings: data.published_config || defaultSiteConfig,
      draft: data.draft_config || defaultSiteConfig,
      version: data.version || 1,
      is_published: data.is_published ?? true,
      published_at: data.published_at,
      updated_at: data.updated_at
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const draftConfig: Partial<SiteGlobalConfig> = body.draft || body;

    // Security & URL Validation
    if (draftConfig.announcement?.ctaUrl && !isSafeUrl(draftConfig.announcement.ctaUrl)) {
      return NextResponse.json({ success: false, error: 'Geçersiz veya güvensiz duyuru linki (javascript: engellendi).' }, { status: 400 });
    }

    if (draftConfig.header?.navItems) {
      for (const item of draftConfig.header.navItems) {
        if (item.url && !isSafeUrl(item.url)) {
          return NextResponse.json({ success: false, error: `Geçersiz menü linki: ${item.label}` }, { status: 400 });
        }
      }
    }

    if (draftConfig.homepage?.heroCtaUrl && !isSafeUrl(draftConfig.homepage.heroCtaUrl)) {
      return NextResponse.json({ success: false, error: 'Geçersiz ana sayfa CTA linki.' }, { status: 400 });
    }

    // Merge with defaults
    const mergedDraft: SiteGlobalConfig = {
      branding: { ...defaultSiteConfig.branding, ...(draftConfig.branding || {}) },
      announcement: { ...defaultSiteConfig.announcement, ...(draftConfig.announcement || {}) },
      header: { ...defaultSiteConfig.header, ...(draftConfig.header || {}) },
      footer: { ...defaultSiteConfig.footer, ...(draftConfig.footer || {}) },
      homepage: { ...defaultSiteConfig.homepage, ...(draftConfig.homepage || {}) },
      maintenance: { ...defaultSiteConfig.maintenance, ...(draftConfig.maintenance || {}) },
      support: { ...defaultSiteConfig.support, ...(draftConfig.support || {}) }
    };

    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 'global',
        draft_config: mergedDraft,
        updated_at: new Date().toISOString(),
        updated_by: 'Super Admin'
      });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await logAuditEvent({
      action: 'site.settings.draft_updated',
      targetType: 'settings',
      targetId: 'global',
      details: { sections: Object.keys(draftConfig) }
    });

    return NextResponse.json({
      success: true,
      message: 'Taslak ayarlar başarıyla kaydedildi.',
      draft: mergedDraft
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST endpoint: Publishes draft configuration to live production
export async function POST(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  try {
    const { data: current, error: fetchErr } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'global')
      .single();

    if (fetchErr || !current) {
      return NextResponse.json({ success: false, error: 'Ayar kaydı bulunamadı.' }, { status: 404 });
    }

    const draftConfig = current.draft_config || defaultSiteConfig;
    const newVersion = (current.version || 1) + 1;

    const { error: updateErr } = await supabase
      .from('site_settings')
      .update({
        published_config: draftConfig,
        version: newVersion,
        is_published: true,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: 'Super Admin'
      })
      .eq('id', 'global');

    if (updateErr) {
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    // Invalidate global caches
    await invalidateGlobalSiteSettingsCache();

    await logAuditEvent({
      action: 'site.settings.published',
      targetType: 'settings',
      targetId: 'global',
      details: { version: newVersion }
    });

    return NextResponse.json({
      success: true,
      message: `Site ayarları başarıyla yayınlandı (v${newVersion}).`,
      published_config: draftConfig,
      version: newVersion
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
