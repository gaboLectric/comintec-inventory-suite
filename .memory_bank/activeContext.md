# Contexto Activo

## Sesión Actual
- **Objetivo**: Migración a arquitectura PocketBase + React.
- **Estado**: Migración Completada y Verificada.

## Cambios Recientes
- **Infraestructura**:
  - Despliegue exitoso de PocketBase y Frontend con Docker Compose.
  - Configuración de MCPs (`sqlite`, `filesystem`, `context-mapper`).
- **Frontend**:
  - Migración a React + Vite completada.
  - Corrección de estilos (Tailwind CSS v3 + Emotion).
  - Implementación de autenticación nativa con PocketBase (Soporte Admin/User).
  - Corrección de configuración de red (`VITE_API_URL`).
- **Backend**:
  - Creación de superusuario inicial (`admin@inventario.com`).
  - Actualización de SDK de PocketBase en frontend (v0.21 -> v0.26) para compatibilidad con servidor v0.34.
  - Configuración de migraciones (`pb_migrations`) y exportación de esquema.
  - **Corrección de Errores**:
    - Creación de esquema de base de datos (`products`, `sales`, `categories`, `media`) vía migración JS.
    - Solución a `ClientResponseError 0` (autocancelación) en `api.js` mediante `requestKey`.
    - Configuración de permisos (Reglas API) para acceso público de lectura y escritura autenticada.
    - **Corrección Crítica**: Reparación de esquema de colecciones (campos faltantes) mediante migración `1765150400_fix_schema_fields.js`.
- **Refactorización y Calidad**:
  - Implementación de reglas estrictas (`MASTER_RULES.md`).
  - Refactorización de `api.js` para usar PocketBase SDK.
  - Implementación de Tests Unitarios (TDD) para Auth y API.
  - Limpieza de archivos legacy (`_archive`).

## Próximos Pasos
- Desarrollo de funcionalidades específicas del inventario sobre la nueva arquitectura.
- Migración de datos desde el esquema SQL legacy (si es necesario).
- Refinamiento de componentes UI.
