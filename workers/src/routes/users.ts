import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';
import { getUserById } from '../db/queries';
import type { Env } from '../types';

const users = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

users.get('/me', requireAuth, async (c) => {
  const user = await getUserById(c.env.DB, c.get('userId'));
  if (!user) return c.json({ error: 'Not found' }, 404);
  return c.json({ user });
});

users.put('/me', requireAuth, async (c) => {
  const { name, mobile, district, language } = await c.req.json<{
    name?: string; mobile?: string; district?: string; language?: string;
  }>();
  await c.env.DB.prepare(
    'UPDATE users SET name = COALESCE(?, name), mobile = COALESCE(?, mobile), district = COALESCE(?, district), language = COALESCE(?, language), updated_at = unixepoch() WHERE id = ?'
  ).bind(name ?? null, mobile ?? null, district ?? null, language ?? null, c.get('userId')).run();
  return c.json({ ok: true });
});

export default users;
