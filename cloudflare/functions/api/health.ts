// Cloudflare Pages Function — served at https://aihoni.com/api/health
// (and from api.aihoni.com once the custom domain is set up)

interface Env {
  DB?: D1Database;
  CACHE?: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  // probe DB
  let db: 'ok' | string = 'unbound';
  let businessCount = 0;
  try {
    if (ctx.env.DB) {
      const row = await ctx.env.DB.prepare('SELECT COUNT(*) AS n FROM businesses').first<{ n: number }>();
      businessCount = row?.n ?? 0;
      db = 'ok';
    }
  } catch (e) {
    db = `error: ${(e as Error).message}`;
  }

  // probe KV
  let kv: 'ok' | string = 'unbound';
  try {
    if (ctx.env.CACHE) {
      await ctx.env.CACHE.put('healthcheck', new Date().toISOString(), { expirationTtl: 60 });
      kv = 'ok';
    }
  } catch (e) {
    kv = `error: ${(e as Error).message}`;
  }

  return new Response(
    JSON.stringify({
      ok: true,
      service: 'aihoni-api',
      time: new Date().toISOString(),
      cf: {
        colo: ctx.request.cf?.colo,
        country: ctx.request.cf?.country,
      },
      db,
      kv,
      sample: { businesses: businessCount },
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    },
  );
};
