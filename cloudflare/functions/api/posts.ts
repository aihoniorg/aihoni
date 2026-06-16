import { readAuth, jsonError } from '../_lib/auth';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

interface PostRow {
  id: string;
  business_id: string | null;
  caption: string | null;
  image_keys: string | null; // JSON array stored as text
  ratio: number;
  likes: number;
  created_at: number;
}

interface PostBody {
  business_id?: string | null;
  caption?: string;
  image_keys?: string[];
  ratio?: number;
}

function inflate(row: PostRow, origin: string) {
  let keys: string[] = [];
  if (row.image_keys) {
    try { keys = JSON.parse(row.image_keys) as string[]; } catch {}
  }
  return {
    ...row,
    image_keys: keys,
    image_urls: keys.map((k) => `${origin}/api/media/${encodeURIComponent(k)}`),
  };
}

// POST /api/posts — create a feed post.
// If business_id is set, caller must own that business. Otherwise the post is personal.
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const auth = await readAuth(ctx.request, ctx.env.JWT_SECRET);
  if (!auth) return jsonError(401, 'unauthenticated');

  let body: PostBody = {};
  try { body = await ctx.request.json(); } catch {}

  const image_keys = Array.isArray(body.image_keys) ? body.image_keys.filter(Boolean) : [];
  if (image_keys.length === 0 && !body.caption?.trim()) {
    return jsonError(400, 'image_keys or caption required');
  }

  if (body.business_id) {
    const owner = await ctx.env.DB.prepare(
      `SELECT owner_id FROM businesses WHERE id = ?1`,
    ).bind(body.business_id).first<{ owner_id: string }>();
    if (!owner) return jsonError(404, 'business not found');
    if (owner.owner_id !== auth.sub) return jsonError(403, 'not your business');
  }

  const id = crypto.randomUUID();
  await ctx.env.DB.prepare(
    `INSERT INTO posts (id, business_id, caption, image_keys, ratio, likes, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, 0, unixepoch())`,
  ).bind(
    id,
    body.business_id ?? null,
    body.caption ?? null,
    image_keys.length ? JSON.stringify(image_keys) : null,
    body.ratio ?? 1.0,
  ).run();

  const row = await ctx.env.DB.prepare(
    `SELECT id, business_id, caption, image_keys, ratio, likes, created_at
       FROM posts WHERE id = ?1`,
  ).bind(id).first<PostRow>();

  if (!row) return jsonError(500, 'insert failed');
  const origin = new URL(ctx.request.url).origin;
  return new Response(JSON.stringify({ post: inflate(row, origin) }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};

// GET /api/posts — latest 50 posts across the feed.
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const rows = await ctx.env.DB.prepare(
    `SELECT id, business_id, caption, image_keys, ratio, likes, created_at
       FROM posts
      ORDER BY created_at DESC
      LIMIT 50`,
  ).all<PostRow>();

  const origin = new URL(ctx.request.url).origin;
  return new Response(
    JSON.stringify({ posts: (rows.results ?? []).map((r) => inflate(r, origin)) }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
