import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    // Lightweight readiness probe verifying database connectivity
    const { error } = await supabase.from('site_settings').select('id').limit(1);
    if (error) {
      return NextResponse.json({
        ready: false,
        error: 'Database connection failed',
        timestamp: new Date().toISOString()
      }, { status: 503 });
    }

    return NextResponse.json({
      ready: true,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({
      ready: false,
      error: 'Readiness probe failed',
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
