#!/bin/bash

# Script para generar certificado SSL autofirmado para red local
# Uso: ./generate-ssl-cert.sh [IP_DE_TU_MAQUINA]

IP=${1:-"192.168.1.100"}  # Cambia por tu IP local
DOMAIN="localhost"

echo "Generando certificado SSL para IP: $IP"

# Crear directorio para certificados
mkdir -p ./docker/ssl

# Generar clave privada
openssl genrsa -out ./docker/ssl/server.key 2048

# Crear archivo de configuración para el certificado
cat > ./docker/ssl/server.conf <<EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = ES
ST = Local
L = Local
O = Local Development
CN = $DOMAIN

[v3_req]
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
IP.1 = 127.0.0.1
IP.2 = $IP
EOF

# Generar certificado
openssl req -new -x509 -key ./docker/ssl/server.key -out ./docker/ssl/server.crt -days 365 -config ./docker/ssl/server.conf -extensions v3_req

echo "Certificados generados en ./docker/ssl/"
echo "Para usar HTTPS, accede a: https://$IP:5173"
echo "El navegador mostrará una advertencia de seguridad que debes aceptar manualmente."