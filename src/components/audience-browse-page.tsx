import Image from "next/image";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import NavHeader from "@/components/ui/nav-header";
import {
  headerLinks,
  opportunityTypes,
  type BrowseOpportunity,
  type BrowsePageTheme,
} from "@/lib/browse-page-content";

type AudienceBrowsePageProps = {
  opportunities: BrowseOpportunity[];
  theme: BrowsePageTheme;
};

export function AudienceBrowsePage({ opportunities, theme }: AudienceBrowsePageProps) {
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
        <div className="grid gap-4 lg:grid-cols-12">
          {opportunities.map((item) => {
            const type = opportunityTypes[item.type];
            const featured = item.className.includes("row-span-2");

            return (
              <article
                key={item.title}
                className={`overflow-hidden rounded-[1.75rem] border border-line bg-card ${theme.headerGlowClass} ${item.className}`}
              >
                <div className={`relative ${featured ? "h-72 sm:h-[30rem]" : "h-56"}`}>
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${type.badgeClass}`}>
                      {type.label}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{item.meta}</span>
                  </div>

                  <div>
                    <h2 className={`${featured ? "text-3xl sm:text-4xl" : "text-2xl"} font-semibold leading-tight`}>
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{item.summary}</p>
                  </div>

                  <button
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-90 ${type.buttonClass}`}
                  >
                    {item.cta}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
