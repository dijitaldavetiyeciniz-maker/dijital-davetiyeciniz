import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { getSupabaseAdmin } from './supabase-admin';

const OTP_SECRET = process.env.OTP_SECRET || process.env.SUPERADMIN_SECRET || 'dijital-davetiye-secure-otp-hash-secret-2026';

/**
 * Centralized email normalization helper
 */
export function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

/**
 * Returns a configured Nodemailer transporter or null if credentials are not provided
 */
export function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || process.env.EMAIL_FROM || 'dijitaldavetiyeciniz@gmail.com';
  const pass = process.env.SMTP_PASS;

  if (!pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

/**
 * Safely verifies SMTP transport connectivity without leaking credentials
 */
export async function verifyEmailTransport(): Promise<{ success: boolean; error?: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    return { success: false, error: 'SMTP credentials missing (SMTP_PASS not set)' };
  }

  try {
    await transporter.verify();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'SMTP verification failed' };
  }
}

/**
 * Computes a secure HMAC-SHA256 hash of the 6-digit OTP
 * RAW OTP is NEVER stored in database or logs!
 */
export function hashOtp(email: string, otp: string): string {
  const payload = `${normalizeEmail(email)}:${otp.trim()}`;
  return crypto.createHmac('sha256', OTP_SECRET).update(payload).digest('hex');
}

/**
 * Generates a cryptographically secure 6-digit verification code
 */
export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * In-memory test store used ONLY during local automated testing when DB is mocked
 */
const _testMemoryStore: Record<string, any> = {};

export function getTestVerificationRecord(email: string): any {
  return _testMemoryStore[normalizeEmail(email)];
}

export function setTestVerificationRecord(email: string, record: any): void {
  _testMemoryStore[normalizeEmail(email)] = record;
}

/**
 * Sends verification email and records delivery status via server-only service role
 */
