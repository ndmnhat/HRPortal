#!/usr/bin/env sh
set -eu

SPEC_FILE="/shared/openapi.json"

echo "[entrypoint] Installing missing dependencies (if any)"
npm ci || true
npm install @openapitools/openapi-generator-cli -g

if [ -f "$SPEC_FILE" ]; then
  echo "[entrypoint] Found shared spec at $SPEC_FILE"
  export OPENAPI_SPEC_FILE="$SPEC_FILE"
  npm run generate:api:file || { echo "[entrypoint] Codegen from file failed"; exit 1; }
else
  echo "[entrypoint] No shared spec; will try URL: ${OPENAPI_SPEC_URL:-unset}"
  # Wait up to 180s for URL to be reachable
  i=0
  until wget -qO- "$OPENAPI_SPEC_URL" >/dev/null 2>&1; do
    i=$((i+1))
    if [ $i -gt 90 ]; then
      echo "[entrypoint] Timeout waiting for backend spec at $OPENAPI_SPEC_URL"
      exit 1
    fi
    sleep 2
  done
  npm run generate:api:remote || { echo "[entrypoint] Codegen from URL failed"; exit 1; }
fi

npm run build

# Start the app
echo "[entrypoint] Starting Next in production (start)"
exec npm run start