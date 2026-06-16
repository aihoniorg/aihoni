import { readAuth, jsonError } from '../../_lib/auth';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

interface UserRow {
  id: string;
  name: string;
  phone: string | null;
  district: string | null;
  language: string | null;
  avatar_key: string | null;
}

function withAvatarUrl(user: UserRow, origin: string) {
  const { avatar_key, ...rest } = user;
  return {
    ...rest,
    avatar_key,
    avatar_url: avatar_key ? `${origin}/api/media/${encodeURIComponent(avatar_key)}` : null,
  };
}

// GET /api/auth/me — current user + derived avatar URL
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const payload = await readAuth(ctx.request, ctx.env.JWT_SECRET);
  if (!payload) return jsonError(401, 'unauthenticated');

  const user = await ctx.env.DB.prepare(
    `SELECT id, name, phone, district, language, avatar_key
       FROM users WHERE id = ?1`,
  ).bind(payload.sub).first<UserRow>();

  if (!user) return jsonError(404, 'user not found');
  const origin = new URL(ctx.request.url).origin;
  return new Response(JSON.stringify({ user: withAvatarUrl(user, origin) }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

interface PatchBody {
  name?: string;
  district?: string;
  language?: string;
  avatar_key?: string | null;
}

// PATCH /api/auth/me — update current user (name / district / language / avatar_key)
export const onRequestPatch: PagesFunction<Env> = async (ctx) => {
  const payload = await readAuth(ctx.request, ctx.env.JWT_SECRET);
  if (!payload) return jsonError(401, 'unauthenticated');

  let body: PatchBody = {};
  try { body = await ctx.request.json(); } catch {}

  const sets: string[] = [];
  const binds: (string | null)[] = [];
  let i = 1;
  const push = (col: string, val: string | null | undefined) => {
    if (val === undefined) return;
    sets.push(`${col} = ?${++i - 1}`);
    binds.push(val);
  };
  push('name', body.name);
  push('district', body.district);
  push('language', body.language);
  push('avatar_key', body.avatar_key ?? null);

  if (sets.length === 0) return jsonError(400, 'no fields to update');

  binds.push(payload.sub);
  await ctx.env.DB.prepare(
    `UPDATE users SET ${sets.join(', ')} WHERE id = ?${binds.length}`,
  ).bind(...binds).run();

  const user = await ctx.env.DB.prepare(
    `SELECT id, name, phone, district, language, avatar_key
       FROM users WHERE id = ?1`,
  ).bind(payload.sub).first<UserRow>();

  if (!user) return jsonError(404, 'user not found');
  const origin = new URL(ctx.request.url).origin;
  return new Response(JSON.stringify({ user: withAvatarUrl(user, origin) }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
