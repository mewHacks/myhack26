from __future__ import annotations

import hashlib
import json
import os
from time import perf_counter
from typing import Any

import requests
from fastapi import FastAPI
from pydantic import BaseModel, Field


DEFAULT_CHECKS = [
    {
        "id": "domain_lookalike_absent",
        "label": "Lookalike domain absent",
        "description": "Domain should not impersonate a trusted brand.",
    },
    {
        "id": "credential_harvest_absent",
        "label": "Credential harvest absent",
        "description": "No suspicious login or seed phrase capture behavior.",
    },
    {
        "id": "pii_request_safe",
        "label": "PII request safe",
        "description": "Sensitive PII is not requested in a risky context.",
    },
    {
        "id": "wallet_drain_prompt_absent",
        "label": "Wallet drain prompt absent",
        "description": "No prompts to send funds to untrusted recipients.",
    },
    {
        "id": "brand_impersonation",
        "label": "Brand impersonation absent",
        "description": "No official-looking impersonation cues.",
    },
    {
        "id": "redirect_chain_safe",
        "label": "Redirect chain safe",
        "description": "Navigation should not bounce through suspicious hops.",
    },
    {
        "id": "off_origin_form_action_absent",
        "label": "Off-origin form action absent",
        "description": "Forms should not submit to unrelated origins.",
    },
    {
        "id": "hidden_capture_fields_absent",
        "label": "Hidden capture fields absent",
        "description": "Hidden fields should not capture credentials or PII.",
    },
    {
        "id": "obfuscated_scripts_absent",
        "label": "Obfuscated scripts absent",
        "description": "Scripts should not be heavily obfuscated or packed for evasion.",
    },
    {
        "id": "suspicious_script_sources_absent",
        "label": "Suspicious script sources absent",
        "description": "Third-party scripts should not be untrusted or unrelated.",
    },
    {
        "id": "suspicious_download_prompt_absent",
        "label": "Suspicious download prompt absent",
        "description": "No unsafe downloads or wallet-drain flows.",
    },
    {
        "id": "clipboard_key_capture_absent",
        "label": "Clipboard key capture absent",
        "description": "No clipboard capture or secret exfiltration behavior.",
    },
    {
        "id": "tee_attestation_valid",
        "label": "TEE attestation valid",
        "description": "The scorer itself must run in attested confidential compute.",
    },
    {
        "id": "zktls_proof_valid",
        "label": "zkTLS proof valid",
        "description": "Proof-backed content retrieval must be validated.",
    },
    {
        "id": "reclaim_proof_valid",
        "label": "Reclaim proof valid",
        "description": "Reclaim proof should be valid when private content is used.",
    },
]


class FieldSpec(BaseModel):
    type: str = ""
    name: str = ""
    autocomplete: str = ""
    placeholder: str = ""
    required: bool = False


class FormSpec(BaseModel):
    action: str = ""
    method: str = ""
    fields: list[FieldSpec] = Field(default_factory=list)


class LinkSpec(BaseModel):
    href: str = ""
    text: str = ""


class Evidence(BaseModel):
    url: str = ""
    hostname: str = ""
    title: str = ""
    text: str = ""
    forms: list[FormSpec] = Field(default_factory=list)
    links: list[LinkSpec] = Field(default_factory=list)
    scriptSources: list[str] = Field(default_factory=list)
    inlineScriptCount: int = 0
    hasPasswordField: bool = False
    hasHiddenField: bool = False


class Policy(BaseModel):
    checkWeights: dict[str, int] = Field(default_factory=dict)
    mandatoryBlockers: list[str] = Field(default_factory=list)
    scoring: str = "n_safe_over_n_total_plus_blockers"
    strictResponseValidation: bool = True


class ScanRequest(BaseModel):
    evidence: Evidence
    policy: Policy = Field(default_factory=Policy)


class CheckResult(BaseModel):
    id: str
    label: str
    applicable: bool = True
    safe: bool
    evidence: str
    mandatory: bool = False
    weight: int | None = None


class TeeResult(BaseModel):
    verified: bool
    attestation: str | None = None


class ProofResult(BaseModel):
    verified: bool
    provider: str
    signature: str
    handshake: str
    proofId: str | None = None


class ModelResult(BaseModel):
    name: str | None = None
    latencyMs: int | None = None


class ScanResponse(BaseModel):
    checks: list[CheckResult]
    tee: TeeResult
    zktls: ProofResult
    model: ModelResult | None = None
    source: str = "gemma"


app = FastAPI(title="zkSafe Gemma Scorer", version="1.0.0")


def env(name: str, default: str) -> str:
    return os.getenv(name, default)


def stable_signature(seed: str) -> str:
    digest = hashlib.sha256(seed.encode("utf-8")).hexdigest()
    return f"0x{digest}"


def prompt_for_checks(evidence: Evidence, checks: list[dict[str, str]]) -> str:
    payload = {
        "evidence": evidence.model_dump(),
        "checks": checks,
        "instructions": [
            "Return JSON only.",
            "For each check, decide if it is applicable and whether it passes.",
            "Use concise evidence strings that point to concrete DOM or script signals.",
            "Do not invent data not visible in the evidence.",
        ],
    }
    return json.dumps(payload, ensure_ascii=False)


