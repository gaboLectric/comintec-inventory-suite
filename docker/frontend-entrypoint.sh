#!/bin/sh
set -e

APP_DIR="/app/modern-system"
cd "$APP_DIR"

if [ ! -d node_modules ] || [ ! -f node_modules/.install-complete ]; then
  echo "[frontend] Installing dependencies..."
  npm install
  touch node_modules/.install-complete
fi

# Fix permissions for binaries
if [ -d node_modules/.bin ]; then
    chmod -R +x node_modules/.bin
fi

echo "[frontend] Building production assets..."
npm run build

echo "[frontend] Starting Vite dev server..."
exec npm run dev -- --host 0.0.0.0 --port 5173
