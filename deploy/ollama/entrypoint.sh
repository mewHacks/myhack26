#!/bin/sh
set -eu

MODEL_NAME="${OLLAMA_MODEL:-covalent-gemma}"
BUNDLE_DIR="/ollama-bundle"
ADAPTER_DIR="${BUNDLE_DIR}/adapters/covalent-lora"

echo "Starting Ollama server..."
ollama serve &
OLLAMA_PID=$!

echo "Waiting for Ollama API..."
ready=0
for _ in $(seq 1 90); do
  if curl -sf http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 1
done

if [ "$ready" -ne 1 ]; then
  echo "Ollama failed to start within 90s" >&2
  exit 1
fi

if ollama list 2>/dev/null | awk '{print $1}' | grep -qx "${MODEL_NAME}"; then
  echo "Model ${MODEL_NAME} already loaded."
elif [ -d "$ADAPTER_DIR" ] && [ -n "$(ls -A "$ADAPTER_DIR" 2>/dev/null)" ]; then
  echo "Creating ${MODEL_NAME} from Gemma base + LoRA adapter..."
  ollama pull gemma3
  ollama create "$MODEL_NAME" -f "${BUNDLE_DIR}/Modelfile"
else
  echo "No LoRA adapter in ${ADAPTER_DIR}; using base gemma3 as ${MODEL_NAME}..."
  ollama pull gemma3
  printf 'FROM gemma3\nPARAMETER temperature 0.2\n' | ollama create "$MODEL_NAME" -f -
fi

echo "Ready. Models:"
ollama list

wait "$OLLAMA_PID"
