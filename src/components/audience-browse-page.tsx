import Image from "next/image";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { AiRecommendationIcon } from "@/components/ui/ai-recommendation-icon";
import NavHeader from "@/components/ui/nav-header";
import {
  getOpportunitySlug,
  headerLinks,
  opportunityTypes,
  type AudienceSlug,
  type BrowseOpportunity,
  type BrowsePageTheme,
} from "@/lib/browse-page-content";

type AudienceBrowsePageProps = {
  audience: AudienceSlug;
  opportunities: BrowseOpportunity[];
  theme: BrowsePageTheme;
};

export function AudienceBrowsePage({ audience, opportunities, theme }: AudienceBrowsePageProps) {
  const recommended = opportunities.slice(0, 3);
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
              <h1 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">Best next matches for you</h1>
            </div>
            <div className="rounded-full border border-line bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Live suggestions
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommended.map((item) => {
              const type = opportunityTypes[item.type];

              return (
                <Link
                  key={item.title}
                  href={`/opportunities/${getOpportunitySlug(audience, item.title)}`}
                  className={`group overflow-hidden rounded-[1.75rem] border border-line bg-card ${theme.headerGlowClass} ring-1 ring-white/70 transition hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div className="relative h-72 sm:h-80">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground backdrop-blur-sm">
                        <AiRecommendationIcon className="h-4 w-4 shrink-0" />
                        AI Pick
                      </span>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${type.badgeClass}`}>
                        {type.label}
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-5 text-white sm:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/80">{item.meta}</span>
                        <span className="text-sm font-semibold text-white">Open</span>
                      </div>

                      <div className="mt-3">
                        <h2 className="text-2xl font-semibold leading-tight">{item.title}</h2>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/88 sm:text-base">
                          {item.summary}
                        </p>
                      </div>

                      <span
                        className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold transition group-hover:opacity-90 ${type.buttonClass}`}
                      >
                        {item.cta}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {browseMore.map((item) => {
            const type = opportunityTypes[item.type];

            return (
              <Link
                key={item.title}
                href={`/opportunities/${getOpportunitySlug(audience, item.title)}`}
                className={`group overflow-hidden rounded-[1.75rem] border border-line bg-card ${theme.headerGlowClass} transition hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="relative h-64 sm:h-72">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${type.badgeClass}`}>
                      {type.label}
                    </span>
                    <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur-sm">
                      {item.meta}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-5 text-white sm:p-6">
                    <h2 className="text-2xl font-semibold leading-tight">{item.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/88 sm:text-base">{item.summary}</p>
                    <span className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${type.buttonClass}`}>
                      {item.cta}
                    </span>
                  </div>
                </div>
              </Link>
            );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
