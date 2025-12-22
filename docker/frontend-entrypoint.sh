#!/bin/sh
set -e

cd /app

if [ ! -d node_modules ] || [ ! -f node_modules/.install-complete ]; then
  echo "[frontend] Installing dependencies with Bun..."
  bun install
  touch node_modules/.install-complete
fi

# Verificar si los certificados SSL existen cuando HTTPS está habilitado
if [ "$VITE_HTTPS" = "true" ]; then
  if [ ! -f "/app/ssl/server.key" ] || [ ! -f "/app/ssl/server.crt" ]; then
    echo "[frontend] ERROR: HTTPS habilitado pero certificados SSL no encontrados en /app/ssl/"
    echo "[frontend] Ejecuta './generate-ssl-cert.sh [TU_IP_LOCAL]' en el host para generar certificados"
    exit 1
  fi
  echo "[frontend] Iniciando servidor Vite con HTTPS habilitado..."
else
  echo "[frontend] Iniciando servidor Vite en modo HTTP..."
fi

exec bun run dev -- --host 0.0.0.0 --port 5173
