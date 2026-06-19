import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';
import { nanoid } from '../lib/nanoid';
import type { Env } from '../types';

const businesses = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

businesses.get('/', requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    'SELECT * FROM businesses WHERE user_id = ? ORDER BY created_at DESC'
  ).bind(c.get('userId')).all();
  return c.json({ businesses: rows.results });
});

businesses.post('/', requireAuth, async (c) => {
  const { name, type, phone, locationName, lat, lng, description } = await c.req.json<{
    name: string; type: string; phone?: string; locationName?: string;
    lat?: number; lng?: number; description?: string;
  }>();
  const id = nanoid();
  const handle = name.toLowerCase().replace(/\s+/g, '').slice(0, 20) + id.slice(0, 4);
  await c.env.DB.prepare(
    'INSERT INTO businesses (id, user_id, name, type, phone, location_name, lat, lng, description, handle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, c.get('userId'), name, type, phone ?? null, locationName ?? null, lat ?? null, lng ?? null, description ?? null, handle).run();
  return c.json({ id }, 201);
});

businesses.get('/:id', requireAuth, async (c) => {
  const biz = await c.env.DB.prepare('SELECT * FROM businesses WHERE id = ?').bind(c.req.param('id')).first();
  if (!biz) return c.json({ error: 'Not found' }, 404);
  return c.json({ business: biz });
});

businesses.put('/:id', requireAuth, async (c) => {
  const biz = await c.env.DB.prepare('SELECT user_id FROM businesses WHERE id = ?').bind(c.req.param('id')).first<{ user_id: string }>();
  if (!biz || biz.user_id !== c.get('userId')) return c.json({ error: 'Forbidden' }, 403);
  const { name, phone, locationName, lat, lng, description } = await c.req.json<Record<string, unknown>>();
  await c.env.DB.prepare(
    'UPDATE businesses SET name = COALESCE(?, name), phone = COALESCE(?, phone), location_name = COALESCE(?, location_name), lat = COALESCE(?, lat), lng = COALESCE(?, lng), description = COALESCE(?, description), updated_at = unixepoch() WHERE id = ?'
  ).bind(name ?? null, phone ?? null, locationName ?? null, lat ?? null, lng ?? null, description ?? null, c.req.param('id')).run();
  return c.json({ ok: true });
});

export default businesses;
