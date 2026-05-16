"use client";

import Link from "next/link";

import { AiMatchCard } from "@/components/ai-match-card";
import { BrandMark } from "@/components/brand-mark";
import { OpportunityCard } from "@/components/opportunity-card";
import NavHeader from "@/components/ui/nav-header";
import {
  getOpportunitySlug,
  headerLinks,
  type AudienceSlug,
  type BrowseOpportunity,
  type BrowsePageTheme,
} from "@/lib/browse-page-content";
import { useAiMatches } from "@/hooks/use-ai-matches";

const defaultViewerIds: Record<AudienceSlug, string> = {
  startup: "founder-aisha",
  mentors: "mentor-james",
  investors: "investor-northstar",
};

type AudienceBrowsePageProps = {
  audience: AudienceSlug;
  opportunities: BrowseOpportunity[];
  theme: BrowsePageTheme;
};

export function AudienceBrowsePage({ audience, opportunities, theme }: AudienceBrowsePageProps) {
  const viewerId = defaultViewerIds[audience];
  const { matches, loading } = useAiMatches(viewerId);

  const browseMore = opportunities.slice(3);

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

      <section className={`rounded-[1.75rem] border border-line p-4 sm:p-6 ${theme.sectionGradientClass}`}>
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4 px-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">AI Recommended</p>
              <h1 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">
                {loading ? "Finding your best matches…" : "Best next matches for you"}
              </h1>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading || matches.length === 0
              ? opportunities.slice(0, 3).map((item, index) => (
                  <OpportunityCard
                    key={item.title}
                    glowClass={theme.headerGlowClass}
                    href={`/opportunities/${getOpportunitySlug(audience, item.title)}`}
                    index={index}
                    item={item}
                    recommended
                  />
                ))
              : matches.map((match, index) => (
                  <AiMatchCard
                    key={match.id}
                    match={match}
                    index={index}
                    glowClass={theme.headerGlowClass}
                    viewerId={viewerId}
                  />
                ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {browseMore.map((item, index) => (
              <OpportunityCard
                key={item.title}
                glowClass={theme.headerGlowClass}
                href={`/opportunities/${getOpportunitySlug(audience, item.title)}`}
                index={3 + index}
                item={item}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
