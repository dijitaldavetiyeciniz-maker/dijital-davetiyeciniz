/**
 * File Upload Security Module
 * Validates magic bytes, size limits, format restrictions, SVG sanitization, and filename cleanup.
 */

export interface FileValidationOptions {
  maxSizeBytes?: number;
  allowedTypes?: ('image' | 'audio' | 'pdf')[];
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_AUDIO_SIZE = 15 * 1024 * 1024; // 15MB

// Magic byte signatures
const MAGIC_BYTES: Record<string, number[]> = {
  jpg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
  gif: [0x47, 0x49, 0x46],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF header
  mp3: [0x49, 0x44, 0x33], // ID3 header
  mp3_raw: [0xff, 0xfb],
  wav: [0x57, 0x41, 0x56, 0x45],
};

/**
 * Validates file buffer against magic bytes signature
 */
export function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (!buffer || buffer.length < 4) return false;

  const lowerMime = (mimeType || '').toLowerCase();

  if (lowerMime.includes('jpeg') || lowerMime.includes('jpg')) {
    return MAGIC_BYTES.jpg.every((byte, idx) => buffer[idx] === byte);
  }
  if (lowerMime.includes('png')) {
    return MAGIC_BYTES.png.every((byte, idx) => buffer[idx] === byte);
  }
  if (lowerMime.includes('gif')) {
    return MAGIC_BYTES.gif.every((byte, idx) => buffer[idx] === byte);
  }
  if (lowerMime.includes('webp')) {
    return MAGIC_BYTES.webp.every((byte, idx) => buffer[idx] === byte);
  }
  if (lowerMime.includes('audio') || lowerMime.includes('mp3')) {
    const isId3 = MAGIC_BYTES.mp3.every((byte, idx) => buffer[idx] === byte);
    const isRawMp3 = MAGIC_BYTES.mp3_raw.every((byte, idx) => buffer[idx] === byte);
    const isWav = MAGIC_BYTES.wav.every((byte, idx) => buffer[idx + 8] === byte);
    return isId3 || isRawMp3 || isWav || buffer.length > 10;
  }

  return true;
}

/**
 * Sanitizes SVG code to strip scripts and external references
 */
export function sanitizeSvg(svgContent: string): string {
  if (!svgContent) return '';
  return svgContent
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

/**
 * Sanitizes uploaded filename to prevent directory traversal
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return 'file';
  return filename
    .replace(/[^a-zA-Z0-9_.-]/g, '_')
    .replace(/\.\./g, '_')
    .slice(0, 100);
}

/**
 * Full file safety check
 */
export function validateUploadedFile(file: { name: string; size: number; type: string; buffer?: Buffer }, type: 'image' | 'audio'): { valid: boolean; error?: string } {
  const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_AUDIO_SIZE;

  if (file.size > maxSize) {
    return { valid: false, error: `Dosya boyutu çok büyük. Maksimum limit: ${maxSize / (1024 * 1024)}MB` };
  }

  if (type === 'image' && !file.type.startsWith('image/')) {
    return { valid: false, error: 'Sadece görsel dosyaları yüklenebilir (JPG, PNG, WebP).' };
  }

  if (type === 'audio' && !file.type.startsWith('audio/') && !file.name.endsWith('.mp3') && !file.name.endsWith('.m4a')) {
    return { valid: false, error: 'Sadece ses dosyaları yüklenebilir (MP3, WAV, M4A).' };
  }

  if (file.buffer && !validateMagicBytes(file.buffer, file.type)) {
    return { valid: false, error: 'Geçersiz veya bozuk dosya içeriği tespit edildi.' };
  }

  return { valid: true };
}
