import { URL } from 'url';
import dns from 'dns';

/**
 * Checks if an IP address string belongs to a private, loopback, or link-local range.
 */
export function isPrivateIp(ip: string): boolean {
  if (!ip) return true;

  const normalized = ip.trim().replace(/^\[|\]$/g, ''); // strip brackets if IPv6

  // IPv4 & IPv6 Loopback & Special
  if (
    normalized === '127.0.0.1' ||
    normalized === '0.0.0.0' ||
    normalized === '::1' ||
    normalized === '::' ||
    normalized === 'localhost'
  ) {
    return true;
  }

  // AWS / Cloud Metadata
  if (normalized === '169.254.169.254') return true;

  // IPv4 Private Ranges
  const match = normalized.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (match) {
    const p1 = parseInt(match[1], 10);
    const p2 = parseInt(match[2], 10);

    if (p1 === 127) return true; // 127.0.0.0/8
    if (p1 === 10) return true;  // 10.0.0.0/8
    if (p1 === 172 && p2 >= 16 && p2 <= 31) return true; // 172.16.0.0/12
    if (p1 === 192 && p2 === 168) return true; // 192.168.0.0/16
    if (p1 === 169 && p2 === 254) return true; // 169.254.0.0/16
  }

  // IPv6 Private & Local Ranges
  const lower = normalized.toLowerCase();
  if (lower.startsWith('fc00:') || lower.startsWith('fd00:') || lower.startsWith('fe80:')) {
    return true;
  }

  return false;
}

/**
 * Validates a URL string for SSRF safety, including static pattern check and IP check.
 */
export function isSafeUrl(urlString: string): { safe: boolean; reason?: string; parsedUrl?: URL } {
  if (!urlString || typeof urlString !== 'string') {
    return { safe: false, reason: 'Invalid or missing URL parameter' };
  }

  try {
    const parsed = new URL(urlString);

    // 1. Protocol check: Only allow HTTP and HTTPS
    if (!['http:', 'https:'].includes(parsed.protocol.toLowerCase())) {
      return { safe: false, reason: `Forbidden protocol: ${parsed.protocol}` };
    }

    const rawHostname = parsed.hostname.toLowerCase();
    const cleanHostname = rawHostname.replace(/^\[|\]$/g, '');

    // 2. Block localhost & loopback strings
    if (
      cleanHostname === 'localhost' ||
      cleanHostname === '127.0.0.1' ||
      cleanHostname === '0.0.0.0' ||
      cleanHostname === '::1' ||
      cleanHostname === '::'
    ) {
      return { safe: false, reason: 'Localhost and loopback IPs are blocked' };
    }

    // 3. Block cloud metadata services
    if (
      cleanHostname === '169.254.169.254' ||
      cleanHostname === 'metadata.google.internal' ||
      cleanHostname.endsWith('.internal')
    ) {
      return { safe: false, reason: 'Metadata services are blocked' };
    }

    // 4. IP check if hostname is direct IP
    if (isPrivateIp(cleanHostname)) {
      return { safe: false, reason: 'Private IP range blocked' };
    }

    return { safe: true, parsedUrl: parsed };
  } catch (e) {
    return { safe: false, reason: 'Malformed URL format' };
  }
}

/**
 * Async DNS Resolution SSRF Check (DNS Rebinding & Hostname-to-IP resolution check)
 */
export async function isSafeUrlWithDns(urlString: string): Promise<{ safe: boolean; reason?: string }> {
  const syncCheck = isSafeUrl(urlString);
  if (!syncCheck.safe || !syncCheck.parsedUrl) {
    return syncCheck;
  }

  const hostname = syncCheck.parsedUrl.hostname.replace(/^\[|\]$/g, '');

  try {
    const records = await dns.promises.lookup(hostname, { all: true });
    for (const record of records) {
      if (isPrivateIp(record.address)) {
        return { safe: false, reason: `Resolved DNS IP (${record.address}) is a private/restricted address.` };
      }
    }
    return { safe: true };
  } catch (err: any) {
    return { safe: false, reason: 'DNS lookup failed for hostname: ' + hostname };
  }
}
