"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import investorBodyTemplate from "@/assets/generated/investor-body-template.png";
import type { InterviewSession, InterviewTurn } from "@/lib/interview-store";

declare global {
  interface Window {
    LivekitClient?: {
      Room: new (options?: Record<string, unknown>) => {
        connect: (url: string, token: string) => Promise<void>;
        disconnect: () => void;
        localParticipant: {
          publishTrack: (track: LocalMediaTrack) => Promise<void>;
        };
      };
      createLocalVideoTrack: () => Promise<LocalMediaTrack>;
      createLocalAudioTrack: () => Promise<LocalMediaTrack>;
    };
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type LocalMediaTrack = {
  attach?: (element: HTMLMediaElement) => void;
  mute?: () => Promise<void> | void;
  unmute?: () => Promise<void> | void;
  stop?: () => void;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

type DecisionResponse = {
  decision: {
    action: "follow_up" | "next_question" | "finish";
    message: string;
    nextQuestionIndex: number;
  };
  transcript: InterviewTurn[];
};

function loadLiveKitScript() {
  if (window.LivekitClient) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-livekit-sdk]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("LiveKit SDK failed to load.")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/livekit-client/dist/livekit-client.umd.min.js";
    script.async = true;
    script.dataset.livekitSdk = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("LiveKit SDK failed to load."));
    document.body.appendChild(script);
  });
}

function presetAvatarClass(value: string) {
  if (value === "green") return "bg-google-green-soft text-google-green";
  if (value === "yellow") return "bg-google-yellow-soft text-stone-800";
  if (value === "red") return "bg-google-red-soft text-google-red";
  return "bg-google-blue-soft text-google-blue";
}

function normalizeSpeech(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function MicIcon({ muted = false }: { muted?: boolean }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M18 10v1a6 6 0 0 1-12 0v-1M12 17v4M8 21h8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      {muted ? (
        <path
          d="M4 4l16 16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.4"
        />
      ) : null}
    </svg>
  );
}

