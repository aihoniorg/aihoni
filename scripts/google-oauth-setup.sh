#!/usr/bin/env bash
# scripts/google-oauth-setup.sh
#
# Semi-automated Google Sign-In setup for aihoni.
#  - Creates a GCP project, enables required APIs (full auto via gcloud)
#  - Opens the 3 OAuth client-creation pages in your browser (you do ~3 min of clicking)
#  - Paste the 3 Client IDs back here
#  - Script writes them to Cloudflare secret, EAS env vars, and .env  (full auto)
#
# Prereqs:
#   • gcloud CLI    (https://cloud.google.com/sdk/docs/install)  — `brew install --cask google-cloud-sdk`
#   • wrangler      (already installed)
#   • eas-cli       (already installed)
#   • You're logged in to all three:  `gcloud auth login`, `wrangler whoami`, `eas whoami`

set -euo pipefail

PROJECT_ID="aihoni-app"
PROJECT_NAME="aihoni"
SUPPORT_EMAIL="aihoninp@gmail.com"
APP_DOMAIN="aihoni.com"
IOS_BUNDLE="com.nepfinder.aihoni"
ANDROID_PACKAGE="com.nepfinder.aihoni"

C_DIM=$'\e[2m'; C_BOLD=$'\e[1m'; C_OK=$'\e[32m'; C_WARN=$'\e[33m'; C_END=$'\e[0m'
step() { echo ""; echo "${C_BOLD}━━ $1 ━━${C_END}"; }
ok()   { echo "${C_OK}  ✓ $1${C_END}"; }
warn() { echo "${C_WARN}  ⚠ $1${C_END}"; }
prompt(){ printf "${C_BOLD}  ?${C_END} %s: " "$1"; read -r REPLY; }
opener(){ if command -v open >/dev/null; then open "$1"; elif command -v xdg-open >/dev/null; then xdg-open "$1"; else echo "  → $1"; fi; }

command -v gcloud   >/dev/null || { echo "Missing gcloud. brew install --cask google-cloud-sdk"; exit 1; }
command -v wrangler >/dev/null || { echo "Missing wrangler. npm i -g wrangler"; exit 1; }
command -v eas      >/dev/null || { echo "Missing eas-cli. npm i -g eas-cli"; exit 1; }

################################################################################
step "1/5  GCP project: $PROJECT_ID"
################################################################################

if gcloud projects describe "$PROJECT_ID" >/dev/null 2>&1; then
  ok "Project $PROJECT_ID already exists, reusing."
else
  gcloud projects create "$PROJECT_ID" --name="$PROJECT_NAME" --quiet
  ok "Created $PROJECT_ID"
fi
gcloud config set project "$PROJECT_ID" --quiet >/dev/null

################################################################################
step "2/5  Enable APIs (People + IAM)"
################################################################################

gcloud services enable \
  people.googleapis.com \
  iamcredentials.googleapis.com \
  --quiet
ok "APIs enabled"

################################################################################
step "3/5  OAuth Consent Screen  ${C_DIM}(manual — once)${C_END}"
################################################################################

cat <<EOF
  Opening the consent screen page. Fill in:
    User type:       External
    App name:        $PROJECT_NAME
    Support email:   $SUPPORT_EMAIL
    App logo:        (optional — use assets/icon.png)
    Authorized dom:  $APP_DOMAIN
    Privacy URL:     https://$APP_DOMAIN/privacy
    Terms URL:       https://$APP_DOMAIN/terms

  Scopes:  keep defaults (openid, profile, email).
  Test users:  add $SUPPORT_EMAIL plus any phones you'll test from.
  Save and leave status as "Testing".
EOF
opener "https://console.cloud.google.com/apis/credentials/consent?project=$PROJECT_ID"
prompt "Press Enter once the consent screen is configured"

################################################################################
step "4/5  Create 3 OAuth Client IDs  ${C_DIM}(manual — once)${C_END}"
################################################################################

EXPO_OWNER=$(node -p "require('./app.json').expo.owner")
EXPO_SLUG=$(node -p  "require('./app.json').expo.slug")
EXPO_REDIRECT="https://auth.expo.io/@$EXPO_OWNER/$EXPO_SLUG"

