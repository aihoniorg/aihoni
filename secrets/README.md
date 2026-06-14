# `/secrets/` — local-only credential files

> **The entire `secrets/` folder is gitignored.** Anything you drop here stays on
> your machine. EAS Build uploads these to its encrypted storage at build time
> via `scripts/setup-eas-secrets.sh` — they never enter the binary or repo.

## What goes here

| Filename | Where you get it | Used for |
|---|---|---|
| `play-service-account.json` | Google Cloud → IAM → Service Accounts → key (JSON) | `eas submit -p android` |
| `AuthKey_XXXXXXXXXX.p8` | App Store Connect → Users & Access → Keys → API Keys | `eas submit -p ios` (App Store Connect API auth) |
| `apns-auth-key.p8` | developer.apple.com → Keys → Apple Push Notifications | Push notifications via APNs token (newer than `.p12` cert) |
| `apns-cert.p12` (legacy) | developer.apple.com → Certificates → Apple Push Notification | Legacy push cert (skip if using `.p8`) |
| `google-oauth-credentials.json` | console.cloud.google.com → APIs & Services → Credentials → Download | Reference for your 3 OAuth Client IDs — you can delete after copying the IDs into `.env` |
| `keystore.jks` | Don't keep one locally — let EAS Build manage it | (only if you must use a manual keystore) |

## What does NOT go here

| Belongs elsewhere | Where it really lives |
|---|---|
| `JWT_SECRET` | Cloudflare Pages encrypted secret store (`wrangler pages secret put`) |
| `GOOGLE_CLIENT_IDS` | Same — Cloudflare Pages secret store |
| `EXPO_PUBLIC_GOOGLE_*_CLIENT_ID` | EAS env vars (`eas env:create`) — pulled into the bundle at build time |
| `google-services.json` (Firebase) | Project root (referenced from `app.json`) — NOT here |
| `GoogleService-Info.plist` (Firebase) | Project root (referenced from `app.json`) — NOT here |
| `.env` | Project root (consumed by Metro) — NOT here |

## After adding files here

Run the EAS uploader, which reads these paths and pushes them to EAS Build's
encrypted storage so cloud builds can use them:

```bash
./scripts/setup-eas-secrets.sh
```
