import { NextRequest, NextResponse } from "next/server";

import { generateInterviewEvaluation } from "@/lib/interview-ai";
import {
  appendInterviewTurn,
  getInterviewEvaluation,
  getInterviewSession,
  getInterviewTranscript,
  saveInterviewEvaluation,
} from "@/lib/interview-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { sessionId?: string };
  if (!body.sessionId) {
    return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
  }

  const session = getInterviewSession(body.sessionId);
  if (!session) {
    return NextResponse.json({ error: "Interview session not found." }, { status: 404 });
  }

  const existing = getInterviewEvaluation(session.id);
  if (existing) return NextResponse.json({ evaluation: existing });

  const transcript = getInterviewTranscript(session.id);
  const hasClosing = transcript.some(
    (turn) => turn.speaker === "ai" && turn.text.includes("completes the interview")
  );
  if (!hasClosing) {
    appendInterviewTurn(session.id, {
      speaker: "ai",
      text: "Thanks, that completes the interview. The investor can now review your transcript and AI evaluation.",
    });
  }

  const evaluation = await generateInterviewEvaluation({
    sessionId: session.id,
    questions: session.questions,
    transcript: getInterviewTranscript(session.id),
  });
  saveInterviewEvaluation(evaluation);

  return NextResponse.json({ evaluation });
}
