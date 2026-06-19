import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { signJwt } from '../lib/jwt';
import { upsertUser } from '../db/queries';
import { requireAuth } from '../middleware/auth';
import type { Env } from '../types';

const auth = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

auth.get('/google', (c) => {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', c.env.GOOGLE_CLIENT_ID);
  url.searchParams.set('redirect_uri', `${c.env.APP_URL}/api/auth/callback`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', crypto.randomUUID()); // add CSRF check
  return c.redirect(url.toString());
});

auth.get('/callback', async (c) => {
  const code = c.req.query('code');
  if (!code) return c.json({ error: 'No code' }, 400);

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: c.env.GOOGLE_CLIENT_ID,
      client_secret: c.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${c.env.APP_URL}/api/auth/callback`,
      grant_type: 'authorization_code',
    }),
  });
  const tokens = await tokenRes.json<{ id_token: string }>();

  // Decode Google ID token (verify in production)
  const payload = JSON.parse(atob(tokens.id_token.split('.')[1]));
  const user = await upsertUser(c.env.DB, {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    avatarUrl: payload.picture,
  });

  // Create session JWT (7 days)
  const jwt = await signJwt({ sub: user.id }, c.env.JWT_SECRET, '7d');

  setCookie(c, 'ah_session', jwt, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  // Redirect to onboarding (personal step if new, chats if returning)
  const redirect = user.isNew ? '/personal' : '/chats';
  return c.redirect(redirect);
});

auth.get('/me', requireAuth, async (c) => {
  const userId = c.get('userId');
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
  if (!user) return c.json({ error: 'Not found' }, 404);
  return c.json({ user });
});

auth.post('/logout', (c) => {
  setCookie(c, 'ah_session', '', { maxAge: 0, path: '/' });
  return c.json({ ok: true });
});

export default auth;
