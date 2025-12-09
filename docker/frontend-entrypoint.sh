#!/bin/sh
set -e

cd /app

if [ ! -d node_modules ] || [ ! -f node_modules/.install-complete ]; then
  echo "[frontend] Installing dependencies with Bun..."
  bun install
  touch node_modules/.install-complete
fi

echo "[frontend] Starting Vite dev server with Bun..."
exec bun run dev -- --host 0.0.0.0 --port 5173
