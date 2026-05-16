import type { Metadata } from "next";

import { AudienceBrowsePage } from "@/components/audience-browse-page";
import { browsePages, browsePageThemes } from "@/lib/browse-page-content";

export const metadata: Metadata = {
  title: "Investors | Covalent",
  description: "Browse investor opportunities, mentors, and scouting tools in one place.",
};

export default function InvestorsPage() {
  return <AudienceBrowsePage opportunities={browsePages.investors} theme={browsePageThemes.investors} />;
}
