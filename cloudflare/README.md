# aihoni · Cloudflare Pages

This folder contains everything served at **https://aihoni.com** via Cloudflare Pages.

## What's here

```
cloudflare/
├── public/                          # Static site root
│   ├── index.html                   # Marketing landing page
│   ├── _headers                     # Content-Type / CORS rules
│   └── .well-known/
│       ├── apple-app-site-association   # iOS Universal Links
│       └── assetlinks.json              # Android App Links
├── functions/                       # Cloudflare Pages Functions (edge API)
│   └── api/
│       └── health.ts                # https://aihoni.com/api/health
├── wrangler.toml                    # Pages config
└── README.md                        # This file
```

## One-time setup

### 1. Install Wrangler
```bash
npm i -g wrangler
wrangler login
```

### 2. Get the Android signing fingerprint and fill `assetlinks.json`
Run interactively from the project root:
```bash
eas credentials -p android
# pick "production" build profile → "Keystore: Manage everything…" → "Download credentials"
# look for "SHA-256 Fingerprint: XX:XX:..." and copy the hex string
```
Paste it into `public/.well-known/assetlinks.json` replacing `TODO_REPLACE_WITH_SHA256_FROM_EAS`.

### 3. Get your Apple Team ID and fill `apple-app-site-association`
Find it at https://developer.apple.com/account → Membership → Team ID (10-char string).
Replace `TODO_APPLE_TEAM_ID` in `public/.well-known/apple-app-site-association` (two places).

### 4. Deploy
```bash
cd cloudflare
wrangler pages deploy public --project-name=aihoni
```

### 5. Connect the custom domain
1. Go to Cloudflare dashboard → Pages → `aihoni` project → Custom domains
2. Add `aihoni.com` and `www.aihoni.com`
3. Cloudflare auto-configures the DNS since the domain is already on Cloudflare

### 6. Verify the well-known files
```bash
curl -i https://aihoni.com/.well-known/apple-app-site-association
curl -i https://aihoni.com/.well-known/assetlinks.json
curl -i https://aihoni.com/api/health
```
Both `.well-known` responses must have `Content-Type: application/json`.

## Testing deep links

After a new EAS build is installed on a real device, paste these into Safari/Chrome:

| URL | Opens |
|---|---|
| `https://aihoni.com/` | Chats screen |
| `https://aihoni.com/feed` | Feed |
| `https://aihoni.com/profile` | Profile |
| `https://aihoni.com/chat/abc123` | Chat with id `abc123` |
| `https://aihoni.com/business/shrestha-kirana` | Business page |
| `aihoni://chat/abc123` | (custom-scheme fallback) Chat |

## Future: web build of the app

To also host the React Native app as a web app at `app.aihoni.com`:
```bash
# from project root
npx expo export -p web
# move the output dir into cloudflare/public/app
mv dist cloudflare/public/app
# deploy
cd cloudflare && wrangler pages deploy public --project-name=aihoni
```
Then add `app.aihoni.com` as another custom domain in the Pages project, pointing to `/app`.

## Future: API at api.aihoni.com

Pages Functions under `functions/api/` are already wired. To use `api.aihoni.com`:
1. Add `api.aihoni.com` as a custom domain on the Pages project
2. Add a rewrite rule in Cloudflare Dashboard → Rules → Transform Rules:
   - When `host = api.aihoni.com`, rewrite path from `/` to `/api/`
3. Or just call `https://aihoni.com/api/*` from the app
