"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";

type ProofStatus = "verified" | "warning" | "danger";

type ScanLog = {
  id: string;
  domain: string;
  status: ProofStatus;
  score: number;
  timestamp: string;
  zktls: {
    provider: string;
    signature: string;
    handshake: string;
  };
};

const mockHistory: ScanLog[] = [
  {
    id: "zks-8291",
    domain: "fake-binance.net",
    status: "danger",
    score: 94,
    timestamp: "2026-05-03 10:12:45",
    zktls: {
      provider: "zkTLS Node Cluster 4",
      signature: "0x7a2b9e155c882d93ea7a2b9e155c882d93ea7a2b9e155c882d93ea7a2b9e155c882d93ea",
      handshake: "TLS_AES_256_GCM_SHA384 | 0x82f...d92 | Signed by Notary A",
    },
  },
  {
    id: "zks-8288",
    domain: "phantom.app",
    status: "verified",
    score: 0,
    timestamp: "2026-05-03 09:45:12",
    zktls: {
      provider: "zkTLS Node Cluster 2",
      signature: "0x3e1da8c231e882b11fa3e1da8c231e882b11fa3e1da8c231e882b11fa3e1da8c231e8",
      handshake: "TLS_CHACHA20_POLY1305_SHA256 | 0x11d...c91 | Signed by Notary B",
    },
  },
  {
    id: "zks-8285",
    domain: "eth-claim-rewards.com",
    status: "warning",
    score: 65,
    timestamp: "2026-05-02 22:15:33",
    zktls: {
      provider: "zkTLS Node Cluster 4",
      signature: "0x91e2b8f155c882d22bc91e2b8f155c882d22bc91e2b8f155c882d22bc91e2b8f155c882d",
      handshake: "TLS_AES_128_GCM_SHA256 | 0x44a...e12 | Signed by Notary C",
    },
  },
  {
    id: "zks-8280",
    domain: "google.com",
    status: "verified",
    score: 0,
    timestamp: "2026-05-02 18:30:05",
    zktls: {
      provider: "zkTLS Node Cluster 1",
      signature: "0xbb21c8e155c882d77e2bb21c8e155c882d77e2bb21c8e155c882d77e2bb21c8e155c882d",
      handshake: "TLS_AES_256_GCM_SHA384 | 0x992...f88 | Signed by Notary A",
    },
  },
];

