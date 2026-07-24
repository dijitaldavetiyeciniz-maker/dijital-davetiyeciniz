import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'İade için giriş yapmalısınız.' }, { status: 401 });
    }

    const { payment_id } = await request.json();
    if (!payment_id) {
      return NextResponse.json({ error: 'Eksik payment_id parametresi.' }, { status: 400 });
    }

    // Verify ownership or super admin
    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('id', payment_id)
      .single();

    if (!payment || payment.user_id !== session.user.id) {
      return NextResponse.json({ error: 'İade yapma yetkiniz bulunmamaktadır.' }, { status: 403 });
    }

    const now = new Date().toISOString();

    // Update payment record (Preserve audit history without deleting row)
    const { error: pErr } = await supabase
      .from('payments')
      .update({
        status: 'refunded',
        refunded_at: now,
        updated_at: now,
      })
      .eq('id', payment_id);

    if (pErr) {
      return NextResponse.json({ error: 'İade işlenirken hata oluştu.' }, { status: 500 });
    }

    // Deactivate wedding
    await supabase.from('weddings').update({ is_paid: false }).eq('id', payment.wedding_id);

    return NextResponse.json({ success: true, message: 'İade işlemi başarıyla kaydedildi.', status: 'refunded' });
  } catch (err: any) {
    return NextResponse.json({ error: 'İade hatası: ' + err.message }, { status: 500 });
  }
}
