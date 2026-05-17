This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scan Configuration

Copy `.env.example` to `.env.local` and set your Confidential VM scoring endpoint:

```bash
cp .env.example .env.local
```

The scan flow reads all of these as its central source of truth:

- `NEXT_PUBLIC_ZKSAFE_TEE_SCORING_ENDPOINT`
- `NEXT_PUBLIC_ZKSAFE_STRIPE_UPGRADE_URL`
- `NEXT_PUBLIC_ZKSAFE_SCAN_TIMEOUT_MS`
- `NEXT_PUBLIC_ZKSAFE_TEE_STRICT_RESPONSE`
- `NEXT_PUBLIC_ZKSAFE_MANDATORY_BLOCKERS`
- `NEXT_PUBLIC_ZKSAFE_CHECK_WEIGHTS`
- `NEXT_PUBLIC_ZKSAFE_BLOCKER_MIN_RISK_SCORE`
- `NEXT_PUBLIC_ZKSAFE_BLOCKER_WEIGHT_MULTIPLIER`
- `NEXT_PUBLIC_ZKSAFE_WARNING_RISK_SCORE`
- `NEXT_PUBLIC_ZKSAFE_DANGER_RISK_SCORE`

## Confidential VM Contract

The extension sends this payload to `NEXT_PUBLIC_ZKSAFE_TEE_SCORING_ENDPOINT` through the background worker:

```json
{
  "evidence": {
    "url": "https://example.com/login",
    "hostname": "example.com",
    "title": "Example Login",
    "text": "...redacted dom text...",
    "forms": [],
    "links": [],
    "scriptSources": [],
    "inlineScriptCount": 0,
    "hasPasswordField": true,
    "hasHiddenField": false
  },
  "policy": {
    "checkWeights": {},
    "mandatoryBlockers": [],
    "scoring": "n_safe_over_n_total_plus_blockers",
    "strictResponseValidation": true
  }
}
```

With strict mode enabled, your backend should return:

```json
{
  "checks": [
    {
      "id": "credential_harvest_absent",
      "label": "Credential harvest absent",
      "applicable": true,
      "safe": false,
      "evidence": "Password form posts to an unrelated domain."
    }
  ],
  "tee": {
    "verified": true,
    "attestation": "Confidential VM attested"
  },
  "zktls": {
    "verified": true,
    "provider": "Reclaim Protocol",
    "signature": "0x...",
    "handshake": "TLS_AES_256_GCM_SHA384 | Confidential VM attested"
  },
  "model": {
    "name": "gemma",
    "latencyMs": 320
  }
}
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
