import { URL } from 'url';

/**
 * Checks if a URL is safe from SSRF attacks before proxying or fetching.
 */
export function isSafeUrl(urlString: string): { safe: boolean; reason?: string; parsedUrl?: URL } {
  if (!urlString || typeof urlString !== 'string') {
    return { safe: false, reason: 'Invalid or missing URL parameter' };
  }

  try {
    const parsed = new URL(urlString);

    // Protocol check: Only allow HTTP and HTTPS
    if (!['http:', 'https:'].includes(parsed.protocol.toLowerCase())) {
      return { safe: false, reason: `Forbidden protocol: ${parsed.protocol}` };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost & loopback
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '::'
    ) {
      return { safe: false, reason: 'Localhost and loopback IPs are blocked' };
    }

    // Block cloud metadata services
    if (
      hostname === '169.254.169.254' ||
      hostname === 'metadata.google.internal' ||
      hostname.endsWith('.internal')
    ) {
      return { safe: false, reason: 'Metadata services are blocked' };
    }

    // Block private IP ranges (IPv4)
    // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16
    const ipMatch = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipMatch) {
      const p1 = parseInt(ipMatch[1], 10);
      const p2 = parseInt(ipMatch[2], 10);

      if (p1 === 10) return { safe: false, reason: 'Private IP range 10.0.0.0/8 blocked' };
      if (p1 === 172 && p2 >= 16 && p2 <= 31) return { safe: false, reason: 'Private IP range 172.16.0.0/12 blocked' };
      if (p1 === 192 && p2 === 168) return { safe: false, reason: 'Private IP range 192.168.0.0/16 blocked' };
      if (p1 === 169 && p2 === 254) return { safe: false, reason: 'Link-local range 169.254.0.0/16 blocked' };
    }

    return { safe: true, parsedUrl: parsed };
  } catch (e) {
    return { safe: false, reason: 'Malformed URL format' };
  }
}
