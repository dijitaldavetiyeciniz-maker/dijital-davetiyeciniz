import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { defaultSiteConfig, SiteGlobalConfig } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('published_config, version, updated_at')
      .eq('id', 'global')
      .maybeSingle();

    if (error || !data || !data.published_config) {
      return NextResponse.json({
        success: true,
        settings: defaultSiteConfig,
        version: 1
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30'
        }
      });
    }

    const merged: SiteGlobalConfig = {
      branding: { ...defaultSiteConfig.branding, ...(data.published_config.branding || {}) },
      announcement: { ...defaultSiteConfig.announcement, ...(data.published_config.announcement || {}) },
      header: { ...defaultSiteConfig.header, ...(data.published_config.header || {}) },
      footer: { ...defaultSiteConfig.footer, ...(data.published_config.footer || {}) },
      homepage: { ...defaultSiteConfig.homepage, ...(data.published_config.homepage || {}) },
      maintenance: { ...defaultSiteConfig.maintenance, ...(data.published_config.maintenance || {}) },
      support: { ...defaultSiteConfig.support, ...(data.published_config.support || {}) }
    };

    return NextResponse.json({
      success: true,
      settings: merged,
      version: data.version || 1,
      updated_at: data.updated_at
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30'
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      settings: defaultSiteConfig,
      fallback: true
    });
  }
}
