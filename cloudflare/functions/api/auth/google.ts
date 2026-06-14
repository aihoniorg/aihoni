import { signJwt, jsonError } from '../../_lib/auth';
import { verifyGoogleIdToken } from '../../_lib/google';

interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  JWT_SECRET: string;
  GOOGLE_CLIENT_IDS: string; // comma-separated list of allowed OAuth client IDs
}

interface Body {
  id_token?: string;
}

// POST /api/auth/google
// Body: { id_token: "<Google ID token from app>" }
// Returns: { token: "<our JWT>", user: { id, name, email } }
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: Body = {};
  try { body = await ctx.request.json(); } catch {}
  if (!body.id_token) return jsonError(400, 'id_token required');

  const allowed = (ctx.env.GOOGLE_CLIENT_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (allowed.length === 0) return jsonError(500, 'GOOGLE_CLIENT_IDS not configured');

  // Try each allowed audience (web, ios, android client IDs)
  let payload = null;
  for (const aud of allowed) {
    payload = await verifyGoogleIdToken(body.id_token, aud, ctx.env.CACHE);
    if (payload) break;
  }
  if (!payload) return jsonError(401, 'invalid Google token');

  // Upsert user keyed by Google sub (stable, unique per Google account)
  const userId = `g_${payload.sub}`;
  await ctx.env.DB.prepare(
    `INSERT INTO users (id, name, phone, district, language, push_token, created_at)
       VALUES (?1, ?2, NULL, NULL, 'np', NULL, unixepoch())
       ON CONFLICT(id) DO UPDATE SET name = excluded.name`,
  ).bind(userId, payload.name ?? payload.email ?? 'aihoni user').run();

  // Issue our own JWT
  const token = await signJwt(
    { sub: userId, name: payload.name, email: payload.email },
    ctx.env.JWT_SECRET,
  );

  return new Response(
    JSON.stringify({
      token,
      user: { id: userId, name: payload.name, email: payload.email, picture: payload.picture },
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
