-- ============================================================
-- aihoni · Cloudflare D1 Schema
-- ============================================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,          -- nanoid / uuid
  google_id   TEXT UNIQUE NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  mobile      TEXT,
  district    TEXT,
  language    TEXT NOT NULL DEFAULT 'ne', -- 'ne' | 'en'
  avatar_url  TEXT,                       -- R2 key or Google photo URL
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

-- SESSIONS (server-side, stored as signed JWT secret in Workers env)
-- Use Cloudflare Workers KV for session tokens (see section 4.1)

-- BUSINESSES
CREATE TABLE IF NOT EXISTS businesses (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  type         TEXT NOT NULL,            -- 'grocery' | 'clothing' | 'restaurant' etc.
  phone        TEXT,
  location_name TEXT,
  lat          REAL,
  lng          REAL,
  description  TEXT,                     -- what they sell
  handle       TEXT UNIQUE,              -- @shresthakirana
  avatar_r2    TEXT,                     -- R2 key for logo image
  is_active    INTEGER NOT NULL DEFAULT 1,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at   INTEGER NOT NULL DEFAULT (unixepoch())
);

-- BUSINESS CONNECTIONS (POS, social media, SMS, payments)
CREATE TABLE IF NOT EXISTS business_connections (
  id           TEXT PRIMARY KEY,
  business_id  TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  service      TEXT NOT NULL,            -- 'sms_golive' | 'sms_sparrow' | 'esewa' | 'khalti' | 'facebook' | 'instagram' | 'tiktok'
  config       TEXT NOT NULL DEFAULT '{}', -- JSON: api_key, account_id etc (encrypted at rest)
  is_active    INTEGER NOT NULL DEFAULT 0,
  connected_at INTEGER,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch())
);

-- USER TOOL CONNECTIONS (Google Drive, Gmail, Calendar, etc.)
CREATE TABLE IF NOT EXISTS user_tool_connections (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool          TEXT NOT NULL,           -- 'google_drive' | 'gmail' | 'calendar' | 'contacts' | 'photos' | 'whatsapp'
  access_token  TEXT,                    -- encrypted
  refresh_token TEXT,                    -- encrypted
  scopes        TEXT,
  connected_at  INTEGER,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(user_id, tool)
);

