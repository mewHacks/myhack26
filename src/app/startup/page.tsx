import type { Metadata } from "next";

import { AudienceBrowsePage } from "@/components/audience-browse-page";
import { browsePages, browsePageThemes } from "@/lib/browse-page-content";

export const metadata: Metadata = {
  title: "Startup | Covalent",
  description: "Browse programmes, investors, and mentors in one place.",
};

export default function StartupPage() {
  return <AudienceBrowsePage audience="startup" opportunities={browsePages.startup} theme={browsePageThemes.startup} />;
}
