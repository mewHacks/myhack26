import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
import NavHeader from "@/components/ui/nav-header";
import {
  browsePages,
  browsePageThemes,
  getOpportunitySlug,
  headerLinks,
  opportunityTypes,
  type AudienceSlug,
} from "@/lib/browse-page-content";

type OpportunityPageProps = {
  params: Promise<{ slug: string }>;
};

function findOpportunity(slug: string) {
  const audiences = Object.keys(browsePages) as AudienceSlug[];

  for (const audience of audiences) {
    for (const item of browsePages[audience]) {
      if (getOpportunitySlug(audience, item.title) === slug) {
        return { audience, item };
      }
    }
  }

  return null;
}

export async function generateMetadata({ params }: OpportunityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = findOpportunity(slug);

  if (!result) {
    return { title: "Opportunity | Covalent" };
  }

  return {
    title: `${result.item.title} | Covalent`,
    description: result.item.summary,
  };
}

export default async function OpportunityPage({ params }: OpportunityPageProps) {
  const { slug } = await params;
  const result = findOpportunity(slug);

  if (!result) notFound();

  const { audience, item } = result;
  const type = opportunityTypes[item.type];
  const theme = browsePageThemes[audience];

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
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className={`overflow-hidden rounded-[1.75rem] border border-line bg-card ${theme.headerGlowClass}`}>
            <div className="relative h-80 sm:h-[32rem]">
              <Image src={item.image} alt={item.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </article>

          <div className="flex flex-col justify-center rounded-[1.75rem] border border-line bg-card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${type.badgeClass}`}>
                {type.label}
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{item.meta}</span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">{item.title}</h1>
            <p className="mt-5 text-base leading-8 text-muted sm:text-lg">{item.summary}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${audience}`}
                className={`inline-flex rounded-full px-5 py-3 text-sm font-semibold transition hover:opacity-90 ${type.buttonClass}`}
              >
                {item.cta}
              </Link>
              <Link href={`/${audience}`} className="inline-flex rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground">
                Back to browse
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
