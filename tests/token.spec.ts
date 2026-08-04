import { test, expect } from '@playwright/test';
import { generateGuestTokenCore, verifyGuestTokenCore } from '../src/lib/security/guestTokenCore';
import { randomUUID, createHmac } from 'crypto';

test.describe('Guest Token Unit Tests', () => {
  const TEST_SECRET = 'test-secret-key-that-is-at-least-32-chars-long';

  test('Valid token generation and verification', () => {
    const publicId = randomUUID();
    const token = generateGuestTokenCore(publicId, 1, TEST_SECRET, 1);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    
    const parts = token.split('.');
    expect(parts.length).toBe(2);
    
    const verified = verifyGuestTokenCore(token, TEST_SECRET);
    expect(verified).not.toBeNull();
    expect(verified?.publicId).toBe(publicId);
    expect(verified?.tokenVersion).toBe(1);
    expect(verified?.keyVersion).toBe(1);
  });

  test('Missing secret throws error on generation', () => {
    const publicId = randomUUID();
    expect(() => generateGuestTokenCore(publicId, 1, '', 1)).toThrow('Secret key is required for token generation');
  });

  test('Missing secret throws error on verification', () => {
    const token = generateGuestTokenCore(randomUUID(), 1, TEST_SECRET, 1);
    expect(() => verifyGuestTokenCore(token, '')).toThrow('Secret key is required for token verification');
  });

  test('Tampered payload fails verification', () => {
    const publicId = randomUUID();
    const token = generateGuestTokenCore(publicId, 1, TEST_SECRET, 1);
    
    const parts = token.split('.');
    const originalPayloadStr = Buffer.from(parts[0], 'base64url').toString('utf-8');
    const originalPayload = JSON.parse(originalPayloadStr);
    
    // Tamper the payload
    originalPayload.publicId = randomUUID();
    const tamperedPayloadBase64 = Buffer.from(JSON.stringify(originalPayload)).toString('base64url');
    const tamperedToken = `${tamperedPayloadBase64}.${parts[1]}`;
    
    const verified = verifyGuestTokenCore(tamperedToken, TEST_SECRET);
    expect(verified).toBeNull();
  });

  test('Tampered signature fails verification', () => {
    const publicId = randomUUID();
    const token = generateGuestTokenCore(publicId, 1, TEST_SECRET, 1);
    
    const parts = token.split('.');
    const tamperedSignature = parts[1] + 'a';
    const tamperedToken = `${parts[0]}.${tamperedSignature}`;
    
    const verified = verifyGuestTokenCore(tamperedToken, TEST_SECRET);
    expect(verified).toBeNull();
  });

  test('Invalid JSON payload fails verification', () => {
    const token = generateGuestTokenCore(randomUUID(), 1, TEST_SECRET, 1);
    const parts = token.split('.');
    
    const invalidPayload = Buffer.from('not-json').toString('base64url');
    const invalidToken = `${invalidPayload}.${parts[1]}`;
    
    const verified = verifyGuestTokenCore(invalidToken, TEST_SECRET);
    expect(verified).toBeNull();
  });

  test('Expired token is rejected', () => {
    const publicId = randomUUID();
    const token = generateGuestTokenCore(publicId, 1, TEST_SECRET, 1, Date.now() - 1000);
    
    const verified = verifyGuestTokenCore(token, TEST_SECRET);
    expect(verified).toBeNull();
  });

  test('Future expiry is accepted', () => {
    const publicId = randomUUID();
    const token = generateGuestTokenCore(publicId, 1, TEST_SECRET, 1, Date.now() + 100000);
    
    const verified = verifyGuestTokenCore(token, TEST_SECRET);
    expect(verified).not.toBeNull();
    expect(verified?.publicId).toBe(publicId);
  });

  test('Token does not expose real guest ID', () => {
    const publicId = randomUUID();
    const token = generateGuestTokenCore(publicId, 1, TEST_SECRET, 1);
    const decodedPayloadStr = Buffer.from(token.split('.')[0], 'base64url').toString('utf-8');
    const payload = JSON.parse(decodedPayloadStr);
    
    expect(payload.publicId).toBeDefined();
    expect(payload.guestId).toBeUndefined();
    expect(payload.id).toBeUndefined();
  });

  test('Token does not expose personal data', () => {
    const publicId = randomUUID();
    const token = generateGuestTokenCore(publicId, 1, TEST_SECRET, 1);
    const decodedPayloadStr = Buffer.from(token.split('.')[0], 'base64url').toString('utf-8');
    const payload = JSON.parse(decodedPayloadStr);
    
    expect(payload.name).toBeUndefined();
    expect(payload.email).toBeUndefined();
    expect(payload.phone).toBeUndefined();
  });

  test('Extremely long token is rejected immediately', () => {
    const longToken = 'a'.repeat(600);
    const verified = verifyGuestTokenCore(longToken, TEST_SECRET);
    expect(verified).toBeNull();
  });

  test('Missing token version fails verification', () => {
    const payload = { publicId: randomUUID(), keyVersion: 1 };
    const payloadStr = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadStr).toString('base64url');
    
    // We need the crypto module to sign it
    const signature = createHmac('sha256', TEST_SECRET)
      .update(payloadStr)
      .digest('base64url');
      
    const token = `${base64Payload}.${signature}`;
    
    const verified = verifyGuestTokenCore(token, TEST_SECRET);
    expect(verified).toBeNull();
  });

});
