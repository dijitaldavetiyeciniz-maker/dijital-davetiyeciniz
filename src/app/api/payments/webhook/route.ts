import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyWebhookSignature, handlePaymentSuccess } from '@/lib/paymentProvider';

const WEBHOOK_SECRET = process.env.IYZICO_WEBHOOK_SECRET || 'iyzico_secret_key_mock';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-iyzico-signature') || request.headers.get('x-webhook-signature');

    // 1. Signature Verification
    if (!signature) {
      return NextResponse.json({ error: 'İmza üstbilgisi (signature header) eksik.' }, { status: 400 });
    }

    const isValidSig = verifyWebhookSignature(rawBody, signature, WEBHOOK_SECRET);
    if (!isValidSig) {
      return NextResponse.json({ error: 'Geçersiz webhook imzası.' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { payment_id, wedding_id, amount, currency = 'TRY', status, provider_payment_id } = payload;

    if (!payment_id || !wedding_id || !amount) {
      return NextResponse.json({ error: 'Eksik webhook payload verileri.' }, { status: 400 });
    }

    // 2. Fetch existing Payment record
    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('id', payment_id)
      .single();

    if (!payment) {
      return NextResponse.json({ error: 'Eşleşen ödeme kaydı bulunamadı.' }, { status: 404 });
    }

    // 3. Idempotency Check: Duplicate Webhook Execution Prevention
    if (payment.status === 'paid') {
      return NextResponse.json({ success: true, message: 'Ödeme zaten işlenmiş (Idempotent).' }, { status: 200 });
    }

    // 4. Verify Amount, Currency, and Wedding ID match DB record
    if (Number(payment.amount) !== Number(amount)) {
      return NextResponse.json({ error: 'Ödeme tutarı uyuşmuyor (Amount mismatch).' }, { status: 400 });
    }

    if (payment.wedding_id !== wedding_id) {
      return NextResponse.json({ error: 'Davetiye ID uyuşmuyor (Wedding ID mismatch).' }, { status: 400 });
    }

    if (payment.currency !== currency) {
      return NextResponse.json({ error: 'Para birimi uyuşmuyor (Currency mismatch).' }, { status: 400 });
    }

    if (status !== 'SUCCESS' && status !== 'PAID') {
      return NextResponse.json({ error: 'Ödeme başarılı değil (Payment failed).' }, { status: 400 });
    }

    // 5. Update Payment & Auto-Publish Wedding
    const publishResult = await handlePaymentSuccess(payment_id, provider_payment_id);
    if (!publishResult.success) {
      return NextResponse.json({ error: publishResult.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Ödeme onaylandı ve davetiye yayına alındı.' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Webhook işleme hatası: ' + err.message }, { status: 500 });
  }
}
