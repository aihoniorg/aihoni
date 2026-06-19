import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';
import type { Env } from '../types';

const upload = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

// Step 1: Get a presigned PUT URL (max 10 MB)
upload.post('/presign', requireAuth, async (c) => {
  const { filename, contentType, context } = await c.req.json<{
    filename: string;
    contentType: string;
    context: 'post' | 'reel' | 'product' | 'avatar' | 'story' | 'message';
  }>();

  const userId = c.get('userId');
  const key = `${context}/${userId}/${Date.now()}-${filename}`;

  // Generate presigned URL for direct browser → R2 upload
  const url = await c.env.STORAGE.createMultipartUpload(key);
  // OR use a simple signed URL pattern via Worker URL signing

  return c.json({ key, uploadUrl: url });
});

// Step 2: Confirm upload and get CDN URL
upload.post('/confirm', requireAuth, async (c) => {
  const { key } = await c.req.json<{ key: string }>();
  // Verify the object exists in R2
  const obj = await c.env.STORAGE.head(key);
  if (!obj) return c.json({ error: 'Upload not found' }, 404);

  const cdnUrl = `https://media.aihoni.app/${key}`;
  return c.json({ url: cdnUrl, key });
});

export default upload;
