-- aihoni · add media keys to users + businesses
-- Apply via:  wrangler d1 execute aihoni-db --file=migrations/0002_persist_media.sql --remote

ALTER TABLE users      ADD COLUMN avatar_key TEXT;
ALTER TABLE businesses ADD COLUMN logo_key   TEXT;
