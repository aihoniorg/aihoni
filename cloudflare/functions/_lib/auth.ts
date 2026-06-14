// HS256 JWT sign + verify using Web Crypto — runs natively in Cloudflare Workers.
// Tokens carry our user identity (subject = users.id) and a short expiry.

const TEXT = new TextEncoder();
const TEXT_DEC = new TextDecoder();

const b64uEncode = (data: ArrayBuffer | Uint8Array): string => {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const b64uDecode = (s: string): Uint8Array => {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    TEXT.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export interface JwtPayload {
  sub: string;            // user id
  name?: string;
  email?: string;
  iat: number;
  exp: number;
  [k: string]: unknown;
}

export async function signJwt(
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  secret: string,
  ttlSeconds = 60 * 60 * 24 * 30, // 30 days
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const full: JwtPayload = { ...payload, iat: now, exp: now + ttlSeconds };
  const header = b64uEncode(TEXT.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = b64uEncode(TEXT.encode(JSON.stringify(full)));
  const data = `${header}.${body}`;
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), TEXT.encode(data));
  return `${data}.${b64uEncode(sig)}`;
}

export async function verifyJwt(token: string, secret: string): Promise<JwtPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, b, s] = parts;
  const data = `${h}.${b}`;
  const ok = await crypto.subtle.verify(
    'HMAC',
    await hmacKey(secret),
    b64uDecode(s),
    TEXT.encode(data),
  );
  if (!ok) return null;
  try {
    const payload = JSON.parse(TEXT_DEC.decode(b64uDecode(b))) as JwtPayload;
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Extract Bearer token from Authorization header and verify it. */
export async function readAuth(
  request: Request,
  secret: string,
): Promise<JwtPayload | null> {
  const h = request.headers.get('Authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  return verifyJwt(m[1], secret);
}

export function jsonError(status: number, error: string): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
