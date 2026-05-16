import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OpportunityDetailView } from "@/components/opportunity-detail-view";
import {
  browsePages,
  browsePageThemes,
  getOpportunitySlug,
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
  const theme = browsePageThemes[audience];

  return <OpportunityDetailView audience={audience} item={item} theme={theme} />;
}
