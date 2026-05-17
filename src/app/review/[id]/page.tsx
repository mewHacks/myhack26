import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ReviewActions } from "@/components/ai-interview/review-actions";
import {
  getInterviewEvaluation,
  getInterviewSession,
  getInterviewTranscript,
} from "@/lib/interview-store";

export const metadata: Metadata = {
  title: "Interview Review | Covalent",
};

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getInterviewSession(id);
  if (!session) notFound();

  const transcript = getInterviewTranscript(id);
  const evaluation = getInterviewEvaluation(id);

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="flex flex-col gap-3 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Link className="text-sm font-semibold text-google-blue" href="/ai-interview">
              AI interview POC
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Investor review</h1>
            <p className="mt-2 text-sm text-muted">
              {session.investorName} · {session.status} · {session.roomName}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className="rounded-md border border-line px-3 py-2 text-sm font-semibold"
              href={`/interview/${session.id}`}
            >
              Open room
            </Link>
            <ReviewActions sessionId={session.id} />
          </div>
        </header>

        {evaluation ? (
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-lg border border-line p-4">
              <div className="text-sm font-semibold text-google-green">AI evaluation</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal">{evaluation.recommendation}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{evaluation.summary}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {evaluation.strengths.map((item) => (
                  <div className="rounded-md bg-google-green-soft p-3 text-sm leading-6" key={item}>
                    <div className="mb-1 font-semibold text-google-green">Strength</div>
                    {item}
                  </div>
                ))}
                {evaluation.risks.map((item) => (
                  <div className="rounded-md bg-google-red-soft p-3 text-sm leading-6" key={item}>
                    <div className="mb-1 font-semibold text-google-red">Risk</div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-lg border border-line p-4">
              <div className="text-sm font-semibold">Scores</div>
              <div className="mt-3 space-y-3">
                {Object.entries(evaluation.scores).map(([label, score]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="capitalize">{label.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-semibold">{score}/10</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-google-blue" style={{ width: `${score * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-line pt-4">
                <div className="text-sm font-semibold">Suggested follow-ups</div>
                <ul className="mt-2 space-y-2 text-sm leading-5 text-muted">
                  {evaluation.suggestedFollowups.map((item) => (
                    <li className="rounded-md bg-slate-50 p-2" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </section>
        ) : (
          <section className="rounded-lg border border-google-yellow bg-google-yellow-soft p-4">
            <div className="font-semibold">No report yet</div>
            <p className="mt-1 text-sm text-muted">
              Finish the founder interview first, then generate the AI evaluation.
            </p>
          </section>
        )}

        <section className="rounded-lg border border-line p-4">
          <div className="mb-3 text-sm font-semibold">Transcript</div>
          {transcript.length === 0 ? (
            <p className="text-sm text-muted">No transcript turns have been captured yet.</p>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {transcript.map((turn) => (
                <div
                  className={`rounded-md p-3 text-sm leading-6 ${
                    turn.speaker === "ai" ? "bg-google-blue-soft" : "bg-slate-50"
                  }`}
                  key={turn.id}
                >
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                    {turn.speaker === "ai" ? "AI investor" : "Founder"}
                  </div>
                  {turn.text}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
