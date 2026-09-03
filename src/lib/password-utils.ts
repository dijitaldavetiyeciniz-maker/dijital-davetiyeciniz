import crypto from 'crypto';

const SCRYPT_KEYLEN = 64;

/**
 * Hashes a plaintext password using crypto.scrypt with a unique random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verifies a password against a stored password string (supporting hashed format and legacy plaintext).
 * Also flags `needsRehash` if the stored password was legacy plaintext.
 */
export function verifyPassword(
  inputPassword: string,
  storedValue: string | null | undefined
): { valid: boolean; needsRehash: boolean } {
  if (!storedValue || !inputPassword) {
    return { valid: false, needsRehash: false };
  }

  // 1. Scrypt hashed format: scrypt:salt:hash
  if (storedValue.startsWith('scrypt:')) {
    try {
      const parts = storedValue.split(':');
      if (parts.length !== 3) return { valid: false, needsRehash: false };
      const [, salt, hash] = parts;
      const derivedKey = crypto.scryptSync(inputPassword, salt, SCRYPT_KEYLEN);
      const expectedBuf = Buffer.from(hash, 'hex');
      const actualBuf = derivedKey;
      if (expectedBuf.length !== actualBuf.length) return { valid: false, needsRehash: false };
      const valid = crypto.timingSafeEqual(expectedBuf, actualBuf);
      return { valid, needsRehash: false };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }

  // 2. Legacy plaintext comparison (for existing protected production weddings)
  try {
    const inputBuf = Buffer.from(inputPassword, 'utf8');
    const storedBuf = Buffer.from(storedValue, 'utf8');
    if (inputBuf.length !== storedBuf.length) {
      return { valid: false, needsRehash: false };
    }
    const valid = crypto.timingSafeEqual(inputBuf, storedBuf);
    return { valid, needsRehash: valid }; // Needs rehash to scrypt on next save
  } catch {
    return { valid: false, needsRehash: false };
  }
}
