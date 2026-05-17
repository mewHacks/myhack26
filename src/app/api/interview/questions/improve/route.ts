import { NextRequest, NextResponse } from "next/server";

import { improveQuestions } from "@/lib/interview-ai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { questions?: string };
  const improved = await improveQuestions(body.questions || "");
  return NextResponse.json({ questions: improved });
}
