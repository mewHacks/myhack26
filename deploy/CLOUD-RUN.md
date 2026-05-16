# Cloud Run + Gemma LoRA

## One-command deploy (after `gcloud auth login`)

```bash
# With LoRA adapter folder:
./scripts/deploy-all.sh /path/to/lora-adapter

# Without LoRA (uses base gemma3 on Cloud Run):
./scripts/deploy-all.sh
```

Or step by step:

```bash
./scripts/setup-lora-model.sh /path/to/lora-adapter   # local only
./scripts/deploy-ollama.sh
export OLLAMA_URL=$(gcloud run services describe covalent-ollama --region asia-southeast1 --format='value(status.url)')
./scripts/deploy-app.sh
```

npm aliases: `npm run deploy:ollama`, `npm run deploy:app`, `npm run deploy:all`

---

# Cloud Run + Gemma LoRA (2-hour deploy cheat sheet)

Your Next.js app talks to Ollama over HTTP. The **LoRA lives inside the Ollama model**, not in Next.js.

## Architecture

```
Browser → Cloud Run (Next.js)  --OLLAMA_URL-->  Cloud Run/GCE (Ollama + covalent-gemma)
```

## Step 1 — Register LoRA locally (5 min)

Copy your fine-tuned adapter (safetensors from Kaggle/Unsloth/etc.):

```bash
chmod +x scripts/setup-lora-model.sh
./scripts/setup-lora-model.sh /path/to/your/lora-adapter-folder
```

Verify:

```bash
ollama run covalent-gemma "Say OK"
curl http://localhost:11434/api/tags
```

## Step 2 — Deploy Ollama with LoRA (30–45 min)

```bash
# Use Cloud Build (recommended — matches cloudbuild-ollama.yaml):
gcloud builds submit --config deploy/cloudbuild-ollama.yaml \
  --substitutions _REGION=asia-southeast1,_REPO=covalent,_OLLAMA_MODEL=covalent-gemma .
```

Or manually (replace `YOUR_PROJECT`):

```bash
REGION=asia-southeast1
PROJECT=$(gcloud config get-value project)
IMAGE="${REGION}-docker.pkg.dev/${PROJECT}/covalent/covalent-ollama"

docker build -t "$IMAGE" -f deploy/ollama/Dockerfile deploy/ollama
docker push "$IMAGE"

gcloud run deploy covalent-ollama \
  --image "$IMAGE" \
  --region "$REGION" \
  --port 11434 \
  --cpu 4 --memory 16Gi \
  --gpu 1 --gpu-type nvidia-l4 \
  --timeout 300 \
  --min-instances 1 \
  --allow-unauthenticated \
  --set-env-vars OLLAMA_MODEL=covalent-gemma \
  --set-secrets OLLAMA_API_KEY=ollama-api-key:latest
```

Copy the service URL, e.g. `https://covalent-ollama-xxxxx.run.app`.

> **No GPU budget?** Use a small GCE VM instead (`ollama serve` + same Docker image). Slower but works for demo.

## Step 3 — Deploy Next.js (20 min)

Set env on your app service (Vercel or Cloud Run):

```env
LLM_PROVIDER=ollama
OLLAMA_URL=https://covalent-ollama-xxxxx.run.app
OLLAMA_MODEL=covalent-gemma
LLM_TIMEOUT_MS=180000
```

**Important:** Do **not** set `GEMINI_API_KEY` if you want LoRA — otherwise `LLM_PROVIDER` defaults to Gemini when that key exists.

Force Ollama:

```env
LLM_PROVIDER=ollama
```

## Step 4 — Smoke test

```bash
curl https://YOUR-APP.run.app/api/health/llm
curl -X POST https://YOUR-APP.run.app/api/match \
  -H "Content-Type: application/json" \
  -d '{"viewerId":"founder-aisha"}'
```

## Troubleshooting

| Symptom | Fix |
|--------|-----|
| `Model "covalent-gemma" not loaded` | Re-run `setup-lora-model.sh`; check adapter files in `deploy/ollama/adapters/covalent-lora/` |
| Timeout on Cloud Run | Increase `LLM_TIMEOUT_MS`; set Ollama `--min-instances 1` |
| Falls back to deterministic scores | Ollama unreachable from app — check `OLLAMA_URL`, firewall, `--allow-unauthenticated` |
| Want Gemini instead of LoRA | `LLM_PROVIDER=gemini` + `GEMINI_API_KEY=...` |

## Hackathon demo fallback

If Ollama deploy fails, the app still works with **deterministic matching** (no GPU). Judges still see scores; mention LoRA in the pitch and show local `ollama run covalent-gemma`.