function CameraIcon({ muted = false }: { muted?: boolean }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="m16 10 4-2v8l-4-2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      {muted ? (
        <path
          d="M4 4l16 16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.4"
        />
      ) : null}
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 14.5c3.15-2 6.85-2 10 0l1.45.92c.7.45 1.62.28 2.07-.39l.95-1.4c.45-.67.3-1.57-.34-2.05-5.42-4.1-12.84-4.1-18.26 0-.64.48-.79 1.38-.34 2.05l.95 1.4c.45.67 1.37.84 2.07.39L7 14.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function FounderRoom({
  session,
  initialTranscript,
}: {
  session: InterviewSession;
  initialTranscript: InterviewTurn[];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<{ disconnect: () => void } | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoTrackRef = useRef<LocalMediaTrack | null>(null);
  const localAudioTrackRef = useRef<LocalMediaTrack | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldListenRef = useRef(false);
  const shouldPauseForAiRef = useRef(false);
  const hasRequestedMediaRef = useRef(false);
  const autoSubmitTimerRef = useRef<number | null>(null);
  const autoSubmitAnswerRef = useRef<(answer: string) => void>(() => {});
  const resumeListeningTimerRef = useRef<number | null>(null);
  const lastAiPromptRef = useRef("");
  const hasFounderSpeechForTurnRef = useRef(false);
  const currentQuestionIndexRef = useRef(0);
  const founderNameRef = useRef("Founder");
  const companyNameRef = useRef("DemoCo");
  const isSubmittingRef = useRef(false);
  const isFinishedRef = useRef(session.status === "completed");
  const [transcript, setTranscript] = useState<InterviewTurn[]>(initialTranscript);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [founderName] = useState(session.founderName || "Founder");
  const [companyName] = useState(session.companyName || "DemoCo");
  const [manualAnswer, setManualAnswer] = useState("");
  const [interimAnswer, setInterimAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoConnected, setIsVideoConnected] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [hasJoined, setHasJoined] = useState(session.status === "completed");
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(session.status === "completed");
  const [videoStatus, setVideoStatus] = useState("Not connected");
  const [speechSupported, setSpeechSupported] = useState(true);

  const activeQuestion = session.questions[currentQuestionIndex];
  const lastAiMessage = useMemo(
    () => [...transcript].reverse().find((turn) => turn.speaker === "ai")?.text || activeQuestion?.text,
    [activeQuestion?.text, transcript]
  );

  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
    founderNameRef.current = founderName;
    companyNameRef.current = companyName;
    isSubmittingRef.current = isSubmitting;
    isFinishedRef.current = isFinished;
  }, [companyName, currentQuestionIndex, founderName, isFinished, isSubmitting]);

  const capturedAnswer = [manualAnswer, interimAnswer].filter(Boolean).join(" ").trim();

  const clearAutoSubmitTimer = useCallback(() => {
    if (autoSubmitTimerRef.current == null) return;
    window.clearTimeout(autoSubmitTimerRef.current);
    autoSubmitTimerRef.current = null;
  }, []);

  const scheduleAutoSubmit = useCallback(
    (answer: string) => {
      clearAutoSubmitTimer();
      if (!hasFounderSpeechForTurnRef.current || !answer.trim()) return;
      autoSubmitTimerRef.current = window.setTimeout(() => {
        autoSubmitAnswerRef.current(answer);
      }, 1800);
    },
    [clearAutoSubmitTimer]
  );

  const clearResumeListeningTimer = useCallback(() => {
    if (resumeListeningTimerRef.current == null) return;
    window.clearTimeout(resumeListeningTimerRef.current);
    resumeListeningTimerRef.current = null;
  }, []);

  const isLikelyAiEcho = useCallback((text: string) => {
    const normalizedText = normalizeSpeech(text);
    const normalizedPrompt = normalizeSpeech(lastAiPromptRef.current);
    if (!normalizedText || !normalizedPrompt) return false;
    if (normalizedText === normalizedPrompt) return true;
    if (normalizedPrompt.includes(normalizedText) && normalizedText.length > 18) return true;
    return normalizedText.includes(normalizedPrompt) && normalizedPrompt.length > 18;
  }, []);

  const keepListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setSpeechSupported(false);
      return;
    }
    if (shouldPauseForAiRef.current) return;
    shouldListenRef.current = true;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window) || !text) return Promise.resolve();
      lastAiPromptRef.current = text;
      shouldPauseForAiRef.current = true;
      clearResumeListeningTimer();
      clearAutoSubmitTimer();
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
      return new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find((voice) => voice.name === session.voiceName);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = 0.96;
        utterance.onstart = () => {
          shouldPauseForAiRef.current = true;
          clearResumeListeningTimer();
          clearAutoSubmitTimer();
          recognitionRef.current?.stop();
          setIsAiSpeaking(true);
        };
        utterance.onend = () => {
          setIsAiSpeaking(false);
          clearResumeListeningTimer();
          shouldPauseForAiRef.current = false;
          hasFounderSpeechForTurnRef.current = false;
          if (shouldListenRef.current) keepListening();
          resolve();
        };
        utterance.onerror = () => {
          setIsAiSpeaking(false);
          clearResumeListeningTimer();
          shouldPauseForAiRef.current = false;
          if (shouldListenRef.current) keepListening();
          resolve();
        };
        window.speechSynthesis.speak(utterance);
      });
    },
    [clearAutoSubmitTimer, clearResumeListeningTimer, keepListening, session.voiceName]
  );

  useEffect(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      return;
    }
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      if (shouldPauseForAiRef.current) {
        setInterimAnswer("");
        return;
      }
      let finalText = "";
      let interimText = "";
      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      if (isLikelyAiEcho([finalText, interimText].filter(Boolean).join(" "))) {
        clearAutoSubmitTimer();
        setInterimAnswer("");
        return;
      }
      if (interimText) {
        clearAutoSubmitTimer();
        hasFounderSpeechForTurnRef.current = true;
        setInterimAnswer(interimText);
      }
      if (finalText.trim()) {
        hasFounderSpeechForTurnRef.current = true;
        setInterimAnswer("");
        setManualAnswer((existing) => {
          const nextAnswer = [existing, finalText.trim()].filter(Boolean).join(" ").trim();
          scheduleAutoSubmit(nextAnswer);
          return nextAnswer;
        });
      }
    };
    recognition.onend = () => {
      setIsListening(false);
      if (shouldListenRef.current && !shouldPauseForAiRef.current) {
        window.setTimeout(() => {
          try {
            recognition.start();
            setIsListening(true);
          } catch {
            setIsListening(false);
          }
        }, 250);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, [clearAutoSubmitTimer, isLikelyAiEcho, scheduleAutoSubmit]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      shouldListenRef.current = false;
      shouldPauseForAiRef.current = false;
      clearResumeListeningTimer();
      hasFounderSpeechForTurnRef.current = false;
      clearAutoSubmitTimer();
      recognitionRef.current?.stop();
      roomRef.current?.disconnect();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localVideoTrackRef.current?.stop?.();
      localAudioTrackRef.current?.stop?.();
    };
  }, [clearAutoSubmitTimer, clearResumeListeningTimer]);

  function setMediaTrackEnabled(kind: "audio" | "video", enabled: boolean) {
    localStreamRef.current
      ?.getTracks()
      .filter((track) => track.kind === kind)
      .forEach((track) => {
        track.enabled = enabled;
      });
  }

  async function setLiveKitTrackEnabled(track: LocalMediaTrack | null, enabled: boolean) {
    if (!track) return;
    if (enabled) await track.unmute?.();
    else await track.mute?.();
  }

  async function connectVideo() {
    setVideoStatus("Connecting...");
    try {
      const tokenResponse = await fetch(
        `/api/interview/livekit-token?room=${session.roomName}&identity=${encodeURIComponent(founderName)}`
      );
      const tokenData = (await tokenResponse.json()) as {
        configured?: boolean;
        token?: string;
        url?: string;
        reason?: string;
      };

      if (tokenData.configured && tokenData.token && tokenData.url) {
        await loadLiveKitScript();
        const livekit = window.LivekitClient;
        if (!livekit) throw new Error("LiveKit SDK unavailable.");
        const room = new livekit.Room({ adaptiveStream: true, dynacast: true });
        await room.connect(tokenData.url, tokenData.token);
        const videoTrack = await livekit.createLocalVideoTrack();
        const audioTrack = await livekit.createLocalAudioTrack();
        if (videoRef.current) videoTrack.attach?.(videoRef.current);
        await room.localParticipant.publishTrack(videoTrack);
        await room.localParticipant.publishTrack(audioTrack);
        roomRef.current = room;
        localVideoTrackRef.current = videoTrack;
        localAudioTrackRef.current = audioTrack;
        setIsVideoConnected(true);
        setVideoStatus("LiveKit room connected");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      localStreamRef.current = stream;
      setIsVideoConnected(true);
      setVideoStatus(tokenData.reason || "Local camera fallback connected");
    } catch (error) {
      setVideoStatus(error instanceof Error ? error.message : "Video connection failed");
    }
  }

  useEffect(() => {
    if (hasRequestedMediaRef.current) return;
    hasRequestedMediaRef.current = true;
    void connectVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!videoRef.current || !isVideoConnected) return;
    if (localStreamRef.current) {
      videoRef.current.srcObject = localStreamRef.current;
    }
    localVideoTrackRef.current?.attach?.(videoRef.current);
  }, [hasJoined, isVideoConnected]);

  async function toggleCamera() {
    const nextValue = !isVideoOn;
    setIsVideoOn(nextValue);
    setMediaTrackEnabled("video", nextValue);
    await setLiveKitTrackEnabled(localVideoTrackRef.current, nextValue);
  }

  async function toggleMic() {
    const nextValue = !isMicOn;
    setIsMicOn(nextValue);
    setMediaTrackEnabled("audio", nextValue);
    await setLiveKitTrackEnabled(localAudioTrackRef.current, nextValue);
  }

  function endCallMedia() {
    window.speechSynthesis?.cancel();
    shouldListenRef.current = false;
    shouldPauseForAiRef.current = false;
    clearResumeListeningTimer();
    hasFounderSpeechForTurnRef.current = false;
    clearAutoSubmitTimer();
    recognitionRef.current?.stop();
    roomRef.current?.disconnect();
    roomRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    localVideoTrackRef.current?.stop?.();
    localVideoTrackRef.current = null;
    localAudioTrackRef.current?.stop?.();
    localAudioTrackRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsListening(false);
    setIsVideoConnected(false);
    setVideoStatus("Call ended");
  }

  function startInterview() {
    setHasStarted(true);
    shouldListenRef.current = true;
    shouldPauseForAiRef.current = true;
    hasFounderSpeechForTurnRef.current = false;
    const firstQuestion = session.questions[0]?.text;
    if (firstQuestion) {
      setTranscript((existing) =>
        existing.length > 0
          ? existing
          : [
              {
                id: "local_first_question",
                speaker: "ai",
                text: firstQuestion,
                questionId: session.questions[0].id,
                createdAt: new Date().toISOString(),
              },
            ]
      );
      void speak(firstQuestion);
    }
  }

  function joinInterview() {
    setHasJoined(true);
    startInterview();
  }

  async function finishInterview() {
    setIsSubmitting(true);
    try {
      await fetch("/api/interview/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      });
      endCallMedia();
      setIsFinished(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitAnswer(answerOverride?: string) {
    const answer = (answerOverride ?? manualAnswer).trim();
    const questionIndex = currentQuestionIndexRef.current;
    const question = session.questions[questionIndex];
    if (!answer || isSubmittingRef.current || !question || isFinishedRef.current) return;
    clearAutoSubmitTimer();
    hasFounderSpeechForTurnRef.current = false;
    setIsSubmitting(true);
    setInterimAnswer("");
    setManualAnswer("");
    try {
      const response = await fetch("/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          answer,
          currentQuestionIndex: questionIndex,
          founderName: founderNameRef.current,
          companyName: companyNameRef.current,
        }),
      });
      const data = (await response.json()) as DecisionResponse;
      setTranscript(data.transcript);
      shouldListenRef.current = true;
      shouldPauseForAiRef.current = true;
      setCurrentQuestionIndex(data.decision.nextQuestionIndex);
      if (data.decision.action === "finish") {
        shouldListenRef.current = false;
        await speak(data.decision.message);
        await new Promise((resolve) => window.setTimeout(resolve, 450));
        await finishInterview();
      } else {
        void speak(data.decision.message);
        hasFounderSpeechForTurnRef.current = false;
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    autoSubmitAnswerRef.current = (answer: string) => {
      void submitAnswer(answer);
    };
  });

  if (isFinished) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,rgba(66,133,244,0.08),#ffffff_42%,#f8fafd)] px-5 py-8 text-foreground">
        <section className="w-full max-w-xl rounded-2xl border border-line bg-white p-8 text-center shadow-[0_24px_80px_rgba(60,64,67,0.14)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-google-green-soft text-google-green">
            <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
              <path
                d="m5 12 4 4L19 6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
              />
            </svg>
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-google-blue">Interview complete</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Thanks for joining</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Your interview with {session.investorName} has ended. The transcript and AI evaluation are ready for review.
          </p>
          <Link
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-google-blue px-6 text-sm font-semibold text-white transition hover:bg-[#3367d6]"
            href="/"
          >
            Back to home
          </Link>
        </section>
      </main>
    );
  }

  if (!hasJoined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,rgba(66,133,244,0.08),#ffffff_42%,#f8fafd)] px-5 py-8 text-foreground">
        <section className="grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div className="relative aspect-video min-h-[280px] overflow-hidden rounded-2xl border border-line bg-slate-100 shadow-[0_24px_80px_rgba(60,64,67,0.16)]">
            <video
              autoPlay
              className={`h-full w-full -scale-x-100 object-cover ${isVideoOn ? "" : "opacity-0"}`}
              muted
              playsInline
              ref={videoRef}
            />
            {!isVideoOn ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-google-blue-soft text-4xl font-semibold text-google-blue">
                  {founderName.slice(0, 1).toUpperCase()}
                </div>
              </div>
            ) : null}
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3">
              <button
                aria-label={isMicOn ? "Turn microphone off" : "Turn microphone on"}
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  isMicOn ? "border border-line bg-white text-foreground shadow-sm hover:bg-slate-50" : "bg-google-red text-white"
                }`}
                title={isMicOn ? "Mic on" : "Mic off"}
                type="button"
                onClick={toggleMic}
              >
                <MicIcon muted={!isMicOn} />
              </button>
              <button
                aria-label={isVideoOn ? "Turn camera off" : "Turn camera on"}
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  isVideoOn ? "border border-line bg-white text-foreground shadow-sm hover:bg-slate-50" : "bg-google-red text-white"
                }`}
                title={isVideoOn ? "Camera on" : "Camera off"}
                type="button"
                onClick={toggleCamera}
              >
                <CameraIcon muted={!isVideoOn} />
              </button>
            </div>
            <div className="absolute left-4 top-4 rounded-full border border-line bg-white/90 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur">
              {founderName}
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm text-center lg:text-left">
            <p className="text-sm font-medium text-google-blue">{videoStatus}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal">Ready to join?</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              You are about to enter the AI interview with {session.investorName}. Check your camera and microphone before joining.
            </p>
            {!speechSupported ? (
              <p className="mt-4 rounded-lg bg-google-yellow-soft px-3 py-2 text-sm text-foreground">
                Browser speech recognition is unavailable in this browser.
              </p>
            ) : null}
            <button
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-google-blue px-6 text-sm font-semibold text-white transition hover:bg-[#3367d6] disabled:opacity-50"
              disabled={!isVideoConnected || isFinished}
              type="button"
              onClick={joinInterview}
            >
              Join now
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#f8fafd] text-foreground">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-white px-5">
        <div className="min-w-0">
          <h1 className="truncate text-base font-medium">{session.investorName}</h1>
          <p className="text-xs text-muted">
            {isFinished ? "Interview submitted" : isAiSpeaking ? "Speaking" : isSubmitting ? "Thinking" : videoStatus}
          </p>
        </div>
        <div className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-muted shadow-sm">
          {isVideoConnected ? "Connected" : "Connecting"}
        </div>
      </header>

      <section className="grid min-h-0 flex-1 grid-rows-2 gap-3 px-3 pb-24 md:grid-cols-2 md:grid-rows-none md:px-5">
        <div className="relative flex min-h-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white shadow-sm">
          <div className={`absolute inset-0 ${isAiSpeaking ? "bg-google-blue-soft" : "bg-white"}`} />
          <div
            className={`relative aspect-[1082/1536] h-[82%] max-h-[620px] max-w-[62vw] ${
              isAiSpeaking ? "animate-[avatar-talk_1s_ease-in-out_infinite]" : "animate-[avatar-idle_5s_ease-in-out_infinite]"
            }`}
          >
            <div className="absolute inset-x-[12%] bottom-[4%] h-[7%] rounded-[50%] bg-slate-300/70 blur-xl" />
            <Image alt="AI interviewer avatar" className="h-full w-full object-contain" priority src={investorBodyTemplate} />
            <div className="absolute left-1/2 top-[11.5%] h-[31.5%] w-[28.5%] -translate-x-1/2 overflow-hidden rounded-[46%] border-2 border-[#b69780]/70 bg-slate-100 shadow-[0_14px_40px_rgba(66,133,244,0.18)]">
              {session.avatar.type === "upload" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={session.avatar.label} className="h-full w-full object-cover" src={session.avatar.value} />
              ) : (
                <div className={`flex h-full w-full items-center justify-center text-3xl font-semibold ${presetAvatarClass(session.avatar.value)}`}>
                  {session.investorName.slice(0, 1)}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-black/18 to-transparent" />
            </div>
          </div>
          <div className="absolute bottom-3 left-3 rounded-md border border-line bg-white/90 px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur">
            {session.investorName}
          </div>
          {isAiSpeaking ? (
            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-google-blue text-white shadow-sm">
              <MicIcon />
            </div>
          ) : null}
        </div>

        <div className="relative min-h-0 overflow-hidden rounded-xl border border-line bg-slate-100 shadow-sm">
          <video
            autoPlay
            className={`h-full w-full -scale-x-100 object-cover ${isVideoOn ? "" : "opacity-0"}`}
            muted
            playsInline
            ref={videoRef}
          />
          {!isVideoOn ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-google-blue-soft text-4xl font-semibold text-google-blue">
                {founderName.slice(0, 1).toUpperCase()}
              </div>
            </div>
          ) : null}
          <div className="absolute bottom-3 left-3 rounded-md border border-line bg-white/90 px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur">
            {founderName}
          </div>
          {!isMicOn ? (
            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-google-red text-white shadow-sm">
              <MicIcon muted />
            </div>
          ) : null}
        </div>
      </section>

      {(lastAiMessage || capturedAnswer || !speechSupported || isFinished) ? (
        <div className="pointer-events-none fixed inset-x-3 bottom-24 flex justify-center">
          <div className="max-w-3xl rounded-lg border border-line bg-white/95 px-4 py-2 text-center text-sm leading-6 text-foreground shadow-lg backdrop-blur">
            {isFinished
              ? "Interview submitted. The investor review is ready."
              : !speechSupported
                ? "Browser speech recognition is unavailable in this browser."
                : capturedAnswer || lastAiMessage}
          </div>
        </div>
      ) : null}

      <footer className="fixed inset-x-0 bottom-0 flex h-20 items-center justify-center gap-3 border-t border-line bg-white/95 px-4 backdrop-blur">
        <button
          aria-label={isMicOn ? "Turn microphone off" : "Turn microphone on"}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            isMicOn ? "border border-line bg-white text-foreground shadow-sm hover:bg-slate-50" : "bg-google-red text-white"
          }`}
          title={isMicOn ? "Mic on" : "Mic off"}
          type="button"
          onClick={toggleMic}
        >
          <MicIcon muted={!isMicOn} />
        </button>
        <button
          aria-label={isVideoOn ? "Turn camera off" : "Turn camera on"}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            isVideoOn ? "border border-line bg-white text-foreground shadow-sm hover:bg-slate-50" : "bg-google-red text-white"
          }`}
          title={isVideoOn ? "Camera on" : "Camera off"}
          type="button"
          onClick={toggleCamera}
        >
          <CameraIcon muted={!isVideoOn} />
        </button>
        <button
          aria-label="End interview"
          className="flex h-12 w-16 items-center justify-center rounded-full bg-google-red text-white hover:bg-[#d93025] disabled:opacity-60"
          disabled={isSubmitting || isFinished}
          title="End interview"
          type="button"
          onClick={finishInterview}
        >
          <PhoneIcon />
        </button>
      </footer>
    </main>
  );
}