cat <<EOF
  Opening Credentials → Create credentials → OAuth Client ID.
  You'll do this THREE times:

  ┌─ Web application ─────────────────────────────────────────
  │  Name:                       aihoni · Web
  │  Authorized JS origins:      https://auth.expo.io
  │                              http://localhost
  │  Authorized redirect URIs:   $EXPO_REDIRECT
  │                              aihoni://
  └───────────────────────────────────────────────────────────

  ┌─ iOS ─────────────────────────────────────────────────────
  │  Name:        aihoni · iOS
  │  Bundle ID:   $IOS_BUNDLE
  └───────────────────────────────────────────────────────────

  ┌─ Android ─────────────────────────────────────────────────
  │  Name:           aihoni · Android
  │  Package name:   $ANDROID_PACKAGE
  │  SHA-1:          $(eas credentials -p android --non-interactive 2>/dev/null | grep -oE 'SHA1 Fingerprint:[[:space:]]+[A-F0-9:]+' | awk -F': ' '{print $2}' || echo '(run: eas credentials -p android — copy SHA-1)')
  └───────────────────────────────────────────────────────────
EOF
opener "https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"

echo ""
echo "  After creating each client, paste its Client ID below:"
echo "  (looks like: 1234567890-abcdefg.apps.googleusercontent.com)"
echo ""

prompt "Web Client ID";      WEB_ID="$REPLY"
prompt "iOS Client ID";      IOS_ID="$REPLY"
prompt "Android Client ID";  ANDROID_ID="$REPLY"

# basic sanity
for v in WEB_ID IOS_ID ANDROID_ID; do
  if [[ "${!v}" != *.apps.googleusercontent.com ]]; then
    echo "  $v does not look like a Google client ID — aborting."
    exit 1
  fi
done

################################################################################
step "5/5  Distribute IDs to Cloudflare, EAS, and .env  ${C_DIM}(full auto)${C_END}"
################################################################################

# ── Cloudflare: server-side allowlist for token verification ──────────────────
echo "$WEB_ID,$IOS_ID,$ANDROID_ID" | \
  wrangler pages secret put GOOGLE_CLIENT_IDS --project-name=aihoni >/dev/null 2>&1
ok "Cloudflare secret GOOGLE_CLIENT_IDS updated"

# ── EAS env vars: bundle-side client IDs (public — used by expo-auth-session) ─
for env in production preview development; do
  eas env:create --scope project --environment "$env" \
    --name EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID --value "$WEB_ID" \
    --visibility plaintext --non-interactive --force >/dev/null 2>&1 || true
  eas env:create --scope project --environment "$env" \
    --name EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID --value "$IOS_ID" \
    --visibility plaintext --non-interactive --force >/dev/null 2>&1 || true
  eas env:create --scope project --environment "$env" \
    --name EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID --value "$ANDROID_ID" \
    --visibility plaintext --non-interactive --force >/dev/null 2>&1 || true
done
ok "EAS env vars set for production / preview / development"

# ── Local .env for `expo start` (gitignored via *.local) ──────────────────────
ENV_FILE=".env"
{
  echo "# Generated by scripts/google-oauth-setup.sh on $(date)"
  echo "EXPO_PUBLIC_API_BASE=https://aihoni.com"
  echo "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=$WEB_ID"
  echo "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=$IOS_ID"
  echo "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=$ANDROID_ID"
} > "$ENV_FILE"
ok "Wrote $ENV_FILE"

# Ensure .env is gitignored
if ! grep -qx ".env" .gitignore 2>/dev/null; then
  echo ".env" >> .gitignore
  ok "Added .env to .gitignore"
fi

echo ""
echo "${C_OK}${C_BOLD}✨ Done. Reload Metro (press r) and try Continue with Google.${C_END}"
echo ""
echo "${C_DIM}Verify with:${C_END}"
echo "${C_DIM}  curl -X POST https://aihoni.com/api/auth/google -H 'Content-Type: application/json' -d '{}'${C_END}"
echo "${C_DIM}  → should return: {\"error\":\"id_token required\"}${C_END}"
