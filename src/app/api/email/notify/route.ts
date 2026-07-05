import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { wedding_id, guest_name, is_attending, guest_count, child_count = 0, message } = await request.json();

    if (!wedding_id || !guest_name) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 });
    }

    // Düğün ve sahip e-posta bilgisini çek
    const { data: wedding, error } = await supabaseAdmin
      .from('weddings')
      .select('bride_name, groom_name, owner_email, slug')
      .eq('id', wedding_id)
      .single();

    if (error || !wedding) {
      return NextResponse.json({ error: 'Düğün bulunamadı' }, { status: 404 });
    }

    // Sahip e-postası yoksa sisteme bildir ama hata verme
    const toEmail = wedding.owner_email || process.env.SMTP_USER;
    if (!toEmail) {
      return NextResponse.json({ success: true, message: 'Sahip e-postası tanımlı değil, bildirim atlandı.' });
    }

    const statusText = is_attending ? '✅ KATILACAK' : '❌ KATILAMAYACAK';
    const statusColor = is_attending ? '#10b981' : '#ef4444';
    const guestLine = is_attending ? `<p><strong>Kişi Sayısı:</strong> ${guest_count} yetişkin${child_count > 0 ? ` + ${child_count} çocuk` : ''}</p>` : '';
    const messageLine = message ? `<p><strong>Mesaj:</strong> "${message}"</p>` : '';
    const eventNames = `${wedding.bride_name}${wedding.groom_name ? ' & ' + wedding.groom_name : ''}`;

    const htmlBody = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yeni LCV Bildirimi</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#f43f5e,#e11d48);padding:32px 40px;text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.8);font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8px;">Dijital Davetiyeciniz</p>
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">💌 Yeni LCV Bildirimi</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">${eventNames}</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" style="background:#f8fafc;border-radius:12px;padding:20px 24px;margin-bottom:24px;border-left:4px solid ${statusColor};" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 12px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Misafir Bilgileri</p>
                    <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#1e293b;">${guest_name}</p>
                    <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:${statusColor};">${statusText}</p>
                    ${guestLine}
                    ${messageLine}
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">
                Tüm misafir yanıtlarını görmek için 
                <a href="https://dijital-davetiyeciniz.vercel.app/d/${wedding.slug}/admin" style="color:#f43f5e;text-decoration:none;font-weight:600;">yönetim paneline</a> göz atabilirsiniz.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f1f5f9;padding:16px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:11px;color:#94a3b8;">
                Bu e-posta <strong>Dijital Davetiyeciniz</strong> platformu tarafından otomatik gönderilmiştir.<br>
                Destek: <a href="mailto:dijitaldavetiyeciniz@gmail.com" style="color:#f43f5e;">dijitaldavetiyeciniz@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"Dijital Davetiyeciniz" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `💌 Yeni LCV: ${guest_name} — ${is_attending ? 'Katılacak ✅' : 'Katılamayacak ❌'} | ${eventNames}`,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('E-posta gönderi hatası:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
