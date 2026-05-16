import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

export type InterviewQuestion = {
  id: string;
  text: string;
  theme: string;
};

export type InterviewSession = {
  id: string;
  investorName: string;
  founderName?: string;
  companyName?: string;
  avatar: {
    type: "preset" | "upload";
    value: string;
    label: string;
  };
  voiceName: string;
  roomName: string;
  status: "draft" | "active" | "completed";
  questions: InterviewQuestion[];
  createdAt: string;
  updatedAt: string;
};

export type InterviewTurn = {
  id: string;
  speaker: "ai" | "founder";
  text: string;
  questionId?: string;
  createdAt: string;
};

export type InterviewEvaluation = {
  sessionId: string;
  summary: string;
  scores: Record<string, number>;
  strengths: string[];
  risks: string[];
  suggestedFollowups: string[];
  recommendation: string;
  createdAt: string;
};

const rootDir = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "ai-interviews");
const sessionsFile = path.join(rootDir, "sessions.json");
const transcriptsDir = path.join(rootDir, "transcripts");
const reportsDir = path.join(rootDir, "reports");

function ensureStore() {
  for (const dir of [rootDir, transcriptsDir, reportsDir]) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }
  if (!existsSync(sessionsFile)) writeFileSync(sessionsFile, "[]", "utf8");
}

function readJson<T>(filePath: string, fallback: T): T {
  ensureStore();
  if (!existsSync(filePath)) return fallback;
  const raw = readFileSync(filePath, "utf8");
  if (!raw.trim()) return fallback;
  return JSON.parse(raw) as T;
}

function writeJson(filePath: string, data: unknown) {
  ensureStore();
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function makeId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function transcriptFile(sessionId: string) {
  return path.join(transcriptsDir, `${sessionId}.json`);
}

function reportFile(sessionId: string) {
  return path.join(reportsDir, `${sessionId}.json`);
}

export function listInterviewSessions(): InterviewSession[] {
  return readJson<InterviewSession[]>(sessionsFile, []).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function getInterviewSession(id: string): InterviewSession | null {
  return listInterviewSessions().find((session) => session.id === id) ?? null;
}

export function createInterviewSession(input: {
  investorName: string;
  avatar: InterviewSession["avatar"];
  voiceName: string;
  questions: Array<{ text: string; theme?: string }>;
}): InterviewSession {
  const now = new Date().toISOString();
  const id = makeId("session");
  const session: InterviewSession = {
    id,
    investorName: input.investorName.trim() || "AI Investor",
    avatar: input.avatar,
    voiceName: input.voiceName || "Browser default",
    roomName: `interview-${id}`,
    status: "draft",
    questions: input.questions
      .map((question, index) => ({
        id: `q_${index + 1}`,
        text: question.text.trim(),
        theme: question.theme?.trim() || "Founder interview",
      }))
      .filter((question) => question.text.length > 0),
    createdAt: now,
    updatedAt: now,
  };

  const sessions = listInterviewSessions();
  writeJson(sessionsFile, [session, ...sessions]);
  writeJson(transcriptFile(id), []);
  return session;
}

export function updateInterviewSession(
  id: string,
  patch: Partial<Pick<InterviewSession, "status" | "founderName" | "companyName">>
): InterviewSession | null {
  const sessions = listInterviewSessions();
  const index = sessions.findIndex((session) => session.id === id);
  if (index === -1) return null;
  sessions[index] = {
    ...sessions[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  writeJson(sessionsFile, sessions);
  return sessions[index];
}

export function getInterviewTranscript(sessionId: string): InterviewTurn[] {
  return readJson<InterviewTurn[]>(transcriptFile(sessionId), []);
}

export function appendInterviewTurn(
  sessionId: string,
  turn: Omit<InterviewTurn, "id" | "createdAt">
): InterviewTurn {
  const turns = getInterviewTranscript(sessionId);
  const entry: InterviewTurn = {
    ...turn,
    id: makeId("turn"),
    createdAt: new Date().toISOString(),
  };
  writeJson(transcriptFile(sessionId), [...turns, entry]);
  return entry;
}

export function saveInterviewEvaluation(evaluation: InterviewEvaluation) {
  writeJson(reportFile(evaluation.sessionId), evaluation);
  updateInterviewSession(evaluation.sessionId, { status: "completed" });
}

export function getInterviewEvaluation(sessionId: string): InterviewEvaluation | null {
  return readJson<InterviewEvaluation | null>(reportFile(sessionId), null);
}
