# aihoni — Technology Stack

A voice-first AI companion for Nepali pasals, built as a mobile-first cross-platform app with edge-served web presence and deep-link integration.

---

## 1. Mobile app — React Native via Expo

**Runtime**
- **Expo SDK 54** (`expo@^54.0.0`)
- **React Native 0.81.5** with the **New Architecture** enabled (`newArchEnabled: true`)
- **React 19.1**
- **Hermes** JS engine (default in RN 0.81)
- **TypeScript 5.9** for typed source

**Why Expo:** zero-config native modules, EAS for builds/submits/updates/workflows, OTA-style insights, push-notification infrastructure included.

### Expo modules in use

| Package | Purpose |
|---|---|
| `expo` | Core runtime + `registerRootComponent` |
| `expo-status-bar` | OS status bar control |
| `expo-font` + `@expo-google-fonts/poppins` + `@expo-google-fonts/baloo-2` | Custom typography (`Poppins`, `Baloo 2`) loaded at boot |
| `expo-linear-gradient` | Gradient backgrounds (wallet cards, hero areas) |
| `expo-splash-screen` | Native splash on cold start |
| `expo-constants` | Reads EAS `projectId` for push registration |
| `expo-device` | Detects real devices vs simulators before requesting push token |
| `expo-notifications` | Push notifications + local scheduling + tap handling |
| `expo-linking` | Cold-start + warm URL handling for deep links |
| `expo-clipboard` | Copying push tokens / IDs to clipboard |
| `expo-insights` | Auto-collected app launch/session telemetry (zero-API) |
| `expo-observe` | Observability primitives |

### React Native ecosystem

| Package | Purpose |
|---|---|
| `react-native-safe-area-context` | Notch/safe-area aware layouts |
| `react-native-screens` | Native screen primitives for nav perf |
| `react-native-svg` | All custom icons and decorations (no icon library — minimal bundle) |
| `react-native-url-polyfill` | WHATWG URL polyfill (required for `expo-linking` + `fetch` URL handling) |

### Babel / build chain

| Package | Purpose |
|---|---|
| `babel-preset-expo` (`~54.0.10`) | Expo-tuned Babel preset for Metro |
| `@babel/plugin-transform-class-properties` | Modern class syntax support |
| `@babel/plugin-transform-private-methods` | Private method downleveling |

### App architecture

- **Custom lightweight nav** — `src/nav.tsx`: React-context driven stack with `go / next / back` API
- **22 screens** in `src/screens/` — Welcome / Language / SignIn / Personal / Connect / Voice / AddBusiness / BusinessDetails / BusinessDashboard / Knowledge / ChatList / Feed / Snap / GroupChat / Chat / ChatAttach / ChatReact / Reels / Order / BusinessPage / Profile / Recharge
- **Shared UI primitives** in `src/components/ui.tsx` — `AHScreen`, `AHHeader`, `AHButton`, `AHField`, `AHChip`, `AHOptionCard`, `AHTabBar`, `AHTabIcon`, `AHOrb`, `AHWave`, `AHCoin`, `AHChatInput`, `AHWordmark`, `AHProgress`, `AHTitle`, plus `pressedOpacity()` + `RIPPLE` helpers for cross-platform tap feedback
- **Animated bottom-bar collapsing-stories** pattern on Chats/Feed (`useNativeDriver: true` for 60fps)
- **Centralized theme** in `src/theme.ts` (single source of color/typography tokens)

---

## 2. Native build & release — EAS (Expo Application Services)

| Service | Purpose |
|---|---|
| **EAS Build** | Cloud-based native builds — Android APK (`preview`) + AAB (`production`) + iOS IPA |
| **EAS Submit** | Automated submission to Play Internal Testing + App Store |
| **EAS Workflows** | YAML-defined CI/CD running on EAS infra |
| **EAS Insights** | Server-side analytics (launches, sessions, app versions) |
| **EAS Credentials** | Auto-managed Android keystore + iOS provisioning |

### EAS configuration

- `eas.json` — `cli.appVersionSource: "remote"`, `cli.version: ">= 16.0.0"`
- **Build profiles:** `development` (dev-client) · `preview` (internal APK) · `production` (autoIncrement + signed AAB/IPA)
- **Submit profiles:** Play Console (Internal testing track, draft) + App Store Connect

