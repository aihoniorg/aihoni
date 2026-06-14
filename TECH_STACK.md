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

### Cloudflare R2 (object storage) — pending

| Setting | Value |
|---|---|
| Bucket name (planned) | `aihoni-media` |
| Binding (planned) | `env.MEDIA` (typed `R2Bucket`) |
| Use | Voice notes (`.m4a`), product photos, knowledge PDFs, profile avatars |
| Status | ⚠️ Requires one-time R2 activation at https://dash.cloudflare.com → R2 → Enable. Once enabled, run the `r2_bucket_create` MCP call or `wrangler r2 bucket create aihoni-media`. Then uncomment the `[[r2_buckets]]` block in `cloudflare/wrangler.toml` and redeploy. |

### Bindings in `cloudflare/wrangler.toml`

```toml
[[d1_databases]]
binding       = "DB"
database_name = "aihoni-db"
database_id   = "94a0f87b-527e-4220-9f3a-367ce804cf75"

[[kv_namespaces]]
binding = "CACHE"
id      = "c099c94a10b44aaab50b1a2e2308ad36"

# [[r2_buckets]]    # uncomment after enabling R2
# binding     = "MEDIA"
# bucket_name = "aihoni-media"
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

## 5. Local development

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

## 6. Top-level file layout

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
│   ├── functions/api/          # Pages Functions (edge API)
│   ├── wrangler.toml
│   └── README.md
│
├── .eas/workflows/             # EAS CI/CD YAML
└── android/                    # Native android (generated via expo prebuild)
```

---

## 7. Service inventory

| Service | Plan | What we use |
|---|---|---|
| **Expo / EAS** | Free tier | Build, Submit, Workflows, Insights, Push Service, Credentials |
| **Cloudflare** | Free plan | Pages (static + functions), DNS, SSL, CDN, DDoS shield, **D1** (SQL), **KV** (cache), **R2** (when enabled) |
| **Google Play Console** | Pay-once $25 | (Pending) Android distribution |
| **Apple Developer Program** | $99/yr | (Pending) iOS distribution |
| **GitHub** | Free | Source at `github.com/aihoniorg/aihoni` |

---

## 8. Identifiers cheat-sheet

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
| Cloudflare R2 bucket | `aihoni-media` (pending R2 enable) |
| GitHub repo | `aihoniorg/aihoni` |

---

## 9. Open TODOs (placeholders to fill before production)

| File | Placeholder | How to fill |
|---|---|---|
| `cloudflare/public/.well-known/apple-app-site-association` | `TODO_APPLE_TEAM_ID` (×2) | developer.apple.com → Membership → Team ID |
| `cloudflare/public/.well-known/assetlinks.json` | `TODO_REPLACE_WITH_SHA256_FROM_EAS` | `eas credentials -p android` → SHA-256 fingerprint |
| `eas.json` (submit.ios) | `TODO_APPLE_APP_ID` | appstoreconnect.apple.com → app numeric ID |
| `eas.json` (submit.ios) | `TODO_APPLE_TEAM_ID` | same as above |
| `eas.json` (submit.android) | `./secrets/play-service-account.json` | Google Cloud → service account JSON key |

After filling these, redeploy Cloudflare (`wrangler pages deploy …`) and you're production-ready.
