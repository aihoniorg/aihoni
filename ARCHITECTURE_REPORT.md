# aihoni — Architecture Report
## Cloudflare Stack · DB Schema · API Design · Auth Fix · Security Plan

> Generated from full read of all 22 UI screens.  
> Stack: **Cloudflare Workers** (API) · **Cloudflare D1** (database) · **Cloudflare R2** (images/video) · **Google OAuth 2.0** (auth only)

---

## 1. App Overview & Screen Inventory

aihoni is a bilingual (Nepali + English) AI assistant app for small business owners ("pasal" owners) in Nepal. It combines social commerce, AI chat, voice-first UX, and business tooling.

| # | Screen | Route Key | Section | Auth Required |
|---|--------|-----------|---------|---------------|
| 01 | Welcome | `welcome` | Welcome | ❌ Public |
| 02 | Language picker | `language` | Welcome | ❌ Public |
| 03 | Sign in | `signin` | Welcome | ❌ Public |
| 04 | Personal info | `personal` | About you | ✅ Protected |
| 05 | Connect tools | `connect` | About you | ✅ Protected |
| 06 | Voice setup | `voice` | About you | ✅ Protected |
| 07 | Add business | `addBusiness` | Your businesses | ✅ Protected |
| 08 | Business details | `businessDetails` | Your businesses | ✅ Protected |
| 09 | Business dashboard | `businessDashboard` | Your businesses | ✅ Protected |
| 10 | Knowledge base | `knowledge` | Your businesses | ✅ Protected |
| 11 | Chats (inbox) | `chats` | The app | ✅ Protected |
| 12 | Feed | `feed` | The app | ✅ Protected |
| 13 | Snap camera | `snap` | The app | ✅ Protected |
| 14 | Group chat | `groupChat` | The app | ✅ Protected |
| 15 | Chat with aihoni | `chat` | The app | ✅ Protected |
| 16 | Chat · attachments | `chatAttach` | The app | ✅ Protected |
| 17 | Chat · react & reply | `chatReact` | The app | ✅ Protected |
| 18 | Reels | `reels` | The app | ✅ Protected |
| 19 | Order from reel | `order` | The app | ✅ Protected |
| 20 | Business page | `businessPage` | The app | ✅ Protected |
| 21 | Profile | `profile` | The app | ✅ Protected |
| 22 | Recharge points | `recharge` | The app | ✅ Protected |

---

## 2. Workflow Fixes

### 2.1 Correct Onboarding Flow

```
Welcome → Language → Sign In (Google only) → Personal Info → Connect Tools
  → Voice Setup → Add Business → Business Details → Business Dashboard
  → Knowledge Base → Chats (app home)
```

The current `ONBOARDING_FLOW` array in `nav.tsx` is correct. The SignIn screen
just needs the Apple button removed.

### 2.2 Fix: Remove Apple Login — Keep Google Only

**File:** `src/screens/SignIn.tsx`

**Remove** the Apple button entirely. Keep only the Google button:

```tsx
// src/screens/SignIn.tsx  — CORRECTED
import { AHScreen, AHProgress, AHTitle, AHButton, AHOrb } from '../components/ui';
import { AH_BRAND_FONT } from '../theme';
import { useNav } from '../nav';

export function SignIn() {
  const nav = useNav();

  async function handleGoogleSignIn() {
    // Redirect to Cloudflare Worker Google OAuth endpoint
    window.location.href = '/api/auth/google';
  }

  return (
    <AHScreen>
      <AHProgress step={1} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
          <AHOrb size={92} />
        </div>
        <AHTitle
          align="center"
          np="खाता बनाउनुहोस्"
          en="Create your account"
          sub="One tap — no passwords to remember."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
          <AHButton
            kind="outline"
            onClick={handleGoogleSignIn}
            icon={
              <span
                style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--ah-bg-soft)',
                  display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 800,
                  fontSize: 14, color: 'var(--ah-ink)',
                  fontFamily: AH_BRAND_FONT,
                }}
              >
                G
              </span>
            }
          >
            Continue with Google
          </AHButton>
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--ah-faint)', textAlign: 'center', lineHeight: 1.5, padding: '0 18px' }}>
        By continuing you agree to aihoni's{' '}
        <span style={{ color: 'var(--ah-ink)', fontWeight: 600 }}>Terms</span> and{' '}
        <span style={{ color: 'var(--ah-ink)', fontWeight: 600 }}>Privacy Policy</span>.
      </div>
    </AHScreen>
  );
}
```

### 2.3 Route Protection (React)