export default function DashboardPage() {
  const [history, setHistory] = useState<ScanLog[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("dashboard-page");
    document.body.classList.add("dashboard-page");

    const saved = localStorage.getItem('zksafe_history');
    const logs = saved ? JSON.parse(saved) : mockHistory;
    setHistory(logs);
    if (logs.length > 0) setSelectedId(logs[0].id);

    return () => {
      document.documentElement.classList.remove("dashboard-page");
      document.body.classList.remove("dashboard-page");
    };
  }, []);

  const selectedLog = history.find((log) => log.id === selectedId) || history[0];

  if (!selectedLog) return null;

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedLog, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `zksafe-proof-${selectedLog.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportImage = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `zksafe-threat-card-${selectedLog.domain}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  const handleShare = (platform: 'x' | 'tg') => {
    const text = `🚨 zkSafe blocked a potential threat: ${selectedLog.domain}. zkTLS proof: ${selectedLog.id}. score: ${selectedLog.score}/100. verified by @zkSafe.`;
    const url = platform === 'x'
      ? `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`
      : `https://t.me/share/url?url=${encodeURIComponent('https://zksafe.io')}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-white font-black lowercase selection:bg-[var(--google-yellow)] p-4 md:p-8">
      <nav className="flex items-center justify-between border-4 border-black bg-white p-4 mb-8">
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="zkSafe" className="h-8 w-8" />
          <h1 className="text-xl">zkSafe / Evidence Vault</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="bg-[var(--google-yellow)] border-4 border-black px-4 py-1 text-xs hover:translate-y-[-2px] transition-transform">
            back
          </Link>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <div className="border-4 border-black p-6 bg-[var(--google-blue)] text-white rounded-2xl">
            <h3 className="text-xl mb-2">global threats aggregated</h3>
            <p className="text-xs opacity-90 leading-relaxed mb-4">
              these signatures were generated by the community via zktls. you have contributed to blocking 1,234 threats.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 p-3 border-2 border-white">
                <p className="text-[18px]">1,234</p>
                <p className="text-[9px]">scams blocked</p>
              </div>
              <div className="bg-black/20 p-3 border-2 border-white">
                <p className="text-[18px]">42.8k</p>
                <p className="text-[9px]">proofs verified</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg mb-4 underline decoration-4 underline-offset-4">sites aggregated / history</h2>
            <div className="border-4 border-black overflow-hidden rounded-2xl bg-white">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-100 border-b-4 border-black">
                  <tr>
                    <th className="p-4 text-[12px]">domain</th>
                    <th className="p-4 text-[12px]">status</th>
                    <th className="p-4 text-[12px]">score</th>
                    <th className="p-4 text-[12px]">timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedId(log.id)}
                      className={`border-b-2 border-black cursor-pointer transition-colors ${selectedId === log.id ? "bg-[var(--google-yellow)]" : "hover:bg-zinc-50"}`}
                    >
                      <td className="p-4 text-[13px] underline">{log.domain}</td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-0.5 border-2 border-black font-black uppercase ${
                          log.status === "danger" ? "bg-[var(--google-red)] text-white" :
                          log.status === "warning" ? "bg-[var(--google-yellow)] text-black" :
                          "bg-[var(--google-green)] text-white"
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-4 text-[13px]">{log.score}</td>
                      <td className="p-4 text-[10px] text-zinc-500">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-lg mb-4 underline decoration-4 underline-offset-4">safe card</h2>

          <div ref={cardRef} className="relative border-4 border-black bg-white rounded-3xl overflow-hidden aspect-[3/2] shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
            <div
              className="absolute inset-0 bg-cover bg-right bg-no-repeat"
              style={{ backgroundImage: "url('/template.png')" }}
            />

            <div className="relative h-full w-[60%] p-8 flex flex-col z-10">
              <div className="mb-6">
                <p className="text-[12px] font-black uppercase text-zinc-400 mb-1">domain check</p>
                <h3 className="text-[24px] font-black leading-tight inline-block break-all">{selectedLog.domain}</h3>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl border-4 border-black flex items-center justify-center ${
                    selectedLog.status === 'danger' ? 'bg-[var(--google-red)]' :
                    selectedLog.status === 'warning' ? 'bg-[var(--google-yellow)]' : 'bg-[var(--google-green)]'
                  }`}>
                    {selectedLog.status === 'verified' ? (
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ) : (
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-500">verdict</p>
                    <p className={`text-[32px] font-black uppercase leading-none ${
                      selectedLog.status === 'danger' ? 'text-[var(--google-red)]' :
                      selectedLog.status === 'warning' ? 'text-[var(--google-yellow)]' : 'text-[var(--google-green)]'
                    }`}>{selectedLog.status}</p>
                  </div>
                </div>

                <div className="mt-3 inline-flex flex-col border-4 border-black bg-zinc-50 p-3 rounded-xl w-[220px] shadow-[4px_4px_0_rgba(0,0,0,0.05)]">
                  <div className="flex items-center mb-1.5">
                    <p className="text-[9px] font-black uppercase tracking-tight">zkproof</p>
                  </div>
                  <p className="text-[8px] font-mono break-all leading-normal text-black font-medium">
                    {selectedLog.zktls.signature}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between opacity-40">
                <p className="text-[9px] font-black italic">verified by zktls protocol</p>
                <img src="/icon.png" className="h-4 w-4 grayscale" alt="zkSafe" />
              </div>
            </div>

            {/* QR Code for Self-Verification */}
            <div className="absolute bottom-6 right-6 flex flex-col items-center gap-2 z-20">
              <div className="bg-white p-2 border-4 border-black rounded-xl shadow-[4px_4px_0_#000]">
                <QRCodeSVG
                  value={`http://zksafe.io/proof/${selectedLog.id}`}
                  size={64}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-[7px] font-black uppercase text-black bg-white/80 px-1 border-2 border-black">scan to verify</p>
            </div>

            <div className="absolute top-0 left-0 w-2 h-full flex flex-col">
              <div className="flex-1 bg-[var(--google-blue)]" />
              <div className="flex-1 bg-[var(--google-red)]" />
              <div className="flex-1 bg-[var(--google-yellow)]" />
              <div className="flex-1 bg-[var(--google-green)]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleExportImage}
              className="bg-[var(--google-green)] text-white py-4 border-4 border-black rounded-2xl hover:translate-y-[-2px] transition-transform text-xs font-black shadow-[4px_4px_0_#000]"
            >
              save verdict (.png)
            </button>
            <button
              onClick={handleExportJSON}
              className="bg-black text-white py-4 border-4 border-black rounded-2xl hover:translate-y-[-2px] transition-transform text-xs font-black shadow-[4px_4px_0_#000]"
            >
              raw proof (.json)
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleShare('x')}
              className="flex-1 bg-[var(--google-red)] text-white py-3 border-4 border-black rounded-2xl hover:translate-y-[-2px] transition-transform text-xs font-black shadow-[4px_4px_0_#000]"
            >
              warn on x
            </button>
            <button
              onClick={() => handleShare('tg')}
              className="flex-1 bg-white text-black py-3 border-4 border-black rounded-2xl hover:translate-y-[-2px] transition-transform text-xs font-black shadow-[4px_4px_0_#000]"
            >
              alert telegram
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-[10px] text-zinc-400">
        zkSafe v1.4.2 — decentralized browser security protocol
      </footer>
    </div>
  );
}
