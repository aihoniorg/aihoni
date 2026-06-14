-- aihoni · initial schema for Cloudflare D1
-- Apply via:  wrangler d1 execute aihoni-db --file=migrations/0001_init.sql --remote

------------------------------------------------------------
-- USERS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  phone       TEXT UNIQUE,
  district    TEXT,
  language    TEXT DEFAULT 'np',
  push_token  TEXT,
  created_at  INTEGER DEFAULT (unixepoch())
);

------------------------------------------------------------
-- BUSINESSES
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS businesses (
  id          TEXT PRIMARY KEY,
  owner_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL,
  district    TEXT,
  lat         REAL,
  lng         REAL,
  phone       TEXT,
  open        INTEGER DEFAULT 1,
  created_at  INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_id);

------------------------------------------------------------
-- WALLETS · points balance per user OR per business
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wallets (
  id           TEXT PRIMARY KEY,           -- 'AIH-2480-SNT'
  owner_id     TEXT NOT NULL,
  owner_type   TEXT NOT NULL CHECK (owner_type IN ('user', 'business')),
  points       INTEGER DEFAULT 0,
  is_default   INTEGER DEFAULT 0,
  created_at   INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_wallets_owner ON wallets(owner_id, owner_type);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id           TEXT PRIMARY KEY,
  wallet_id    TEXT NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  delta        INTEGER NOT NULL,
  reason       TEXT,
  ref          TEXT,
  created_at   INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_wallet ON wallet_transactions(wallet_id);

------------------------------------------------------------
-- THREADS + MESSAGES
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS threads (
  id          TEXT PRIMARY KEY,
  kind        TEXT NOT NULL CHECK (kind IN ('direct', 'group', 'ai', 'business')),
  name        TEXT,
  business_id TEXT REFERENCES businesses(id),
  updated_at  INTEGER DEFAULT (unixepoch()),
  created_at  INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS thread_members (
  thread_id  TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       TEXT DEFAULT 'member',
  muted      INTEGER DEFAULT 0,
  joined_at  INTEGER DEFAULT (unixepoch()),
  PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id           TEXT PRIMARY KEY,
  thread_id    TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  sender_id    TEXT REFERENCES users(id),
  body         TEXT,
  voice_key    TEXT,                       -- R2 object key
  attachments  TEXT,                       -- JSON array of R2 keys
  reactions    TEXT,                       -- JSON map { emoji: count }
  read_at      INTEGER,
  created_at   INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id, created_at DESC);

------------------------------------------------------------
-- KNOWLEDGE · "Teach aihoni" sources per business
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knowledge (
  id            TEXT PRIMARY KEY,
  business_id   TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  kind          TEXT NOT NULL CHECK (kind IN ('photo','voice','file','text','link','scan')),
  source_key    TEXT,                      -- R2 key OR external URL
  title         TEXT,
  summary       TEXT,
  vector_id     TEXT,                      -- → Cloudflare Vectorize
  created_at    INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_knowledge_business ON knowledge(business_id);

------------------------------------------------------------
-- POSTS · what shows up on the Feed
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS posts (
  id           TEXT PRIMARY KEY,
  business_id  TEXT REFERENCES businesses(id) ON DELETE CASCADE,
  caption      TEXT,
  image_keys   TEXT,                       -- JSON array of R2 keys
  ratio        REAL DEFAULT 1.0,
  likes        INTEGER DEFAULT 0,
  created_at   INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_posts_business ON posts(business_id, created_at DESC);

------------------------------------------------------------
-- ORDERS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id            TEXT PRIMARY KEY,
  buyer_id      TEXT NOT NULL REFERENCES users(id),
  business_id   TEXT NOT NULL REFERENCES businesses(id),
  product       TEXT NOT NULL,
  quantity      INTEGER DEFAULT 1,
  price_total   INTEGER NOT NULL,          -- in paisa
  delivery_fee  INTEGER DEFAULT 0,
  status        TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at    INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_business ON orders(business_id, created_at DESC);
