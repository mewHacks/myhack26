import type { Metadata } from "next";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { RelationshipDashboard } from "@/components/relationship-dashboard";
import NavHeader from "@/components/ui/nav-header";
import { headerLinks } from "@/lib/browse-page-content";

export const metadata: Metadata = {
  title: "Dashboard | Covalent",
};

const DEMO_VIEWER_ID = "founder-aisha";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-6 sm:px-10 lg:px-12 lg:py-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-line bg-card px-5 py-3">
        <Link href="/" className="text-lg leading-none">
          <BrandMark />
        </Link>
        <div className="flex items-center justify-self-center gap-3">
          <span className="text-lg font-medium text-foreground sm:text-xl">I&apos;m a</span>
          <NavHeader items={headerLinks} />
        </div>
        <Link href="/" className="justify-self-end text-sm font-medium text-muted transition hover:text-foreground">
          Sign in
        </Link>
      </header>

      <section className="rounded-[1.75rem] border border-line bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_58%,rgba(66,133,244,0.18)_100%)] p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Your Activity</p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Connection Dashboard</h1>
        </div>
        <RelationshipDashboard viewerId={DEMO_VIEWER_ID} />
      </section>
    </main>
  );
}
