import { scanConfig } from "@/lib/scan-config";
import type { BenchCheck, ScoreSummary, TeeScanResponse, Threat } from "@/lib/scan-types";

type LooseRecord = Record<string, unknown>;

function isObject(value: unknown): value is LooseRecord {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function humanizeCheckId(checkId: string) {
  return checkId
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function normalizeThreatsToChecks(threats: Threat[]) {
  return threats.map<BenchCheck>((threat) => ({
    applicable: true,
    evidence: threat.reason,
    id: threat.key,
    label: threat.label,
    mandatory: threat.mandatory,
    safe: !threat.checked,
    weight: threat.weight,
  }));
}

function normalizeCheck(value: unknown): BenchCheck | null {
  if (!isObject(value)) {
    return null;
  }

  const id = asString(value.id || value.key);
  if (!id) {
    return null;
  }

  const applicable = value.applicable === undefined ? true : asBoolean(value.applicable, true);
  const safe = value.safe === undefined ? asBoolean(value.passed, false) : asBoolean(value.safe, false);
  const evidence = asString(value.evidence || value.reason || value.detail, safe ? "Check passed." : "Check failed.");
  const label = asString(value.label, humanizeCheckId(id));
  const mandatory = asBoolean(value.mandatory, false);
  const rawWeight = Number(value.weight);

  return {
    applicable,
    evidence,
    id,
    label,
    mandatory,
    safe,
    weight: Number.isFinite(rawWeight) ? rawWeight : undefined,
  };
}

export function normalizeTeeScanResponse(payload: unknown): TeeScanResponse | null {
  if (!isObject(payload)) {
    return null;
  }

  const checks = Array.isArray(payload.checks) ? payload.checks.map(normalizeCheck).filter((check): check is BenchCheck => check !== null) : [];
  if (checks.length === 0) {
    return null;
  }

  const teePayload = isObject(payload.tee) ? payload.tee : {};
  const proofPayload = isObject(payload.zktls) ? payload.zktls : isObject(payload.proof) ? payload.proof : {};
  const modelPayload = isObject(payload.model) ? payload.model : undefined;

  if (scanConfig.strictResponseValidation) {
    const everyCheckIsStrict = checks.every((check) =>
      typeof check.id === "string" &&
      typeof check.label === "string" &&
      typeof check.evidence === "string" &&
      typeof check.safe === "boolean" &&
      typeof check.applicable === "boolean"
    );

    const hasStrictTee = typeof teePayload.verified === "boolean";
    const hasStrictProof = typeof proofPayload.verified === "boolean";

    if (!everyCheckIsStrict || !hasStrictTee || !hasStrictProof) {
      return null;
    }
  }

  return {
    checks,
    model: modelPayload
      ? {
          latencyMs: Number.isFinite(Number(modelPayload.latencyMs)) ? Number(modelPayload.latencyMs) : undefined,
          name: asString(modelPayload.name),
        }
      : undefined,
    source: asString(payload.source, "tee"),
    tee: {
      attestation: asString(teePayload.attestation || teePayload.status),
      verified: asBoolean(teePayload.verified, false),
    },
    zktls: {
      handshake: asString(proofPayload.handshake, "Confidential VM attested"),
      proofId: asString(proofPayload.proofId),
      provider: asString(proofPayload.provider, "Reclaim Protocol"),
      signature: asString(proofPayload.signature),
      verified: asBoolean(proofPayload.verified, false),
    },
  };
}

export function scoreChecks(checks: BenchCheck[]): ScoreSummary {
  const applicableChecks = checks.filter((check) => check.applicable);
  const nTotal = applicableChecks.length;
  const nSafe = applicableChecks.filter((check) => check.safe).length;
  const failedChecks = applicableChecks.filter((check) => !check.safe);
  const blockerFailures = failedChecks.filter((check) => scanConfig.mandatoryBlockers.includes(check.id) || check.mandatory);
  const baseSafetyScore = nTotal > 0 ? Math.floor((100 * nSafe) / nTotal) : 0;
  const baseRiskScore = 100 - baseSafetyScore;

  const weightedPenalty = failedChecks.reduce((total, check) => {
    const configuredWeight = scanConfig.checkWeights[check.id] ?? check.weight ?? 1;
    const isBlocker = blockerFailures.some((blocker) => blocker.id === check.id);
    return total + configuredWeight * (isBlocker ? scanConfig.blockerWeightMultiplier : 1);
  }, 0);

  let riskScore = Math.min(100, baseRiskScore + weightedPenalty);
  if (blockerFailures.length > 0) {
    riskScore = Math.max(riskScore, scanConfig.blockerMinRiskScore);
  }

  const safetyScore = Math.max(0, 100 - riskScore);
  const status = riskScore >= scanConfig.dangerRiskScore
    ? "danger"
    : riskScore >= scanConfig.warningRiskScore
      ? "warning"
      : "verified";

  return {
    blockerFailures,
    failedChecks,
    nSafe,
    nTotal,
    riskScore,
    safetyScore,
    status,
  };
}

export function checksToThreats(checks: BenchCheck[]) {
  return checks
    .filter((check) => check.applicable)
    .map<Threat>((check) => ({
      checked: !check.safe,
      key: check.id,
      label: check.label,
      mandatory: scanConfig.mandatoryBlockers.includes(check.id) || check.mandatory,
      reason: check.evidence,
      weight: scanConfig.checkWeights[check.id] ?? check.weight,
    }));
}

export function generateProofSignature(seed = "zksafe") {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }

  const hex = Array.from({ length: 64 }, (_, index) => {
    const nibble = Math.abs((hash + index * 17 + seed.length * 31) % 16);
    return nibble.toString(16);
  }).join("");

  return `0x${hex}`;
}
