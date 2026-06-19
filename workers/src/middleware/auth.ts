import type { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifyJwt } from '../lib/jwt';
import type { Env } from '../types';

export async function requireAuth(c: Context<{ Bindings: Env; Variables: { userId: string } }>, next: Next) {
  const token = getCookie(c, 'ah_session');
  if (!token) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const payload = await verifyJwt(token, c.env.JWT_SECRET);
    c.set('userId', payload.sub);
    await next();
  } catch {
    return c.json({ error: 'Invalid session' }, 401);
  }
}
