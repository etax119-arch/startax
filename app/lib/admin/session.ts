import { getAdminSessionSecret } from '../env';

export const ADMIN_COOKIE = 'startax_admin';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8시간

const encoder = new TextEncoder();

function base64url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * node:crypto 의 createHmac 대신 Web Crypto 를 씁니다.
 * createHmac 은 Edge 런타임(미들웨어 기본)에서 쓸 수 없지만 crypto.subtle 은
 * Edge / Node 18+ 양쪽에서 전역이라 한 모듈로 어디서든 동작합니다.
 */
async function hmac(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return base64url(new Uint8Array(signature));
}

export async function sha256Base64(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return base64url(new Uint8Array(digest));
}

/** 길이 정보까지 새지 않도록, 항상 같은 길이인 다이제스트끼리 비교하세요. */
export function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** 토큰 형식: {만료 epoch ms}.{nonce}.{HMAC-SHA256} */
export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;
  const nonce = base64url(crypto.getRandomValues(new Uint8Array(9)));
  const payload = `${exp}.${nonce}`;
  return `${payload}.${await hmac(payload, getAdminSessionSecret())}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [expString, nonce, signature] = parts;
  const expected = await hmac(`${expString}.${nonce}`, getAdminSessionSecret());
  if (!timingSafeEqualStr(signature, expected)) return false;

  const exp = Number(expString);
  return Number.isFinite(exp) && Date.now() < exp;
}
