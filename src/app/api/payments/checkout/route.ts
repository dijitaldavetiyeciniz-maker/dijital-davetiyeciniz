import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { initializePayment } from '@/lib/paymentProvider';
import { PLAN_CONFIGS } from '@/lib/planLimits';
import { checkRateLimit } from '@/lib/rateLimit';

// Fixed server-side tier prices in TRY (Never trust client prices)
const TIER_PRICES_TRY: Record<string, number> = {
  standard: 1999,
  premium: 2999,
  corporate: 9999,
};

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  const rate = checkRateLimit(`checkout_${ip}`, { windowMs: 60000, max: 10 });
  if (!rate.success) {
    return NextResponse.json({ error: 'Çok fazla ödeme denemesi yapıldı. Lütfen bekleyin.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { wedding_id, plan_tier = 'standard' } = body;

    if (!wedding_id) {
      return NextResponse.json({ error: 'Eksik wedding_id parametresi.' }, { status: 400 });
    }

    // 1. Authenticate user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Ödeme başlatmak için giriş yapmalısınız.' }, { status: 401 });
    }

    // 2. Ownership Check: Verify user owns this wedding
    const { data: wedding } = await supabase
      .from('weddings')
      .select('id, user_id, is_paid, title')
      .eq('id', wedding_id)
      .single();

    if (!wedding || wedding.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Bu davetiye için ödeme yapma yetkiniz yoktur.' }, { status: 403 });
    }

    if (wedding.is_paid) {
      return NextResponse.json({ error: 'Bu davetiye zaten ödenmiş ve yayındadır.' }, { status: 400 });
    }

    // 3. Resolve price server-side (Ignore any client-supplied price)
    const amount = TIER_PRICES_TRY[plan_tier] || TIER_PRICES_TRY.standard;
    const currency = 'TRY';
    const idempotencyKey = `checkout_${wedding_id}_${plan_tier}`;

    // 4. Initialize Payment via Provider Abstraction
    const result = await initializePayment({
      weddingId: wedding_id,
      userId: session.user.id,
      userEmail: session.user.email || '',
      amount,
      currency,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/payments/callback`,
      idempotencyKey,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Ödeme başlatılamadı.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      payment_id: result.paymentId,
      checkout_url: result.checkoutUrl,
      amount,
      currency,
      status: 'SANDBOX / MOCK HAZIR',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Sunucu hatası: ' + err.message }, { status: 500 });
  }
}
