import { scanConfig } from "@/lib/scan-config";

export default function UpgradePage() {
  const checkoutUrl = scanConfig.upgradeUrl;
  const gradientBaseId = "upgrade-cta";
  const blobBlurId = `${gradientBaseId}-blob-blur`;
  const blueBlobId = `${gradientBaseId}-blue-blob`;
  const greenBlobId = `${gradientBaseId}-green-blob`;

  return (
    <main className="min-h-screen bg-white px-4 py-6 font-black lowercase selection:bg-[var(--google-yellow)]">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <header className="flex items-center justify-between border-4 border-black bg-white p-4">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="zkSafe" className="h-8 w-8" />
            <div>
              <p className="text-xl">zkSafe</p>
              <p className="text-[10px] text-zinc-500">safe+</p>
            </div>
          </div>
          <a href="index.html" className="rounded-2xl border-4 border-black bg-[var(--google-yellow)] px-4 py-2 text-xs hover:-translate-y-0.5 transition-transform">
            back
          </a>
        </header>

        <section className="relative overflow-hidden rounded-3xl border-4 border-black bg-black p-5 text-white">
          <div className="absolute inset-0">
            <svg className="h-full w-full scale-125" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id={blobBlurId}>
                  <feGaussianBlur stdDeviation="4" />
                </filter>
                <radialGradient id={blueBlobId} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1a73e8" stopOpacity="0.9" />
                  <stop offset="90%" stopColor="#1a73e8" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={greenBlobId} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#34a853" stopOpacity="0.85" />
                  <stop offset="90%" stopColor="#34a853" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g filter={`url(#${blobBlurId})`} opacity="0.9">
                <circle cx="28" cy="28" r="42" fill={`url(#${blueBlobId})`}>
                  <animate attributeName="cx" values="28;68;28" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" dur="6s" repeatCount="indefinite" />
                  <animate attributeName="cy" values="28;54;28" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" dur="6s" repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy="52" r="34" fill={`url(#${greenBlobId})`}>
                  <animate attributeName="cx" values="50;60;50" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" dur="7.5s" repeatCount="indefinite" />
                  <animate attributeName="cy" values="52;40;52" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" dur="7.5s" repeatCount="indefinite" />
                  <animate attributeName="r" values="28;40;28" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" dur="7.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="72" cy="70" r="38" fill={`url(#${blueBlobId})`}>
                  <animate attributeName="cx" values="72;44;72" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" dur="6.8s" repeatCount="indefinite" />
                  <animate attributeName="cy" values="70;46;70" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" dur="6.8s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>
          </div>
          <div className="relative">
            <img src="/lock3d.png" alt="safe+ logo" className="absolute right-[-54px] top-[-46px] h-[18rem] w-[18rem] translate-x-12 scale-[1.35] object-contain opacity-80" />
            <div className="relative z-10 pr-32">
              <h1
                className="mt-2 text-4xl leading-tight text-white"
                style={{
                  textShadow:
                    "0 0 1px rgba(255,255,255,1), 0 0 3px rgba(255,255,255,0.95), 0 0 5px rgba(26,115,232,0.8), 0 0 7px rgba(52,168,83,0.35)",
                  filter: "drop-shadow(0 0 1px rgba(255,255,255,0.95)) drop-shadow(0 0 2px rgba(26,115,232,0.5))",
                }}
              >
                safe+
              </h1>
              <ul className="mt-2 space-y-1 text-[11px] font-black text-white/85">
                <li>unlimited scans</li>
                <li>faster scans</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 text-white">
          {checkoutUrl ? (
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noreferrer"
              className="relative flex h-[72px] w-full items-center justify-center overflow-hidden rounded-3xl border-4 border-white px-5 text-white transition-transform duration-150 hover:-translate-y-0.5"
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
                  </defs>
                  <g filter={`url(#${blobBlurId})`}>
                    <circle cx="18" cy="18" r="42" fill={`url(#${blueBlobId})`}>
                      <animate attributeName="cx" values="18;78;18" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50" cy="50" r="34" fill={`url(#${blueBlobId})`}>
                      <animate attributeName="r" values="24;42;24" dur="1s" repeatCount="indefinite" />
                    </circle>
                  </g>
                </svg>
              </div>
              <span className="relative text-[18px] font-black uppercase tracking-tight text-white">buy plan</span>
            </a>
          ) : (
            <div className="rounded-2xl border-4 border-white px-5 py-3 text-xs text-zinc-300">
              stripe url not set
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
