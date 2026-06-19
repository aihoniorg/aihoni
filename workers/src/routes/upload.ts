import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';
import type { Env } from '../types';

const upload = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

const ALLOWED_CONTEXTS = ['post', 'reel', 'product', 'avatar', 'story', 'message'] as const;
type UploadContext = typeof ALLOWED_CONTEXTS[number];
const CDN_BASE = 'https://media.aihoni.com';

function isValidContext(s: unknown): s is UploadContext {
  return typeof s === 'string' && (ALLOWED_CONTEXTS as readonly string[]).includes(s);
}

function sanitizeFilename(name: unknown): string | null {
  if (typeof name !== 'string') return null;
  const base = name.split(/[/\\]/).pop() ?? '';
  const cleaned = base.replace(/[^A-Za-z0-9._-]/g, '_').replace(/^\.+/, '');
  if (!cleaned || cleaned.length > 100) return null;
  return cleaned;
}

upload.post('/presign', requireAuth, async (c) => {
  const body = await c.req.json<{ filename: string; contentType: string; context: string }>();
  if (!isValidContext(body.context)) return c.json({ error: 'Invalid context' }, 400);
  const filename = sanitizeFilename(body.filename);
  if (!filename) return c.json({ error: 'Invalid filename' }, 400);

  const userId = c.get('userId');
  const key = `${body.context}/${userId}/${Date.now()}-${filename}`;

  const url = await c.env.STORAGE.createMultipartUpload(key);
  return c.json({ key, uploadUrl: url });
});

upload.post('/confirm', requireAuth, async (c) => {
  const { key } = await c.req.json<{ key: string }>();
  if (typeof key !== 'string') return c.json({ error: 'Invalid key' }, 400);

  const userId = c.get('userId');
  const parts = key.split('/');
  if (parts.length < 3 || !isValidContext(parts[0]) || parts[1] !== userId) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const obj = await c.env.STORAGE.head(key);
  if (!obj) return c.json({ error: 'Upload not found' }, 404);

  return c.json({ url: `${CDN_BASE}/${key}`, key });
});

export default upload;
