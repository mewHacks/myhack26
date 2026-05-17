const DEFAULT_CHECK_WEIGHTS: Record<string, number> = {
  brand_impersonation: 8,
  clipboard_key_capture_absent: 12,
  credential_harvest_absent: 16,
  domain_lookalike_absent: 12,
  hidden_capture_fields_absent: 10,
  obfuscated_scripts_absent: 8,
  off_origin_form_action_absent: 14,
  pii_request_safe: 8,
  reclaim_proof_valid: 4,
  redirect_chain_safe: 6,
  suspicious_download_prompt_absent: 10,
  suspicious_script_sources_absent: 8,
  tee_attestation_valid: 6,
  wallet_drain_prompt_absent: 16,
  zktls_proof_valid: 6,
};

function parseInteger(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseList(value: string | undefined, fallback: string[]) {
  if (!value) {
    return fallback;
  }

  const parsed = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : fallback;
}

function parseWeights(value: string | undefined) {
  if (!value) {
    return DEFAULT_CHECK_WEIGHTS;
  }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const normalized = Object.entries(parsed).reduce<Record<string, number>>((acc, [key, rawValue]) => {
      const numericValue = Number(rawValue);
      if (Number.isFinite(numericValue)) {
        acc[key] = numericValue;
      }
      return acc;
    }, {});

    return { ...DEFAULT_CHECK_WEIGHTS, ...normalized };
  } catch {
    return DEFAULT_CHECK_WEIGHTS;
  }
}

const defaultMandatoryBlockers = [
  "credential_harvest_absent",
  "off_origin_form_action_absent",
  "wallet_drain_prompt_absent",
  "tee_attestation_valid",
  "zktls_proof_valid",
];

export const scanConfig = {
  blockerMinRiskScore: parseInteger(process.env.NEXT_PUBLIC_ZKSAFE_BLOCKER_MIN_RISK_SCORE, 80),
  blockerWeightMultiplier: parseInteger(process.env.NEXT_PUBLIC_ZKSAFE_BLOCKER_WEIGHT_MULTIPLIER, 2),
  checkWeights: parseWeights(process.env.NEXT_PUBLIC_ZKSAFE_CHECK_WEIGHTS),
  dangerRiskScore: parseInteger(process.env.NEXT_PUBLIC_ZKSAFE_DANGER_RISK_SCORE, 70),
  appBaseUrl: process.env.NEXT_PUBLIC_ZKSAFE_APP_BASE_URL?.trim() || "http://localhost:3000",
  mandatoryBlockers: parseList(process.env.NEXT_PUBLIC_ZKSAFE_MANDATORY_BLOCKERS, defaultMandatoryBlockers),
  scoringEndpoint: process.env.NEXT_PUBLIC_ZKSAFE_TEE_SCORING_ENDPOINT?.trim() || "",
  strictResponseValidation: process.env.NEXT_PUBLIC_ZKSAFE_TEE_STRICT_RESPONSE !== "false",
  timeoutMs: parseInteger(process.env.NEXT_PUBLIC_ZKSAFE_SCAN_TIMEOUT_MS, 4000),
  upgradeUrl: process.env.NEXT_PUBLIC_ZKSAFE_STRIPE_UPGRADE_URL?.trim() || "",
  warningRiskScore: parseInteger(process.env.NEXT_PUBLIC_ZKSAFE_WARNING_RISK_SCORE, 35),
};

export const defaultCheckWeights = DEFAULT_CHECK_WEIGHTS;
