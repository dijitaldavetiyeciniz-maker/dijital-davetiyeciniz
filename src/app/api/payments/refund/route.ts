import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { handlePaymentRefund } from '@/lib/paymentProvider';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'İade için oturum açmalısınız.' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) {
      return NextResponse.json({ error: 'Geçersiz oturum.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { payment_id } = body;
    if (!payment_id) {
      return NextResponse.json({ error: 'Eksik payment_id parametresi.' }, { status: 400 });
    }

    // Verify ownership of the payment
    const { data: payment, error: pErr } = await supabase
      .from('payments')
      .select('*')
      .eq('id', payment_id)
      .maybeSingle();

    if (pErr || !payment || payment.user_id !== user.id) {
      return NextResponse.json({ error: 'İade yapma yetkiniz bulunmamaktadır.' }, { status: 403 });
    }

    if (payment.status !== 'paid') {
      return NextResponse.json({ error: 'Yalnızca tamamlanmış (ödenmiş) işlemler iade edilebilir.' }, { status: 400 });
    }

    const refundResult = await handlePaymentRefund(payment_id);
    if (!refundResult.success) {
      return NextResponse.json({ error: refundResult.error || 'İade işlemi gerçekleştirilemedi.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'İade işlemi başarıyla tamamlandı.', status: 'refunded' });
  } catch (err: any) {
    return NextResponse.json({ error: 'İade hatası: ' + (err?.message || 'Bilinmeyen hata') }, { status: 500 });
  }
}
