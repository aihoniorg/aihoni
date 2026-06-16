import { readAuth, jsonError } from '../_lib/auth';

interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  JWT_SECRET: string;
}

interface BusinessRow {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  district: string | null;
  phone: string | null;
  logo_key: string | null;
}

function withLogoUrl(b: BusinessRow, origin: string) {
  return {
    ...b,
    logo_url: b.logo_key ? `${origin}/api/media/${encodeURIComponent(b.logo_key)}` : null,
  };
}

// GET /api/businesses           → all businesses (KV-cached 60s)
// GET /api/businesses?mine=1    → only the caller's businesses (auth required, no cache)
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  try {
    const mine = new URL(ctx.request.url).searchParams.get('mine') === '1';
    const origin = new URL(ctx.request.url).origin;

    if (mine) {
      const auth = await readAuth(ctx.request, ctx.env.JWT_SECRET);
      if (!auth) return jsonError(401, 'unauthenticated');
      const stmt = await ctx.env.DB.prepare(
        `SELECT id, owner_id, name, type, district, phone, logo_key
           FROM businesses
          WHERE owner_id = ?1
          ORDER BY created_at DESC`,
      ).bind(auth.sub).all<BusinessRow>();
      const businesses = (stmt.results ?? []).map((b) => withLogoUrl(b, origin));
      return new Response(JSON.stringify({ businesses }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cached = await ctx.env.CACHE.get('businesses:list');
    if (cached) {
      return new Response(`{"businesses":${cached},"cached":true}`, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stmt = await ctx.env.DB.prepare(
      `SELECT b.id, b.name, b.type, b.district, b.logo_key, w.points
         FROM businesses b
         LEFT JOIN wallets w ON w.owner_id = b.id AND w.owner_type = 'business'
         ORDER BY b.name`,
    ).all();

    const json = JSON.stringify(stmt.results);
    ctx.waitUntil(ctx.env.CACHE.put('businesses:list', json, { expirationTtl: 60 }));

    return new Response(`{"businesses":${json},"cached":false}`, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message, stack: (e as Error).stack }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

interface PostBody {
  name?: string;
  type?: string;
  district?: string;
  phone?: string;
  logo_key?: string | null;
}

// POST /api/businesses — create a new business owned by the signed-in user.
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const auth = await readAuth(ctx.request, ctx.env.JWT_SECRET);
  if (!auth) return jsonError(401, 'unauthenticated');

  let body: PostBody = {};
  try { body = await ctx.request.json(); } catch {}

  const name = (body.name ?? '').trim();
  const type = (body.type ?? '').trim();
  if (!name) return jsonError(400, 'name required');
  if (!type) return jsonError(400, 'type required');

  const id = crypto.randomUUID();
  await ctx.env.DB.prepare(
    `INSERT INTO businesses (id, owner_id, name, type, district, phone, logo_key, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, unixepoch())`,
  ).bind(
    id,
    auth.sub,
    name,
    type,
    body.district ?? null,
    body.phone ?? null,
    body.logo_key ?? null,
  ).run();

  // Bust the list cache so the new row appears immediately.
  ctx.waitUntil(ctx.env.CACHE.delete('businesses:list'));

  const row = await ctx.env.DB.prepare(
    `SELECT id, owner_id, name, type, district, phone, logo_key FROM businesses WHERE id = ?1`,
  ).bind(id).first<BusinessRow>();

  if (!row) return jsonError(500, 'insert failed');
  const origin = new URL(ctx.request.url).origin;
  return new Response(JSON.stringify({ business: withLogoUrl(row, origin) }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
