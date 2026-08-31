/**
 * Canonical Hostname Normalization and Platform Host Validation Utilities
 * Server-only reusable helper functions for custom domain routing and control plane.
 */

// Platform and reserved domains that cannot be claimed by tenants
const RESERVED_PLATFORM_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  'dijitaldavetiyeciniz.com',
  'www.dijitaldavetiyeciniz.com',
  'davetiyeciniz.com',
  'www.davetiyeciniz.com',
];

// Reserved platform suffixes
const RESERVED_SUFFIXES = [
  '.vercel.app',
  '.dijitaldavetiyeciniz.com',
  '.davetiyeciniz.com',
  '.local',
  '.internal',
];

/**
 * Normalizes user-entered hostname to canonical format.
 * - Strips protocols (http://, https://)
 * - Strips leading/trailing whitespace
 * - Converts to lowercase
 * - Strips ports (:443, :80, :3000)
 * - Strips trailing dots (example.com. -> example.com)
 * - Strips trailing slashes
 * Rejects inputs containing URL paths (e.g. example.com/page).
 */
export function normalizeHostname(input: string): { hostname: string; error?: string } {
  if (!input || typeof input !== 'string') {
    return { hostname: '', error: 'Alan adı boş olamaz' };
  }

  let cleaned = input.trim().toLowerCase();

  // Strip protocol if provided
  if (cleaned.startsWith('http://')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('https://')) {
    cleaned = cleaned.slice(8);
  }

  // Reject URL paths
  if (cleaned.includes('/')) {
    const slashIdx = cleaned.indexOf('/');
    const pathPart = cleaned.slice(slashIdx);
    if (pathPart !== '/' && pathPart.length > 1) {
      return { hostname: '', error: 'Alan adı URL yolu (path) içeremez, yalnızca alan adını girin (örn: davet.example.com)' };
    }
    cleaned = cleaned.slice(0, slashIdx);
  }

  // Strip port if present
  if (cleaned.includes(':')) {
    cleaned = cleaned.split(':')[0];
  }

  // Strip trailing dot
  while (cleaned.endsWith('.')) {
    cleaned = cleaned.slice(0, -1);
  }

  cleaned = cleaned.trim();

  if (!cleaned) {
    return { hostname: '', error: 'Geçerli bir alan adı girilmedi' };
  }

  // Length check: max 253 characters according to RFC 1035
  if (cleaned.length > 253) {
    return { hostname: '', error: 'Alan adı çok uzun (maksimum 253 karakter)' };
  }

  return { hostname: cleaned };
}

/**
 * Validates whether normalized hostname conforms to standard DNS format.
 */
export function isValidHostname(hostname: string): boolean {
  if (!hostname || hostname.length === 0 || hostname.length > 253) {
    return false;
  }

  // Reject IPv4 or IPv6 literals
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(':')) {
    return false;
  }

  // Must have at least one dot (domain + TLD, e.g. example.com or sub.example.com)
  if (!hostname.includes('.')) {
    return false;
  }

  // Hostname regex compliant with RFC 1123
  const hostnameRegex = /^(?=.{1,253}$)(?!-)[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,63}$/;
  if (!hostnameRegex.test(hostname)) {
    return false;
  }

  // Check each label length (max 63 chars)
  const labels = hostname.split('.');
  for (const label of labels) {
    if (label.length === 0 || label.length > 63) return false;
    if (label.startsWith('-') || label.endsWith('-')) return false;
  }

  return true;
}

/**
 * Checks whether the hostname is a platform-owned domain or internal address that tenants cannot claim.
 */
export function isPlatformDomain(hostname: string): boolean {
  const normalized = hostname.toLowerCase().trim();

  // Exact match on reserved platform domains
  if (RESERVED_PLATFORM_DOMAINS.includes(normalized)) {
    return true;
  }

  // Suffix match on platform subdomains
  for (const suffix of RESERVED_SUFFIXES) {
    if (normalized.endsWith(suffix)) {
      return true;
    }
  }

  // IP addresses, localhost, internal domains
  if (
    normalized === 'localhost' ||
    normalized === '127.0.0.1' ||
    normalized.startsWith('192.168.') ||
    normalized.startsWith('10.') ||
    normalized.startsWith('172.') ||
    normalized.endsWith('.local') ||
    normalized.endsWith('.internal')
  ) {
    return true;
  }

  return false;
}