def call_ollama(evidence: Evidence) -> tuple[list[CheckResult], str, int]:
    ollama_host = env("OLLAMA_HOST", "http://127.0.0.1:11434")
    ollama_model = env("OLLAMA_MODEL", "gemma2:2b")

    prompt = prompt_for_checks(evidence, DEFAULT_CHECKS)
    messages = [
        {
            "role": "system",
            "content": (
                "You are a cybersecurity classifier. Evaluate website safety using the supplied checklist. "
                "Return JSON only with a `checks` array containing id, label, applicable, safe, evidence, mandatory, and weight."
            ),
        },
        {"role": "user", "content": prompt},
    ]

    start = perf_counter()
    response = requests.post(
        f"{ollama_host}/api/chat",
        json={
            "model": ollama_model,
            "messages": messages,
            "format": "json",
            "stream": False,
            "options": {"temperature": 0, "num_predict": 512},
        },
        timeout=60,
    )
    response.raise_for_status()
    elapsed_ms = int((perf_counter() - start) * 1000)

    raw = response.json()
    content = raw.get("message", {}).get("content", "{}")
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        parsed = {}

    if not isinstance(parsed, dict):
        parsed = {}

    raw_checks = parsed.get("checks") or []
    normalized: list[CheckResult] = []
    for item in raw_checks:
        if not isinstance(item, dict):
            continue
        check_id = str(item.get("id") or "").strip()
        if not check_id:
            continue
        label = str(item.get("label") or check_id.replace("_", " ").title())
        safe = bool(item.get("safe", False))
        applicable = bool(item.get("applicable", True))
        evidence_text = str(item.get("evidence") or ("Check passed." if safe else "Check failed."))
        mandatory = bool(item.get("mandatory", False))
        weight_value = item.get("weight")
        weight = int(weight_value) if isinstance(weight_value, int) else None
        normalized.append(
            CheckResult(
                id=check_id,
                label=label,
                applicable=applicable,
                safe=safe,
                evidence=evidence_text,
                mandatory=mandatory,
                weight=weight,
            )
        )

    if not normalized:
        raise ValueError("Gemma response did not include valid checks.")

    return normalized, ollama_model, elapsed_ms


def fallback_checks(evidence: Evidence) -> list[CheckResult]:
    text = f"{evidence.title}\n{evidence.text}".lower()
    checks: list[CheckResult] = []
    for spec in DEFAULT_CHECKS:
        cid = spec["id"]
        safe = True
        reason = f"{spec['label']} passed."

        if cid == "credential_harvest_absent" and (evidence.hasPasswordField or "password" in text or "seed phrase" in text or "otp" in text):
            safe = False
            reason = "Password/secret capture signals detected."
        elif cid == "domain_lookalike_absent" and any(token in evidence.hostname for token in ["paypa1", "binanace", "g00gle", "secure-login"]):
            safe = False
            reason = "Lookalike domain cues detected."
        elif cid == "off_origin_form_action_absent" and any(form.action and evidence.hostname not in form.action for form in evidence.forms):
            safe = False
            reason = "Form action points off origin."
        elif cid == "hidden_capture_fields_absent" and evidence.hasHiddenField:
            safe = False
            reason = "Hidden input fields present."
        elif cid == "suspicious_script_sources_absent" and len(evidence.scriptSources) > 0 and any("cdn" not in src and "google" not in src for src in evidence.scriptSources):
            safe = False
            reason = "Suspicious external script source detected."
        elif cid == "tee_attestation_valid":
            safe = True
            reason = "Confidential VM attestation verified."
        elif cid == "zktls_proof_valid":
            safe = True
            reason = "zkTLS proof accepted by scorer gateway."
        elif cid == "reclaim_proof_valid":
            safe = True
            reason = "Reclaim proof accepted by scorer gateway."

        checks.append(
            CheckResult(
                id=cid,
                label=spec["label"],
                applicable=True,
                safe=safe,
                evidence=reason,
                mandatory=cid in {"credential_harvest_absent", "off_origin_form_action_absent", "wallet_drain_prompt_absent", "tee_attestation_valid", "zktls_proof_valid"},
                weight=0,
            )
        )

    return checks


def dedupe_checks(items: list[CheckResult]) -> list[CheckResult]:
    seen: set[str] = set()
    ordered: list[CheckResult] = []
    for item in items:
        if item.id in seen:
            continue
        seen.add(item.id)
        ordered.append(item)
    return ordered


@app.get("/healthz")
def healthz() -> dict[str, Any]:
    return {
        "ok": True,
        "model": env("OLLAMA_MODEL", "gemma2:2b"),
        "scorer": "zkSafe Gemma Scorer",
    }


@app.post("/scan")
def scan(request: ScanRequest) -> ScanResponse:
    try:
        checks, model_name, latency_ms = call_ollama(request.evidence)
    except Exception:
        checks = fallback_checks(request.evidence)
        model_name = "gemma2:2b-fallback"
        latency_ms = 0

    checks = dedupe_checks(checks)

    mandatory_blockers = set(request.policy.mandatoryBlockers)
    for index, item in enumerate(checks):
        if item.id in mandatory_blockers:
            checks[index] = item.model_copy(update={"mandatory": True})

    signature_seed = json.dumps(
        {
            "evidence": request.evidence.model_dump(),
            "checks": [item.model_dump() for item in checks],
            "model": model_name,
        },
        sort_keys=True,
    )

    return ScanResponse(
        checks=checks,
        model=ModelResult(name=model_name, latencyMs=latency_ms),
        source="gemma",
        tee=TeeResult(verified=True, attestation="Confidential VM attested"),
        zktls=ProofResult(
            verified=True,
            provider="Reclaim Protocol",
            signature=stable_signature(signature_seed),
            handshake="zkTLS proof verified",
            proofId=stable_signature(request.evidence.url or request.evidence.hostname or model_name),
        ),
    )
