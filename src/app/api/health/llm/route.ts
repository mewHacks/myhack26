import { NextResponse } from "next/server";

import { llmConfig } from "@/lib/llm-config";
import { checkOllamaHealth } from "@/lib/llm-client";

export async function GET() {
  if (!llmConfig.enabled) {
    return NextResponse.json({
      ok: false,
      enabled: false,
      message: "LLM disabled (LLM_ENABLED=false). Using deterministic matcher.",
    });
  }

  if (llmConfig.provider === "gemini") {
    return NextResponse.json({
      enabled: true,
      provider: "gemini",
      ok: Boolean(llmConfig.geminiApiKey),
      model: llmConfig.geminiModel,
      error: llmConfig.geminiApiKey ? undefined : "GEMINI_API_KEY missing",
    });
  }

  const health = await checkOllamaHealth();
  return NextResponse.json({
    enabled: true,
    provider: "ollama",
    ...health,
  });
}
