import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { initializePayment } from '@/lib/paymentProvider';
import { checkRateLimit } from '@/lib/rateLimit';

// Fixed server-side tier prices in TRY fallback
const TIER_PRICES_TRY: Record<string, number> = {
  standard: 0,
  premium: 1999,
  corporate: 4999,
};

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  const rate = checkRateLimit(`checkout_${ip}`, { windowMs: 60000, max: 10 });
  if (!rate.success) {
    return NextResponse.json({ error: 'Çok fazla ödeme denemesi yapıldı. Lütfen bekleyin.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { wedding_id, plan_tier = 'premium', user_id, user_email } = body;
    const supabase = getSupabaseAdmin();

    // 1. Resolve user ID from session or payload in test/development
    let targetUserId = user_id;
    let targetUserEmail = user_email || '';

    if (!targetUserId) {
      const authHeader = request.headers.get('authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
          targetUserId = user.id;
          targetUserEmail = user.email || '';
        }
      }
    }

    // 2. Ownership Check if wedding_id provided
    if (wedding_id) {
      const { data: wedding } = await supabase
        .from('weddings')
        .select('id, user_id, is_paid, slug')
        .eq('id', wedding_id)
        .maybeSingle();

      if (!wedding) {
        return NextResponse.json({ error: 'Davetiye bulunamadı.' }, { status: 404 });
      }

      if (targetUserId && wedding.user_id && wedding.user_id !== targetUserId) {
        return NextResponse.json({ error: 'Bu davetiye için ödeme yapma yetkiniz yoktur.' }, { status: 403 });
      }

      if (wedding.is_paid) {
        return NextResponse.json({ error: 'Bu davetiye zaten ödenmiş ve yayındadır.' }, { status: 400 });
      }

      if (!targetUserId && wedding.user_id) {
        targetUserId = wedding.user_id;
      }
    }

    if (!targetUserId) {
      targetUserId = '00000000-0000-0000-0000-000000000000';
    }

    // 3. Resolve Price from Database Plans Table & Validate Active Plan
    const validTiers = ['standard', 'premium', 'corporate'];
    if (!plan_tier || !validTiers.includes(plan_tier)) {
      return NextResponse.json({ error: 'Geçersiz veya aktif olmayan paket seçimi.' }, { status: 400 });
    }

    let amount = TIER_PRICES_TRY[plan_tier] ?? TIER_PRICES_TRY.premium;
    try {
      const { data: plan } = await supabase
        .from('plans')
        .select('price, is_active')
        .eq('code', plan_tier)
        .maybeSingle();

      if (plan) {
        if (plan.is_active === false) {
          return NextResponse.json({ error: 'Bu paket şu anda satışa kapalıdır.' }, { status: 400 });
        }
        if (plan.price !== undefined) {
          amount = Number(plan.price);
        }
      }
    } catch {}

    const currency = 'TRY';
    const idempotencyKey = `checkout_${wedding_id || targetUserId}_${plan_tier}_${Date.now()}`;

    // 4. Initialize Payment via Provider Abstraction
    const result = await initializePayment({
      weddingId: wedding_id,
      userId: targetUserId,
      userEmail: targetUserEmail,
      amount,
      currency,
      planCode: plan_tier,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dijitaldavetiyeciniz.com'}/api/payments/callback`,
      idempotencyKey,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Ödeme başlatılamadı.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      payment_id: result.paymentId,
      checkout_url: result.checkoutUrl,
      amount,
      currency,
      plan_tier,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Ödeme işlemi başlatılırken hata oluştu.' }, { status: 500 });
  }
}
