# Google Sign-In · setup guide

> **TL;DR — the fast path**
> ```bash
> brew install --cask google-cloud-sdk  # one-time, if needed
> gcloud auth login                      # one-time
> ./scripts/google-oauth-setup.sh        # 3 min of clicking + 3 paste-back prompts
> ```
> The script creates the GCP project, enables APIs, opens the right Console pages
> in your browser, and then pushes the resulting client IDs to Cloudflare, EAS,
> and `.env` automatically. Everything below is the manual long-form if you'd
> rather not use the script.
>
> ---

Sign in with Google is wired end-to-end:

| Layer | Status |
|---|---|
| Backend — `POST /api/auth/google`, `GET /api/auth/me` | ✅ Live at https://aihoni.com/api/auth/* |
| JWT signing secret | ✅ Stored as Cloudflare Pages secret `JWT_SECRET` |
| Google client-IDs secret (server side) | ⚠️ Placeholder — needs real IDs |
| Mobile sign-in button | ✅ Wired in `src/screens/SignIn.tsx` |
| Mobile auth context | ✅ `src/auth.tsx` (`useAuth()`) |
| Mobile session storage | ✅ `expo-secure-store` via `src/apiClient.ts` |

**You just need to provision the Google OAuth client IDs once. Then everything works.**

---

## Step 1 — Create a Google Cloud project

1. Open https://console.cloud.google.com
2. Top bar → **Select a project** → **New Project**
3. Name: `aihoni` → **Create**

## Step 2 — Configure the OAuth consent screen

1. Sidebar → **APIs & Services** → **OAuth consent screen**
2. User type: **External** → **Create**
3. Fill in:
   - App name: `aihoni`
   - User support email: `aihoninp@gmail.com`
   - Developer contact: `aihoninp@gmail.com`
   - App logo: optional (the icon at `assets/icon.png`)
   - App domain: `aihoni.com`
   - Authorized domain: `aihoni.com`
   - Privacy policy: `https://aihoni.com/privacy` (placeholder ok for now)
   - Terms of service: `https://aihoni.com/terms`
4. **Save and Continue**
5. Scopes: just keep defaults (`openid`, `email`, `profile`) → **Save and Continue**
6. Test users: add `aihoninp@gmail.com` + any phones you test from → **Save and Continue**
7. Status: leave as **Testing** for now (move to **In production** after you submit for verification later)

## Step 3 — Create three OAuth client IDs

Sidebar → **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**.

You need **three** separate clients:

### 3a · Web application (used by Expo Go + dev client)

- Application type: **Web application**
- Name: `aihoni · Web`
- Authorized JavaScript origins:
  - `https://auth.expo.io`
  - `http://localhost`
- Authorized redirect URIs:
  - `https://auth.expo.io/@aihoni/aihoni`  *(your Expo proxy URL — replace `@aihoni/aihoni` if owner/slug differs)*
  - `aihoni://`  *(custom scheme for dev client)*
- **Create** → copy the **Client ID** (looks like `1234567890-xxx.apps.googleusercontent.com`)

### 3b · iOS

- Application type: **iOS**
- Name: `aihoni · iOS`
- Bundle ID: **`com.nepfinder.aihoni`**
- **Create** → copy the **Client ID** and the **iOS URL scheme** (`com.googleusercontent.apps.1234…`)

### 3c · Android

- Application type: **Android**
- Name: `aihoni · Android`
- Package name: **`com.nepfinder.aihoni`**
- SHA-1 fingerprint: get it from `eas credentials -p android` → look for **SHA-1 Certificate fingerprint** (NOT SHA-256). Paste it here.
- **Create** → copy the **Client ID**

---

## Step 4 — Add the IDs to the backend (Cloudflare)

Replace the placeholder secret with the three client IDs, comma-separated:

```bash
echo "WEB_ID.apps.googleusercontent.com,IOS_ID.apps.googleusercontent.com,ANDROID_ID.apps.googleusercontent.com" | \
  wrangler pages secret put GOOGLE_CLIENT_IDS --project-name=aihoni
```

The backend verifier loops through these three audiences when verifying an ID token, so any of the three platforms works.

## Step 5 — Add the IDs to the mobile app

The app reads them from `EXPO_PUBLIC_*` env vars. For local dev, add to `.env` (gitignored):

```bash
# .env (project root)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=WEB_ID.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=IOS_ID.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=ANDROID_ID.apps.googleusercontent.com
```

For EAS builds, add as EAS environment variables (visible to the bundler, NOT secrets — they're public client IDs):

```bash
eas env:create --scope project --environment production --name EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID --value 'WEB_ID.apps.googleusercontent.com'
eas env:create --scope project --environment production --name EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID --value 'IOS_ID.apps.googleusercontent.com'
eas env:create --scope project --environment production --name EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID --value 'ANDROID_ID.apps.googleusercontent.com'
```

(Repeat with `--environment preview` and `--environment development` if you want them in those builds too.)

## Step 6 — iOS extra config (only for native iOS builds)

Add the iOS URL scheme to `app.json` under `ios.infoPlist.CFBundleURLTypes`:

```json
"ios": {
  "bundleIdentifier": "com.nepfinder.aihoni",
  "infoPlist": {
    "CFBundleURLTypes": [
      { "CFBundleURLSchemes": ["com.googleusercontent.apps.IOS_ID"] }
    ]
  }
}
```

(Skip this if you're only testing in Expo Go.)

## Step 7 — Rebuild & test

```bash
# If on dev client / native build, redeploy:
eas build --platform android --profile preview

# Or for Expo Go, just reload Metro
```

On the Sign In screen, tap **Continue with Google**:

1. Browser opens → user picks Google account → grants email/profile
2. Browser closes, app receives `id_token`
3. App POSTs to `https://aihoni.com/api/auth/google`
4. Backend verifies the token with Google's public keys, upserts the user in D1, signs our JWT
5. App stores the JWT in iOS Keychain / Android Keystore via `expo-secure-store`
6. `useAuth()` returns `{ user: { id, name, email } }`, screen auto-advances to the next onboarding step

## Verification

```bash
# Verify the JWT-issuing endpoint exists (must say "id_token required" not 404)
curl -X POST https://aihoni.com/api/auth/google -H 'Content-Type: application/json' -d '{}'

# Verify the me endpoint exists (must say "unauthenticated" not 404)
curl https://aihoni.com/api/auth/me

# After sign-in, in the app's console you should see the response:
# { token: "eyJ…", user: { id: "g_…", name: "…", email: "…" } }
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Alert: "Google not configured" | The `EXPO_PUBLIC_GOOGLE_*` env vars are still the TODO placeholders | Add them as described in Step 5 + reload |
| Backend returns `401 invalid Google token` | Backend's `GOOGLE_CLIENT_IDS` secret doesn't include the platform-specific client ID that issued the token | Update via wrangler in Step 4 with the right IDs comma-separated |
| Backend returns `500 GOOGLE_CLIENT_IDS not configured` | Secret still has the TODO placeholder | Update via wrangler in Step 4 |
| Browser opens but never redirects back | Redirect URI mismatch | Make sure `https://auth.expo.io/@aihoni/aihoni` is in the Web client's redirect URIs |
| Android: "Error 10" | SHA-1 fingerprint missing or wrong | Re-run `eas credentials -p android`, grab the SHA-1 from the production profile, add it to the Android OAuth client |
