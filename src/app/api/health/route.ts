import { NextResponse } from 'next/server';
import { validateEnvironment } from '@/lib/validateEnv';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envCheck = validateEnvironment();
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0-c13.w9',
    environment: envCheck.environment,
    healthy: true
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
