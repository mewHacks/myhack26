#!/usr/bin/env bash
set -euo pipefail

if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

PROJECT_ID="${PROJECT_ID:-${GOOGLE_CLOUD_PROJECT:-${FIREBASE_PROJECT_ID:-${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-flux-731fd}}}}"
REGION="${REGION:-asia-southeast1}"
REPO="${REPO:-covalent}"
SERVICE_NAME="${SERVICE_NAME:-covalent-app}"
GEMINI_MODEL="${GEMINI_MODEL:-gemini-3-flash-preview}"
SECRET_NAME="${SECRET_NAME:-gemini-api-key}"

required_public_env=(
  NEXT_PUBLIC_FIREBASE_API_KEY
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  NEXT_PUBLIC_FIREBASE_PROJECT_ID
  NEXT_PUBLIC_FIREBASE_APP_ID
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
)

missing=()
for key in "${required_public_env[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    missing+=("$key")
  fi
done

if (( ${#missing[@]} > 0 )); then
  printf 'Missing required build-time Firebase env vars: %s\n' "${missing[*]}" >&2
  printf 'Set them in your shell or .env.local before deploying.\n' >&2
  exit 1
fi

gcloud config set project "$PROJECT_ID" >/dev/null

gcloud services enable \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com \
  iamcredentials.googleapis.com \
  >/dev/null

if ! gcloud artifacts repositories describe "$REPO" --location "$REGION" >/dev/null 2>&1; then
  gcloud artifacts repositories create "$REPO" \
    --repository-format docker \
    --location "$REGION" \
    --description "Covalent Cloud Run images" \
    >/dev/null
fi

if ! gcloud secrets describe "$SECRET_NAME" >/dev/null 2>&1; then
  gcloud secrets create "$SECRET_NAME" --replication-policy automatic >/dev/null
fi

if [[ -n "${GEMINI_API_KEY:-}" ]]; then
  printf '%s' "$GEMINI_API_KEY" | gcloud secrets versions add "$SECRET_NAME" --data-file=- >/dev/null
else
  version_count="$(gcloud secrets versions list "$SECRET_NAME" --filter='state=ENABLED' --format='value(name)' | wc -l | tr -d ' ')"
  if [[ "$version_count" == "0" ]]; then
    printf 'Secret %s has no enabled versions and GEMINI_API_KEY is not set locally.\n' "$SECRET_NAME" >&2
    printf 'Set GEMINI_API_KEY locally once, rerun this script, then remove it from your shell history/session.\n' >&2
    exit 1
  fi
fi

project_number="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
runtime_sa="${project_number}-compute@developer.gserviceaccount.com"
cloudbuild_sa="${project_number}@cloudbuild.gserviceaccount.com"

gcloud secrets add-iam-policy-binding "$SECRET_NAME" \
  --member "serviceAccount:${runtime_sa}" \
  --role roles/secretmanager.secretAccessor \
  --quiet \
  >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member "serviceAccount:${cloudbuild_sa}" \
  --role roles/run.admin \
  --quiet \
  >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member "serviceAccount:${cloudbuild_sa}" \
  --role roles/iam.serviceAccountUser \
  --quiet \
  >/dev/null

gcloud builds submit . \
  --config cloudbuild.yaml \
  --substitutions "_REGION=${REGION},_REPO=${REPO},_SERVICE_NAME=${SERVICE_NAME},_GEMINI_MODEL=${GEMINI_MODEL},_SECRET_NAME=${SECRET_NAME},_NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY},_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN},_NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID},_NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID},_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET},_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}"

service_url="$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format='value(status.url)')"
printf 'Cloud Run URL: %s\n' "$service_url"
printf 'Add this domain to Firebase Auth authorized domains if Google sign-in is blocked.\n'
