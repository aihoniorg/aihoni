interface GoogleJwk {
  kid: string;
  kty: 'RSA';
  use: 'sig';
  alg: 'RS256';
  n: string;
  e: string;
}

const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_ISSUERS = new Set(['accounts.google.com', 'https://accounts.google.com']);
const CLOCK_SKEW_S = 60;

let cachedKeys: { keys: GoogleJwk[]; expiresAt: number } | null = null;

async function fetchGoogleKeys(): Promise<GoogleJwk[]> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedKeys && cachedKeys.expiresAt > now) return cachedKeys.keys;
  const res = await fetch(GOOGLE_JWKS_URL);
  if (!res.ok) throw new Error(`JWKS fetch failed: ${res.status}`);
  const maxAge = parseInt((res.headers.get('cache-control') ?? '').match(/max-age=(\d+)/)?.[1] ?? '3600', 10);
  const body = await res.json<{ keys: GoogleJwk[] }>();
  cachedKeys = { keys: body.keys, expiresAt: now + maxAge };
  return body.keys;
}

function b64urlDecode(s: string): Uint8Array {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const bin = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'));
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function b64urlDecodeJson<T>(s: string): T {
  return JSON.parse(new TextDecoder().decode(b64urlDecode(s)));
}

export interface GoogleIdTokenPayload {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
}

export async function verifyGoogleIdToken(idToken: string, clientId: string): Promise<GoogleIdTokenPayload> {
  const parts = idToken.split('.');
  if (parts.length !== 3) throw new Error('Malformed ID token');
  const [headerB64, payloadB64, sigB64] = parts;

  const header = b64urlDecodeJson<{ alg: string; kid: string }>(headerB64);
  if (header.alg !== 'RS256') throw new Error(`Unsupported alg: ${header.alg}`);

  const jwk = (await fetchGoogleKeys()).find(k => k.kid === header.kid);
  if (!jwk) throw new Error(`Unknown signing key: ${header.kid}`);

  const key = await crypto.subtle.importKey(
    'jwk',
    jwk as JsonWebKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    b64urlDecode(sigB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`),
  );
  if (!ok) throw new Error('Invalid ID token signature');

  const payload = b64urlDecodeJson<GoogleIdTokenPayload>(payloadB64);
  const now = Math.floor(Date.now() / 1000);
  if (!GOOGLE_ISSUERS.has(payload.iss)) throw new Error(`Invalid issuer: ${payload.iss}`);
  if (payload.aud !== clientId) throw new Error('Invalid audience');
  if (payload.exp + CLOCK_SKEW_S < now) throw new Error('ID token expired');
  if (payload.iat - CLOCK_SKEW_S > now) throw new Error('ID token used before issued');
  if (!payload.sub || !payload.email) throw new Error('Missing required claims');

  return payload;
}
