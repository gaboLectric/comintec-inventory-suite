# Configuración HTTPS para Red Local

Este documento explica cómo configurar HTTPS para que la funcionalidad de lectura de QR funcione en tu red local.

## ¿Por qué necesito HTTPS?

Los navegadores modernos requieren HTTPS para acceder a la cámara por razones de seguridad. En `localhost` funciona sin HTTPS, pero en otras IPs de la red local necesitas HTTPS.

---

## Producción (OpenMediaVault - 192.168.88.2)

### Paso 1: Generar certificados para el servidor
```bash
./generate-ssl-cert.sh 192.168.88.2
```

### Paso 2: Desplegar con HTTPS
```bash
docker-compose -f docker-compose.prod.https.yml up -d --build
```

### Paso 3: Acceder
- **Desde cualquier dispositivo**: `https://192.168.88.2`
- El navegador mostrará advertencia de seguridad → Aceptar
- La cámara para QR funcionará correctamente

### Archivos de producción HTTPS:
- `docker-compose.prod.https.yml` - Docker compose con HTTPS
- `Dockerfile.frontend.prod.https` - Dockerfile con nginx HTTPS
- `frontend/nginx.https.conf` - Configuración nginx con SSL
- `docker/ssl/` - Certificados SSL (generados)

---

## Desarrollo Local

### Opción 1: HTTPS en desarrollo
```bash
./start-https.sh
# Accede a: https://TU_IP_LOCAL:5173
```

### Opción 2: Solo localhost (sin HTTPS)
```bash
docker-compose up -d
# Accede a: http://localhost:5173
```

---

## Solución de Problemas

### Error: "Certificados no encontrados"
```bash
rm -rf ./docker/ssl
./generate-ssl-cert.sh 192.168.88.2
```

### Error: "No se puede acceder desde móvil"
1. Verifica que estés en la misma red WiFi
2. Verifica que no haya firewall bloqueando puertos 80/443
3. Usa la IP exacta: `https://192.168.88.2`

### Error: "La cámara no funciona"
1. Asegúrate de usar HTTPS (candado en barra de direcciones)
2. Acepta permisos de cámara cuando el navegador los solicite
3. Recarga la página después de aceptar el certificado

### Regenerar certificados (si cambias de IP)
```bash
rm -rf ./docker/ssl
./generate-ssl-cert.sh NUEVA_IP
docker-compose -f docker-compose.prod.https.yml up -d --build
```

---

## Comandos Útiles

```bash
# Ver logs producción
docker-compose -f docker-compose.prod.https.yml logs -f frontend

# Reiniciar frontend
docker-compose -f docker-compose.prod.https.yml restart frontend

# Detener todo
docker-compose -f docker-compose.prod.https.yml down
```