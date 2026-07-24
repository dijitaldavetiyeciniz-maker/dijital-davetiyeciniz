import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wedding_id = searchParams.get('wedding_id');

  if (!wedding_id) {
    return NextResponse.json({ error: 'Eksik wedding_id parametresi.' }, { status: 400 });
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  const { data: payment } = await supabase
    .from('payments')
    .select('id, amount, currency, status, paid_at, created_at')
    .eq('wedding_id', wedding_id)
    .order('created_at', { ascending: false })
    .maybeSingle();

  return NextResponse.json({
    has_payment: !!payment,
    payment: payment || null,
  });
}
