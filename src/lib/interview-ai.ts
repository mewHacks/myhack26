import type { InterviewQuestion, InterviewTurn } from "@/lib/interview-store";
import type { InterviewEvaluation } from "@/lib/interview-store";

export type InterviewDecision = {
  action: "follow_up" | "next_question" | "finish";
  message: string;
  nextQuestionIndex: number;
  reason: string;
};

const defaultQuestions = [
  "What problem are you solving, and who feels it most urgently?",
  "Who is your initial target customer, and how are you reaching them?",
  "What evidence do you have that customers want this solution?",
  "What is your business model, and what would make it durable?",
  "What are the biggest risks you need to resolve in the next six months?",
];

function extractJsonObject(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as unknown;
  } catch {
    return null;
  }
}

async function callGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.45 },
      }),
    }
  );

  if (!response.ok) return null;
  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

function splitQuestionLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-*\d.\s)]+/, "").trim())
    .filter((line) => line.length > 12)
    .slice(0, 8);
}

export async function improveQuestions(rawQuestions: string): Promise<string[]> {
  const prompt = `Improve these investor interview questions for a founder interview.
Make them concise, specific, non-leading, and useful for evaluating startup quality.
Return only a numbered list.

Questions:
${rawQuestions}`;

  const aiText = await callGemini(prompt);
  if (aiText) {
    const parsed = splitQuestionLines(aiText);
    if (parsed.length > 0) return parsed;
  }

  const lines = splitQuestionLines(rawQuestions);
  if (lines.length === 0) return defaultQuestions;
  return lines.map((line) => {
    const lower = line.toLowerCase();
    if (lower.includes("customer")) {
      return "Who is your initial target customer, and what makes them urgently need this?";
    }
    if (lower.includes("traction") || lower.includes("metric")) {
      return "What traction or usage evidence shows customers want this product?";
    }
    if (lower.includes("money") || lower.includes("revenue") || lower.includes("business")) {
      return "What is your business model, and what evidence supports it?";
    }
    return line.endsWith("?") ? line : `${line}?`;
  });
}

function hasSpecificEvidence(answer: string) {
  return /\d|percent|%|customer|pilot|revenue|mrr|arr|signed|paid|retention|usage/i.test(answer);
}

function fallbackDecision(args: {
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  answer: string;
  transcript: InterviewTurn[];
}): InterviewDecision {
  const nextQuestionIndex = args.currentQuestionIndex + 1;
  const nextQuestion = args.questions[nextQuestionIndex];
  if (!nextQuestion) {
    return {
      action: "finish",
      message:
        "Thanks, that completes the interview. The investor can now review your transcript and AI evaluation.",
      nextQuestionIndex: args.currentQuestionIndex,
      reason: "All planned questions have been covered.",
    };
  }

  return {
    action: "next_question",
    message: nextQuestion.text,
    nextQuestionIndex,
    reason: "Continue with the next planned preview question.",
  };
}

export function decideNextInterviewMove(args: {
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  answer: string;
  transcript: InterviewTurn[];
}): InterviewDecision {
  return fallbackDecision(args);
}

export async function generateInterviewEvaluation(args: {
  sessionId: string;
  questions: InterviewQuestion[];
  transcript: InterviewTurn[];
}): Promise<InterviewEvaluation> {
  const prompt = `Evaluate this founder interview for an investor.
Base the evaluation only on the transcript. Return strict JSON:
{
  "summary": string,
  "scores": { "clarity": number, "market": number, "traction": number, "businessModel": number, "team": number, "fundraisingReadiness": number },
  "strengths": string[],
  "risks": string[],
  "suggestedFollowups": string[],
  "recommendation": string
}

Questions:
${args.questions.map((q) => `- ${q.text}`).join("\n")}

Transcript:
${args.transcript.map((turn) => `${turn.speaker}: ${turn.text}`).join("\n")}`;

  const aiText = await callGemini(prompt);
  const parsed = aiText ? extractJsonObject(aiText) : null;
  if (parsed && typeof parsed === "object" && "summary" in parsed) {
    const report = parsed as Partial<InterviewEvaluation>;
    return {
      sessionId: args.sessionId,
      summary: String(report.summary || "The founder completed the interview."),
      scores: report.scores || {},
      strengths: Array.isArray(report.strengths) ? report.strengths.map(String) : [],
      risks: Array.isArray(report.risks) ? report.risks.map(String) : [],
      suggestedFollowups: Array.isArray(report.suggestedFollowups)
        ? report.suggestedFollowups.map(String)
        : [],
      recommendation: String(report.recommendation || "Review manually"),
      createdAt: new Date().toISOString(),
    };
  }

  const founderTurns = args.transcript.filter((turn) => turn.speaker === "founder");
  const combinedAnswers = founderTurns.map((turn) => turn.text).join(" ");
  const evidenceScore = hasSpecificEvidence(combinedAnswers) ? 7 : 5;
  const completenessScore = Math.min(8, Math.max(4, founderTurns.length + 3));

  return {
    sessionId: args.sessionId,
    summary:
      founderTurns.length > 0
        ? "The founder completed the POC interview. Review the transcript for the strongest signals and unresolved risks."
        : "No founder answers were captured yet.",
    scores: {
      clarity: completenessScore,
      market: evidenceScore,
      traction: evidenceScore,
      businessModel: Math.max(4, evidenceScore - 1),
      team: 6,
      fundraisingReadiness: Math.max(4, evidenceScore - 1),
    },
    strengths: [
      founderTurns.length > 2
        ? "The founder engaged across multiple investor questions."
        : "The founder provided an initial response for review.",
      hasSpecificEvidence(combinedAnswers)
        ? "Some answers included concrete signals or metrics."
        : "The conversation produced a useful starting transcript.",
    ],
    risks: [
      hasSpecificEvidence(combinedAnswers)
        ? "The investor should verify the claims and supporting evidence."
        : "The answers need more concrete metrics, customer examples, or traction details.",
    ],
    suggestedFollowups: [
      "Which customer segment is most urgent and easiest to win first?",
      "What metric would prove this is working over the next 30 days?",
      "What has changed recently that makes now the right time?",
    ],
    recommendation: "Proceed to manual investor review",
    createdAt: new Date().toISOString(),
  };
}
