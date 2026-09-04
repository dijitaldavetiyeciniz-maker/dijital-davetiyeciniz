import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { verifyWebhookSignature, handlePaymentSuccess, handlePaymentFailed, handlePaymentRefund } from '@/lib/paymentProvider';

function getWebhookSecret(): string | null {
  const secret = process.env.IYZICO_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      return null;
    }
    return process.env.DEV_IYZICO_WEBHOOK_SECRET || 'dev_mock_webhook_secret_for_tests';
  }
  return secret;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-iyzico-signature') || request.headers.get('x-webhook-signature');

    // 1. Signature Verification
    if (!signature) {
      return NextResponse.json({ error: 'İmza üstbilgisi (signature header) eksik.' }, { status: 400 });
    }

    const secret = getWebhookSecret();
    if (!secret) {
      console.error('[Payment Webhook] IYZICO_WEBHOOK_SECRET is not configured. Failing closed.');
      return NextResponse.json({ error: 'Webhook altyapısı yapılandırılmamış.' }, { status: 500 });
    }

    const isValidSig = verifyWebhookSignature(rawBody, signature, secret);
    if (!isValidSig) {
      return NextResponse.json({ error: 'Geçersiz webhook imzası.' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { payment_id, amount, currency = 'TRY', status, provider_payment_id, event_type } = payload;

    if (!payment_id) {
      return NextResponse.json({ error: 'Eksik payment_id parametresi.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // 2. Fetch existing Payment record
    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('id', payment_id)
      .maybeSingle();

    if (!payment) {
      return NextResponse.json({ error: 'Eşleşen ödeme kaydı bulunamadı.' }, { status: 404 });
    }

    // 3. Handle specific event types
    if (event_type === 'refund.processed' || status === 'REFUNDED') {
      await handlePaymentRefund(payment_id);
      return NextResponse.json({ success: true, message: 'İade başarıyla işlendi.' });
    }

    if (status === 'FAILED' || event_type === 'payment.failed') {
      await handlePaymentFailed(payment_id, payload.reason || 'Banka tarafından reddedildi');
      return NextResponse.json({ success: true, message: 'Başarısız ödeme kaydedildi.' });
    }

    // 4. Idempotency Check: Duplicate Webhook Execution Prevention
    if (payment.status === 'paid') {
      return NextResponse.json({ success: true, message: 'Ödeme zaten işlenmiş (Idempotent).' }, { status: 200 });
    }

    // 5. Verify Amount and Currency match DB record if provided
    if (amount !== undefined && Number(payment.amount) !== Number(amount)) {
      return NextResponse.json({ error: 'Ödeme tutarı uyuşmuyor (Amount mismatch).' }, { status: 400 });
    }

    if (currency && payment.currency !== currency) {
      return NextResponse.json({ error: 'Para birimi uyuşmuyor (Currency mismatch).' }, { status: 400 });
    }

    if (status !== 'SUCCESS' && status !== 'PAID') {
      return NextResponse.json({ error: 'Ödeme onaylanmadı.' }, { status: 400 });
    }

    // 6. Update Payment & Activate Plan & Wedding
    const publishResult = await handlePaymentSuccess(payment_id, provider_payment_id);
    if (!publishResult.success) {
      return NextResponse.json({ error: publishResult.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Ödeme onaylandı ve plan aktif edildi.' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Webhook işleme hatası: ' + err.message }, { status: 500 });
  }
}
