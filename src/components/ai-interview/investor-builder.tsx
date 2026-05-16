"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChangeEvent, ClipboardEvent, DragEvent, useEffect, useMemo, useState } from "react";

import investorBodyTemplate from "@/assets/generated/investor-body-template.png";
import { BrandMark } from "@/components/brand-mark";
import NavHeader from "@/components/ui/nav-header";

const headerLinks = [
  { href: "/startup", label: "Startup", color: "var(--color-google-blue)" },
  { href: "/mentors", label: "Mentors", color: "var(--color-google-yellow)" },
  { href: "/investors", label: "Investors", color: "var(--color-google-green)" },
  { href: "/ai-interview", label: "AI Interview", color: "var(--color-google-red)" },
];

const starterQuestions = [
  "What problem are you solving, and who feels it most urgently?",
].join("\n");

type CreatedSession = {
  id: string;
  roomName: string;
};

export function InvestorBuilder() {
  const router = useRouter();
  const [investorName, setInvestorName] = useState("Dagestan");
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const [questions, setQuestions] = useState(starterQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState("");
  const [voiceName, setVoiceName] = useState("Browser default");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState("Waiting for image");
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [savedFingerprint, setSavedFingerprint] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const questionRows = useMemo(
    () =>
      questions
        .split("\n")
        .map((question) => question.trim())
        .filter(Boolean),
    [questions]
  );

  const previewQuestionIndex = Math.min(activeQuestionIndex, Math.max(questionRows.length - 1, 0));
  const previewAvatar = generatedAvatar || uploadedAvatar;
  const voiceSummary = voiceName === "Browser default" ? "Default browser voice" : voiceName;
  const avatarSummary = generatedAvatar
    ? "Generated avatar ready"
    : uploadedAvatar
      ? "Uploaded photo ready"
      : "No avatar image yet";

  const sessionFingerprint = useMemo(
    () =>
      JSON.stringify({
        investorName: investorName.trim(),
        avatar: generatedAvatar || uploadedAvatar || "pending-upload",
        voiceName,
        questions: questionRows,
      }),
    [generatedAvatar, investorName, questionRows, uploadedAvatar, voiceName]
  );

  async function generateAvatarFromImage(sourceImage: string, name: string) {
    setIsGeneratingAvatar(true);
    setAvatarError(null);
    setAvatarStatus("Generating avatar...");

    try {
      const response = await fetch("/api/interview/avatar-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: sourceImage,
          investorName: name,
        }),
      });

      const data = (await response.json()) as { image?: string; error?: string };
      if (!response.ok || !data.image) {
        throw new Error(data.error || "Could not generate avatar.");
      }

      setGeneratedAvatar(data.image);
      setAvatarStatus("Avatar ready");
    } catch (err) {
      setGeneratedAvatar(null);
      setAvatarError(err instanceof Error ? err.message : "Could not generate avatar.");
      setAvatarStatus(sourceImage ? "Using uploaded image" : "Generation failed");
    } finally {
      setIsGeneratingAvatar(false);
    }
  }

  async function handleAvatarFile(file?: File) {
    if (!file) return;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read image."));
      reader.readAsDataURL(file);
    });

    setUploadedAvatar(dataUrl);
    setGeneratedAvatar(null);
    setAvatarError(null);
    setAvatarStatus("Image uploaded");
    await generateAvatarFromImage(dataUrl, investorName);
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    await handleAvatarFile(event.target.files?.[0]);
  }

  async function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    await handleAvatarFile(event.dataTransfer.files?.[0]);
  }

  async function handlePaste(event: ClipboardEvent<HTMLLabelElement>) {
    const file = Array.from(event.clipboardData.files).find((item) => item.type.startsWith("image/"));
    await handleAvatarFile(file);
  }

  function speakQuestion(question: string, index: number) {
    setActiveQuestionIndex(index);
    if (!("speechSynthesis" in window) || !question) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question);
    const selectedVoice = voices.find((voice) => voice.name === voiceName);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.94;
    utterance.pitch = 0.98;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  async function improveWithAi() {
    setIsImproving(true);
    setError(null);
    try {
      const targetQuestions = isAddingQuestion ? newQuestion : questions;
      const response = await fetch("/api/interview/questions/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: targetQuestions }),
      });
      const data = (await response.json()) as { questions?: string[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Could not improve questions.");
      const improved = (data.questions || []).join("\n");
      if (isAddingQuestion) {
        setNewQuestion(improved);
      } else {
        setQuestions(improved);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not improve questions.");
    } finally {
      setIsImproving(false);
    }
  }

  function addQuestion() {
    setNewQuestion("");
    setIsAddingQuestion(true);
  }

  function saveNewQuestion() {
    const trimmedQuestion = newQuestion.trim();
    if (!trimmedQuestion) {
      setIsAddingQuestion(false);
      setNewQuestion("");
      return;
    }

    setQuestions((current) => `${current.trimEnd()}\n${trimmedQuestion}`.trimStart());
    setActiveQuestionIndex(questionRows.length);
    setNewQuestion("");
    setIsAddingQuestion(false);
  }

  function replaceQuestionAt(index: number, nextQuestion: string) {
    const nextQuestions = questionRows.map((question, questionIndex) =>
      questionIndex === index ? nextQuestion : question
    );
    setQuestions(nextQuestions.join("\n"));
  }

  function startEditingQuestion(index: number, question: string) {
    setIsAddingQuestion(false);
    setNewQuestion("");
    setEditingQuestionIndex(index);
    setEditingQuestion(question);
  }

  function saveEditedQuestion() {
    if (editingQuestionIndex === null) return;
    const trimmedQuestion = editingQuestion.trim();
    if (trimmedQuestion) {
      replaceQuestionAt(editingQuestionIndex, trimmedQuestion);
    }
    setEditingQuestionIndex(null);
    setEditingQuestion("");
  }

  function deleteQuestion(index: number) {
    const nextQuestions = questionRows.filter((_, questionIndex) => questionIndex !== index);
    setQuestions(nextQuestions.join("\n"));
    if (previewQuestionIndex >= nextQuestions.length) {
      setActiveQuestionIndex(Math.max(nextQuestions.length - 1, 0));
    }
    if (editingQuestionIndex === index) {
      setEditingQuestionIndex(null);
      setEditingQuestion("");
    }
  }

  async function savePreferences() {
    if (questionRows.length === 0 || !investorName.trim()) return;

    setIsSavingPreferences(true);
    setError(null);
    try {
      const response = await fetch("/api/interview/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investorName,
          avatar: uploadedAvatar
            ? {
                type: "upload",
                value: generatedAvatar || uploadedAvatar,
                label: generatedAvatar ? "Generated avatar" : "Uploaded headshot",
              }
            : { type: "preset", value: "blue", label: "Uploaded headshot pending" },
          voiceName,
          questions: questionRows.map((text) => ({ text })),
        }),
      });
      const data = (await response.json()) as { session?: CreatedSession; error?: string };
      if (!response.ok || !data.session) throw new Error(data.error || "Could not save preferences.");
      setSavedFingerprint(sessionFingerprint);
      router.push(`/interview/${data.session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save preferences.");
    } finally {
      setIsSavingPreferences(false);
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-4 px-6 py-5 sm:px-10 lg:px-12">
        <header className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-line bg-card px-5 py-3">
          <Link href="/" className="text-lg leading-none">
            <BrandMark />
          </Link>
          <NavHeader items={headerLinks} className="justify-self-center" />
          <Link href="/" className="justify-self-end text-sm font-medium text-muted transition hover:text-foreground">
            Sign in
          </Link>
        </header>

        <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[430px_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col rounded-[1.75rem] border border-line bg-card">
            <div className="border-b border-line px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">AI Interview</p>
              <h1 className="mt-2 text-2xl font-semibold">Investor setup</h1>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              <label className="block text-sm font-medium">
                Investor name
                <input
                  className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-google-blue"
                  value={investorName}
                  onChange={(event) => setInvestorName(event.target.value)}
                />
              </label>

              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Avatar image</h2>
                  <span className="text-xs font-medium text-muted">{avatarStatus}</span>
                </div>
                <label
                  className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line bg-slate-50 px-4 text-center transition hover:border-google-blue"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  onPaste={handlePaste}
                  tabIndex={0}
                >
                  <span className="text-sm font-semibold">Upload investor photo</span>
                  <span className="mt-1 text-xs leading-5 text-muted">
                    Click, drop, or paste an image. We will generate the avatar automatically.
                  </span>
                  <input accept="image/*" className="hidden" type="file" onChange={handleUpload} />
                </label>
                {avatarError ? <p className="mt-2 text-xs font-medium text-google-red">{avatarError}</p> : null}
              </section>

              <label className="block text-sm font-medium">
                Voice
                <select
                  className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-google-blue"
                  value={voiceName}
                  onChange={(event) => setVoiceName(event.target.value)}
                >
                  <option>Browser default</option>
                  {voices.map((voice) => (
                    <option key={`${voice.name}-${voice.lang}`} value={voice.name}>
                      {voice.name} - {voice.lang}
                    </option>
                  ))}
                </select>
              </label>

              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Preview questions</h2>
                  <span className="text-xs font-medium text-muted">{questionRows.length} prompts</span>
                </div>
                <ol className="space-y-2">
                  {questionRows.map((question, index) => (
                    <li key={`${question}-${index}`}>
                      {editingQuestionIndex === index ? (
                        <div className="rounded-xl border border-google-blue bg-white p-2">
                          <textarea
                            autoFocus
                            className="h-20 w-full resize-none rounded-lg border border-line bg-white p-3 text-sm leading-6 outline-none transition focus:border-google-blue"
                            onChange={(event) => setEditingQuestion(event.target.value)}
                            onKeyDown={(event) => {
                              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                                event.preventDefault();
                                saveEditedQuestion();
                              }
                              if (event.key === "Escape") {
                                setEditingQuestionIndex(null);
                                setEditingQuestion("");
                              }
                            }}
                            value={editingQuestion}
                          />
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <button
                              className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-muted transition hover:text-foreground"
                              onClick={() => {
                                setEditingQuestionIndex(null);
                                setEditingQuestion("");
                              }}
                              type="button"
                            >
                              Cancel
                            </button>
                            <button
                              className="rounded-lg bg-google-blue px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
                              disabled={!editingQuestion.trim()}
                              onClick={saveEditedQuestion}
                              type="button"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`group flex items-center gap-2 rounded-xl border transition ${
                            previewQuestionIndex === index
                              ? "border-google-green bg-google-green-soft text-google-green"
                              : "border-line bg-white text-muted hover:text-foreground"
                          }`}
                        >
                          <button
                            className="min-w-0 flex-1 px-3 py-2 text-left text-sm leading-5"
                            type="button"
                            onClick={() => speakQuestion(question, index)}
                          >
                            <span className="mr-2 text-xs font-semibold text-muted">{String(index + 1).padStart(2, "0")}</span>
                            {question}
                          </button>
                          <div className="flex shrink-0 gap-1 pr-2 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                            <button
                              aria-label={`Edit question ${index + 1}`}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-white text-muted transition hover:border-google-blue hover:text-google-blue"
                              onClick={() => startEditingQuestion(index, question)}
                              title="Edit question"
                              type="button"
                            >
                              <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                                <path
                                  d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20zM13.5 6l4.5 4.5"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.8"
                                />
                              </svg>
                            </button>
                            <button
                              aria-label={`Delete question ${index + 1}`}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-white text-muted transition hover:border-google-red hover:text-google-red"
                              onClick={() => deleteQuestion(index)}
                              title="Delete question"
                              type="button"
                            >
                              <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                                <path
                                  d="M6 7h12M10 7V5h4v2M9 10v7M15 10v7M8 7l1 13h6l1-13"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.8"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
                {isAddingQuestion ? (
                  <div className="mt-2 rounded-xl border border-google-blue bg-white p-2">
                    <div className="relative">
                      <textarea
                        autoFocus
                        className="h-24 w-full resize-none rounded-lg border border-line bg-white p-3 pr-12 text-sm leading-6 outline-none transition focus:border-google-blue"
                        id="new-question"
                        onChange={(event) => setNewQuestion(event.target.value)}
                        onKeyDown={(event) => {
                          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                            event.preventDefault();
                            saveNewQuestion();
                          }
                        }}
                        placeholder="Type a new investor question..."
                        value={newQuestion}
                      />
                      <button
                        aria-label="Improve new question with AI"
                        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg border border-google-blue bg-white text-google-blue shadow-sm transition hover:bg-google-blue-soft disabled:opacity-50"
                        disabled={isImproving || !newQuestion.trim()}
                        onClick={improveWithAi}
                        title="Improve question"
                        type="button"
                      >
                        <svg
                          aria-hidden="true"
                          className={isImproving ? "h-4 w-4 animate-pulse" : "h-4 w-4"}
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 3l1.45 4.55L18 9l-4.55 1.45L12 15l-1.45-4.55L6 9l4.55-1.45L12 3zM19 14l.85 2.65L22.5 17.5l-2.65.85L19 21l-.85-2.65-2.65-.85 2.65-.85L19 14zM5 13l.7 2.3L8 16l-2.3.7L5 19l-.7-2.3L2 16l2.3-.7L5 13z"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-muted transition hover:text-foreground"
                        onClick={() => {
                          setIsAddingQuestion(false);
                          setNewQuestion("");
                        }}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="rounded-lg bg-google-blue px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
                        disabled={!newQuestion.trim()}
                        onClick={saveNewQuestion}
                        type="button"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="mt-2 flex h-10 w-full items-center justify-center rounded-xl border border-dashed border-line bg-slate-50 text-lg font-semibold text-google-blue transition hover:border-google-blue hover:bg-google-blue-soft"
                    onClick={addQuestion}
                    title="Add question"
                    type="button"
                  >
                    +
                  </button>
                )}
              </section>

              {error ? <p className="rounded-xl bg-google-red-soft px-3 py-2 text-sm font-medium text-google-red">{error}</p> : null}
            </div>

          </aside>

          <section className="relative flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-line bg-[linear-gradient(120deg,#ffffff_0%,#ffffff_56%,rgba(66,133,244,0.13)_100%)]">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Live Preview</p>
                <h2 className="mt-1 text-xl font-semibold">{investorName}</h2>
              </div>
              <div className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-muted">
                {isGeneratingAvatar ? "Generating avatar" : isSpeaking ? "Speaking" : "Idle"} · {questionRows.length} prompts
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-rows-[1fr_auto]">
              <div className="relative flex min-h-0 items-center justify-center p-6">
                <div className={`relative aspect-[1082/1536] w-[340px] max-w-[72vw] overflow-visible ${isSpeaking ? "animate-[avatar-talk_1s_ease-in-out_infinite]" : "animate-[avatar-idle_5s_ease-in-out_infinite]"}`}>
                  <div className="absolute inset-x-[12%] bottom-[4%] h-[7%] rounded-[50%] bg-slate-300/70 blur-xl" />
                  <Image
                    alt="Investor body template"
                    className="h-full w-full object-contain"
                    priority
                    src={investorBodyTemplate}
                  />
                  <div className="absolute left-1/2 top-[11.5%] h-[31.5%] w-[28.5%] -translate-x-1/2 overflow-hidden rounded-[46%] border-2 border-[#b69780]/70 bg-slate-100 shadow-[0_14px_40px_rgba(66,133,244,0.18)]">
                    {previewAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={generatedAvatar ? "Generated AI avatar reference" : "Uploaded investor image"}
                        className="h-full w-full object-cover"
                        src={previewAvatar}
                      />
                    ) : isGeneratingAvatar ? (
                      <div className="flex h-full w-full items-center justify-center bg-google-yellow-soft text-center text-xs font-semibold leading-4 text-foreground">
                        Generating
                        <br />
                        avatar...
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-google-blue-soft text-center text-xs font-semibold leading-4 text-google-blue">
                        Upload
                        <br />
                        photo
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-black/18 to-transparent" />
                  </div>
                </div>
              </div>

              <div className="border-t border-line bg-white/85 p-5">
                <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-base font-semibold">
                      {isGeneratingAvatar
                        ? "Waiting for the model to return the avatar preview."
                        : savedFingerprint === sessionFingerprint
                          ? "Investor interview preferences saved."
                          : "Review the setup, then save this interviewer."}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {investorName || "Unnamed investor"} · {voiceSummary} · {avatarSummary}
                    </p>
                  </div>
                  <button
                    className="shrink-0 rounded-xl bg-google-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
                    type="button"
                    disabled={isSavingPreferences || isGeneratingAvatar || questionRows.length === 0 || !investorName.trim()}
                    onClick={savePreferences}
                  >
                    {isSavingPreferences ? "Saving..." : savedFingerprint === sessionFingerprint ? "Saved" : "Done"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
