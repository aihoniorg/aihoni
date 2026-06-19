-- aihoni · extended schema — social, commerce, and AI features
-- Apply via:  wrangler d1 execute aihoni-db --file=migrations/0003_extended_schema.sql --remote
-- NOTE: Tables users, businesses, wallets, wallet_transactions, threads,
--       thread_members, messages, knowledge, posts, orders already exist from
--       migrations 0001 + 0002. This migration adds missing columns and NEW tables.

------------------------------------------------------------
-- PATCH EXISTING TABLES
------------------------------------------------------------

-- Users: add Google OAuth fields + email + updated_at
ALTER TABLE users ADD COLUMN google_id TEXT;
ALTER TABLE users ADD COLUMN email     TEXT;
ALTER TABLE users ADD COLUMN updated_at INTEGER DEFAULT (unixepoch());
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email     ON users(email);

-- Businesses: add social handle, full description, active flag, updated_at
ALTER TABLE businesses ADD COLUMN description TEXT;
ALTER TABLE businesses ADD COLUMN handle      TEXT;
ALTER TABLE businesses ADD COLUMN is_active   INTEGER DEFAULT 1;
ALTER TABLE businesses ADD COLUMN updated_at  INTEGER DEFAULT (unixepoch());
CREATE UNIQUE INDEX IF NOT EXISTS idx_businesses_handle ON businesses(handle);

------------------------------------------------------------
-- BUSINESS CONNECTIONS (POS, payments, social media)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS business_connections (
  id           TEXT PRIMARY KEY,
  business_id  TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  service      TEXT NOT NULL, -- 'sms_golive'|'sms_sparrow'|'esewa'|'khalti'|'facebook'|'instagram'|'tiktok'
  config       TEXT NOT NULL DEFAULT '{}', -- JSON: api_key, account_id etc.
  is_active    INTEGER NOT NULL DEFAULT 0,
  connected_at INTEGER,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_biz_connections_biz ON business_connections(business_id);

------------------------------------------------------------
-- USER TOOL CONNECTIONS (Google Drive, Gmail, Calendar…)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_tool_connections (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool          TEXT NOT NULL, -- 'google_drive'|'gmail'|'calendar'|'contacts'|'photos'|'whatsapp'
  access_token  TEXT,          -- encrypted
  refresh_token TEXT,          -- encrypted
  scopes        TEXT,
  connected_at  INTEGER,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(user_id, tool)
);

------------------------------------------------------------
-- LIKES (users like a post)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS likes (
  id         TEXT PRIMARY KEY,
  post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(post_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_likes_post ON likes(post_id);

------------------------------------------------------------
-- SAVES (users bookmark a post)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saves (
  id         TEXT PRIMARY KEY,
  post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(post_id, user_id)
);

------------------------------------------------------------
-- FOLLOWS (user follows a business page)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS follows (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(user_id, business_id)
);
CREATE INDEX IF NOT EXISTS idx_follows_business ON follows(business_id);

------------------------------------------------------------
-- STORIES (24-hour ephemeral media)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stories (
  id          TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  r2_key      TEXT NOT NULL,
  expires_at  INTEGER NOT NULL, -- unixepoch() + 86400
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_stories_business ON stories(business_id, expires_at);

------------------------------------------------------------
-- STORY HIGHLIGHTS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS story_highlights (
  id          TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#3B76EF',
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS highlight_stories (
  highlight_id TEXT NOT NULL REFERENCES story_highlights(id) ON DELETE CASCADE,
  story_id     TEXT NOT NULL REFERENCES stories(id)          ON DELETE CASCADE,
  PRIMARY KEY (highlight_id, story_id)
);

------------------------------------------------------------
-- PRODUCTS (business catalogue)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id             TEXT PRIMARY KEY,
  business_id    TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  name_np        TEXT,
  price          INTEGER NOT NULL, -- NPR paisa
  original_price INTEGER,
  description    TEXT,
  image_r2       TEXT,
  in_stock       INTEGER NOT NULL DEFAULT 1,
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at     INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_products_business ON products(business_id);

------------------------------------------------------------
-- REELS (short video linked to a product)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reels (
  id          TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  r2_key      TEXT NOT NULL,  -- R2 video key
  thumb_r2    TEXT,
  caption     TEXT,
  product_id  TEXT REFERENCES products(id),
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_reels_business ON reels(business_id);

------------------------------------------------------------
-- AI MESSAGES (aihoni AI chat history, separate from human threads)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_messages (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_id TEXT REFERENCES businesses(id),  -- context business for this turn
  role        TEXT NOT NULL,                   -- 'user' | 'assistant'
  content     TEXT NOT NULL,
  points_used INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_ai_messages_user ON ai_messages(user_id, created_at);