### EAS Workflows (`.eas/workflows/*.yml`)

| File | Trigger | Effect |
|---|---|---|
| `preview-android.yml` | push to `main` | Auto-builds Android preview APK |
| `production.yml` | manual (`eas workflow:run`) | Builds Android + iOS production in parallel |
| `pr-checks.yml` | pull request to `main` | `tsc --noEmit` type-check + fingerprint diff |

### Project identity

- **Owner org:** `aihoni`
- **Project URL:** https://expo.dev/accounts/aihoni/projects/aihoni
- **EAS Project ID:** `1fafd0c0-1222-4538-8b42-88fc31553b45`
- **Bundle ID / package:** `com.nepfinder.aihoni` (iOS + Android share the same identifier)

---

## 3. Push notifications

**End-to-end:**

```
App boot
  → registerForPushNotificationsAsync() (src/notifications.ts)
    → permission request (iOS APNs / Android channel)
    → getExpoPushTokenAsync({ projectId })
    → cached for later (getPushToken)
  → listener: addNotificationResponseReceivedListener
    → reads data.screen
    → calls nav.go(screen) for deep-link routing

Server side (or test panel)
  → POST https://exp.host/--/api/v2/push/send
    → Expo Push Service fans out to APNs + FCM
    → Phone receives banner + sound + badge
```

**In-app helpers (`src/notifications.ts`):**
- `getPushToken()` — synchronous access to cached token
- `sendLocalTestNotification(title, body, data)` — fires real local notification immediately (works on simulator)
- `sendPushViaExpoApi(token, title, body, data)` — sends through Expo Push Service

**Profile debug panel** — live status indicator, token display, "Fire local test" + "Copy token" buttons.

---

## 4. Edge web presence — Cloudflare

Everything served at `https://aihoni.com` runs on Cloudflare's global edge.

### Cloudflare Pages (static + functions)

| Path | Tech | Purpose |
|---|---|---|
| `cloudflare/public/index.html` | Static HTML/CSS | Marketing landing page (Nepali/English bilingual, brand-styled, store buttons) |
| `cloudflare/public/.well-known/apple-app-site-association` | Static JSON | **iOS Universal Links** — `applinks:aihoni.com` |
| `cloudflare/public/.well-known/assetlinks.json` | Static JSON | **Android App Links** — `autoVerify` HTTPS deep links |
| `cloudflare/public/_headers` | Cloudflare Pages directive | Pins `Content-Type: application/json` for AASA + CORS for `/api/*` |
| `cloudflare/functions/api/health.ts` | **Cloudflare Pages Functions** (V8 isolates) | Edge API — probes D1 + KV bindings, reports colo |
| `cloudflare/functions/api/businesses.ts` | Pages Function + D1 + KV | Lists all businesses with wallet balance (60s KV cache) |
| `cloudflare/functions/api/chats.ts` | Pages Function + D1 | Inbox: every thread + its latest message |

### Cloudflare D1 (SQL database)

| Setting | Value |
|---|---|
| Database name | `aihoni-db` |
| Database ID | `94a0f87b-527e-4220-9f3a-367ce804cf75` |
| Primary region | APAC (Singapore) |
| Binding in Functions | `env.DB` (typed `D1Database`) |
| Schema migration | `cloudflare/migrations/0001_init.sql` |

**Tables** — `users`, `businesses`, `wallets`, `wallet_transactions`, `threads`, `thread_members`, `messages`, `knowledge`, `posts`, `orders`. All include `created_at INTEGER DEFAULT (unixepoch())` for tabular-friendly Unix timestamps.

**Apply migration to remote DB:**
```bash
cd cloudflare
wrangler d1 execute aihoni-db --remote --file=migrations/0001_init.sql
```

**Query from the dev shell:**
```bash
wrangler d1 execute aihoni-db --remote --command="SELECT * FROM businesses"
```

### Cloudflare KV (cache + hot key-value)