export async function sendVerificationEmail({
  email,
  firstName,
  userId
}: {
  email: string;
  firstName?: string;
  userId?: string;
}): Promise<{ success: boolean; error?: string; retryAfter?: number }> {
  const normalizedEmail = normalizeEmail(email);
  const supabase = getSupabaseAdmin();

  try {
    // 1. Check Resend Cooldown (60 seconds) from server DB
    let existingPending: any = null;

    try {
      const { data } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) existingPending = data;
    } catch {}

    // Test environment fallback
    if (!existingPending && (process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST)) {
      existingPending = getTestVerificationRecord(normalizedEmail);
    }

    if (existingPending && existingPending.status === 'pending') {
      const lastSent = new Date(existingPending.last_sent_at || existingPending.created_at).getTime();
      const elapsedSeconds = Math.floor((Date.now() - lastSent) / 1000);
      if (elapsedSeconds < 60) {
        return {
          success: false,
          error: `Lütfen tekrar kod istemek için ${60 - elapsedSeconds} saniye bekleyin.`,
          retryAfter: 60 - elapsedSeconds
        };
      }
    }

    // 2. Generate secure 6-digit code and HMAC-SHA256 hash
    const rawOtp = generateOtp();
    const codeHash = hashOtp(normalizedEmail, rawOtp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes expiry

    // 3. Mark previous pending codes superseded
    try {
      await supabase
        .from('email_verifications')
        .update({ status: 'superseded' })
        .eq('email', normalizedEmail)
        .eq('status', 'pending');
    } catch {}

    const resendCount = existingPending ? (existingPending.resend_count || 0) + 1 : 0;

    const record = {
      id: crypto.randomUUID(),
      user_id: userId || null,
      email: normalizedEmail,
      code_hash: codeHash,
      status: 'pending',
      attempt_count: 0,
      resend_count: resendCount,
      expires_at: expiresAt,
      last_sent_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    // Save to test store if test environment
    if (process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST) {
      setTestVerificationRecord(normalizedEmail, record);
    }

    // Insert new pending record to Supabase via service role
    try {
      await supabase.from('email_verifications').insert([record]);
    } catch (insertErr) {
      console.warn('DB verification insert warning:', insertErr);
    }

    // 4. Actual SMTP Dispatch via Nodemailer
    let deliveryStatus = 'sent';
    let errorMessage: string | null = null;
    const transporter = getTransporter();

    if (transporter) {
      try {
        const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER || 'dijitaldavetiyeciniz@gmail.com';
        const senderName = process.env.EMAIL_FROM_NAME || 'Dijital Davetiye';

        const htmlBody = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-posta Doğrulama Kodu</title>
</head>
<body style="margin:0;padding:0;background-color:#0b0b14;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#0b0b14;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="560" border="0" cellspacing="0" cellpadding="0" style="max-width:560px;background:#131326;border-radius:24px;border:1px solid rgba(244,63,94,0.25);overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
          <tr>
            <td style="padding:36px 32px 24px;text-align:center;background:linear-gradient(180deg, rgba(244,63,94,0.12) 0%, rgba(19,19,38,0) 100%);">
              <div style="display:inline-block;padding:12px;background:rgba(244,63,94,0.15);border-radius:16px;margin-bottom:16px;">
                <span style="font-size:32px;">💌</span>
              </div>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Dijital Davetiye</h1>
              <p style="margin:6px 0 0;font-size:14px;color:#94a3b8;">E-posta Doğrulama Kodu</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#cbd5e1;">
                ${firstName ? `Merhaba <strong>${firstName}</strong>,` : 'Merhaba,'}<br>
                Hesabınızı güvenle aktifleştirmek için aşağıdaki 6 haneli doğrulama kodunu kullanın:
              </p>
              <div style="background:#1e1e38;border:2px dashed #f43f5e;border-radius:18px;padding:20px;margin:24px 0;letter-spacing:10px;font-size:36px;font-weight:800;color:#ffffff;font-family:monospace;text-align:center;">
                ${rawOtp}
              </div>
              <p style="margin:0 0 16px;font-size:13px;color:#94a3b8;line-height:1.5;">
                ⏱️ Bu kod <strong>10 dakika</strong> boyunca geçerlidir.<br>
                Güvenliğiniz için bu kodu kimseyle paylaşmayınız.
              </p>
              <div style="margin-top:28px;padding-top:20px;border-top:1px solid #2d2d4d;font-size:12px;color:#64748b;line-height:1.5;">
                Eğer bu hesabı siz oluşturmadıysanız, lütfen bu e-postayı dikkate almayınız.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        const textBody = `Dijital Davetiye — E-posta Doğrulama Kodu\n\n${firstName ? `Merhaba ${firstName},\n\n` : 'Merhaba,\n\n'}Hesabınızı doğrulamak için kodunuz: ${rawOtp}\n\nBu kod 10 dakika boyunca geçerlidir.`;

        await transporter.sendMail({
          from: `"${senderName}" <${fromAddress}>`,
          to: normalizedEmail,
          subject: `${rawOtp} — Dijital Davetiye Doğrulama Kodunuz`,
          text: textBody,
          html: htmlBody
        });

        deliveryStatus = 'sent';
      } catch (err: any) {
        deliveryStatus = 'failed';
        errorMessage = err.message || 'SMTP iletim hatası';
        console.error('[EMAIL DELIVERY ERROR]', err.code || err.name, errorMessage);
      }
    } else {
      if (process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST || process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost')) {
        deliveryStatus = 'mock_sent';
      } else {
        deliveryStatus = 'failed';
        errorMessage = 'SMTP credentials not configured (SMTP_PASS missing).';
      }
    }

    // 5. Log Email Delivery (WITHOUT plain OTP or credentials)
    try {
      await supabase.from('email_delivery_logs').insert([
        {
          recipient: normalizedEmail,
          email_type: 'verification_otp',
          status: deliveryStatus,
          error_message: errorMessage ? errorMessage.slice(0, 500) : null
        }
      ]);
    } catch {}

    // 6. Log Security Event
    try {
      await supabase.from('security_events').insert([
        {
          event_type: 'EMAIL_VERIFICATION_SENT',
          actor_email: normalizedEmail,
          details: { resend_count: resendCount, delivery_status: deliveryStatus }
        }
      ]);
    } catch {}

    const isTestEnv = process.env.NODE_ENV === 'test' || !!process.env.PLAYWRIGHT_TEST || process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost');

    if (deliveryStatus === 'failed' && !isTestEnv) {
      return {
        success: false,
        error: 'E-posta servisine bağlanırken bir sorun oluştu. Lütfen biraz sonra tekrar deneyin.'
      };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Doğrulama e-postası gönderilemedi.' };
  }
}

/**
 * Validates the user-submitted 6-digit OTP code against the stored hash via service role
 */
export async function verifySubmittedOtp({
  email,
  code
}: {
  email: string;
  code: string;
}): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = normalizeEmail(email);
  const trimmedCode = (code || '').trim();
  const supabase = getSupabaseAdmin();

  if (!trimmedCode || trimmedCode.length !== 6) {
    return { success: false, error: 'Lütfen 6 haneli doğrulama kodunu eksiksiz girin.' };
  }

  try {
    let record: any = null;

    // 1. Fetch latest pending verification record from Supabase via service role
    try {
      const { data } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        record = data;
      }
    } catch (dbErr) {
      console.warn('DB verification lookup warning:', dbErr);
    }

    // 2. Fallback to test memory store in test environment
    if (!record && (process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST)) {
      const localRec = getTestVerificationRecord(normalizedEmail);
      if (localRec && localRec.status === 'pending') {
        record = localRec;
      }
    }

    if (!record) {
      return { success: false, error: 'Aktif bir doğrulama kodu bulunamadı. Lütfen yeni bir kod isteyin.' };
    }

    // Check expiration
    if (new Date(record.expires_at).getTime() < Date.now()) {
      record.status = 'expired';
      try {
        await supabase
          .from('email_verifications')
          .update({ status: 'expired' })
          .eq('id', record.id);
      } catch {}
      return { success: false, error: 'Bu doğrulama kodunun süresi dolmuş. Lütfen tekrar kod isteyin.' };
    }

    // Check max attempts (5 failed attempts limit)
    const currentAttempts = (record.attempt_count || 0) + 1;
    if (currentAttempts > 5) {
      record.status = 'too_many_attempts';
      record.attempt_count = currentAttempts;
      try {
        await supabase
          .from('email_verifications')
          .update({ status: 'too_many_attempts', attempt_count: currentAttempts })
          .eq('id', record.id);
      } catch {}
      return { success: false, error: 'Çok fazla hatalı deneme yapıldı. Güvenliğiniz için lütfen yeni bir kod talep edin.' };
    }

    // Compute submitted code hash
    const submittedHash = hashOtp(normalizedEmail, trimmedCode);

    // Constant-time comparison
    const subBuf = Buffer.from(submittedHash);
    const recBuf = Buffer.from(record.code_hash || '');
    const isMatch = subBuf.length === recBuf.length && crypto.timingSafeEqual(subBuf, recBuf);

    if (!isMatch) {
      record.attempt_count = currentAttempts;
      try {
        await supabase
          .from('email_verifications')
          .update({ attempt_count: currentAttempts })
          .eq('id', record.id);
      } catch {}
      return { success: false, error: `Doğrulama kodu hatalı. (Kalan deneme hakkı: ${5 - currentAttempts})` };
    }

    // Verification Success!
    record.status = 'verified';
    record.verified_at = new Date().toISOString();

    try {
      await supabase
        .from('email_verifications')
        .update({
          status: 'verified',
          verified_at: record.verified_at,
          attempt_count: currentAttempts
        })
        .eq('id', record.id);
    } catch {}

    try {
      await supabase
        .from('profiles')
        .update({ is_email_verified: true, email_verified_at: new Date().toISOString() })
        .eq('email', normalizedEmail);
    } catch {}

    try {
      await supabase.from('security_events').insert([
        {
          event_type: 'EMAIL_VERIFIED',
          actor_email: normalizedEmail,
          details: { verified_at: record.verified_at, attempts: currentAttempts }
        }
      ]);
    } catch {}

    return { success: true };
  } catch (err: any) {
    return { success: false, error: 'Doğrulama işlemi sırasında bir hata oluştu.' };
  }
}

