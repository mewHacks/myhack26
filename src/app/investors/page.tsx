import type { Metadata } from "next";

import { AudiencePage } from "@/components/audience-page";
import { audiencePages } from "@/lib/page-content";

export const metadata: Metadata = {
  title: "Opportunity Page | Covalent",
  description: "Audience page for capital partners.",
};

export default function InvestorsPage() {
  return <AudiencePage page={audiencePages.investors} />;
}
