#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [ -n "${1:-}" ]; then
  echo "Setting up LoRA adapter from: $1"
  "$ROOT/scripts/setup-lora-model.sh" "$1"
fi

"$ROOT/scripts/deploy-ollama.sh"
export OLLAMA_URL="$(gcloud run services describe covalent-ollama --region "${GCP_REGION:-asia-southeast1}" --format='value(status.url)')"
"$ROOT/scripts/deploy-app.sh"