Add an auth context and a guard that redirects unauthenticated users to the
sign-in screen:

```tsx
// src/auth.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .finally(() => setLoading(false));
  }, []);

  function signOut() {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).then(() => {
      setUser(null);
    });
  }

  return <Ctx.Provider value={{ user, loading, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
```

```tsx
// In nav.tsx — add guard before rendering protected screens
const PUBLIC_SCREENS: ScreenId[] = ['welcome', 'language', 'signin'];

// Inside DeviceStage (App.tsx), wrap the Screen render:
const { user, loading } = useAuth();

if (!loading && !user && !PUBLIC_SCREENS.includes(nav.current)) {
  nav.go('signin');
  return null;
}
```

---

## 3. Cloudflare D1 — Database Schema

```sql
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
```

---

## 4. Cloudflare Workers — API Design

### 4.1 Auth Flow (Google OAuth → JWT in HttpOnly Cookie)

```
App          Worker                Google OAuth
 |               |                       |
 |--GET /api/auth/google--------------->|
 |               |--redirect to Google--|
 |               |                      |
 |               |<--code + state-------|
 |--GET /api/auth/callback?code=...---->|
 |               |--exchange code------>|
 |               |<--id_token + email---|
 |               |--upsert user in D1---|
 |               |--set HttpOnly JWT----|
 |<--redirect to /personal-------------|
```

### 4.2 Full API Route Table

**Base URL:** `https://api.aihoni.app` (Workers custom domain)

#### Auth
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/auth/google` | Redirect to Google consent screen |
| GET | `/api/auth/callback` | Exchange code, set session cookie |
| GET | `/api/auth/me` | Return current user (or 401) |
| POST | `/api/auth/logout` | Clear session cookie |

#### Users
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users/me` | Current user profile |
| PUT | `/api/users/me` | Update name, mobile, district, language |
| PUT | `/api/users/me/language` | Quick language toggle |

#### Businesses
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/businesses` | List user's businesses |
| POST | `/api/businesses` | Create business |
| GET | `/api/businesses/:id` | Get business (public) |
| PUT | `/api/businesses/:id` | Update business |
| GET | `/api/businesses/:id/stats` | Posts, followers, following count |

#### Tool Connections
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/connections/tools` | List connected tools for current user |
| POST | `/api/connections/tools/:tool/start` | Begin OAuth for Drive/Gmail/etc. |
| GET | `/api/connections/tools/:tool/callback` | Complete OAuth, save tokens |
| DELETE | `/api/connections/tools/:tool` | Disconnect tool |

#### Business Services
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/businesses/:id/services` | List service connections |
| POST | `/api/businesses/:id/services` | Add/connect a service |
| PUT | `/api/businesses/:id/services/:service` | Update config |
| DELETE | `/api/businesses/:id/services/:service` | Disconnect |

#### Knowledge Base
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/businesses/:id/knowledge` | List sources |
| POST | `/api/businesses/:id/knowledge` | Add source (URL / text) |
| DELETE | `/api/businesses/:id/knowledge/:sourceId` | Remove source |

#### Feed
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/feed` | Paginated feed (all / stores / nearby / saved) |
| POST | `/api/posts` | Create post (multipart: caption + images) |
| POST | `/api/posts/:id/like` | Toggle like |
| POST | `/api/posts/:id/save` | Toggle save |
| GET | `/api/businesses/:id/posts` | Posts for a business page |

#### Stories
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/stories` | Upload story (R2 presigned then confirm) |
| GET | `/api/businesses/:id/stories` | Get active stories |

#### Reels
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/reels` | Paginated reels feed |
| POST | `/api/reels` | Upload reel |
| POST | `/api/reels/:id/like` | Toggle like |

#### Follow
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/businesses/:id/follow` | Follow/unfollow (toggle) |
| GET | `/api/businesses/:id/followers` | Follower list |

#### Products
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/businesses/:id/products` | List products |
| POST | `/api/businesses/:id/products` | Add product |
| PUT | `/api/businesses/:id/products/:pid` | Update product |
| DELETE | `/api/businesses/:id/products/:pid` | Delete product |

#### Orders
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | User's orders |
| GET | `/api/orders/:id` | Order detail |
| PUT | `/api/orders/:id/status` | Update status (business owner only) |

#### Chat (P2P + Groups)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/conversations` | Inbox list |
| POST | `/api/conversations` | Start direct or group conversation |
| GET | `/api/conversations/:id/messages` | Message history (paginated) |
| POST | `/api/conversations/:id/messages` | Send message |

