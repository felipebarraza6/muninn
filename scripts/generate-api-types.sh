#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/src/api/generated/schema.ts"
API_URL="${VITE_DEV_API_PROXY:-http://localhost:8000}"
echo "Fetching OpenAPI from $API_URL/api/schema/ …"
curl -sS -o /tmp/yggdra-openapi.json \
  -H "Accept: application/vnd.oai.openapi+json" \
  "$API_URL/api/schema/"
bunx openapi-typescript /tmp/yggdra-openapi.json -o "$OUT"
echo "Wrote $OUT"
echo "Tip: importa solo tipos acotados desde src/api/generated/yggdra.ts"
