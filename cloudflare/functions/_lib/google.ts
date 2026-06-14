// Verify a Google-issued ID token (RS256 + JWKS).
// Cached in KV so we don't refetch Google's public keys on every login.
// Spec: https://developers.google.com/identity/sign-in/web/backend-auth

const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_ISS = ['https://accounts.google.com', 'accounts.google.com'];

interface Jwk {
  kid: string;
  kty: string;
  n: string;
  e: string;
  alg?: string;
  use?: string;
}

export interface GoogleIdToken {
  iss: string;
  aud: string;
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  iat: number;
  exp: number;
}

const TEXT = new TextEncoder();

function b64uDecode(s: string): Uint8Array {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function fetchKeys(cache?: KVNamespace): Promise<Jwk[]> {
  if (cache) {
    const cached = await cache.get<{ keys: Jwk[] }>('google:jwks', 'json');
    if (cached?.keys) return cached.keys;
  }
  const res = await fetch(GOOGLE_JWKS_URL);
  if (!res.ok) throw new Error(`google jwks fetch failed: ${res.status}`);
  const json = await res.json<{ keys: Jwk[] }>();
  if (cache) {
    await cache.put('google:jwks', JSON.stringify(json), { expirationTtl: 3600 });
  }
  return json.keys;
}

async function importRsaKey(jwk: Jwk): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'jwk',
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: jwk.alg ?? 'RS256', ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
}

/**
 * Verify a Google ID token. Returns the decoded payload on success, null on failure.
 *
 * @param token  The id_token string from Google
 * @param aud    The OAuth client_id that issued the token (must match aud claim)
 * @param cache  Optional KV namespace to cache Google's public keys
 */
export async function verifyGoogleIdToken(
  token: string,
  aud: string,
  cache?: KVNamespace,
): Promise<GoogleIdToken | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h64, p64, s64] = parts;

  let header: { kid?: string; alg?: string };
  try {
    header = JSON.parse(new TextDecoder().decode(b64uDecode(h64)));
  } catch {
    return null;
  }
  if (header.alg !== 'RS256' || !header.kid) return null;

  const keys = await fetchKeys(cache);
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) return null;
  const cryptoKey = await importRsaKey(jwk);

  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    b64uDecode(s64),
    TEXT.encode(`${h64}.${p64}`),
  );
  if (!ok) return null;

  let payload: GoogleIdToken;
  try {
    payload = JSON.parse(new TextDecoder().decode(b64uDecode(p64)));
  } catch {
    return null;
  }

  if (!GOOGLE_ISS.includes(payload.iss)) return null;
  if (payload.aud !== aud) return null;
  if (payload.exp * 1000 < Date.now()) return null;
  if (payload.email && payload.email_verified === false) return null;

  return payload;
}
