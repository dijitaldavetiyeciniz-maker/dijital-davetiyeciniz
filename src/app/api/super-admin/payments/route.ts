import { NextResponse } from 'next/server';
import { isSuperAdminAuthorized } from '@/lib/superadmin-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { handlePaymentRefund } from '@/lib/paymentProvider';

export async function GET(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('payments')
      .select('id, user_id, wedding_id, amount, currency, status, provider, provider_payment_id, idempotency_key, paid_at, refunded_at, created_at, plans(code, name)')
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: payments, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      payments: payments || []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Ödemeler alınamadı.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authorized = await isSuperAdminAuthorized();
  if (!authorized) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    const { action, payment_id, user_id, plan_tier } = await req.json();
    const supabase = getSupabaseAdmin();

    if (action === 'refund') {
      if (!payment_id) {
        return NextResponse.json({ error: 'Eksik payment_id.' }, { status: 400 });
      }
      const res = await handlePaymentRefund(payment_id);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }

      await supabase.from('super_admin_audit_logs').insert([
        {
          action: 'payment_refunded_by_admin',
          actor_email: 'Super Admin',
          details: { payment_id }
        }
      ]);

      return NextResponse.json({ success: true, message: 'İade başarıyla tamamlandı.' });
    }

    if (action === 'update_user_plan') {
      if (!user_id || !plan_tier) {
        return NextResponse.json({ error: 'Eksik user_id veya plan_tier.' }, { status: 400 });
      }

      await supabase
        .from('profiles')
        .update({ current_plan_tier: plan_tier })
        .eq('id', user_id);

      await supabase.from('super_admin_audit_logs').insert([
        {
          action: 'user_plan_updated_by_admin',
          actor_email: 'Super Admin',
          details: { user_id, plan_tier }
        }
      ]);

      return NextResponse.json({ success: true, message: 'Kullanıcı planı güncellendi.' });
    }

    return NextResponse.json({ error: 'Geçersiz işlem (action).' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
