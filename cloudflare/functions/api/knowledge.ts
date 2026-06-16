import { readAuth, jsonError } from '../_lib/auth';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

interface KnowledgeRow {
  id: string;
  business_id: string;
  kind: string;
  source_key: string | null;
  title: string | null;
  summary: string | null;
  created_at: number;
}

const VALID_KINDS = ['photo', 'voice', 'file', 'text', 'link', 'scan'] as const;
type Kind = (typeof VALID_KINDS)[number];

interface PostBody {
  business_id?: string;
  kind?: string;
  source_key?: string;
  title?: string;
  summary?: string;
}

// POST /api/knowledge — add a knowledge entry to a business owned by the caller.
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const auth = await readAuth(ctx.request, ctx.env.JWT_SECRET);
  if (!auth) return jsonError(401, 'unauthenticated');

  let body: PostBody = {};
  try { body = await ctx.request.json(); } catch {}

  const business_id = (body.business_id ?? '').trim();
  const kind = body.kind as Kind | undefined;
  if (!business_id) return jsonError(400, 'business_id required');
  if (!kind || !VALID_KINDS.includes(kind)) {
    return jsonError(400, `kind must be one of ${VALID_KINDS.join('|')}`);
  }

  // Ownership check — only the business owner can teach.
  const owner = await ctx.env.DB.prepare(
    `SELECT owner_id FROM businesses WHERE id = ?1`,
  ).bind(business_id).first<{ owner_id: string }>();
  if (!owner) return jsonError(404, 'business not found');
  if (owner.owner_id !== auth.sub) return jsonError(403, 'not your business');

  const id = crypto.randomUUID();
  await ctx.env.DB.prepare(
    `INSERT INTO knowledge (id, business_id, kind, source_key, title, summary, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, unixepoch())`,
  ).bind(
    id,
    business_id,
    kind,
    body.source_key ?? null,
    body.title ?? null,
    body.summary ?? null,
  ).run();

  const row = await ctx.env.DB.prepare(
    `SELECT id, business_id, kind, source_key, title, summary, created_at
       FROM knowledge WHERE id = ?1`,
  ).bind(id).first<KnowledgeRow>();

  return new Response(JSON.stringify({ knowledge: row }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};

// GET /api/knowledge?business_id=...
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const auth = await readAuth(ctx.request, ctx.env.JWT_SECRET);
  if (!auth) return jsonError(401, 'unauthenticated');

  const business_id = new URL(ctx.request.url).searchParams.get('business_id');
  if (!business_id) return jsonError(400, 'business_id required');

  const rows = await ctx.env.DB.prepare(
    `SELECT id, business_id, kind, source_key, title, summary, created_at
       FROM knowledge
      WHERE business_id = ?1
      ORDER BY created_at DESC`,
  ).bind(business_id).all<KnowledgeRow>();

  return new Response(JSON.stringify({ knowledge: rows.results }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
