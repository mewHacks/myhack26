# zkSafe Test Submission Guide

## Package Ready

- Test upload zip created: `zksafe-extension-test-submit.zip`
- Source build folder: `out`

## Submit as Private Test First

1. Open Chrome Web Store Developer Dashboard.
2. Click `New item`.
3. Upload `zksafe-extension-test-submit.zip`.
4. In visibility, choose `Private` or `Unlisted` for test rollout.
5. Fill basic listing:
   - Name: `zkSafe`
   - Short description: `Anti-fraud page checker with risk matrix alerts`
6. Add at least one screenshot of popup and one danger-state screenshot.
7. In privacy/data section, declare current behavior clearly:
   - Reads page text signals via content script.
   - Plays local alarm and shows warning notification.
   - No account login required.
8. Submit for review.

## Pre-Review Notes (Current Build)

- Uses broad host permission: `<all_urls>` for MVP testing.
- TEE status is currently placeholder (`TEE unavailable`) until backend attestation integration is complete.
- Alarm trigger currently activates on `Medium` and `High` risk bands.

## Local Retest Before Upload

1. Rebuild: `bun run build`
2. Reload unpacked extension from `out`.
3. Open `out/mock-threat-page.html`.
4. Click `Check Page` in popup and confirm:
   - Threat matrix checks appear.
   - Alarm sound plays.
   - Notification appears.
