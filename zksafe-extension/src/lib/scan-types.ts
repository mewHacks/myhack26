export type Threat = {
  key: string;
  label: string;
  checked: boolean;
  reason: string;
  mandatory?: boolean;
  weight?: number;
};

export type ExtractedField = {
  type: string;
  name: string;
  autocomplete: string;
  placeholder: string;
  required: boolean;
};

export type ExtractedForm = {
  action: string;
  method: string;
  fields: ExtractedField[];
};

export type ExtractedLink = {
  href: string;
  text: string;
};

export type PageEvidence = {
  url: string;
  hostname: string;
  title: string;
  text: string;
  forms: ExtractedForm[];
  links: ExtractedLink[];
  scriptSources: string[];
  inlineScriptCount: number;
  hasPasswordField: boolean;
  hasHiddenField: boolean;
};

export type ScanExtractionResponse = {
  threats: Threat[];
  teeVerified: boolean;
  attestationStatus?: string;
  evidence?: PageEvidence;
  teeError?: string;
  teePayload?: unknown;
};

export type BenchCheck = {
  id: string;
  label: string;
  applicable: boolean;
  safe: boolean;
  evidence: string;
  mandatory?: boolean;
  weight?: number;
};

export type TeeScanResponse = {
  checks: BenchCheck[];
  tee: {
    verified: boolean;
    attestation?: string;
  };
  zktls: {
    verified: boolean;
    provider: string;
    signature: string;
    handshake: string;
    proofId?: string;
  };
  model?: {
    name?: string;
    latencyMs?: number;
  };
  source?: string;
};

export type ScanStatus = "verified" | "warning" | "danger";

export type ScoreSummary = {
  safetyScore: number;
  riskScore: number;
  nSafe: number;
  nTotal: number;
  failedChecks: BenchCheck[];
  blockerFailures: BenchCheck[];
  status: ScanStatus;
};
