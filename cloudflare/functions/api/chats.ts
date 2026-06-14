interface Env {
  DB: D1Database;
}

// GET /api/chats → inbox: every thread + its latest message
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { results } = await ctx.env.DB.prepare(
    `SELECT t.id, t.kind, t.name,
            m.body AS last_message,
            m.created_at AS last_at,
            (SELECT COUNT(*) FROM messages m2
              WHERE m2.thread_id = t.id AND m2.read_at IS NULL) AS unread
       FROM threads t
       LEFT JOIN messages m ON m.id = (
         SELECT id FROM messages
           WHERE thread_id = t.id
           ORDER BY created_at DESC LIMIT 1
       )
       ORDER BY COALESCE(m.created_at, t.created_at) DESC`,
  ).all();

  return new Response(JSON.stringify({ chats: results }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
