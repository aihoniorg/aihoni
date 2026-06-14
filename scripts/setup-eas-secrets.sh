#!/usr/bin/env bash
# Provision EAS secrets + env vars for the aihoni project.
#
#   chmod +x scripts/setup-eas-secrets.sh
#   ./scripts/setup-eas-secrets.sh
#
# Prereqs:
#   • eas login                       (logged in as a member of @aihoni)
#   • Real values typed in below      (replace the TODO_ placeholders)

set -euo pipefail

# ---- public client-side env vars (will be visible in the bundle) ----
EXPO_PUBLIC_API_BASE='https://aihoni.com'
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID='TODO_WEB_CLIENT_ID.apps.googleusercontent.com'
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID='TODO_IOS_CLIENT_ID.apps.googleusercontent.com'
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID='TODO_ANDROID_CLIENT_ID.apps.googleusercontent.com'

# ---- build-time secrets (encrypted on EAS, never in the bundle) ----
APPLE_APP_SPECIFIC_PASSWORD='TODO_APPLE_APP_SPECIFIC_PASSWORD'         # appleid.apple.com → Sign-In and Security → App-Specific Passwords
APPLE_TEAM_ID='TODO_APPLE_TEAM_ID'                                     # developer.apple.com → Membership → Team ID
ASC_APP_ID='TODO_APP_STORE_CONNECT_APP_ID'                             # appstoreconnect.apple.com → Apps → your app → App Information → Apple ID (numeric)
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON='secrets/play-service-account.json'   # path to JSON keyfile from Google Cloud → IAM → Service Accounts

ENVS=(production preview development)

upsert_env() {
  local name="$1"
  local value="$2"
  local visibility="$3"   # plaintext | sensitive | secret
  for env in "${ENVS[@]}"; do
    echo "→ $env :: $name ($visibility)"
    eas env:create \
      --scope project \
      --environment "$env" \
      --name "$name" \
      --value "$value" \
      --visibility "$visibility" \
      --non-interactive --force 2>&1 | tail -2 || true
  done
}

echo "──── Public bundle env vars (plaintext) ────────────────────"
upsert_env EXPO_PUBLIC_API_BASE              "$EXPO_PUBLIC_API_BASE"              plaintext
upsert_env EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID  "$EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID"  plaintext
upsert_env EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID  "$EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID"  plaintext
upsert_env EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID "$EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID" plaintext

echo ""
echo "──── Build-only secrets (sensitive) ────────────────────────"
upsert_env APPLE_APP_SPECIFIC_PASSWORD "$APPLE_APP_SPECIFIC_PASSWORD" sensitive
upsert_env APPLE_TEAM_ID               "$APPLE_TEAM_ID"               sensitive
upsert_env ASC_APP_ID                  "$ASC_APP_ID"                  sensitive

echo ""
echo "──── Google Play submission key (file secret) ──────────────"
if [ -f "$GOOGLE_PLAY_SERVICE_ACCOUNT_JSON" ]; then
  for env in "${ENVS[@]}"; do
    echo "→ $env :: GOOGLE_PLAY_SERVICE_ACCOUNT_JSON (file)"
    eas env:create \
      --scope project \
      --environment "$env" \
      --name GOOGLE_PLAY_SERVICE_ACCOUNT_JSON \
      --type file \
      --value "$GOOGLE_PLAY_SERVICE_ACCOUNT_JSON" \
      --visibility secret \
      --non-interactive --force 2>&1 | tail -2 || true
  done
else
  echo "  (skipped — drop your service account JSON at $GOOGLE_PLAY_SERVICE_ACCOUNT_JSON first)"
fi

echo ""
echo "Done. Verify with:  eas env:list --environment production"
