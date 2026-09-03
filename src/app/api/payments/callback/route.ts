import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const payment_id = searchParams.get('payment_id');

  if (!payment_id) {
    return NextResponse.redirect(new URL('/odeme/sonuc?status=failed&error=missing_payment_id', request.url));
  }

  const supabase = getSupabaseAdmin();

  // Server-to-server check of payment status (Never trust URL params)
  const { data: payment } = await supabase
    .from('payments')
    .select('id, wedding_id, status, plans(name)')
    .eq('id', payment_id)
    .maybeSingle();

  const planName = (payment as any)?.plans?.name || 'Premium Paket';

  if (!payment || payment.status === 'failed') {
    return NextResponse.redirect(new URL(`/odeme/sonuc?payment_id=${payment_id}&status=failed`, request.url));
  }

  if (payment.status === 'pending') {
    return NextResponse.redirect(new URL(`/odeme/sonuc?payment_id=${payment_id}&status=pending&plan=${encodeURIComponent(planName)}`, request.url));
  }

  return NextResponse.redirect(new URL(`/odeme/sonuc?payment_id=${payment_id}&status=paid&plan=${encodeURIComponent(planName)}`, request.url));
}
