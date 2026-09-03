import { NextResponse } from 'next/server';
import { validateEnvironment } from '@/lib/validateEnv';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envCheck = validateEnvironment();
  const healthy = envCheck.isValid;

  return NextResponse.json({
    status: healthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    version: '1.0.0-c13.w10.3',
    environment: envCheck.environment,
    healthy,
    ...(healthy ? {} : { issues: envCheck.missingRequired })
  }, {
    status: healthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
