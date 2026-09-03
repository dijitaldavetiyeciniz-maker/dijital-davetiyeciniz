import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getUserEntitlements } from '@/lib/entitlements';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const supabase = getSupabaseAdmin();
    let authenticatedUserId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        authenticatedUserId = user.id;
      }
    }

    // In dev / tests allow fallback if header absent
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get('user_id');

    if (!authenticatedUserId) {
      if (process.env.NODE_ENV !== 'production' && queryUserId) {
        authenticatedUserId = queryUserId;
      } else {
        return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
      }
    }

    // 1. Fetch User Profile & Active Plan
    const entitlements = await getUserEntitlements(authenticatedUserId);

    // 2. Fetch User's Payments History (Strictly Ownership scoped to authenticated user)
    const { data: payments, error } = await supabase
      .from('payments')
      .select('id, amount, currency, status, paid_at, created_at, plans(name, code)')
      .eq('user_id', authenticatedUserId)
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
    return NextResponse.json({ error: err?.message || 'Fatura bilgileri alınamadı.' }, { status: 500 });
  }
}