| Setting | Value |
|---|---|
| Namespace title | `aihoni-cache` |
| Namespace ID | `c099c94a10b44aaab50b1a2e2308ad36` |
| Binding | `env.CACHE` (typed `KVNamespace`) |
| Typical use | API response caching (60s+ TTL), feature flags, push-token-by-user index |
| **Caveat** | `expirationTtl` minimum is **60 seconds** |

### Cloudflare R2 (object storage)

| Setting | Value |
|---|---|
| Bucket name | `aihoni` |
| Binding | `env.MEDIA` (typed `R2Bucket`) |
| Use | Voice notes (`.m4a`), product photos, knowledge PDFs, profile avatars |
| Endpoints | `POST /api/media/upload` (auth required) + `GET /api/media/<key>` (public, 24h edge cache) |
| Key format | `media/<userId>/<timestamp>-<rand>.<ext>` |
| Max upload | 25 MB · allowed types: `image/*`, `audio/*`, `video/*`, `application/pdf` |

### Bindings in `cloudflare/wrangler.toml`

```toml
[[d1_databases]]
binding       = "DB"
database_name = "aihoni-db"
database_id   = "94a0f87b-527e-4220-9f3a-367ce804cf75"

[[kv_namespaces]]
binding = "CACHE"
id      = "c099c94a10b44aaab50b1a2e2308ad36"

[[r2_buckets]]
binding     = "MEDIA"
bucket_name = "aihoni"
```

Pages Functions receive these as `ctx.env.DB`, `ctx.env.CACHE`, `ctx.env.MEDIA`.

### Cloudflare DNS

| Record | Type | Value | Status |
|---|---|---|---|
| `aihoni.com` | CNAME | `aihoni.pages.dev` | Proxied 🟧 |
| `www.aihoni.com` | CNAME | `aihoni.pages.dev` | Proxied 🟧 |
| `aihoni.com` | TXT | `v=spf1 -all` | DNS only |
| `_dmarc.aihoni.com` | TXT | `v=DMARC1; p=reject…` | DNS only |
| `*._domainkey.aihoni.com` | TXT | `v=DKIM1; p=` | DNS only |

SPF/DMARC/DKIM auto-configured by Cloudflare to **prevent email spoofing** on the domain.

### Edge benefits we use

- **Free SSL** (auto-issued, auto-renewed)
- **DDoS protection** (orange-cloud proxying)
- **HTTP/2 + HTTP/3** with QUIC
- **Global edge cache** — assets served from the nearest of 300+ datacenters (KTM colo for users in Nepal — sub-60ms)
- **Pages Functions** — TypeScript serverless on V8 isolates, zero cold start

### Deploy commands

```bash
cd cloudflare
wrangler pages deploy public --project-name=aihoni --branch=main
```

---

## 5. Secrets, auth, and the trust boundary

The hard rule: **anything bundled into the app binary is extractable**. So:

```
┌─────────────────┐   JWT      ┌──────────────────────────┐  secrets  ┌──────────────────┐
│  Expo app       │ ─────────► │  Cloudflare Functions    │ ────────► │  3rd-party APIs  │
│  SecureStore:   │ Bearer hdr │  (D1 + KV + Secrets)     │           │  Google JWKS,    │
│   - session JWT │            │                          │           │  OpenAI, etc.    │
└─────────────────┘            └──────────────────────────┘           └──────────────────┘
```

Three secret stores, one rule for each:

