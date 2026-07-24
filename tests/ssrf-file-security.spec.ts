import { test, expect } from '@playwright/test';
import { isSafeUrl, isPrivateIp } from '../src/lib/ssrfProtection';
import { validateUploadedFile, sanitizeSvg, sanitizeFilename } from '../src/lib/fileValidation';

test.describe('SSRF Protection & Deep File Security Unit Tests', () => {

  test('SSRF Protection must block localhost, private IPs, loopback, and metadata endpoints', () => {
    const forbiddenUrls = [
      'http://localhost/admin',
      'http://127.0.0.1:8080/secret',
      'http://[::1]/debug',
      'http://10.0.0.1/internal',
      'http://172.16.0.5/api',
      'http://192.168.1.1/router',
      'http://169.254.169.254/latest/meta-data/',
      'http://metadata.google.internal/computeMetadata/v1/',
      'file:///etc/passwd',
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
    ];

    for (const url of forbiddenUrls) {
      const check = isSafeUrl(url);
      expect(check.safe, `URL should be blocked: ${url}`).toBe(false);
    }
  });

  test('SSRF Protection must allow legitimate public HTTPS image URLs', () => {
    const validUrls = [
      'https://images.unsplash.com/photo-12345.jpg',
      'https://cdn.pixabay.com/photo/wedding.png',
    ];

    for (const url of validUrls) {
      const check = isSafeUrl(url);
      expect(check.safe, `URL should be allowed: ${url}`).toBe(true);
    }
  });

  test('File validation must reject oversized files and non-image MIME types', () => {
    const exeFile = {
      name: 'malicious.exe.jpg',
      size: 50 * 1024 * 1024, // 50MB
      type: 'application/x-msdownload',
    };

    const res = validateUploadedFile(exeFile, 'image');
    expect(res.valid).toBe(false);
    expect(res.error).toBeDefined();
  });

  test('SVG Sanitizer must strip script tags and inline event handlers', () => {
    const maliciousSvg = `<svg><script>alert('xss')</script><circle onload="alert(1)" cx="10" cy="10" r="5"/></svg>`;
    const cleanSvg = sanitizeSvg(maliciousSvg);

    expect(cleanSvg).not.toContain('<script>');
    expect(cleanSvg).not.toContain('onload');
  });

  test('Filename sanitizer must remove directory traversal and malicious characters', () => {
    const rawFilename = '../../var/www/shell.php.jpg';
    const cleanName = sanitizeFilename(rawFilename);

    expect(cleanName).not.toContain('../');
    expect(cleanName).toContain('_');
  });
});
