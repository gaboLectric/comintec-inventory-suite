#!/bin/bash

# Script para iniciar el sistema con HTTPS
# Uso: ./start-https.sh [IP_DE_TU_MAQUINA]

set -e

# Obtener IP local automáticamente si no se proporciona
if [ -z "$1" ]; then
    # Intentar obtener IP de la interfaz de red principal
    LOCAL_IP=$(ip route get 1.1.1.1 | grep -oP 'src \K\S+' 2>/dev/null || echo "192.168.1.100")
    echo "IP detectada automáticamente: $LOCAL_IP"
    echo "Si no es correcta, ejecuta: ./start-https.sh TU_IP_CORRECTA"
else
    LOCAL_IP=$1
fi

echo "Configurando HTTPS para IP: $LOCAL_IP"

# Generar certificados si no existen
if [ ! -f "./docker/ssl/server.crt" ] || [ ! -f "./docker/ssl/server.key" ]; then
    echo "Generando certificados SSL..."
    ./generate-ssl-cert.sh $LOCAL_IP
else
    echo "Certificados SSL ya existen, reutilizando..."
fi

# Detener contenedores existentes
echo "Deteniendo contenedores existentes..."
docker-compose down 2>/dev/null || true

# Iniciar con HTTPS
echo "Iniciando sistema con HTTPS..."
docker-compose -f docker-compose.https.yml up -d

echo ""
echo "✅ Sistema iniciado con HTTPS!"
echo ""
echo "🌐 Accede a: https://$LOCAL_IP:5173"
echo "⚠️  El navegador mostrará una advertencia de seguridad."
echo "   Haz clic en 'Avanzado' > 'Continuar a $LOCAL_IP (no seguro)'"
echo ""
echo "📱 Para usar desde móvil en la misma red:"
echo "   1. Abre https://$LOCAL_IP:5173 en el móvil"
echo "   2. Acepta la advertencia de seguridad"
echo "   3. La cámara debería funcionar correctamente"
echo ""
echo "🔧 Para ver logs: docker-compose -f docker-compose.https.yml logs -f"
echo "🛑 Para detener: docker-compose -f docker-compose.https.yml down"