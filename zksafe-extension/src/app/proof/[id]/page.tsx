import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const isDanger = id.includes("danger");
  const domain = isDanger ? "fake-eth.io" : "binance.com";
  const title = `zkSafe Proof: ${domain} - ${isDanger ? "MALICIOUS" : "SAFE"}`;
  const description = `zkTLS verified security analysis for ${domain}. See the cryptographic proof and agent reasoning logs.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: "/icon.png",
          width: 512,
          height: 512,
          alt: "zkSafe Security Certificate",
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/icon.png"],
    },
  };
}

import { ProofClient } from "@/components/ProofClient";

export function generateStaticParams() {
  return [
    { id: "binance-safe" },
    { id: "fake-eth-danger" },
  ];
}

export default async function ProofPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProofClient id={id} />;
}
