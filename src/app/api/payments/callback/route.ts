import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const payment_id = searchParams.get('payment_id');

  if (!payment_id) {
    return NextResponse.redirect(new URL('/dashboard?error=missing_payment_id', request.url));
  }

  // Server-to-server check of payment status (Never trust URL params)
  const { data: payment } = await supabase
    .from('payments')
    .select('id, wedding_id, status')
    .eq('id', payment_id)
    .maybeSingle();

  if (!payment || payment.status !== 'paid') {
    return NextResponse.redirect(new URL(`/dashboard?status=pending_payment`, request.url));
  }

  const { data: wedding } = await supabase
    .from('weddings')
    .select('slug')
    .eq('id', payment.wedding_id)
    .maybeSingle();

  return NextResponse.redirect(new URL(`/d/${wedding?.slug || ''}?payment=success`, request.url));
}
