const FALLBACK_THREATS = [
  { key: "domain_lookalike_absent", label: "Lookalike domain absent", checked: false, reason: "Domain appears expected." },
  { key: "credential_harvest_absent", label: "Credential harvest absent", checked: false, reason: "No urgent credential harvesting pattern found." },
  { key: "pii_request_safe", label: "PII request is safe", checked: false, reason: "No OTP or password request detected." },
  { key: "wallet_drain_prompt_absent", label: "Wallet drain prompt absent", checked: false, reason: "No suspicious direct transfer instruction found." },
  { key: "brand_impersonation", label: "Brand impersonation absent", checked: false, reason: "No impersonation language found." },
  { key: "zktls_proof_valid", label: "zkTLS proof valid", checked: true, mandatory: true, reason: "No zkTLS proof was attached." },
  { key: "tee_attestation_valid", label: "TEE attestation valid", checked: true, mandatory: true, reason: "No TEE attestation was attached." }
];

async function ensureOffscreenDocument() {
  const offscreenUrl = chrome.runtime.getURL("offscreen.html");
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [offscreenUrl],
  });
  if (contexts.length === 0) {
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play security alarm when threats are detected.",
    });
  }
}

async function playAlarm() {
  try {
    await ensureOffscreenDocument();
    chrome.runtime.sendMessage({ type: "PLAY_ALARM" });
  } catch {
    // no-op fallback for browsers without offscreen support
  }
}

function bandFromThreats(threats) {
  const count = threats.filter((t) => t.checked).length;
  if (count >= 4) return "High";
  if (count >= 2) return "Medium";
  return "Low";
}

async function fetchTeePayload(message, evidence) {
  if (!message?.endpoint || !evidence) {
    return { teeError: "TEE endpoint not configured.", teePayload: null };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(message.timeoutMs) || 4000);

  try {
    const response = await fetch(message.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        evidence,
        policy: message.policy || {},
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { teeError: `TEE endpoint returned ${response.status}.`, teePayload: null };
    }

    return {
      teeError: undefined,
      teePayload: await response.json(),
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { teeError: "TEE request timed out.", teePayload: null };
    }

    return { teeError: "TEE request failed.", teePayload: null };
  } finally {
    clearTimeout(timeout);
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "CHECK_PAGE") {
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs?.[0]?.id;
    if (!tabId) {
      sendResponse({ threats: FALLBACK_THREATS, teeVerified: false });
      return;
    }

    chrome.tabs.sendMessage(tabId, { type: "EXTRACT_SIGNALS" }, async (signalResponse) => {
      const lastError = chrome.runtime.lastError;
      const threats = signalResponse?.threats || FALLBACK_THREATS;
      const evidence = signalResponse?.evidence;
      const band = bandFromThreats(threats);
      const teeResult = !lastError ? await fetchTeePayload(message, evidence) : { teeError: "Could not extract page evidence.", teePayload: null };

      if (!lastError && (band === "High" || band === "Medium")) {
        await playAlarm();
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon128.png",
          title: "zkSafe Warning",
          message: "Dangerous site signals detected. Open extension for details.",
          priority: 2,
        });
      }

      sendResponse({
        evidence,
        threats,
        teeVerified: Boolean(teeResult.teePayload?.tee?.verified),
        attestationStatus: teeResult.teeError || "TEE response received",
        teeError: teeResult.teeError,
        teePayload: teeResult.teePayload,
      });
    });
  });

  return true;
});
