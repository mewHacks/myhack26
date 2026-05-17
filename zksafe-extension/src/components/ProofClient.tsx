"use client";

import { use, useState } from "react";
import Link from "next/link";

type AgentLog = {
  agent: string;
  step: string;
  detail: string;
};

type ProofData = {
  id: string;
  domain: string;
  status: "safe" | "danger";
  timestamp: string;
  agents: AgentLog[];
  rawProof: string;
};

const mockProofs: Record<string, ProofData> = {
  "binance-safe": {
    id: "binance-safe",
    domain: "binance.com",
    status: "safe",
    timestamp: "2026-05-02 14:20:00",
    agents: [
      { agent: "agent 1", step: "heuristics", detail: "domain matches official certificate records." },
      { agent: "agent 2", step: "reputation", detail: "clean record in global whitelist databases." },
      { agent: "agent 3", step: "behavioral", detail: "no suspicious script injections detected." },
      { agent: "agent 4", step: "consensus", detail: "final safety verdict confirmed by all nodes." },
    ],
    rawProof: JSON.stringify({ version: "1.0", signature: "0x7a2b...f9e1", provider: "zkTLS", verified: true }, null, 2),
  },
  "fake-eth-danger": {
    id: "fake-eth-danger",
    domain: "fake-eth.io",
    status: "danger",
    timestamp: "2026-05-02 15:45:00",
    agents: [
      { agent: "agent 1", step: "heuristics", detail: "detected look-alike domain targeting eth users." },
      { agent: "agent 2", step: "reputation", detail: "flagged in 3 recent community scam reports." },
      { agent: "agent 3", step: "behavioral", detail: "detected hidden form fields capturing private keys." },
      { agent: "agent 4", step: "consensus", detail: "consensus reached: malicious phishing attempt." },
    ],
    rawProof: JSON.stringify({ version: "1.0", signature: "0x3c9d...a2b4", provider: "zkTLS", threat_level: "critical" }, null, 2),
  },
};

export function ProofClient({ id }: { id: string }) {
  const data = mockProofs[id] || mockProofs["fake-eth-danger"];
  const [showRaw, setShowRaw] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const twitterIntent = `https://twitter.com/intent/tweet?text=scanned: ${data.domain}. verdict: ${data.status.toUpperCase()}. proof: ${shareUrl} @zkSafe`;
  const telegramIntent = `https://t.me/share/url?url=${shareUrl}&text=scanned: ${data.domain}. verdict: ${data.status.toUpperCase()}. proof verified by zkTLS.`;

  const statusBg = data.status === "safe" ? "bg-[var(--google-green)]" : "bg-[var(--google-red)]";

  return (
    <div className="min-h-screen bg-white p-4 font-black lowercase selection:bg-[var(--google-yellow)]">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between border-4 border-black bg-white p-4">
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="zkSafe" className="h-8 w-8" />
          <h1 className="text-xl">zkSafe proof center</h1>
        </div>
        <Link href="/" className="border-2 border-black px-4 py-1 text-xs hover:bg-zinc-100 transition-colors">
          download extension
        </Link>
      </header>

      <main className="mx-auto max-w-2xl space-y-6">
        {/* Verdict Card */}
        <section className={`border-4 border-black p-6 text-white ${statusBg}`}>
          <p className="text-xs opacity-80 mb-1">domain analysis for:</p>
          <h2 className="text-3xl mb-4 underline decoration-4 underline-offset-8">{data.domain}</h2>
          <div className="inline-block border-2 border-white px-4 py-1 bg-black text-white text-sm">
            verdict: {data.status}
          </div>
        </section>

        {/* Share Section */}
        <section className="grid grid-cols-2 gap-4">
          <a
            href={twitterIntent}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-4 border-black bg-[var(--google-yellow)] py-4 hover:translate-y-[-2px] transition-transform active:translate-y-0"
          >
            share to x
          </a>
          <a
            href={telegramIntent}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-4 border-black bg-white py-4 hover:translate-y-[-2px] transition-transform active:translate-y-0"
          >
            share to telegram
          </a>
        </section>

        {/* Agent Reasoning */}
        <section className="border-4 border-black p-6 bg-white">
          <h3 className="text-sm mb-6 border-b-4 border-black pb-2 inline-block">agent reasoning logs</h3>
          <div className="space-y-4">
            {data.agents.map((log, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="border-2 border-black bg-[var(--google-blue)] text-white text-[10px] px-2 py-1 shrink-0">
                  {log.agent}
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--google-gray)]">{log.step}</p>
                  <p className="text-sm">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* zkTLS Proof */}
        <section className="border-4 border-black bg-black p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm">zktls cryptographic evidence</h3>
            <button
              onClick={() => setShowRaw(!showRaw)}
              className="border-2 border-white px-3 py-1 text-[10px] hover:bg-white hover:text-black transition-colors"
            >
              {showRaw ? "hide details" : "view raw proof"}
            </button>
          </div>
          {showRaw && (
            <pre className="bg-zinc-900 p-4 border-2 border-zinc-700 text-[10px] overflow-x-auto text-green-400 font-mono">
              {data.rawProof}
            </pre>
          )}
          <p className="text-[10px] mt-4 text-zinc-400">
            this proof is cryptographically signed and verified using zero-knowledge transport layer security (zktls).
          </p>
        </section>

        {/* Footer Info */}
        <footer className="text-center py-8 text-xs text-zinc-500">
          <p>scanned at {data.timestamp} via zksafe engine v1.4</p>
          <p className="mt-2">protect your wallet. verify before you connect.</p>
        </footer>
      </main>
    </div>
  );
}
