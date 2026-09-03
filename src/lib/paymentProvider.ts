import crypto from 'crypto';
import { getSupabaseAdmin } from './supabase-admin';

export interface PaymentInitParams {
  weddingId?: string;
  userId: string;
  userEmail: string;
  amount: number;
  currency?: string;
  planCode?: string;
  callbackUrl: string;
  idempotencyKey?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  checkoutUrl?: string;
  error?: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
}

/**
 * Generates an HMAC-SHA256 signature for payment webhook verification
 */
export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  if (!payload || !signature || !secret) return false;
  try {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expected, 'hex');
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

const _testPaymentStore: Record<string, any> = {};

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.PART5_TEST_MODE !== 'true';
}

function isProviderConfigured(): boolean {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  return Boolean(apiKey && secretKey && apiKey !== 'mock' && secretKey !== 'mock');
}

/**
 * Initializes a payment transaction via Iyzico provider abstraction.
 * In production: fails closed if provider is not configured or if DB fails.
 */
export async function initializePayment(params: PaymentInitParams): Promise<PaymentResult> {
  const { weddingId, userId, userEmail, amount, currency = 'TRY', planCode = 'premium', idempotencyKey } = params;

  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return {
      success: false,
      error: 'Geçerli bir kullanıcı kimliği (userId) gereklidir.',
      status: 'failed',
    };
  }

  // Stable idempotency key
  const key = idempotencyKey || `pay_${weddingId || userId}_${planCode}_${amount}`;
  const supabase = getSupabaseAdmin();

  // 1. Idempotency Check: check if payment record already exists with key
  try {
    const { data: existing } = await supabase
      .from('payments')
      .select('*')
      .eq('idempotency_key', key)
      .maybeSingle();

    if (existing) {
      return {
        success: existing.status === 'paid' || existing.status === 'pending',
        paymentId: existing.id,
        status: existing.status,
        checkoutUrl: existing.provider_payment_id ? `/checkout/${existing.id}` : undefined,
      };
    }
  } catch (err) {
    console.error('[PaymentProvider] Failed to check idempotency in database:', err);
  }

  // In test / dev environments only: check memory store
  if (!isProduction() && _testPaymentStore[key]) {
    const existing = _testPaymentStore[key];
    return {
      success: existing.status === 'paid' || existing.status === 'pending',
      paymentId: existing.id,
      status: existing.status,
      checkoutUrl: `/checkout/${existing.id}`,
    };
  }

  // In production, verify provider configuration
  if (isProduction() && !isProviderConfigured()) {
    console.error('[PaymentProvider] Iyzico credentials missing in production. Failing closed with 503.');
    return {
      success: false,
      error: 'BILLING_NOT_CONFIGURED: Ödeme altyapısı henüz aktif edilmemiştir.',
      status: 'failed',
    };
  }

  // 2. Fetch plan id if planCode exists
  let planId: string | null = null;
  try {
    const { data: plan } = await supabase
      .from('plans')
      .select('id')
      .eq('code', planCode)
      .maybeSingle();
    if (plan) planId = plan.id;
  } catch (err) {
    console.error('[PaymentProvider] Failed to query plans table:', err);
  }

  // 3. Create Payment record in DB via service role
  const paymentPayload: any = {
    user_id: userId,
    provider: 'iyzico',
    amount: amount,
    currency: currency,
    status: 'pending',
    idempotency_key: key,
    created_at: new Date().toISOString(),
  };

  if (weddingId) {
    paymentPayload.wedding_id = weddingId;
  }
  if (planId) {
    paymentPayload.plan_id = planId;
  }

  let createdPayment: any = null;

  try {
    const { data: newPayment, error } = await supabase
      .from('payments')
      .insert([paymentPayload])
      .select()
      .single();

    if (!error && newPayment) {
      createdPayment = newPayment;
    } else if (error) {
      console.error('[PaymentProvider] Payment record insertion error:', error);
    }
  } catch (err) {
    console.error('[PaymentProvider] DB exception during payment insertion:', err);
  }

  // In production, DB failure MUST NOT silently fall back to in-memory fake store!
  if (!createdPayment) {
    if (isProduction()) {
      return {
        success: false,
        error: 'Ödeme kaydı oluşturulamadı. Lütfen tekrar deneyiniz.',
        status: 'failed',
      };
    }

    // Non-production test runner fallback
    const testId = crypto.randomUUID();
    createdPayment = {
      id: testId,
      ...paymentPayload,
      status: 'pending'
    };
    _testPaymentStore[key] = createdPayment;
    _testPaymentStore[testId] = createdPayment;
  }

  return {
    success: true,
    paymentId: createdPayment.id,
    checkoutUrl: `/checkout/${createdPayment.id}`,
    status: 'pending',
  };
}

/**
 * Handles payment success: updates payment, activates subscription, and enables wedding
 */
