# zkSafe GCP Setup (Confidential VM + TEE Scan Endpoint)

This document records the infrastructure setup done via `gcloud` for project `zksafe`.

## Project and Account

- Active account: `wyhang2006gt@gmail.com`
- Active project: `zksafe`
- Billing: enabled
- Default region: `asia-southeast1`
- Default zone: `asia-southeast1-b`

## APIs Enabled

- `compute.googleapis.com`
- `artifactregistry.googleapis.com`
- `iam.googleapis.com`
- `cloudbuild.googleapis.com`
- `logging.googleapis.com`
- `monitoring.googleapis.com`
- `secretmanager.googleapis.com`

## Artifact Registry

- Repository name: `zksafe`
- Format: `DOCKER`
- Region: `asia-southeast1`
- Full name: `projects/zksafe/locations/asia-southeast1/repositories/zksafe`

Docker auth configured for:

- `asia-southeast1-docker.pkg.dev`

## Service Account

- Service account: `zksafe-tee-sa@zksafe.iam.gserviceaccount.com`
- Display name: `zkSafe TEE VM`

Granted roles:

- `roles/artifactregistry.reader`
- `roles/logging.logWriter`
- `roles/monitoring.metricWriter`

## Networking

- Static external IP (regional): `zksafe-tee-ip`
- External IP value: `34.126.172.10`
- Firewall rule: `allow-zksafe-scan`
  - Direction: ingress
  - Port: `tcp:8080`
  - Target tag: `zksafe-scan`

## Confidential VM

- Instance name: `zksafe-tee`
- Machine type: `n2d-standard-8`
- Zone: `asia-southeast1-b`
- Confidential compute: enabled (`SEV` class via `--confidential-compute`)
- Internal IP: `10.148.0.2`
- External IP: `34.126.172.10`
- Status: `RUNNING`
- Network tag: `zksafe-scan`
- Service account attached: `zksafe-tee-sa@zksafe.iam.gserviceaccount.com`

VM bootstrap performed:

- Installed Docker (`docker.io`)
- Enabled and started Docker daemon

## Real Gemma Scoring Service

The mock endpoint has been replaced with a real Gemma-backed scorer on the Confidential VM.

Running containers:

- `zksafe-ollama`
- `zksafe-scorer`

Model:

- `gemma2:2b`

Scorer image:

- `asia-southeast1-docker.pkg.dev/zksafe/zksafe/zksafe-scorer:latest`

Endpoints:

- `GET /healthz`
- `POST /scan`

Endpoint test:

```bash
curl http://34.126.172.10:8080/healthz
curl -X POST http://34.126.172.10:8080/scan -H "Content-Type: application/json" -d '{"evidence":{...},"policy":{...}}'
```

The `/scan` endpoint returns strict JSON with `checks`, `tee`, `zktls`, and `model` fields.

## Local App/Extension Wiring

Updated local env value:

- `NEXT_PUBLIC_ZKSAFE_TEE_SCORING_ENDPOINT=http://34.126.172.10:8080/scan`

Other policy/tuning env vars remain in `.env.local`.

## Useful Commands

Check VM status:

```bash
gcloud compute instances describe zksafe-tee --zone=asia-southeast1-b
```

SSH into VM:

```bash
gcloud compute ssh zksafe-tee --zone=asia-southeast1-b
```

Check running containers on VM:

```bash
gcloud compute ssh zksafe-tee --zone=asia-southeast1-b --command="sudo docker ps"
```

## Deploy Commands Used

```bash
gcloud builds submit --config cloudbuild-scorer.yaml .
gcloud compute ssh zksafe-tee --zone=asia-southeast1-b
```

On the VM:

```bash
TOKEN=$(python3 - <<'PY'
import json, urllib.request
req = urllib.request.Request("http://metadata/computeMetadata/v1/instance/service-accounts/default/token", headers={"Metadata-Flavor":"Google"})
print(json.load(urllib.request.urlopen(req))["access_token"])
PY
)
echo "$TOKEN" | sudo docker login -u oauth2accesstoken --password-stdin https://asia-southeast1-docker.pkg.dev
sudo docker run -d --name zksafe-ollama --restart unless-stopped --network host -v zksafe-ollama:/root/.ollama ollama/ollama:latest
sudo docker exec zksafe-ollama ollama pull gemma2:2b
sudo docker run -d --name zksafe-scorer --restart unless-stopped --network host -e OLLAMA_HOST=http://127.0.0.1:11434 -e OLLAMA_MODEL=gemma2:2b asia-southeast1-docker.pkg.dev/zksafe/zksafe/zksafe-scorer:latest
```

## Security/Production Notes

- Current endpoint is HTTP over public IP for fast testing.
- For production:
  - place HTTPS in front (managed cert + LB or reverse proxy with TLS)
  - restrict ingress CIDR if possible
  - enforce auth between extension gateway and scorer service
  - keep strict response validation enabled (`NEXT_PUBLIC_ZKSAFE_TEE_STRICT_RESPONSE=true`)