| Where | What lives there | Set with |
|---|---|---|
| **Cloudflare Pages Secrets** (server-only, encrypted at rest) | `JWT_SECRET`, `GOOGLE_CLIENT_IDS`, future `OPENAI_API_KEY`, `STRIPE_SECRET_KEY` etc. | `wrangler pages secret put NAME --project-name=aihoni` |
| **EAS Secrets / Env Vars** (build-time only, never in bundle) | `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID`, `ASC_APP_ID`, `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | `./scripts/setup-eas-secrets.sh` (or `eas env:create` directly) |
| **EAS Plaintext Env Vars** (public, baked into bundle) | `EXPO_PUBLIC_API_BASE`, `EXPO_PUBLIC_GOOGLE_*_CLIENT_ID` | same script — these are config, not secrets |

### Authentication flow — Google Sign-In

1. App → Google OAuth (`expo-auth-session`) → returns `id_token`
2. App → `POST /api/auth/google` with `{ id_token }`
3. Edge function (`cloudflare/functions/api/auth/google.ts`):
   - fetches Google's public JWKS (cached 1h in KV)
   - verifies RS256 signature, `iss`, `aud` (must match one of `GOOGLE_CLIENT_IDS`), `exp`, `email_verified`
   - upserts user in `users` table (keyed by `g_<google_sub>`)
   - signs HS256 JWT with `JWT_SECRET`, returns it + user
4. App stores JWT in **iOS Keychain / Android Keystore** via `expo-secure-store`
5. Every subsequent API call sends `Authorization: Bearer <jwt>`
6. Server functions verify with `readAuth(request, env.JWT_SECRET)` from `_lib/auth.ts`

### Auth code map

| File | Purpose |
|---|---|
| `cloudflare/functions/_lib/auth.ts` | HS256 sign/verify (Web Crypto, zero deps), `readAuth()` helper |
| `cloudflare/functions/_lib/google.ts` | RS256 + JWKS verifier for Google ID tokens, KV-cached keys |
| `cloudflare/functions/api/auth/google.ts` | `POST` — exchange Google `id_token` for our JWT |
| `cloudflare/functions/api/auth/me.ts` | `GET` — return current user (requires Bearer token) |
| `src/apiClient.ts` (Expo) | Typed `api()` fetch wrapper, auto Bearer header, `setSessionToken()`, `ApiError` |
| `src/auth.tsx` (Expo) | `AuthProvider` + `useAuth()` context, `signInWithGoogle()`, `signOut()`, session restore on cold start |
| `src/screens/SignIn.tsx` | "Continue with Google" button wired to `signInWithGoogle()` + auto-advance on success |
| `GOOGLE_SIGNIN_SETUP.md` | Step-by-step Google Cloud Console setup with troubleshooting |

### Active secrets (as of today)

```
$ wrangler pages secret list --project-name=aihoni
  - JWT_SECRET:        Value Encrypted   (32 bytes random, set 2026-06-14)
  - GOOGLE_CLIENT_IDS: Value Encrypted   (TODO placeholder — replace with real OAuth IDs)
```

---

## 6. Local development

```bash
# Start Metro
npx expo start

# Reset cache (when stuck)
npx expo start --clear

# Type-check the entire project
npx tsc --noEmit

# Validate EAS workflow
eas workflow:validate .eas/workflows/preview-android.yml

