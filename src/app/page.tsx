import Image from "next/image";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import NavHeader from "@/components/ui/nav-header";
import { Globe } from "@/components/ui/cobe-globe";
import covalentHeroMark from "@/assets/cov-logo.png";

const headerLinks = [
  { href: "/startup", label: "Startup", color: "var(--color-google-blue)" },
  { href: "/mentors", label: "Mentors", color: "var(--color-google-yellow)" },
  { href: "/investors", label: "Investors", color: "var(--color-google-green)" },
];

const globeMarkers = [
  { id: "sf", location: [37.7595, -122.4367] as [number, number], label: "San Francisco" },
  { id: "nyc", location: [40.7128, -74.006] as [number, number], label: "New York" },
  { id: "tokyo", location: [35.6762, 139.6503] as [number, number], label: "Tokyo" },
  { id: "london", location: [51.5074, -0.1278] as [number, number], label: "London" },
  { id: "sydney", location: [-33.8688, 151.2093] as [number, number], label: "Sydney" },
  { id: "capetown", location: [-33.9249, 18.4241] as [number, number], label: "Cape Town" },
  { id: "dubai", location: [25.2048, 55.2708] as [number, number], label: "Dubai" },
  { id: "paris", location: [48.8566, 2.3522] as [number, number], label: "Paris" },
  { id: "saopaulo", location: [-23.5505, -46.6333] as [number, number], label: "São Paulo" },
];

const globeArcs = [
  {
    id: "sf-tokyo",
    from: [37.7595, -122.4367] as [number, number],
    to: [35.6762, 139.6503] as [number, number],
    label: "SF → Tokyo",
  },
  {
    id: "nyc-london",
    from: [40.7128, -74.006] as [number, number],
    to: [51.5074, -0.1278] as [number, number],
    label: "NYC → London",
  },
  {
    id: "sydney-paris",
    from: [-33.8688, 151.2093] as [number, number],
    to: [48.8566, 2.3522] as [number, number],
    label: "Sydney → Paris",
  },
  {
    id: "dubai-saopaulo",
    from: [25.2048, 55.2708] as [number, number],
    to: [-23.5505, -46.6333] as [number, number],
    label: "Dubai → São Paulo",
  },
  {
    id: "sf-london",
    from: [37.7595, -122.4367] as [number, number],
    to: [51.5074, -0.1278] as [number, number],
    label: "SF → London",
  },
  {
    id: "nyc-dubai",
    from: [40.7128, -74.006] as [number, number],
    to: [25.2048, 55.2708] as [number, number],
    label: "NYC → Dubai",
  },
  {
    id: "paris-tokyo",
    from: [48.8566, 2.3522] as [number, number],
    to: [35.6762, 139.6503] as [number, number],
    label: "Paris → Tokyo",
  },
  {
    id: "capetown-london",
    from: [-33.9249, 18.4241] as [number, number],
    to: [51.5074, -0.1278] as [number, number],
    label: "Cape Town → London",
  },
  {
    id: "saopaulo-nyc",
    from: [-23.5505, -46.6333] as [number, number],
    to: [40.7128, -74.006] as [number, number],
    label: "São Paulo → NYC",
  },
  {
    id: "sydney-dubai",
    from: [-33.8688, 151.2093] as [number, number],
    to: [25.2048, 55.2708] as [number, number],
    label: "Sydney → Dubai",
  },
  {
    id: "tokyo-capetown",
    from: [35.6762, 139.6503] as [number, number],
    to: [-33.9249, 18.4241] as [number, number],
    label: "Tokyo → Cape Town",
  },
  {
    id: "paris-saopaulo",
    from: [48.8566, 2.3522] as [number, number],
    to: [-23.5505, -46.6333] as [number, number],
    label: "Paris → São Paulo",
  },
  {
    id: "sf-nyc",
    from: [37.7595, -122.4367] as [number, number],
    to: [40.7128, -74.006] as [number, number],
    label: "SF → NYC",
  },
  {
    id: "sf-paris",
    from: [37.7595, -122.4367] as [number, number],
    to: [48.8566, 2.3522] as [number, number],
    label: "SF → Paris",
  },
  {
    id: "sf-dubai",
    from: [37.7595, -122.4367] as [number, number],
    to: [25.2048, 55.2708] as [number, number],
    label: "SF → Dubai",
  },
  {
    id: "nyc-paris",
    from: [40.7128, -74.006] as [number, number],
    to: [48.8566, 2.3522] as [number, number],
    label: "NYC → Paris",
  },
  {
    id: "nyc-tokyo",
    from: [40.7128, -74.006] as [number, number],
    to: [35.6762, 139.6503] as [number, number],
    label: "NYC → Tokyo",
  },
  {
    id: "nyc-sydney",
    from: [40.7128, -74.006] as [number, number],
    to: [-33.8688, 151.2093] as [number, number],
    label: "NYC → Sydney",
  },
  {
    id: "london-dubai",
    from: [51.5074, -0.1278] as [number, number],
    to: [25.2048, 55.2708] as [number, number],
    label: "London → Dubai",
  },
  {
    id: "london-saopaulo",
    from: [51.5074, -0.1278] as [number, number],
    to: [-23.5505, -46.6333] as [number, number],
    label: "London → São Paulo",
  },
  {
    id: "london-sydney",
    from: [51.5074, -0.1278] as [number, number],
    to: [-33.8688, 151.2093] as [number, number],
    label: "London → Sydney",
  },
  {
    id: "tokyo-sydney",
    from: [35.6762, 139.6503] as [number, number],
    to: [-33.8688, 151.2093] as [number, number],
    label: "Tokyo → Sydney",
  },
  {
    id: "tokyo-dubai",
    from: [35.6762, 139.6503] as [number, number],
    to: [25.2048, 55.2708] as [number, number],
    label: "Tokyo → Dubai",
  },
  {
    id: "tokyo-saopaulo",
    from: [35.6762, 139.6503] as [number, number],
    to: [-23.5505, -46.6333] as [number, number],
    label: "Tokyo → São Paulo",
  },
  {
    id: "paris-capetown",
    from: [48.8566, 2.3522] as [number, number],
    to: [-33.9249, 18.4241] as [number, number],
    label: "Paris → Cape Town",
  },
  {
    id: "paris-dubai",
    from: [48.8566, 2.3522] as [number, number],
    to: [25.2048, 55.2708] as [number, number],
    label: "Paris → Dubai",
  },
  {
    id: "dubai-capetown",
    from: [25.2048, 55.2708] as [number, number],
    to: [-33.9249, 18.4241] as [number, number],
    label: "Dubai → Cape Town",
  },
  {
    id: "dubai-london-return",
    from: [25.2048, 55.2708] as [number, number],
    to: [51.5074, -0.1278] as [number, number],
    label: "Dubai → London",
  },
  {
    id: "capetown-nyc",
    from: [-33.9249, 18.4241] as [number, number],
    to: [40.7128, -74.006] as [number, number],
    label: "Cape Town → NYC",
  },
  {
    id: "capetown-sydney",
    from: [-33.9249, 18.4241] as [number, number],
    to: [-33.8688, 151.2093] as [number, number],
    label: "Cape Town → Sydney",
  },
  {
    id: "saopaulo-sf",
    from: [-23.5505, -46.6333] as [number, number],
    to: [37.7595, -122.4367] as [number, number],
    label: "São Paulo → SF",
  },
  {
    id: "saopaulo-dubai",
    from: [-23.5505, -46.6333] as [number, number],
    to: [25.2048, 55.2708] as [number, number],
    label: "São Paulo → Dubai",
  },
  {
    id: "sydney-sf",
    from: [-33.8688, 151.2093] as [number, number],
    to: [37.7595, -122.4367] as [number, number],
    label: "Sydney → SF",
  },
  {
    id: "sydney-nyc",
    from: [-33.8688, 151.2093] as [number, number],
    to: [40.7128, -74.006] as [number, number],
    label: "Sydney → NYC",
  },
];

