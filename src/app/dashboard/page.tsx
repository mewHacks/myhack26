import type { Metadata } from "next";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { RelationshipDashboard } from "@/components/relationship-dashboard";
import { HeaderActions } from "@/components/ui/header-actions";
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
        <HeaderActions />
      </header>

      <section className="relative overflow-hidden rounded-[1.75rem] border border-line bg-[linear-gradient(135deg,#ffffff_0%,#ffffff_48%,rgba(66,133,244,0.18)_72%,rgba(52,168,83,0.14)_100%)] p-4 shadow-[0_24px_80px_rgba(60,64,67,0.08)] sm:p-6">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[var(--color-google-blue)]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-12 h-64 w-64 rounded-full bg-[var(--color-google-yellow)]/20 blur-3xl" />
        <RelationshipDashboard viewerId={DEMO_VIEWER_ID} />
      </section>
    </main>
  );
}
