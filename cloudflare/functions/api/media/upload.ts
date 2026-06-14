import { readAuth, jsonError } from '../../_lib/auth';

interface Env {
  MEDIA: R2Bucket;
  JWT_SECRET: string;
}

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB cap
const ALLOWED_PREFIX = ['image/', 'audio/', 'video/', 'application/pdf'];

// POST /api/media/upload
// Headers: Authorization: Bearer <jwt>, Content-Type: <real mime type>
// Body:    raw bytes
// Returns: { key, size, contentType, url }
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const auth = await readAuth(ctx.request, ctx.env.JWT_SECRET);
  if (!auth) return jsonError(401, 'unauthenticated');

  const contentType = ctx.request.headers.get('content-type') || 'application/octet-stream';
  if (!ALLOWED_PREFIX.some((p) => contentType.startsWith(p))) {
    return jsonError(415, `unsupported content-type: ${contentType}`);
  }

  const body = await ctx.request.arrayBuffer();
  if (body.byteLength === 0) return jsonError(400, 'empty body');
  if (body.byteLength > MAX_BYTES) return jsonError(413, `max ${MAX_BYTES} bytes`);

  // Keyspace: media/<userId>/<timestamp>-<random>.<ext>
  const ext = contentType.split('/')[1]?.split(';')[0] || 'bin';
  const rand = crypto.randomUUID().slice(0, 8);
  const key = `media/${auth.sub}/${Date.now()}-${rand}.${ext}`;

  await ctx.env.MEDIA.put(key, body, {
    httpMetadata: { contentType },
    customMetadata: { uploadedBy: auth.sub, uploadedAt: String(Date.now()) },
  });

  const url = new URL(ctx.request.url);
  return new Response(
    JSON.stringify({
      key,
      size: body.byteLength,
      contentType,
      url: `${url.origin}/api/media/${encodeURIComponent(key)}`,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
