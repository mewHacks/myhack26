"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { scanConfig } from "@/lib/scan-config";
import { checksToThreats, generateProofSignature, normalizeTeeScanResponse, normalizeThreatsToChecks, scoreChecks } from "@/lib/scan-scoring";
import type { ScanExtractionResponse, ScoreSummary, Threat } from "@/lib/scan-types";

function GoogleGradientCheckmark({ variant = "complete" }: { variant?: "complete" | "scanning" }) {
  const gradientBaseId = useId().replace(/:/g, "");
  const checkMaskId = `${gradientBaseId}-check-mask`;
  const blobBlurId = `${gradientBaseId}-blob-blur`;
  const blueBlobId = `${gradientBaseId}-blue-blob`;
  const redBlobId = `${gradientBaseId}-red-blob`;
  const yellowBlobId = `${gradientBaseId}-yellow-blob`;
  const greenBlobId = `${gradientBaseId}-green-blob`;
  const ringGradientId = `${gradientBaseId}-ring-gradient`;

  const isScanning = variant === "scanning";

  return (
    <svg className="checkmark-svg" viewBox="-4 -4 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={ringGradientId} x1="0" y1="72" x2="72" y2="0" gradientUnits="userSpaceOnUse">
          {isScanning ? (
            <>
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="33%" stopColor="#EA4335" />
              <stop offset="66%" stopColor="#FBBC05" />
              <stop offset="100%" stopColor="#34A853" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="100%" stopColor="#34A853" />
            </>
          )}
        </linearGradient>
        <filter id={blobBlurId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.6" />
        </filter>
        <radialGradient id={blueBlobId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4285F4" stopOpacity="1" />
          <stop offset="72%" stopColor="#4285F4" stopOpacity="0.82" />
          <stop offset="100%" stopColor="#4285F4" stopOpacity="0.18" />
        </radialGradient>
        <radialGradient id={redBlobId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EA4335" stopOpacity="0.98" />
          <stop offset="72%" stopColor="#EA4335" stopOpacity="0.78" />
          <stop offset="100%" stopColor="#EA4335" stopOpacity="0.14" />
        </radialGradient>
        <radialGradient id={yellowBlobId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBBC05" stopOpacity="0.98" />
          <stop offset="72%" stopColor="#FBBC05" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FBBC05" stopOpacity="0.16" />
        </radialGradient>
        <radialGradient id={greenBlobId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34A853" stopOpacity="0.98" />
          <stop offset="72%" stopColor="#34A853" stopOpacity="0.76" />
          <stop offset="100%" stopColor="#34A853" stopOpacity="0.14" />
        </radialGradient>
        <mask id={checkMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width="72" height="72">
          <rect x="0" y="0" width="72" height="72" fill="black" />
          <path
            className="checkmark-mask-path"
            d="M16 37 L30 51 L56 23"
            fill="none"
            stroke="white"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>

      <ellipse
        className={isScanning ? "ring-scanning" : "checkmark-ring-arc"}
        cx="36"
        cy="36"
        rx="35"
        ry="35"
        fill="none"
        stroke={`url(#${ringGradientId})`}
        strokeWidth="3"
        strokeLinecap="round"
        pathLength="100"
        transform="rotate(-90 36 36)"
      />

      {!isScanning && (
        <g mask={`url(#${checkMaskId})`} filter={`url(#${blobBlurId})`}>
          <rect x="0" y="0" width="72" height="72" fill="#4285F4" />
          <circle cx="14" cy="12" r="24" fill={`url(#${blueBlobId})`}>
            <animate attributeName="cx" values="8;35;14;8" dur="4.2s" repeatCount="indefinite" />
            <animate attributeName="cy" values="9;30;15;9" dur="4.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="46" cy="18" r="23" fill={`url(#${redBlobId})`}>
            <animate attributeName="cx" values="54;26;46;54" dur="4.8s" repeatCount="indefinite" />
            <animate attributeName="cy" values="15;38;22;15" dur="4.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="58" cy="48" r="22" fill={`url(#${yellowBlobId})`}>
            <animate attributeName="cx" values="62;38;56;62" dur="4.5s" repeatCount="indefinite" />
            <animate attributeName="cy" values="51;28;54;51" dur="4.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="18" cy="56" r="21" fill={`url(#${greenBlobId})`}>
            <animate attributeName="cx" values="15;40;20;15" dur="5s" repeatCount="indefinite" />
            <animate attributeName="cy" values="59;35;55;59" dur="5s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
    </svg>
  );
}

function ThinkingBlock({ pattern = "bloom", blockIdx = 0 }: { pattern?: "bloom" | "knight" | "ladder" | "heartbeat" | "stairs", blockIdx?: number }) {
  const dots = [];
  const googleColors = [
    "var(--google-blue)",
    "var(--google-red)",
    "var(--google-yellow)",
    "var(--google-green)",
  ];

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const delayClass = `d${row}${col}`;
      const color = googleColors[(row + col + blockIdx) % 4];

      dots.push(
        <circle
          key={`${row}-${col}`}
          className={`thinking-dot ${pattern} ${delayClass}`}
          cx={10 + col * 18}
          cy={10 + row * 18}
          r="6"
          fill={color}
        />
      );
    }
  }

  return (
    <svg width="84" height="84" viewBox="0 0 92 92" xmlns="http://www.w3.org/2000/svg">
      {/* Background dots */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => (
          <circle
            key={`bg-${row}-${col}`}
            cx={10 + col * 18}
            cy={10 + row * 18}
            r="4.5"
            fill="currentColor"
            className="text-zinc-50"
          />
        ))
      )}
      {dots}
    </svg>
  );
}

function GoogleThinkingGrid() {
  return (
    <div className="flex w-full justify-center gap-4 mb-4 scale-110">
      <ThinkingBlock pattern="knight" blockIdx={0} />
      <ThinkingBlock pattern="ladder" blockIdx={1} />
      <ThinkingBlock pattern="heartbeat" blockIdx={2} />
    </div>
  );
}

function SafePlusCTA() {
  const gradientBaseId = useId().replace(/:/g, "");
  const blobBlurId = `${gradientBaseId}-blob-blur`;
  const blueBlobId = `${gradientBaseId}-blue-blob`;
  const blackBlobId = `${gradientBaseId}-black-blob`;

  return (
    <a
      href="upgrade.html"
      aria-label="Open Safe+ upgrade page"
      className="relative flex h-[76px] w-full items-center justify-between overflow-hidden rounded-3xl border-4 border-black px-5 text-white transition-transform duration-150 hover:-translate-y-0.5"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#000000_0%,#123cff_100%)]">
        <svg className="h-full w-full scale-125" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id={blobBlurId}>
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <radialGradient id={blueBlobId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a73e8" stopOpacity="1" />
              <stop offset="90%" stopColor="#1a73e8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={blackBlobId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="1" />
              <stop offset="90%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g filter={`url(#${blobBlurId})`}>
            <circle cx="18" cy="18" r="42" fill={`url(#${blueBlobId})`}>
              <animate attributeName="cx" values="18;78;18" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="82" cy="82" r="38" fill={`url(#${blackBlobId})`}>
              <animate attributeName="cx" values="82;22;82" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="cy" values="82;22;82" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="34" fill={`url(#${blueBlobId})`}>
              <animate attributeName="r" values="24;42;24" dur="1s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      </div>
      <div className="relative flex w-full items-center justify-between">
        <p className="text-[28px] font-black leading-none tracking-tight text-white">get safe+</p>
      </div>
    </a>
  );
}

function SafeView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-2 animate-in fade-in slide-in-from-right duration-300">
      <section className="w-full space-y-4 px-4">
        <Link
          href={`${scanConfig.appBaseUrl}/dashboard`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-black lowercase underline block text-center hover:text-[var(--google-blue)] transition-colors"
        >
          see more in dashboard
        </Link>

        {/* Main Stats Block */}
        <div className="w-full border-4 border-black bg-white p-5 rounded-2xl">
          <div className="text-center mb-4">
            <p className="text-[48px] font-black leading-none tracking-tighter">1,234</p>
            <p className="text-[10px] font-black lowercase text-zinc-500 mt-1">scams blocked by zksafe</p>
          </div>

          <div className="flex items-center justify-between border-t-4 border-black pt-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black lowercase">daily scan limit</p>
              <div className="w-32 h-3 bg-zinc-100 border-2 border-black rounded-full overflow-hidden">
                <div className="h-full bg-[var(--google-blue)] w-[85%]" />
              </div>
            </div>
            <div className="text-right text-[12px] font-black leading-tight">
              <span className="text-[var(--google-blue)]">85</span>/100
            </div>
          </div>
        </div>

        {/* Safe+ Upgrade CTA */}
        <SafePlusCTA />
      </section>
    </div>
  );
}

const fallbackThreats: Threat[] = [
  { key: "domain_lookalike_absent", label: "Lookalike domain absent", checked: true, reason: "Brand terms appear but the hostname does not look official." },
  { key: "credential_harvest_absent", label: "Credential harvest absent", checked: true, reason: "Urgent login copy suggests credentials may be harvested." },
  { key: "pii_request_safe", label: "PII request is safe", checked: false, reason: "No OTP or password request detected in visible form fields." },
  { key: "wallet_drain_prompt_absent", label: "Wallet drain prompt absent", checked: true, reason: "Page asks for direct transfer to a personal wallet or account." },
  { key: "brand_impersonation", label: "Brand impersonation absent", checked: false, reason: "No explicit fake staff title detected in page text." },
  { key: "zktls_proof_valid", label: "zkTLS proof valid", checked: true, mandatory: true, reason: "No zkTLS proof attached for this scan." },
  { key: "tee_attestation_valid", label: "TEE attestation valid", checked: true, mandatory: true, reason: "No confidential VM attestation was returned." },
];

const safeDefaultThreats: Threat[] = fallbackThreats.map((threat) => ({
  ...threat,
  checked: false,
  reason: "",
}));

export default function Home() {
  const [activeTab, setActiveTab] = useState<"scan" | "safe">("scan");
  const [loading, setLoading] = useState(false);
  const [threats, setThreats] = useState<Threat[]>(safeDefaultThreats);
  const [scanSummary, setScanSummary] = useState<ScoreSummary | null>(null);
  const [showThreats, setShowThreats] = useState(true);
  const [language, setLanguage] = useState<"EN" | "ID">("EN");

  const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.play().catch(e => console.error("Audio play failed", e));
  };

  useEffect(() => {
    playSound("/open.mp3");
  }, []);

  const checkedCount = useMemo(() => threats.filter((t) => t.checked).length, [threats]);
  const band = scanSummary?.status === "danger" ? "High" : scanSummary?.status === "warning" ? "Medium" : "Low";
  const currentThreats = threats;

  async function checkPage() {
    playSound("/start.mp3");
    setLoading(true);

    let resultThreats = fallbackThreats;
    let resultSummary = scoreChecks(normalizeThreatsToChecks(fallbackThreats));
    let scannedDomain = "current-page.io";
    let proofDetails = {
      handshake: "Confidential VM attestation unavailable",
      provider: "Reclaim Protocol",
      signature: generateProofSignature("fallback-proof"),
    };

    try {
      const chromeApi = (globalThis as { chrome?: { runtime?: { sendMessage?: (msg: unknown) => Promise<unknown> } } }).chrome;
      if (chromeApi?.runtime?.sendMessage) {
        const response = (await chromeApi.runtime.sendMessage({
          type: "CHECK_PAGE",
          endpoint: scanConfig.scoringEndpoint,
          timeoutMs: scanConfig.timeoutMs,
          policy: {
            checkWeights: scanConfig.checkWeights,
            mandatoryBlockers: scanConfig.mandatoryBlockers,
            scoring: "n_safe_over_n_total_plus_blockers",
            strictResponseValidation: scanConfig.strictResponseValidation,
          },
        })) as ScanExtractionResponse;
        if (response?.threats?.length) {
          resultThreats = response.threats as Threat[];
          const evidence = response.evidence;
          scannedDomain = evidence?.hostname || scannedDomain;

          const fallbackChecks = normalizeThreatsToChecks(resultThreats);
          resultSummary = scoreChecks(fallbackChecks);
          const teeResponse = normalizeTeeScanResponse(response.teePayload);
          if (teeResponse) {
            resultThreats = checksToThreats(teeResponse.checks);
            resultSummary = scoreChecks(teeResponse.checks);
            proofDetails = {
              handshake: teeResponse.zktls.handshake,
              provider: teeResponse.zktls.provider,
              signature: teeResponse.zktls.signature || generateProofSignature(evidence?.url || scannedDomain),
            };
          } else if (evidence) {
            proofDetails = {
              handshake: response.teeError || response.attestationStatus || proofDetails.handshake,
              provider: "Reclaim Protocol",
              signature: generateProofSignature(evidence.url),
            };
          }
        }
      }
    } catch {
      // stay with fallback
    } finally {
      setThreats(resultThreats);
      setScanSummary(resultSummary);
      setLoading(false);
      setShowThreats(true);
      playSound("/ok.mp3");

      // Sync to local storage for Dashboard
      const newEntry = {
        id: `zks-${Math.floor(Math.random() * 10000)}`,
        domain: scannedDomain,
        status: resultSummary.status,
        score: resultSummary.riskScore,
        safetyScore: resultSummary.safetyScore,
        timestamp: new Date().toISOString().replace("T", " ").split(".")[0],
        zktls: {
          provider: proofDetails.provider,
          signature: proofDetails.signature,
          handshake: proofDetails.handshake,
        },
      };

      const existing = JSON.parse(localStorage.getItem("zksafe_history") || "[]");
      localStorage.setItem("zksafe_history", JSON.stringify([newEntry, ...existing].slice(0, 20)));
    }
  }

  const bandColor =
    band === "High"
      ? "bg-[var(--google-red)] text-white"
      : band === "Medium"
        ? "bg-[var(--google-yellow)] text-black"
        : "bg-[var(--google-green)] text-white";
  const scanState: "idle" | "scanning" | "safe" | "danger" = loading
    ? "scanning"
    : showThreats
      ? band === "Low"
        ? "safe"
        : "danger"
      : "idle";
  const isSafe = scanState === "safe";
  const isDanger = scanState === "danger";

  // Hide the "proof" threat from the primary list
  const primaryThreats = currentThreats;
  const checkedThreats = primaryThreats.filter((t) => t.checked);
  const safeCount = scanSummary?.nSafe ?? currentThreats.length - checkedCount;

  return (
    <main className="relative flex h-full w-full flex-col overflow-hidden border-x-4 border-[var(--google-blue)] bg-white">
      <header className="flex items-center justify-between bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="zkSafe icon" className="h-6 w-6" />
          <p className="text-[14px] leading-none text-black">zkSafe</p>
        </div>
        <button
          type="button"
          onClick={() => setLanguage((prev) => (prev === "EN" ? "ID" : "EN"))}
          className="rounded-full border-2 border-black px-3 py-1 text-[10px] font-black leading-none"
          aria-label="language-switcher"
        >
          {language}
        </button>
      </header>

      <section className="flex flex-1 flex-col items-center px-4 pb-3 pt-4 overflow-y-auto">
        {activeTab === "scan" ? (
          <>
            <div className="relative mb-3 flex h-44 w-44 flex-col items-center justify-center rounded-full bg-white transition-all duration-500 shrink-0">
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${scanState === "scanning" ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}>
                <div className="checkmark-wrap mb-3 z-10" aria-label="scanning-status">
                  <GoogleGradientCheckmark variant="scanning" />
                </div>
              </div>

              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${scanState === "safe" ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}>
                <div className="checkmark-wrap mb-3 z-10" aria-label="safe-checkmark">
                  <GoogleGradientCheckmark />
                </div>
              </div>

              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${scanState === "danger" ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}>
                <div className="checkmark-wrap mb-3 z-10" aria-label="danger-crossmark">
                  <svg className="checkmark-svg" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="dangerGradient" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#EA4335" />
                        <stop offset="100%" stopColor="#FBBC05" />
                      </linearGradient>
                    </defs>
                    <path stroke="url(#dangerGradient)" className="danger-path" d="M20 20 L52 52" />
                    <path stroke="url(#dangerGradient)" className="danger-path" d="M52 20 L20 52" />
                  </svg>
                </div>
              </div>

              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${scanState === "idle" ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}>
                <div className="checkmark-wrap mb-3 z-10" aria-label="idle-status">
                  <svg className="checkmark-svg" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="idleGradient" x1="0" y1="72" x2="72" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#4285F4" />
                        <stop offset="0.33" stopColor="#EA4335" />
                        <stop offset="0.66" stopColor="#FBBC05" />
                        <stop offset="1" stopColor="#34A853" />
                      </linearGradient>
                    </defs>
                    <circle cx="36" cy="36" r="22" fill="none" stroke="url(#idleGradient)" strokeWidth="7" />
                  </svg>
                </div>
              </div>

              <p className="pixel-text z-10 mt-40 text-center text-[12px] font-medium uppercase text-[var(--google-gray)]">
                {scanState === "scanning"
                  ? "SCANNING..."
                  : scanState === "danger"
                    ? "UNSAFE SITE"
                    : `${safeCount}/${currentThreats.length} safe`}
              </p>
            </div>

            <div className="mt-auto w-full">
              {loading && <GoogleThinkingGrid />}

              <button
                onClick={loading ? () => setLoading(false) : checkPage}
                disabled={loading && checkedCount === 0}
                className={`${isDanger ? "bg-[var(--google-red)]" : "bg-[var(--google-blue)]"} mb-3 w-full rounded-full px-8 py-2.5 text-[12px] lowercase text-white border-4 border-black active:scale-[0.98] transition-all duration-300 font-black`}
              >
                {loading ? "stop" : "scan"}
              </button>

              {showThreats && !loading && (checkedThreats.length > 0 || isDanger) && (
                <section className="mb-2 w-full space-y-2 rounded-2xl border-4 border-black bg-white p-2.5">
                  {checkedThreats.length > 0 && checkedThreats.slice(0, 2).map((threat) => (
                    <article key={threat.key} className="rounded-lg border border-zinc-300 p-2">
                      <p className="text-[11px] font-black">
                        {threat.checked ? "[!]" : "[ ]"} {threat.label}
                      </p>
                      <p className="text-[10px] text-[var(--google-gray)]">{threat.reason}</p>
                    </article>
                  ))}
                  {isDanger && (
                    <Link
                      href="/dashboard"
                      target="_blank"
                      className="flex items-center justify-center w-full bg-[var(--google-yellow)] py-2 text-[10px] font-black border-4 border-black hover:translate-y-[-1px] transition-transform active:translate-y-0"
                    >
                      warn others on x
                    </Link>
                  )}
                </section>
              )}
            </div>
          </>
        ) : (
          <SafeView />
        )}
      </section>

      <nav className="mx-3 mb-2 mt-auto flex h-16 items-center justify-around rounded-full bg-white shrink-0">
        <div
          onClick={() => {
            setActiveTab("scan");
            playSound("/tab.mp3");
          }}
          className={`flex h-14 flex-1 mx-1 items-center justify-center rounded-full border-4 border-black text-xs font-black transition-all cursor-pointer ${activeTab === "scan" ? "bg-[var(--google-yellow)] text-black" : "bg-white text-zinc-500"}`}
        >
          scan
        </div>
        <div
          onClick={() => {
            setActiveTab("safe");
            playSound("/tab.mp3");
          }}
          className={`flex h-14 flex-1 mx-1 items-center justify-center rounded-full border-4 border-black text-xs font-black transition-all cursor-pointer ${activeTab === "safe" ? "bg-[var(--google-yellow)] text-black" : "bg-white text-zinc-500"}`}
        >
          safe
        </div>
      </nav>
    </main>
  );
}
