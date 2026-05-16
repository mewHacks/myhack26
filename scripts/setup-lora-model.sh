#!/usr/bin/env bash
# Register your fine-tuned LoRA with Ollama locally (run once before deploy).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ADAPTER_SRC="${1:-}"
ADAPTER_DEST="$ROOT/deploy/ollama/adapters/covalent-lora"
MODEL_NAME="${OLLAMA_MODEL:-covalent-gemma}"

if [ -n "$ADAPTER_SRC" ]; then
  echo "Copying LoRA adapter from $ADAPTER_SRC ..."
  rm -rf "$ADAPTER_DEST"
  mkdir -p "$ADAPTER_DEST"
  cp -R "$ADAPTER_SRC"/. "$ADAPTER_DEST/"
fi

if [ ! "$(ls -A "$ADAPTER_DEST" 2>/dev/null)" ]; then
  echo "No adapter files in $ADAPTER_DEST"
  echo "Usage: ./scripts/setup-lora-model.sh /path/to/your/lora/adapter"
  echo "       (folder should contain adapter_config.json + adapter weights)"
  exit 1
fi

echo "Creating Ollama model: $MODEL_NAME"
ollama pull gemma3
(cd "$ROOT/deploy/ollama" && ollama create "$MODEL_NAME" -f Modelfile)

echo ""
echo "Done. Add to .env.local:"
echo "  LLM_PROVIDER=ollama"
echo "  OLLAMA_MODEL=$MODEL_NAME"
echo ""
echo "Test: curl http://localhost:3000/api/health/llm"
