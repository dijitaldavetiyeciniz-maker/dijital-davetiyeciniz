import { NextResponse } from 'next/server';
import { trackEvent } from '@/lib/analytics';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  const rate = checkRateLimit(`analytics_${ip}`, { windowMs: 60000, max: 60 });
  if (!rate.success) {
    return NextResponse.json({ error: 'Çok fazla istek.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { event_name, user_id, wedding_id, session_id, properties } = body;

    if (!event_name) {
      return NextResponse.json({ error: 'Eksik event_name.' }, { status: 400 });
    }

    const res = await trackEvent({
      eventName: event_name,
      userId: user_id,
      weddingId: wedding_id,
      sessionId: session_id,
      properties
    });

    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
