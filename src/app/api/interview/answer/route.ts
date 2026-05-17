import { NextRequest, NextResponse } from "next/server";

import { decideNextInterviewMove } from "@/lib/interview-ai";
import {
  appendInterviewTurn,
  getInterviewSession,
  getInterviewTranscript,
  updateInterviewSession,
} from "@/lib/interview-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    sessionId?: string;
    answer?: string;
    currentQuestionIndex?: number;
    founderName?: string;
    companyName?: string;
  };

  if (!body.sessionId || !body.answer?.trim()) {
    return NextResponse.json({ error: "sessionId and answer are required." }, { status: 400 });
  }

  const session = getInterviewSession(body.sessionId);
  if (!session) {
    return NextResponse.json({ error: "Interview session not found." }, { status: 404 });
  }

  updateInterviewSession(session.id, {
    status: "active",
    founderName: body.founderName,
    companyName: body.companyName,
  });

  const currentQuestionIndex = Math.max(0, Math.min(body.currentQuestionIndex || 0, session.questions.length - 1));
  const currentQuestion = session.questions[currentQuestionIndex];
  const beforeTranscript = getInterviewTranscript(session.id);
  const hasQuestionTurn = beforeTranscript.some(
    (turn) => turn.speaker === "ai" && turn.questionId === currentQuestion.id
  );

  if (!hasQuestionTurn) {
    appendInterviewTurn(session.id, {
      speaker: "ai",
      text: currentQuestion.text,
      questionId: currentQuestion.id,
    });
  }

  appendInterviewTurn(session.id, {
    speaker: "founder",
    text: body.answer.trim(),
    questionId: currentQuestion.id,
  });

  const transcript = getInterviewTranscript(session.id);
  const decision = decideNextInterviewMove({
    questions: session.questions,
    currentQuestionIndex,
    answer: body.answer,
    transcript,
  });

  const nextQuestion = session.questions[decision.nextQuestionIndex];
  if (decision.action !== "finish") {
    appendInterviewTurn(session.id, {
      speaker: "ai",
      text: decision.message,
      questionId: nextQuestion?.id || currentQuestion.id,
    });
  }

  return NextResponse.json({
    decision,
    transcript: getInterviewTranscript(session.id),
  });
}
