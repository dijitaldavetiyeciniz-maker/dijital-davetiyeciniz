import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { wedding_id } = await req.json();
    if (!wedding_id) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.delete(`admin_auth_${wedding_id}`);
    
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
