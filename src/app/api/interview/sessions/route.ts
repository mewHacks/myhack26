import { NextRequest, NextResponse } from "next/server";

import { createInterviewSession, listInterviewSessions } from "@/lib/interview-store";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ sessions: listInterviewSessions() });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    investorName?: string;
    avatar?: {
      type?: "preset" | "upload";
      value?: string;
      label?: string;
    };
    voiceName?: string;
    questions?: Array<{ text?: string; theme?: string }>;
  };

  const questions = (body.questions || [])
    .map((question) => ({ text: question.text?.trim() || "", theme: question.theme }))
    .filter((question) => question.text.length > 0);

  if (questions.length === 0) {
    return NextResponse.json({ error: "At least one interview question is required." }, { status: 400 });
  }

  const session = createInterviewSession({
    investorName: body.investorName || "AI Investor",
    avatar: {
      type: body.avatar?.type || "preset",
      value: body.avatar?.value || "blue",
      label: body.avatar?.label || "Blue investor avatar",
    },
    voiceName: body.voiceName || "Browser default",
    questions,
  });

  return NextResponse.json({ session });
}