-- KNOWLEDGE SOURCES (business AI training)
CREATE TABLE IF NOT EXISTS knowledge_sources (
  id          TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,             -- 'file' | 'url' | 'text' | 'drive' | 'sheet'
  source_ref  TEXT NOT NULL,             -- R2 key, URL, or drive file ID
  label       TEXT,
  status      TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'indexed' | 'error'
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

-- WALLETS
CREATE TABLE IF NOT EXISTS wallets (
  id          TEXT PRIMARY KEY,
  owner_type  TEXT NOT NULL,             -- 'user' | 'business'
  owner_id    TEXT NOT NULL,             -- user.id or business.id
  wallet_code TEXT UNIQUE NOT NULL,      -- AIH-XXXX-XXX
  points      INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

-- WALLET TRANSACTIONS
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id          TEXT PRIMARY KEY,
  wallet_id   TEXT NOT NULL REFERENCES wallets(id),
  delta       INTEGER NOT NULL,          -- +/- points
  source      TEXT NOT NULL,             -- 'esewa' | 'khalti' | 'ime' | 'ai_usage' | 'promo'
  ref         TEXT,                      -- payment ref / transaction ID
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

-- POSTS (Feed)
CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  caption     TEXT,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

-- POST IMAGES
CREATE TABLE IF NOT EXISTS post_images (
  id       TEXT PRIMARY KEY,
  post_id  TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  r2_key   TEXT NOT NULL,               -- R2 object key
  position INTEGER NOT NULL DEFAULT 0,  -- sort order
  ratio    TEXT NOT NULL DEFAULT '4/5'  -- aspect ratio hint
);

-- LIKES
CREATE TABLE IF NOT EXISTS likes (
  id         TEXT PRIMARY KEY,
  post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(post_id, user_id)
);

-- SAVES
CREATE TABLE IF NOT EXISTS saves (
  id         TEXT PRIMARY KEY,
  post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(post_id, user_id)
);

-- FOLLOWS (user follows a business page)
CREATE TABLE IF NOT EXISTS follows (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(user_id, business_id)
);

-- STORIES
CREATE TABLE IF NOT EXISTS stories (
  id          TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  r2_key      TEXT NOT NULL,
  expires_at  INTEGER NOT NULL,          -- unix: now + 24h
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

-- STORY HIGHLIGHTS
CREATE TABLE IF NOT EXISTS story_highlights (
  id          TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#3B76EF',
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

-- HIGHLIGHT STORIES (junction)
CREATE TABLE IF NOT EXISTS highlight_stories (
  highlight_id TEXT NOT NULL REFERENCES story_highlights(id) ON DELETE CASCADE,
  story_id     TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  PRIMARY KEY (highlight_id, story_id)
);

-- REELS
CREATE TABLE IF NOT EXISTS reels (
  id          TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  r2_key      TEXT NOT NULL,             -- R2 video key
  thumb_r2    TEXT,                      -- thumbnail
  caption     TEXT,
  product_id  TEXT REFERENCES products(id),
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id          TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  name_np     TEXT,
  price       INTEGER NOT NULL,          -- in NPR paisa
  original_price INTEGER,
  description TEXT,
  image_r2    TEXT,
  in_stock    INTEGER NOT NULL DEFAULT 1,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES users(id),
  business_id     TEXT NOT NULL REFERENCES businesses(id),
  product_id      TEXT REFERENCES products(id),
  product_name    TEXT NOT NULL,
  quantity        INTEGER NOT NULL DEFAULT 1,
  unit_price      INTEGER NOT NULL,      -- NPR paisa
  delivery_fee    INTEGER NOT NULL DEFAULT 0,
  total_price     INTEGER NOT NULL,
  delivery_address TEXT,
  status          TEXT NOT NULL DEFAULT 'pending', -- 'pending'|'confirmed'|'delivered'|'cancelled'
  payment_method  TEXT,                  -- 'esewa'|'khalti'|'cod'
  payment_ref     TEXT,
  created_at      INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at      INTEGER NOT NULL DEFAULT (unixepoch())
);

-- CONVERSATIONS
CREATE TABLE IF NOT EXISTS conversations (
  id         TEXT PRIMARY KEY,
  type       TEXT NOT NULL,              -- 'direct' | 'group' | 'ai'
  name       TEXT,                       -- for groups
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- CONVERSATION MEMBERS
CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at       INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (conversation_id, user_id)
);

-- MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id              TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       TEXT NOT NULL REFERENCES users(id),
  content         TEXT,
  type            TEXT NOT NULL DEFAULT 'text', -- 'text'|'image'|'file'|'voice'|'order_card'
  r2_key          TEXT,                  -- for image/file/voice types
  file_name       TEXT,
  file_size       INTEGER,
  metadata        TEXT DEFAULT '{}',     -- JSON for order_card etc.
  is_read         INTEGER NOT NULL DEFAULT 0,
  created_at      INTEGER NOT NULL DEFAULT (unixepoch())
);

-- AI CHAT MESSAGES (aihoni conversations, stored separately for context)
CREATE TABLE IF NOT EXISTS ai_messages (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_id TEXT REFERENCES businesses(id), -- context business
  role        TEXT NOT NULL,             -- 'user' | 'assistant'
  content     TEXT NOT NULL,
  points_used INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_businesses_user ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_business ON posts(business_id);
CREATE INDEX IF NOT EXISTS idx_post_images_post ON post_images(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_post ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_follows_business ON follows(business_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_business ON orders(business_id);
CREATE INDEX IF NOT EXISTS idx_reels_business ON reels(business_id);
CREATE INDEX IF NOT EXISTS idx_products_business ON products(business_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_user ON ai_messages(user_id, created_at);
