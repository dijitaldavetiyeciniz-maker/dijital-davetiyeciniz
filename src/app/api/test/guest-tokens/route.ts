import { NextResponse } from 'next/server';
import { resolveGuestToken, generateGuestToken, revokeGuestToken, renewGuestToken } from '@/server/guestTokens';

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'test' && process.env.PART5_TEST_MODE !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { action, payload } = body;

    switch (action) {
      case 'generate':
        return NextResponse.json({ 
          token: generateGuestToken(payload.publicId, payload.tokenVersion, payload.expiresAt) 
        });

      case 'resolve':
        const resolved = await resolveGuestToken(payload.token, payload.weddingId);
        return NextResponse.json({ resolved });

      case 'revoke':
        await revokeGuestToken(payload.guestId);
        return NextResponse.json({ success: true });

      case 'renew':
        await renewGuestToken(payload.guestId);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
