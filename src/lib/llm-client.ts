import { llmConfig } from "./llm-config";

export type OllamaGenerateOptions = {
  prompt: string;
  format?: "json";
  stream?: boolean;
};

export async function ollamaGenerate(options: OllamaGenerateOptions): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), llmConfig.timeoutMs);

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (llmConfig.apiKey) {
      headers.Authorization = `Bearer ${llmConfig.apiKey}`;
    }

    const response = await fetch(`${llmConfig.ollamaUrl}/api/generate`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: llmConfig.model,
        prompt: options.prompt,
        stream: options.stream ?? false,
        format: options.format,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { response?: string };
    if (!data.response?.trim()) {
      throw new Error("Ollama returned an empty response");
    }

    return data.response.trim();
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkOllamaHealth(): Promise<{
  ok: boolean;
  model: string;
  url: string;
  models: string[];
  error?: string;
}> {
  const base = { model: llmConfig.model, url: llmConfig.ollamaUrl, models: [] as string[] };

  try {
    const headers: Record<string, string> = {};
    if (llmConfig.apiKey) headers.Authorization = `Bearer ${llmConfig.apiKey}`;

    const response = await fetch(`${llmConfig.ollamaUrl}/api/tags`, { headers });
    if (!response.ok) {
      return { ...base, ok: false, error: `${response.status} ${response.statusText}` };
    }

    const data = (await response.json()) as { models?: { name: string }[] };
    const models = (data.models ?? []).map((m) => m.name);
    const hasModel = models.some(
      (name) => name === llmConfig.model || name.startsWith(`${llmConfig.model}:`)
    );

    return {
      ...base,
      ok: hasModel,
      models,
      error: hasModel ? undefined : `Model "${llmConfig.model}" not loaded. Available: ${models.join(", ") || "none"}`,
    };
  } catch (err) {
    return {
      ...base,
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
