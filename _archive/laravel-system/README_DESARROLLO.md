# Guía de Uso - Sistema Modernizado

## ✅ Estado Actual
La conexión frontend-backend está **configurada y funcionando**.

## 🚀 Cómo Ejecutar

### Desarrollo con Docker
```bash
cd modern-system
docker compose up
```

**URLs:**
- **Aplicación principal:** http://localhost:8000 (Laravel sirve React con HMR de Vite)
- **API Backend:** http://localhost:8000/api/*
- **Vite Dev Server:** http://localhost:5173 (solo para assets, NO acceder directamente)

### Desarrollo Local (sin Docker)
```bash
# Terminal 1 - Backend Laravel
cd modern-system
php artisan serve --host=127.0.0.1 --port=8000

# Terminal 2 - Frontend Vite
cd modern-system
npm run dev
```

Abrir: http://localhost:8000

## 🔧 Configuración Aplicada

### Backend (`modern-system/.env`)
```env
APP_URL=http://localhost:8000
VITE_DEV_SERVER_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

### Frontend (`vite.config.js`)
- HMR configurado para `localhost:5173`
- Proxy `/api` → backend
- Polling habilitado para Docker
- Variable `VITE_BACKEND_URL` para contenedores

### CORS (`config/cors.php`)
- Orígenes permitidos: frontend dinámico vía `FRONTEND_URL`
- Credenciales habilitadas para Sanctum

### Docker (`docker-compose.yml`)
- **Backend:** `modern-backend` (puerto 8000)
- **Frontend:** `modern-frontend` (puerto 5173)
- Red compartida: `laravel-network`
- Variables de entorno configuradas

## 📝 Notas Importantes

1. **NO acceder directamente a puerto 5173** - Vite solo sirve assets, no la aplicación.
2. **Siempre usar puerto 8000** - Laravel sirve la vista Blade que carga React con HMR.
3. **Hot Module Replacement activo** - Cambios en código React se reflejan instantáneamente.
4. **API Base URL** inyectada en `window.API_BASE_URL`.

## 🐛 Troubleshooting

### Si ves "Laravel Vite development server"
- Accede a http://localhost:8000 (NO 5173)

### Si el build está cacheado
```bash
docker exec modern-backend rm -rf /var/www/html/public/build
```

### Reiniciar servicios
```bash
cd modern-system
docker compose restart
```

### Ver logs
```bash
docker logs modern-backend
docker logs modern-frontend
```
