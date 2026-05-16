/**
 * LLM routing for local Ollama (incl. LoRA via custom model name) and optional Gemini fallback.
 *
 * Local + LoRA:
 *   ollama create covalent-gemma -f deploy/ollama/Modelfile
 *   LLM_PROVIDER=ollama OLLAMA_MODEL=covalent-gemma
 *
 * Cloud Run:
 *   Deploy deploy/ollama → set OLLAMA_URL on the Next.js service.
 */
export type LlmProvider = "ollama" | "gemini";

export function resolveLlmProvider(env: NodeJS.ProcessEnv = process.env): LlmProvider {
  const explicit = env.LLM_PROVIDER?.toLowerCase();
  if (explicit === "gemini" || explicit === "ollama") return explicit;
  if (env.GEMINI_API_KEY) return "gemini";
  return "ollama";
}

export const llmConfig = {
  provider: resolveLlmProvider(),
  ollamaUrl: process.env.OLLAMA_URL ?? "http://127.0.0.1:11434",
  /** Custom Ollama model (Modelfile + ADAPTER for your LoRA). */
  model: process.env.OLLAMA_MODEL ?? "gemma3",
  apiKey: process.env.OLLAMA_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
  timeoutMs: Number(process.env.LLM_TIMEOUT_MS ?? "120000"),
  enabled: process.env.LLM_ENABLED !== "false",
} as const;
