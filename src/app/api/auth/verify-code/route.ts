import { NextResponse } from 'next/server';
import { verifySubmittedOtp } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: 'E-posta ve 6 haneli doğrulama kodu gereklidir.' }, { status: 400 });
    }

    const result = await verifySubmittedOtp({ email, code });
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'E-posta adresiniz başarıyla doğrulandı.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Doğrulama işlemi gerçekleştirilemedi.' }, { status: 500 });
  }
}
