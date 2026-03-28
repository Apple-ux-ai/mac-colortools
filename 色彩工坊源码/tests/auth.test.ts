import { describe, it, expect } from 'vitest';
import { generateSignedNonce, encodeSignedNonce } from '../src/utils/authUtils';

describe('Auth Signature Logic', () => {
  it('should generate a valid signed nonce structure', () => {
    const signedNonce = generateSignedNonce();
    expect(signedNonce).toHaveProperty('nonce');
    expect(signedNonce).toHaveProperty('timestamp');
    expect(signedNonce).toHaveProperty('signature');
    expect(typeof signedNonce.nonce).toBe('string');
    expect(signedNonce.nonce.length).toBeGreaterThan(0);
    expect(typeof signedNonce.timestamp).toBe('number');
  });

  it('should encode signed nonce to a URL safe string', () => {
    const signedNonce = {
      nonce: 'test-nonce',
      timestamp: 1234567890,
      signature: 'test-signature/with+special=chars'
    };
    const encoded = encodeSignedNonce(signedNonce);
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(encoded).not.toContain('=');
  });

  it('should produce consistent results for same input (idempotency of encoding)', () => {
    const signedNonce = generateSignedNonce();
    const encoded1 = encodeSignedNonce(signedNonce);
    const encoded2 = encodeSignedNonce(signedNonce);
    expect(encoded1).toBe(encoded2);
  });
});
