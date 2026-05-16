#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${GCP_REGION:-asia-southeast1}"
REPO="${ARTIFACT_REPO:-covalent}"
OLLAMA_MODEL="${OLLAMA_MODEL:-covalent-gemma}"

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
  echo "Set GCP_PROJECT_ID or run: gcloud config set project YOUR_PROJECT"
  exit 1
fi

IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/covalent-ollama:latest"

echo "Ensuring Artifact Registry repo ${REPO}..."
gcloud artifacts repositories describe "$REPO" \
  --location="$REGION" >/dev/null 2>&1 \
  || gcloud artifacts repositories create "$REPO" \
    --repository-format=docker \
    --location="$REGION" \
    --description="Covalent containers"

echo "Building Ollama + LoRA image..."
docker build -t "$IMAGE" -f "$ROOT/deploy/ollama/Dockerfile" "$ROOT/deploy/ollama"

echo "Pushing..."
docker push "$IMAGE"

echo "Deploying to Cloud Run (GPU)..."
gcloud run deploy covalent-ollama \
  --image "$IMAGE" \
  --region "$REGION" \
  --port 11434 \
  --cpu 4 \
  --memory 16Gi \
  --gpu 1 \
  --gpu-type nvidia-l4 \
  --timeout 300 \
  --min-instances 1 \
  --max-instances 2 \
  --allow-unauthenticated \
  --set-env-vars "OLLAMA_MODEL=${OLLAMA_MODEL}"

OLLAMA_URL="$(gcloud run services describe covalent-ollama --region "$REGION" --format='value(status.url)')"
echo ""
echo "Ollama deployed: ${OLLAMA_URL}"
echo "Export for app deploy:"
echo "  export OLLAMA_URL=${OLLAMA_URL}"