const googleGlobeArcColors: [number, number, number][] = [
  [0.2588, 0.5216, 0.9569],
  [0.9843, 0.7373, 0.0196],
  [0.2039, 0.6588, 0.3255],
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-6 sm:px-10 lg:px-12 lg:py-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-line bg-card px-5 py-3">
        <Link href="/" className="text-lg leading-none">
          <BrandMark />
        </Link>

        <div className="flex items-center justify-self-center gap-3">
          <span className="text-lg font-medium text-foreground sm:text-xl">I&apos;m a</span>
          <NavHeader items={headerLinks} />
        </div>

        <div className="flex items-center justify-self-end gap-3">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-foreground rounded-full border border-line px-4 py-1.5 transition hover:bg-black/4"
          >
            Dashboard
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted transition hover:text-foreground"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="grid gap-6 rounded-[1.75rem] border border-line bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_58%,rgba(66,133,244,0.18)_100%)] px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:px-12">
        <div className="flex flex-col justify-center text-foreground">
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
            <span className="inline-flex items-center gap-3 align-middle sm:gap-4">
              <Image
                src={covalentHeroMark}
                alt=""
                aria-hidden="true"
                className="h-20 w-20 shrink-0 object-contain sm:h-28 sm:w-28 lg:h-36 lg:w-36"
                priority
              />
              <BrandMark className="text-[3.375rem] leading-none sm:text-[4.5rem] lg:text-[7.2rem]" />
            </span>
            <span className="ml-2 align-middle text-2xl font-medium leading-snug text-foreground sm:text-3xl lg:text-4xl">
              Match. Remember. Bridge.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Shared layer that connects startup teams, investors, and mentors across ecosystems to discover opportunities, support one another, and accelerate growth.
          </p>
        </div>

        <div className="rounded-[1.75rem] bg-transparent p-3 flex min-h-0">
          <Globe
            markers={globeMarkers}
            arcs={globeArcs}
            className="h-full w-full"
            markerColor={[0.2039, 0.6588, 0.3255]}
            baseColor={[0.96, 0.98, 1]}
            arcColor={[0.2588, 0.5216, 0.9569]}
            arcColors={googleGlobeArcColors}
            glowColor={[0.99, 0.96, 0.82]}
            dark={0}
            mapBrightness={12}
            markerSize={0.025}
            markerElevation={0.01}
            arcWidth={0.7}
            arcHeight={0.3}
            speed={0.003}
            theta={0.2}
            diffuse={1.5}
            mapSamples={16000}
          />
        </div>
      </section>

    </main>
  );
}
