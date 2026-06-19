import { nanoid } from '../lib/nanoid';
import type { Env } from '../types';

export async function upsertUser(db: Env['DB'], data: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}): Promise<{ id: string; isNew: boolean }> {
  const existing = await db.prepare(
    'SELECT id FROM users WHERE google_id = ?'
  ).bind(data.googleId).first<{ id: string }>();

  if (existing) return { id: existing.id, isNew: false };

  const id = nanoid();
  await db.prepare(
    'INSERT INTO users (id, google_id, email, name, avatar_url) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, data.googleId, data.email, data.name, data.avatarUrl ?? null).run();

  return { id, isNew: true };
}

export async function getUserById(db: Env['DB'], id: string) {
  return db.prepare('SELECT id, email, name, mobile, district, language, avatar_url, created_at FROM users WHERE id = ?')
    .bind(id).first();
}
