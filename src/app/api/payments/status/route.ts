import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wedding_id = searchParams.get('wedding_id');

  if (!wedding_id) {
    return NextResponse.json({ error: 'Eksik wedding_id parametresi.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const authHeader = request.headers.get('authorization');
  let authenticatedUserId: string | null = null;

  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    if (user) {
      authenticatedUserId = user.id;
    }
  }

  // Ownership verification
  const { data: wedding } = await supabase
    .from('weddings')
    .select('id, user_id')
    .eq('id', wedding_id)
    .maybeSingle();

  if (!wedding) {
    return NextResponse.json({ error: 'Davetiye bulunamadı.' }, { status: 404 });
  }

  if (wedding.user_id && wedding.user_id !== authenticatedUserId && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  const { data: payment } = await supabase
    .from('payments')
    .select('id, amount, currency, status, paid_at, created_at')
    .eq('wedding_id', wedding_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    has_payment: !!payment,
    payment: payment || null,
  });
}
