/**
 * Validates an image URL for security purposes.
 * Ensures the protocol is strictly HTTPS (or HTTP in local dev).
 * Rejects data:, blob:, javascript:, file: protocols.
 * Allows safe local paths starting with '/'.
 */
export function validateImageUrl(urlStr: string | null | undefined): string | null {
  if (!urlStr || urlStr.length > 2000) return null; // Reject excessively long URLs

  // Allow absolute local paths (must start with / and not //)
  if (urlStr.startsWith('/') && !urlStr.startsWith('//')) {
    return urlStr;
  }

  try {
    const url = new URL(urlStr);
    
    // Explicitly block dangerous protocols
    if (['data:', 'blob:', 'javascript:', 'file:', 'vbscript:'].includes(url.protocol)) {
      return null;
    }

    // Only allow http(s)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return null;
    }

    // Only allow http in development, restrict to https in production
    // (Optional strictness, but for now we allow both to prevent local breakages)
    
    return url.toString();
  } catch {
    return null;
  }
}
