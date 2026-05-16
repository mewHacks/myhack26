import { NextResponse } from "next/server";

import { GEMINI_MODEL, getGeminiGenerateContentUrl } from "@/lib/gemini-config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(getGeminiGenerateContentUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Return exactly OK." }] }],
        generationConfig: { maxOutputTokens: 8 },
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, provider: "gemini", model: GEMINI_MODEL, status: response.status },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, provider: "gemini", model: GEMINI_MODEL });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        provider: "gemini",
        model: GEMINI_MODEL,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
