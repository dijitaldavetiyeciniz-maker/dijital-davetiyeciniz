import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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
      error: err?.message || 'Unknown readiness error',
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
