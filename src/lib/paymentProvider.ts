import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export interface PaymentInitParams {
  weddingId: string;
  userId: string;
  userEmail: string;
  amount: number;
  currency?: string;
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
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch (err) {
    return false;
  }
}

/**
 * Initializes a payment transaction via Iyzico/Mock provider abstraction
 */
export async function initializePayment(params: PaymentInitParams): Promise<PaymentResult> {
  const { weddingId, userId, amount, currency = 'TRY', idempotencyKey } = params;
  const key = idempotencyKey || `pay_${weddingId}_${Date.now()}`;

  // 1. Idempotency Check: check if payment record already exists with key
  const { data: existing } = await supabase
    .from('payments')
    .select('*')
    .eq('idempotency_key', key)
    .maybeSingle();

  if (existing) {
    return {
      success: existing.status === 'paid',
      paymentId: existing.id,
      status: existing.status,
      checkoutUrl: existing.provider_payment_id ? `/checkout/${existing.id}` : undefined,
    };
  }

  // 2. Create Payment record in DB
  const { data: newPayment, error } = await supabase
    .from('payments')
    .insert([
      {
        user_id: userId,
        wedding_id: weddingId,
        provider: 'iyzico',
        amount: amount,
        currency: currency,
        status: 'pending',
        idempotency_key: key,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error || !newPayment) {
    return { success: false, error: error?.message || 'Ödeme kaydı oluşturulamadı.', status: 'failed' };
  }

  return {
    success: true,
    paymentId: newPayment.id,
    checkoutUrl: `/checkout/${newPayment.id}`,
    status: 'pending',
  };
}

/**
 * Marks a payment as successfully paid and automatically activates/publishes the wedding
 */
export async function handlePaymentSuccess(paymentId: string, providerPaymentId?: string): Promise<{ success: boolean; error?: string }> {
  const now = new Date().toISOString();

  // 1. Update Payment status
  const { data: payment, error: pErr } = await supabase
    .from('payments')
    .update({
      status: 'paid',
      provider_payment_id: providerPaymentId || `iyz_${Date.now()}`,
      paid_at: now,
      updated_at: now,
    })
    .eq('id', paymentId)
    .select()
    .single();

  if (pErr || !payment) {
    return { success: false, error: pErr?.message || 'Ödeme güncellenemedi.' };
  }

  // 2. Auto-publish wedding
  const { error: wErr } = await supabase
    .from('weddings')
    .update({
      is_paid: true,
      is_active: true,
      updated_at: now,
    })
    .eq('id', payment.wedding_id);

  if (wErr) {
    return { success: false, error: 'Ödeme alındı ancak davetiye yayına alınırken hata oluştu: ' + wErr.message };
  }

  return { success: true };
}
