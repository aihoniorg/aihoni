interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
}

// GET /api/businesses → list all businesses with their wallet balance.
// Uses a 60s KV cache layer (KV minimum TTL is 60s).
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  try {
    const cached = await ctx.env.CACHE.get('businesses:list');
    if (cached) {
      return new Response(`{"businesses":${cached},"cached":true}`, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stmt = await ctx.env.DB.prepare(
      `SELECT b.id, b.name, b.type, b.district, w.points
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