export async function handlePaymentSuccess(
  paymentId: string,
  providerPaymentId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

  // 1. Fetch current payment status to enforce valid state machine transition
  const { data: currentPayment, error: fetchErr } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .maybeSingle();

  if (fetchErr || !currentPayment) {
    if (!isProduction() && _testPaymentStore[paymentId]) {
      const p = _testPaymentStore[paymentId];
      p.status = 'paid';
      p.paid_at = now;
      return { success: true };
    }
    return { success: false, error: 'Ödeme kaydı bulunamadı.' };
  }

  // Prevent invalid state transition (e.g. refunded -> paid)
  if (currentPayment.status === 'refunded') {
    return { success: false, error: 'İade edilmiş bir ödeme tekrar onaylanamaz.' };
  }

  if (currentPayment.status === 'paid') {
    return { success: true }; // Already processed (Idempotent)
  }

  // 2. Update Payment record
  const { data: updatedPayment, error: updateErr } = await supabase
    .from('payments')
    .update({
      status: 'paid',
      provider_payment_id: providerPaymentId || (isProduction() ? null : `iyz_${Date.now()}`),
      paid_at: now,
      updated_at: now,
    })
    .eq('id', paymentId)
    .select()
    .single();

  if (updateErr || !updatedPayment) {
    return { success: false, error: 'Ödeme durumu güncellenemedi.' };
  }

  // 3. Determine target plan tier
  let planTier = 'premium';
  if (updatedPayment.plan_id) {
    try {
      const { data: plan } = await supabase
        .from('plans')
        .select('code')
        .eq('id', updatedPayment.plan_id)
        .maybeSingle();
      if (plan?.code) planTier = plan.code;
    } catch (err) {
      console.error('[PaymentProvider] Failed to fetch plan tier:', err);
    }
  }

  // 4. Update User Profile Plan Tier & Subscription Record
  try {
    await supabase
      .from('profiles')
      .update({ current_plan_tier: planTier })
      .eq('id', updatedPayment.user_id);

    await supabase
      .from('user_subscriptions')
      .insert([
        {
          user_id: updatedPayment.user_id,
          plan_id: updatedPayment.plan_id,
          status: 'active',
          started_at: now,
          current_period_start: now,
          created_at: now,
          updated_at: now
        }
      ]);
  } catch (err) {
    console.error('[PaymentProvider] Failed to update user profile/subscription:', err);
  }

  // 5. Update Wedding if associated
  if (updatedPayment.wedding_id) {
    try {
      await supabase
        .from('weddings')
        .update({
          is_paid: true,
          is_active: true,
          plan_tier: planTier,
        })
        .eq('id', updatedPayment.wedding_id);
    } catch (err) {
      console.error('[PaymentProvider] Failed to update wedding is_paid status:', err);
    }
  }

  // 6. Security Event Audit Log
  try {
    await supabase.from('security_events').insert([
      {
        event_type: 'PAYMENT_SUCCESS',
        actor_email: updatedPayment.user_id,
        details: { payment_id: paymentId, amount: updatedPayment.amount, plan_tier: planTier }
      }
    ]);
  } catch (err) {
    console.error('[PaymentProvider] Failed to record security event:', err);
  }

  return { success: true };
}

/**
 * Handles failed payment state
 */
export async function handlePaymentFailed(paymentId: string, reason?: string): Promise<{ success: boolean }> {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

  if (!isProduction() && _testPaymentStore[paymentId]) {
    _testPaymentStore[paymentId].status = 'failed';
  }

  try {
    await supabase
      .from('payments')
      .update({
        status: 'failed',
        updated_at: now,
        metadata: { failure_reason: reason || 'Ödeme reddedildi' }
      })
      .eq('id', paymentId);
  } catch (err) {
    console.error('[PaymentProvider] Failed to update payment failure status:', err);
  }

  return { success: true };
}

/**
 * Handles refund processing
 */
export async function handlePaymentRefund(paymentId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

  if (isProduction() && !isProviderConfigured()) {
    return { success: false, error: 'Ödeme sağlayıcısı yapılandırılmamış. İade işlemi gerçekleştirilemiyor.' };
  }

  const { data: payment, error } = await supabase
    .from('payments')
    .update({
      status: 'refunded',
      refunded_at: now,
      updated_at: now
    })
    .eq('id', paymentId)
    .select()
    .single();

  if (error || !payment) {
    if (!isProduction() && _testPaymentStore[paymentId]) {
      const p = _testPaymentStore[paymentId];
      p.status = 'refunded';
      p.refunded_at = now;
      return { success: true };
    }
    return { success: false, error: 'İade edilecek ödeme kaydı bulunamadı' };
  }

  // Revert wedding is_paid
  if (payment.wedding_id) {
    try {
      await supabase
        .from('weddings')
        .update({ is_paid: false })
        .eq('id', payment.wedding_id);
    } catch (err) {
      console.error('[PaymentProvider] Failed to revert wedding paid status on refund:', err);
    }
  }

  return { success: true };
}
