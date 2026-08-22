/**
 * User-facing Error Sanitization Module
 * Translates raw database/SQL/system errors into clean, helpful Turkish messages.
 * Prevents technical stack traces and schema details from leaking to users.
 */

export function sanitizeErrorMessage(error: any): string {
  if (!error) return 'Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.';

  const raw = typeof error === 'string' ? error : error?.message || String(error);
  const lower = raw.toLowerCase();

  if (lower.includes('column') || lower.includes('relation') || lower.includes('schema cache') || lower.includes('syntax error')) {
    return 'Sunucu veritabanında geçici bir işlem hatası oluştu. Lütfen sayfayı yenileyip tekrar deneyin.';
  }

  if (lower.includes('duplicate key') || lower.includes('already exists') || lower.includes('unique constraint')) {
    return 'Bu kayıt zaten sistemde mevcuttur. Lütfen farklı bilgilerle tekrar deneyin.';
  }

  if (lower.includes('jwt') || lower.includes('token') || lower.includes('session') || lower.includes('unauthorized') || lower.includes('not logged in')) {
    return 'Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın.';
  }

  if (lower.includes('permission denied') || lower.includes('violates row-level security') || lower.includes('forbidden')) {
    return 'Bu işlemi gerçekleştirmek için yetkiniz bulunmamaktadır.';
  }

  if (lower.includes('fetch failed') || lower.includes('network') || lower.includes('econnrefused') || lower.includes('timeout')) {
    return 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.';
  }

  if (lower.includes('rate limit') || lower.includes('too many')) {
    return 'Çok fazla istek gönderildi. Lütfen biraz bekleyip tekrar deneyin.';
  }

  // If already a clean Turkish user message, return as is
  if (raw.length < 150 && !raw.includes('ERROR:') && !raw.includes('at ') && !raw.includes('SQLSTATE')) {
    return raw;
  }

  return 'İşlem sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
}
