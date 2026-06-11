#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"

HOST="${LEDGER_HOST:-127.0.0.1}"
PORT="${LEDGER_PORT:-8765}"
PYTHON_BIN="${LEDGER_PYTHON:-python3}"

if [ -d ".git" ] && command -v git >/dev/null 2>&1; then
  echo "Checking for Ledger Public updates..."
  git pull --ff-only || echo "Update skipped. Continuing with the installed version."
fi

if ! "$PYTHON_BIN" - <<'PY' >/dev/null 2>&1
import googleapiclient.discovery
import google.oauth2.service_account
PY
then
  echo "Installing Google Sheets requirements..."
  "$PYTHON_BIN" -m pip install -r requirements-google.txt
fi

"$PYTHON_BIN" scripts/setup_google.py
"$PYTHON_BIN" scripts/setup_auth.py --app-name "Ledger Public"

echo "Starting Ledger Public at http://${HOST}:${PORT}"
exec "$PYTHON_BIN" server.py --store google --host "$HOST" --port "$PORT" --open
