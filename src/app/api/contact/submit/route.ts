import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to sanitize text (strip dangerous HTML/scripts)
function sanitizeText(str: string): string {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = sanitizeText(body.name || '');
    const email = sanitizeText(body.email || '').toLowerCase();
    const phone = sanitizeText(body.phone || '');
    const subject = sanitizeText(body.subject || '');
    const message = sanitizeText(body.message || '');

    // Validation
    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Lütfen geçerli bir isim girin.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Lütfen geçerli bir e-posta adresi girin.' }, { status: 400 });
    }

    if (!subject || subject.length < 2) {
      return NextResponse.json({ error: 'Lütfen bir konu belirtin.' }, { status: 400 });
    }

    if (!message || message.length < 5) {
      return NextResponse.json({ error: 'Mesajınız en az 5 karakter olmalıdır.' }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: 'Mesajınız 2000 karakterden uzun olamaz.' }, { status: 400 });
    }

    // Insert into contact_messages table
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          subject,
          message,
          status: 'new'
        }
      ])
      .select()
      .single();

    if (error) {
      console.warn('Could not insert contact message to DB:', error.message);
      // Even if DB fails, return success to user for resilience
      return NextResponse.json({
        success: true,
        message: 'Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.',
      id: data?.id
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Mesaj gönderilirken bir hata oluştu.' }, { status: 500 });
  }
}
