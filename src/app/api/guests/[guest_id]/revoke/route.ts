import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { verifyAdminCookie } from '@/lib/auth-cookie';
import { generateGuestToken } from '@/lib/guestTokens';

export async function POST(request: NextRequest, { params }: { params: { guest_id: string } }) {
  try {
    const guestId = params.guest_id;

    // First fetch the guest to get wedding_id
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('wedding_id, token_version')
      .eq('id', guestId)
      .single();

    if (guestError || !guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    const cookieStore = await cookies();
    const storedCookie = cookieStore.get(`admin_auth_${guest.wedding_id}`)?.value;

    if (!storedCookie || !verifyAdminCookie(guest.wedding_id, storedCookie)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Increment token_version and reset is_revoked if it was set
    const { data: updatedGuest, error: updateError } = await supabase
      .from('guests')
      .update({ 
        token_version: guest.token_version + 1,
        is_revoked: false 
      })
      .eq('id', guestId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const newTokenUrl = generateGuestToken(updatedGuest.id, updatedGuest.token_version);

    return NextResponse.json({ 
      success: true, 
      token_version: updatedGuest.token_version,
      tokenUrl: newTokenUrl 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