# Project health
npx expo-doctor
```

---

## 7. Top-level file layout

```
aihoni/
├── app.tsx                     # Root: fonts, splash, push, deep links, nav provider
├── app.json                    # Expo config: scheme, plugins, intentFilters, associatedDomains
├── eas.json                    # EAS build + submit profiles
├── babel.config.js             # Expo preset + class/private transforms
├── tsconfig.json               # TS config
├── assets/icon.png             # 1024×1024 app icon (used for splash + adaptive icon)
│
├── src/
│   ├── theme.ts                # Colors, fonts, mixWithWhite helper
│   ├── nav.tsx                 # Custom React-context navigation
│   ├── auth.tsx                # AuthProvider + useAuth() + Google sign-in
│   ├── apiClient.ts            # Bearer-auth fetch wrapper + SecureStore session
│   ├── notifications.ts        # Push registration + helpers
│   ├── deeplinks.ts            # URL → ScreenId resolver
│   ├── SplashScreen.tsx        # JS splash (icon fade-in)
│   ├── components/
│   │   ├── ui.tsx              # All shared primitives
│   │   ├── StoryRing.tsx       # Story-style ring with glyph
│   │   └── ImageSlot.tsx       # Placeholder image component
│   └── screens/                # 22 screens
│
├── cloudflare/
│   ├── public/                 # Static site root for Pages
│   │   ├── index.html
│   │   ├── _headers
│   │   └── .well-known/
│   ├── functions/
│   │   ├── _lib/
│   │   │   ├── auth.ts         # HS256 JWT sign/verify (Web Crypto)
│   │   │   └── google.ts       # Google ID-token verifier (RS256+JWKS)
│   │   └── api/
│   │       ├── auth/google.ts  # POST — exchange Google id_token for our JWT
│   │       ├── auth/me.ts      # GET — current user (Bearer)
│   │       ├── businesses.ts   # GET — list businesses (KV-cached)
│   │       ├── chats.ts        # GET — inbox
│   │       └── health.ts       # GET — D1/KV health probe
│   ├── migrations/0001_init.sql
│   ├── wrangler.toml
│   └── README.md
│
├── scripts/setup-eas-secrets.sh # One-shot EAS env/secrets provisioning
├── .eas/workflows/              # EAS CI/CD YAML
├── GOOGLE_SIGNIN_SETUP.md       # Google Cloud Console step-by-step
└── android/                     # Native android (generated via expo prebuild)
```

---

## 8. Service inventory

| Service | Plan | What we use |
|---|---|---|
| **Expo / EAS** | Free tier | Build, Submit, Workflows, Insights, Push Service, Credentials |
| **Cloudflare** | Free plan | Pages (static + functions), DNS, SSL, CDN, DDoS shield, **D1** (SQL), **KV** (cache), **R2** (when enabled) |
| **Google Play Console** | Pay-once $25 | (Pending) Android distribution |
| **Apple Developer Program** | $99/yr | (Pending) iOS distribution |
| **GitHub** | Free | Source at `github.com/aihoniorg/aihoni` |

---

## 9. Identifiers cheat-sheet

| Thing | Value |
|---|---|
| App display name | `aihoni` |
| Slug | `aihoni` |
| URL scheme | `aihoni://` |
| Universal Link domain | `aihoni.com`, `www.aihoni.com` |
| iOS bundle ID | `com.nepfinder.aihoni` |
| Android package | `com.nepfinder.aihoni` |
| Brand color | `#3B76EF` (accent blue) |
| Dark background | `#1a1d2e` (splash + adaptive icon) |
| Expo org | `aihoni` |
| EAS project ID | `1fafd0c0-1222-4538-8b42-88fc31553b45` |
| Cloudflare account ID | `22eacf782857c9708be1f82fb25edccf` |
| Cloudflare Pages project | `aihoni` (live at `aihoni.pages.dev` and `aihoni.com`) |
| Cloudflare D1 database | `aihoni-db` (`94a0f87b-527e-4220-9f3a-367ce804cf75`) |
| Cloudflare KV namespace | `aihoni-cache` (`c099c94a10b44aaab50b1a2e2308ad36`) |
| Cloudflare R2 bucket | `aihoni` |
| GitHub repo | `aihoniorg/aihoni` |

---

## 10. Open TODOs (placeholders to fill before production)

| File / Resource | Placeholder | How to fill |
|---|---|---|
| `cloudflare/public/.well-known/apple-app-site-association` | `TODO_APPLE_TEAM_ID` (×2) | developer.apple.com → Membership → Team ID |
| `cloudflare/public/.well-known/assetlinks.json` | `TODO_REPLACE_WITH_SHA256_FROM_EAS` | `eas credentials -p android` → SHA-256 fingerprint |
| `eas.json` (submit.ios) | `TODO_APPLE_APP_ID` | appstoreconnect.apple.com → app numeric ID |
| `eas.json` (submit.ios) | `TODO_APPLE_TEAM_ID` | same as above |
| Cloudflare secret `GOOGLE_CLIENT_IDS` | `TODO_REPLACE_WITH_GOOGLE_OAUTH_CLIENT_IDS` | Follow `GOOGLE_SIGNIN_SETUP.md` to get 3 OAuth client IDs, then `echo "WEB,IOS,ANDROID" \| wrangler pages secret put GOOGLE_CLIENT_IDS --project-name=aihoni` |
| `scripts/setup-eas-secrets.sh` | All `TODO_*` values at the top | Fill in real Apple/Google client IDs + credentials, then `./scripts/setup-eas-secrets.sh` |
| `eas.json` (submit.android) | `./secrets/play-service-account.json` | Google Cloud → service account JSON key |

After filling these, redeploy Cloudflare (`wrangler pages deploy …`) and you're production-ready.
