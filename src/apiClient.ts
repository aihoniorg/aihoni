import * as SecureStore from 'expo-secure-store';

export const API_BASE = 'https://aihoni.com';

const TOKEN_KEY = 'aihoni.session.jwt';

let cachedToken: string | null | undefined; // undefined = unloaded, null = none

async function loadToken(): Promise<string | null> {
  if (cachedToken !== undefined) return cachedToken;
  cachedToken = (await SecureStore.getItemAsync(TOKEN_KEY)) ?? null;
  return cachedToken;
}

export async function setSessionToken(token: string | null): Promise<void> {
  cachedToken = token;
  if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export function getCachedToken(): string | null {
  return cachedToken ?? null;
}

export class ApiError extends Error {
  constructor(public status: number, public body: unknown, message: string) {
    super(message);
  }
}

interface RequestOpts<TBody> {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: TBody;
  /** If true, do not attach Authorization header even if a token exists. */
  noAuth?: boolean;
  /** Override base URL (defaults to API_BASE). */
  base?: string;
}

/**
 * Typed JSON fetch wrapper. Attaches `Authorization: Bearer <jwt>` automatically
 * when a session token is present.
 */
export async function api<TResp = unknown, TBody = unknown>(
  path: string,
  opts: RequestOpts<TBody> = {},
): Promise<TResp> {
  const url = `${opts.base ?? API_BASE}${path}`;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';

  if (!opts.noAuth) {
    const tok = await loadToken();
    if (tok) headers.Authorization = `Bearer ${tok}`;
  }

  const res = await fetch(url, {
    method: opts.method ?? (opts.body !== undefined ? 'POST' : 'GET'),
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    throw new ApiError(
      res.status,
      payload,
      (typeof payload === 'object' && payload && 'error' in payload ? String((payload as { error: unknown }).error) : `HTTP ${res.status}`),
    );
  }
  return payload as TResp;
}
