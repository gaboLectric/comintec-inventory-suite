# Inventario Mod

Sistema de Inventario Modernizado utilizando PocketBase, React y Bun.

## Características Principales
- **Backend**: PocketBase (Go) con migraciones automáticas en JS.
- **Frontend**: React + Vite + Emotion.
- **Runtime**: Bun (reemplazando Node.js).
- **Gestión**:
  - **Equipos**: Control por número de serie, imágenes y detalles técnicos.
  - **Insumos**: Control de stock por cantidad.
  - **Salidas**: Registro de movimientos de salida para equipos e insumos.

## Requisitos
- Docker & Docker Compose

## Ejecución

La forma más fácil de iniciar la aplicación es usando el script maestro:

```bash
./start.sh
```

Te permitirá elegir entre:
1. **Dev (HTTP)**: Desarrollo rápido local.
2. **Dev (HTTPS)**: Para probar cámara/móvil en red local.
3. **Prod Sim**: Simulación de entorno de producción con Nginx.

Alternativamente, puedes usar Docker Compose directamente:

```bash
# Desarrollo básico
docker-compose up --build
```

Esto iniciará:
- **PocketBase** (Backend/Admin) en `http://localhost:8090`
  - Admin UI: `http://localhost:8090/_/`
- **Frontend** (App) en `http://localhost:5173`

## Estructura del Proyecto
- `frontend/`: Código fuente de la aplicación React.
- `pocketbase/`: Migraciones y datos de la base de datos.
- `docker/`: Scripts y configuraciones de contenedores.
- `_archive/`: Archivos legacy y documentación antigua.

## Notas de Desarrollo
- El proyecto utiliza **Bun** como gestor de paquetes y runtime en el entorno de desarrollo (Docker).
- Las colecciones de la base de datos se crean automáticamente al iniciar PocketBase gracias a las migraciones en `pocketbase/pb_migrations`.
