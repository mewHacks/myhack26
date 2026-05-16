#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${GCP_REGION:-asia-southeast1}"
REPO="${ARTIFACT_REPO:-covalent}"
OLLAMA_MODEL="${OLLAMA_MODEL:-covalent-gemma}"
OLLAMA_URL="${OLLAMA_URL:-}"

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
  echo "Set GCP_PROJECT_ID or run: gcloud config set project YOUR_PROJECT"
  exit 1
fi

if [ -z "$OLLAMA_URL" ]; then
  OLLAMA_URL="$(gcloud run services describe covalent-ollama --region "$REGION" --format='value(status.url)' 2>/dev/null || true)"
fi

if [ -z "$OLLAMA_URL" ]; then
  echo "OLLAMA_URL is required. Deploy Ollama first: ./scripts/deploy-ollama.sh"
  exit 1
fi

IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/covalent-app:latest"

echo "Ensuring Artifact Registry repo ${REPO}..."
gcloud artifacts repositories describe "$REPO" \
  --location="$REGION" >/dev/null 2>&1 \
  || gcloud artifacts repositories create "$REPO" \
    --repository-format=docker \
    --location="$REGION" \
    --description="Covalent containers"

gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

echo "Building Next.js app..."
docker build -t "$IMAGE" -f "$ROOT/deploy/app/Dockerfile" "$ROOT"

echo "Pushing..."
docker push "$IMAGE"

echo "Deploying app (OLLAMA_URL=${OLLAMA_URL})..."
gcloud run deploy covalent-app \
  --image "$IMAGE" \
  --region "$REGION" \
  --port 8080 \
  --cpu 1 \
  --memory 1Gi \
  --timeout 300 \
  --allow-unauthenticated \
  --set-env-vars "LLM_PROVIDER=ollama,OLLAMA_MODEL=${OLLAMA_MODEL},OLLAMA_URL=${OLLAMA_URL},LLM_TIMEOUT_MS=180000"

APP_URL="$(gcloud run services describe covalent-app --region "$REGION" --format='value(status.url)')"
echo ""
echo "App deployed: ${APP_URL}"
echo "Health: ${APP_URL}/api/health/llm"
echo "Match:  curl -X POST ${APP_URL}/api/match -H 'Content-Type: application/json' -d '{\"viewerId\":\"founder-aisha\"}'"