/**
 * Generic helper for sending transactional emails with audit logging
 */
export async function sendEmailWithAudit(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
  eventType: string;
}): Promise<{ success: boolean; error?: string }> {
  const { to, subject, html, text, eventType } = params;
  const normalizedEmail = to.trim().toLowerCase();
  const supabase = getSupabaseAdmin();
  const transporter = getTransporter();

  let deliveryStatus = 'sent';
  let errorMessage: string | null = null;

  if (transporter && process.env.NODE_ENV !== 'test' && !process.env.PLAYWRIGHT_TEST) {
    try {
      const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER || 'dijitaldavetiyeciniz@gmail.com';
      const senderName = process.env.EMAIL_FROM_NAME || 'Dijital Davetiye';

      await transporter.sendMail({
        from: `"${senderName}" <${fromAddress}>`,
        to: normalizedEmail,
        subject,
        text,
        html
      });
      deliveryStatus = 'sent';
    } catch (err: any) {
      deliveryStatus = 'failed';
      errorMessage = err.message || 'SMTP iletim hatası';
      console.error('[EMAIL AUDIT ERROR]', err.code || err.name, errorMessage);
    }
  } else {
    deliveryStatus = 'mock_sent';
  }

  try {
    await supabase.from('email_delivery_logs').insert([
      {
        recipient: normalizedEmail,
        email_type: eventType,
        status: deliveryStatus,
        error_message: errorMessage ? errorMessage.slice(0, 500) : null
      }
    ]);
  } catch {}

  return { success: deliveryStatus === 'sent' || deliveryStatus === 'mock_sent', error: errorMessage || undefined };
}

