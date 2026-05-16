import type { Metadata } from "next";

import { InvestorBuilder } from "@/components/ai-interview/investor-builder";

export const metadata: Metadata = {
  title: "AI Interview POC | Covalent",
  description: "Create a file-based AI investor interview with browser voice and optional LiveKit video.",
};

export default function AiInterviewPage() {
  return <InvestorBuilder />;
}