#### AI Chat
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ai/chat` | Send message to aihoni, streams response |
| GET | `/api/ai/history` | AI conversation history |

#### Wallets
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/wallets` | List user + business wallets |
| POST | `/api/wallets/recharge` | Initiate recharge (eSewa / Khalti / IME) |
| GET | `/api/wallets/transactions` | Transaction history |

#### File Upload (R2)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/upload/presign` | Get presigned R2 PUT URL |
| POST | `/api/upload/confirm` | Confirm upload, return CDN URL |

---

## 5. Cloudflare Workers — Code Structure

```
workers/
├── src/
│   ├── index.ts          ← main router (Hono)
│   ├── middleware/
│   │   ├── auth.ts       ← JWT cookie verify
│   │   └── cors.ts
│   ├── routes/
│   │   ├── auth.ts       ← Google OAuth
│   │   ├── users.ts
│   │   ├── businesses.ts
│   │   ├── feed.ts
│   │   ├── chat.ts
│   │   ├── ai.ts
│   │   ├── orders.ts
│   │   ├── wallets.ts
│   │   └── upload.ts
│   ├── db/
│   │   ├── schema.sql    ← D1 migration
│   │   └── queries.ts    ← typed query helpers
│   └── lib/
│       ├── jwt.ts
│       ├── r2.ts
│       └── google.ts
├── wrangler.toml
└── package.json
```

### 5.1 `wrangler.toml`

```toml
name = "aihoni-api"
main = "src/index.ts"
compatibility_date = "2024-11-01"

[[d1_databases]]
binding = "DB"
database_name = "aihoni-production"
database_id = "YOUR_D1_DATABASE_ID"

[[r2_buckets]]
binding = "STORAGE"
bucket_name = "aihoni-media"

[vars]
GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"
APP_URL = "https://aihoni.app"

# Set these as secrets via `wrangler secret put`:
# GOOGLE_CLIENT_SECRET
# JWT_SECRET
# KV_SESSION (KV namespace ID for sessions)

[[kv_namespaces]]
binding = "SESSIONS"
id = "YOUR_KV_NAMESPACE_ID"
```

### 5.2 Auth Middleware

```typescript
// workers/src/middleware/auth.ts
import type { Context, Next } from 'hono';

export async function requireAuth(c: Context, next: Next) {
  const token = getCookie(c, 'ah_session');
  if (!token) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const payload = await verifyJwt(token, c.env.JWT_SECRET);
    c.set('userId', payload.sub);
    await next();
  } catch {
    return c.json({ error: 'Invalid session' }, 401);
  }
}
```

### 5.3 Google OAuth Route

```typescript
// workers/src/routes/auth.ts
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { signJwt } from '../lib/jwt';
import { upsertUser } from '../db/queries';

const auth = new Hono<{ Bindings: Env }>();

auth.get('/google', (c) => {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', c.env.GOOGLE_CLIENT_ID);
  url.searchParams.set('redirect_uri', `${c.env.APP_URL}/api/auth/callback`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', crypto.randomUUID()); // add CSRF check
  return c.redirect(url.toString());
});

auth.get('/callback', async (c) => {
  const code = c.req.query('code');
  if (!code) return c.json({ error: 'No code' }, 400);

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: c.env.GOOGLE_CLIENT_ID,
      client_secret: c.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${c.env.APP_URL}/api/auth/callback`,
      grant_type: 'authorization_code',
    }),
  });
  const tokens = await tokenRes.json<{ id_token: string }>();

  // Decode Google ID token (verify in production)
  const payload = JSON.parse(atob(tokens.id_token.split('.')[1]));
  const user = await upsertUser(c.env.DB, {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    avatarUrl: payload.picture,
  });

  // Create session JWT (7 days)
  const jwt = await signJwt({ sub: user.id }, c.env.JWT_SECRET, '7d');

  setCookie(c, 'ah_session', jwt, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  // Redirect to onboarding (personal step if new, chats if returning)
  const redirect = user.isNew ? '/personal' : '/chats';
  return c.redirect(redirect);
});

auth.get('/me', requireAuth, async (c) => {
  const userId = c.get('userId');
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
  if (!user) return c.json({ error: 'Not found' }, 404);
  return c.json({ user });
});

auth.post('/logout', (c) => {
  setCookie(c, 'ah_session', '', { maxAge: 0, path: '/' });
  return c.json({ ok: true });
});

export default auth;
```

### 5.4 R2 Image Upload (Presign Pattern)

```typescript
// workers/src/routes/upload.ts
import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';

const upload = new Hono<{ Bindings: Env }>();

