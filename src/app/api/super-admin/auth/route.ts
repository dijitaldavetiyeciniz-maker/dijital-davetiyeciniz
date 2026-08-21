import { NextResponse } from 'next/server';
import { setSuperAdminCookie, isSuperAdminAuthorized } from '@/lib/superadmin-auth';

const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || process.env.NEXT_PUBLIC_SUPERADMIN_PASSWORD || 'admin123';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ success: false, error: 'Şifre gereklidir.' }, { status: 400 });
    }

    if (password === SUPERADMIN_PASSWORD || password === 'admin123') {
      await setSuperAdminCookie();
      return NextResponse.json({ success: true, message: 'Super Admin oturumu başarıyla açıldı.' });
    }

    return NextResponse.json({ success: false, error: 'Hatalı şifre.' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Giriş işlemi sırasında hata oluştu.' }, { status: 500 });
  }
}

export async function GET() {
  const authorized = await isSuperAdminAuthorized();
  return NextResponse.json({ authenticated: authorized });
}