/**
 * Sends a welcome email after successful email verification
 */
export async function sendWelcomeEmail(params: { email: string; name?: string }): Promise<{ success: boolean; error?: string }> {
  const { email, name = 'Değerli Kullanıcımız' } = params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dijital-davetiyeciniz.vercel.app';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fdfaf7; color: #334155;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #e11d48; margin: 0; font-size: 24px;">Dijital Davetiyeciniz</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Aramıza Hoş Geldiniz!</p>
      </div>
      <div style="background-color: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;">
        <p style="font-size: 16px; line-height: 24px; margin-top: 0;">Merhaba <strong>${name}</strong>,</p>
        <p style="font-size: 15px; line-height: 24px; color: #475569;">
          E-posta adresiniz başarıyla doğrulandı. Artık 120+ şablon, özel zarf animasyonları ve müzik seçenekleriyle hayalinizdeki davetiyeyi hemen hazırlamaya başlayabilirsiniz.
        </p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${siteUrl}/onboarding" style="background: linear-gradient(to right, #f43f5e, #e11d48); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 15px; display: inline-block;">
            Davetiyeni Oluşturmaya Başla
          </a>
        </div>
        <p style="font-size: 13px; color: #94a3b8; line-height: 20px; margin-bottom: 0;">
          Sorularınız için dilediğiniz zaman bu e-postayı yanıtlayabilir veya destek ekibimizle iletişime geçebilirsiniz.
        </p>
      </div>
    </div>
  `;

  const text = `Merhaba ${name},\n\nE-posta adresiniz başarıyla doğrulandı. Dijital Davetiyeciniz'e hoş geldiniz!\n\nDavetiyenizi oluşturmak için: ${siteUrl}/onboarding\n\nDijital Davetiyeciniz Ekibi`;

  return sendEmailWithAudit({
    to: email,
    subject: 'Dijital Davetiyeciniz’e Hoş Geldiniz! 🎉',
    html,
    text,
    eventType: 'welcome_email'
  });
}

/**
 * Sends a confirmation email when an invitation is published
 */
export async function sendPublishConfirmationEmail(params: {
  email: string;
  name?: string;
  weddingTitle: string;
  slug: string;
}): Promise<{ success: boolean; error?: string }> {
  const { email, name = 'Değerli Kullanıcımız', weddingTitle, slug } = params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dijital-davetiyeciniz.vercel.app';
  const invitationUrl = `${siteUrl}/${slug}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fdfaf7; color: #334155;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #e11d48; margin: 0; font-size: 24px;">Dijital Davetiyeciniz</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Davetiyeniz Yayında! ✨</p>
      </div>
      <div style="background-color: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;">
        <p style="font-size: 16px; line-height: 24px; margin-top: 0;">Tebrikler <strong>${name}</strong>,</p>
        <p style="font-size: 15px; line-height: 24px; color: #475569;">
          <strong>"${weddingTitle}"</strong> başlıklı davetiyeniz başarıyla yayına alındı. Misafirlerinizle bu kalıcı bağlantıyı paylaşabilirsiniz.
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center; margin: 25px 0;">
          <a href="${invitationUrl}" style="color: #e11d48; font-weight: bold; word-break: break-all; font-size: 14px; text-decoration: none;">
            ${invitationUrl}
          </a>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/dashboard" style="background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; display: inline-block;">
            Yönetim Paneline Git
          </a>
        </div>
      </div>
    </div>
  `;

  const text = `Tebrikler ${name}!\n\n"${weddingTitle}" davetiyeniz yayında:\n${invitationUrl}\n\nDijital Davetiyeciniz`;

  return sendEmailWithAudit({
    to: email,
    subject: `Davetiyeniz Yayında! ✨ — ${weddingTitle}`,
    html,
    text,
    eventType: 'invitation_published'
  });
}

/**
 * Sends payment and plan activation receipt email
 */
export async function sendPaymentReceiptEmail(params: {
  email: string;
  name?: string;
  planName: string;
  amount: number;
  currency?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { email, name = 'Değerli Kullanıcımız', planName, amount, currency = 'TL' } = params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dijital-davetiyeciniz.vercel.app';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fdfaf7; color: #334155;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #e11d48; margin: 0; font-size: 24px;">Dijital Davetiyeciniz</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Ödeme Makbuzu</p>
      </div>
      <div style="background-color: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;">
        <p style="font-size: 16px; line-height: 24px; margin-top: 0;">Sayın <strong>${name}</strong>,</p>
        <p style="font-size: 15px; line-height: 24px; color: #475569;">
          Ödemeniz başarıyla alınmış ve <strong>${planName}</strong> üyeliğiniz aktif edilmiştir.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Paket / Plan</td>
            <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #0f172a; font-size: 14px;">${planName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Ödenen Tutar</td>
            <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669; font-size: 16px;">₺${amount.toLocaleString('tr-TR')} ${currency}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Durum</td>
            <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669; font-size: 14px;">Onaylandı (Ödendi)</td>
          </tr>
        </table>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${siteUrl}/dashboard" style="background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; display: inline-block;">
            Paneli Görüntüle
          </a>
        </div>
      </div>
    </div>
  `;

  const text = `Sayın ${name},\n\n${planName} için ₺${amount} ${currency} tutarındaki ödemeniz onaylandı.\n\nDijital Davetiyeciniz`;

  return sendEmailWithAudit({
    to: email,
    subject: `Ödemeniz Onaylandı — ${planName}`,
    html,
    text,
    eventType: 'payment_receipt'
  });
}
