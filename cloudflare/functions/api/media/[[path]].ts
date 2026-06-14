interface Env {
  MEDIA: R2Bucket;
}

// GET /api/media/<key>  →  streams the R2 object back, with 1-day edge cache
// Catch-all so keys with slashes (e.g. "media/abc/123.jpg") work.
export const onRequestGet: PagesFunction<Env, 'path'> = async (ctx) => {
  const parts = ctx.params.path as string[] | string | undefined;
  const key = Array.isArray(parts) ? parts.join('/') : parts;
  if (!key) return new Response('not found', { status: 404 });

  // Skip the /upload subroute (handled by upload.ts).
  if (key === 'upload') return new Response('use POST', { status: 405 });

  const obj = await ctx.env.MEDIA.get(key);
  if (!obj) return new Response('not found', { status: 404 });

  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=86400',
      ETag: obj.httpEtag,
    },
  });
};
