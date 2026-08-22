import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getUserEntitlements } from '@/lib/entitlements';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get('user_id');
    const supabase = getSupabaseAdmin();

    let targetUserId = queryUserId;

    if (!targetUserId && authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        targetUserId = user.id;
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    // 1. Fetch User Profile & Active Plan
    const entitlements = await getUserEntitlements(targetUserId);

    // 2. Fetch User's Payments History (Ownership scoped)
    const { data: payments, error } = await supabase
      .from('payments')
      .select('id, amount, currency, status, paid_at, created_at, plans(name, code)')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      entitlements,
      transactions: payments || []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatura bilgileri alınamadı.' }, { status: 500 });
  }
}
