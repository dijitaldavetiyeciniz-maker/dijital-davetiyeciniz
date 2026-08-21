import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    const { email, firstName, userId } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'E-posta adresi gereklidir.' }, { status: 400 });
    }

    const result = await sendVerificationEmail({ email, firstName, userId });
    if (!result.success) {
      return NextResponse.json({ error: result.error, retryAfter: result.retryAfter }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: '6 haneli doğrulama kodu e-posta adresinize gönderildi.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Doğrulama kodu gönderilemedi.' }, { status: 500 });
  }
}
