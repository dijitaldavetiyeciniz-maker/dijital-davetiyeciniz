import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { initializePayment } from '@/lib/paymentProvider';
import { checkDistributedRateLimit } from '@/lib/rate-limiter';

const TIER_PRICES_TRY: Record<string, number> = {
  standard: 0,
  premium: 1999,
  corporate: 4999,
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  
  // Distributed Rate Limiting: 10 attempts per minute per IP
  const rateLimit = await checkDistributedRateLimit(`checkout_${ip}`, {
    intervalMs: 60000,
    maxRequests: 10
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Çok fazla ödeme denemesi yapıldı. Lütfen bir süre sonra tekrar deneyiniz.' },
      { status: 429 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const authHeader = request.headers.get('authorization');
    let authenticatedUserId: string | null = null;
    let authenticatedUserEmail = '';

    // Verify user identity strictly from server auth session / token
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        authenticatedUserId = user.id;
        authenticatedUserEmail = user.email || '';
      }
    }

    const body = await request.json().catch(() => ({}));
    const { wedding_id, plan_tier = 'premium' } = body;

    // Reject checkout without verified server authentication
    if (!authenticatedUserId) {
      // In non-production test runner, if body specifies user_id for unit test mocking:
      if (process.env.NODE_ENV !== 'production' && body.user_id) {
        authenticatedUserId = body.user_id;
        authenticatedUserEmail = body.user_email || 'test@example.com';
      } else {
        return NextResponse.json({ error: 'Ödeme işlemi için oturum açmış olmanız gerekmektedir.' }, { status: 401 });
      }
    }

    // Ownership Verification if wedding_id is provided
    if (wedding_id) {
      const { data: wedding, error: wErr } = await supabase
        .from('weddings')
        .select('id, user_id, is_paid, slug')
        .eq('id', wedding_id)
        .maybeSingle();

      if (wErr || !wedding) {
        return NextResponse.json({ error: 'Davetiye bulunamadı.' }, { status: 404 });
      }

      // Check that the authenticated user owns this wedding
      if (wedding.user_id && wedding.user_id !== authenticatedUserId) {
        return NextResponse.json({ error: 'Bu davetiye için ödeme yapma yetkiniz bulunmamaktadır.' }, { status: 403 });
      }

      // Ownerless legacy wedding policy: cannot claim/pay without ownership link
      if (!wedding.user_id && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Bu davetiye kaydı sahiplendirilmemiştir. Lütfen destek ile iletişime geçiniz.' }, { status: 403 });
      }

      if (wedding.is_paid) {
        return NextResponse.json({ error: 'Bu davetiye zaten ödenmiş ve yayındadır.' }, { status: 400 });
      }
    }

    // Resolve plan price
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
        if (plan.price !== undefined && plan.price !== null) {
          amount = Number(plan.price);
        }
      }
    } catch (err) {
      console.error('[Checkout] Failed to fetch plan price:', err);
    }

    const currency = 'TRY';
    // Stable idempotency key based on entity and plan (no timestamp)
    const idempotencyKey = `checkout_${wedding_id || authenticatedUserId}_${plan_tier}`;

    // Initialize Payment via Provider Abstraction
    const result = await initializePayment({
      weddingId: wedding_id,
      userId: authenticatedUserId!,
      userEmail: authenticatedUserEmail,
      amount,
      currency,
      planCode: plan_tier,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dijitaldavetiyeciniz.com'}/api/payments/callback`,
      idempotencyKey,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Ödeme başlatılamadı.' }, { status: result.error?.startsWith('BILLING_NOT_CONFIGURED') ? 503 : 500 });
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