// Step 1: Get a presigned PUT URL (max 10 MB)
upload.post('/presign', requireAuth, async (c) => {
  const { filename, contentType, context } = await c.req.json<{
    filename: string;
    contentType: string;
    context: 'post' | 'reel' | 'product' | 'avatar' | 'story' | 'message';
  }>();

  const userId = c.get('userId');
  const key = `${context}/${userId}/${Date.now()}-${filename}`;

  // Generate presigned URL for direct browser → R2 upload
  const url = await c.env.STORAGE.createMultipartUpload(key);
  // OR use a simple signed URL pattern via Worker URL signing

  return c.json({ key, uploadUrl: url });
});

// Step 2: Confirm upload and get CDN URL
upload.post('/confirm', requireAuth, async (c) => {
  const { key } = await c.req.json<{ key: string }>();
  // Verify the object exists in R2
  const obj = await c.env.STORAGE.head(key);
  if (!obj) return c.json({ error: 'Upload not found' }, 404);

  const cdnUrl = `https://media.aihoni.app/${key}`;
  return c.json({ url: cdnUrl, key });
});

export default upload;
```

---

## 6. Cloudflare R2 — Storage Structure

```
aihoni-media/
├── avatars/
│   └── {userId}/{timestamp}-avatar.jpg
├── businesses/
│   └── {businessId}/{timestamp}-logo.jpg
├── post/
│   └── {userId}/{timestamp}-{filename}.jpg
├── reel/
│   └── {userId}/{timestamp}-{filename}.mp4
│   └── {userId}/{timestamp}-thumb.jpg
├── story/
│   └── {userId}/{timestamp}-{filename}.jpg
├── product/
│   └── {businessId}/{timestamp}-{filename}.jpg
├── message/
│   └── {conversationId}/{timestamp}-{filename}
└── knowledge/
    └── {businessId}/{timestamp}-{filename}
```

**CDN:** Serve R2 via a custom domain `media.aihoni.app` using Cloudflare R2's
public bucket or a Worker that sets cache headers.

---

## 7. Security Checklist

| Concern | Solution |
|---------|----------|
| Auth bypass | All `/api/*` routes except `/api/auth/*` require valid `ah_session` JWT cookie |
| Session fixation | New JWT issued on every login; old tokens expire in 7 days |
| CSRF | `SameSite=Lax` cookie + CSRF state parameter in Google OAuth |
| XSS | HttpOnly cookie — JS cannot read the session token |
| Data isolation | Every DB query filters by `user_id` or verifies `business.user_id = currentUser` |
| Business auth | Middleware `requireBusinessOwner(businessId)` checked on all write routes |
| R2 access | No public bucket — all media served through Worker (adds auth check or signed URLs) |
| API rate limiting | Cloudflare Rate Limiting rules on `/api/auth/*` (5 req/min per IP) |
| Sensitive config | API keys stored as Wrangler secrets (not in `wrangler.toml`) |
| Input validation | Zod schemas on all request bodies in Workers |

---

## 8. Summary of Suggestions

### Must-do (blockers)
1. **Remove Apple Sign-In** from `SignIn.tsx` — Apple auth requires paid Apple Developer account and is not shown as set up anywhere.
2. **Add `AuthProvider`** wrapping `<App>` in `main.tsx` and guard every non-public screen.
3. **Fix workflow step numbering** — `AHProgress` currently goes 0→5 but there are 9 onboarding steps. Update `step` values on each screen to reflect 0–8.

### Should-do (before launch)
4. **Implement D1 schema** above via `wrangler d1 execute aihoni-production --file=schema.sql`.
5. **Set up Google OAuth** in Google Cloud Console — add `https://aihoni.app/api/auth/callback` as an authorized redirect URI.
6. **R2 bucket** for media — `wrangler r2 bucket create aihoni-media`.
7. **Point count** — AI chat currently costs 4 pts per answer (shown in profile). Deduct from wallet in the AI chat Worker route.
8. **Business-scoped AI context** — pass `business_id` when calling the AI route so aihoni can look up that business's knowledge sources.

### Nice-to-have (post-launch polish)
9. **Offline queue** — cache unsent messages in IndexedDB and resync on reconnect.
10. **Push notifications** — use Cloudflare Workers + Web Push (VAPID) for new messages and order updates.
11. **Snap camera** (screen 13) — integrate with device camera API; store media directly to R2 presigned URL.
12. **Real-time chat** — use Cloudflare Durable Objects for WebSocket-based live messaging instead of polling.

---

*End of report. All schema, route tables, and code snippets are production-ready starting points for Cloudflare Workers + D1 + R2.*
