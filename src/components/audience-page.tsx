import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { StockImageRail } from "@/components/stock-image-rail";
import { HeaderActions } from "@/components/ui/header-actions";
import NavHeader from "@/components/ui/nav-header";
import type { AudiencePageContent } from "@/lib/page-content";

type AudiencePageProps = {
  page: AudiencePageContent;
};

const allLinks = [
  { href: "/startup", label: "Startup" },
  { href: "/investors", label: "Investors" },
  { href: "/mentors", label: "Mentors" },
];

const headerLinks = [
  { href: "/startup", label: "Startup", color: "var(--color-google-blue)" },
  { href: "/investors", label: "Investors", color: "var(--color-google-yellow)" },
  { href: "/mentors", label: "Mentors", color: "var(--color-google-green)" },
]

const highlightClasses = [
  "border border-line text-[var(--color-google-blue)]",
  "border border-line text-[var(--color-google-yellow)]",
  "border border-line text-[var(--color-google-green)]",
];

const routeClasses = [
  "border-black border-2 bg-[var(--color-google-blue)] text-white hover:opacity-90",
  "border-black border-2 bg-[var(--color-google-yellow)] text-white hover:opacity-90",
  "border-black border-2 bg-[var(--color-google-green)] text-white hover:opacity-90",
];

export function AudiencePage({ page }: AudiencePageProps) {
  const relatedLinks = allLinks.filter((link) => link.href !== `/${page.slug}`);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-6 sm:px-10 lg:px-12 lg:py-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-line bg-card px-5 py-3">
        <Link href="/" className="text-lg leading-none">
          <BrandMark />
        </Link>

        <NavHeader items={headerLinks} className="justify-self-center" />

        <HeaderActions />
      </header>

      <section className="grid gap-6 rounded-[1.75rem] border border-line p-3">
        <div className="rounded-[1.65rem] border border-line bg-card p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{page.eyebrow}</p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{page.summary}</p>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted">{page.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {page.highlights.map((highlight, index) => (
              <p
                key={highlight}
                className={`rounded-[1.25rem] border border-line px-4 py-4 text-sm font-medium ${highlightClasses[index % highlightClasses.length]}`}
              >
                {highlight}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {page.sections.map((section) => (
          <article key={section.title} className="rounded-[1.75rem] border border-line bg-card p-7">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{section.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[1.75rem] border border-line bg-card p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Keep moving</p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight">Move between audience pages to compare tone and flow.</h2>

          <div className="mt-6 grid gap-3">
              {relatedLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-press-start-2p rounded-[1.35rem] border px-4 py-4 text-sm font-medium transition ${routeClasses[index % routeClasses.length]}`}
                >
                  Go to {link.label}
                </Link>
              ))}
          </div>
        </div>

        <StockImageRail items={page.gallery} />
      </section>
    </main>
  );
}
