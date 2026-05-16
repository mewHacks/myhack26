import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FounderRoom } from "@/components/ai-interview/founder-room";
import { getInterviewSession, getInterviewTranscript } from "@/lib/interview-store";

export const metadata: Metadata = {
  title: "Founder Interview | Covalent",
};

export default async function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getInterviewSession(id);
  if (!session) notFound();

  if (session.questions.length === 0) {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="mx-auto max-w-xl rounded-lg border border-line p-5">
          <h1 className="text-2xl font-semibold">No questions found</h1>
          <p className="mt-2 text-sm text-muted">Create a fresh AI interview session first.</p>
          <Link className="mt-4 inline-flex rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-white" href="/ai-interview">
            Create session
          </Link>
        </div>
      </main>
    );
  }

  return <FounderRoom initialTranscript={getInterviewTranscript(id)} session={session} />;
}
