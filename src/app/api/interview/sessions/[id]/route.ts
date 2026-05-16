import { NextResponse } from "next/server";

import {
  getInterviewEvaluation,
  getInterviewSession,
  getInterviewTranscript,
} from "@/lib/interview-store";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = getInterviewSession(id);
  if (!session) {
    return NextResponse.json({ error: "Interview session not found." }, { status: 404 });
  }

  return NextResponse.json({
    session,
    transcript: getInterviewTranscript(id),
    evaluation: getInterviewEvaluation(id),
  });
}
