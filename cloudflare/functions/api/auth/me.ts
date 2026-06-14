import { readAuth, jsonError } from '../../_lib/auth';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

// GET /api/auth/me
// Headers: Authorization: Bearer <our JWT>
// Returns: { user: { id, name, phone, district, language } } or 401
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const payload = await readAuth(ctx.request, ctx.env.JWT_SECRET);
  if (!payload) return jsonError(401, 'unauthenticated');

  const user = await ctx.env.DB.prepare(
    `SELECT id, name, phone, district, language FROM users WHERE id = ?1`,
  ).bind(payload.sub).first();

  if (!user) return jsonError(404, 'user not found');
  return new Response(JSON.stringify({ user }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
