import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wedding_id = searchParams.get('wedding_id');

    if (!wedding_id) {
      return new Response('Missing wedding_id', { status: 400 });
    }

    // Fetch minimal details needed for OG from database
    const { data: wedding } = await supabase
      .from('weddings')
      .select('bride_name, groom_name, venue_name, event_type')
      .eq('slug', wedding_id)
      .single();

    const title = wedding 
      ? `${wedding.bride_name} & ${wedding.groom_name}`
      : 'Davetiyeniz';
      
    const venue = wedding?.venue_name || 'Dijital Davetiye';
    const typeLabel = wedding?.event_type === 'wedding' ? 'Düğün Davetiyesi' : 'Etkinlik Davetiyesi';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e1b4b, #020617)',
            fontFamily: 'serif',
            color: 'white',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          {/* Subtle elegant border */}
          <div
            style={{
              position: 'absolute',
              top: '30px',
              left: '30px',
              right: '30px',
              bottom: '30px',
              border: '2px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          />

          {/* Elegant header */}
          <div
            style={{
              fontSize: '24px',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              color: '#f43f5e',
              marginBottom: '20px',
              fontWeight: '300',
              zIndex: 10,
            }}
          >
            {typeLabel}
          </div>

          {/* Names block */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              marginBottom: '24px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '1.2',
            }}
          >
            {title}
          </div>

          {/* Venue & Footer */}
          <div
            style={{
              fontSize: '20px',
              color: '#cbd5e1',
              maxWidth: '80%',
              lineHeight: '1.4',
              zIndex: 10,
            }}
          >
            {venue}
          </div>

          <div
            style={{
              marginTop: '40px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              zIndex: 10,
            }}
          >
            dijitaldavetiyeciniz.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          // Dynamic query buster parameter is sent on change. We can safely cache at CDN level for 1 day.
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch (err: any) {
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}
