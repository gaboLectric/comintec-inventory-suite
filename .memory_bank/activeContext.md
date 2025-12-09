# Contexto Activo

## Sesión Actual
- **Objetivo**: Finalización de Modernización y Verificación.
- **Estado**: Implementación Completada. Tests Verificados.

## Cambios Recientes
- **Infraestructura**:
  - Migración completa a **Bun** (v1.3.4) en entorno local y Docker.
  - Instalación de dependencias con `bun install`.
- **Base de Datos (PocketBase)**:
  - Nuevo esquema implementado: `equipments`, `supplies`, `equipment_outputs`, `supply_outputs`, `media`.
  - Eliminación de colecciones legacy (`products`, `sales`, `categories`).
  - Migración `1765160000_create_new_schema.js` creada.
- **Frontend**:
  - Nuevas páginas: `Equipments`, `Supplies`, `EquipmentOutputs`, `SupplyOutputs`.
  - Refactorización de `Users` y `Dashboard`.
  - Componentes compartidos: `SimpleTable`, `FormComponents`, `Modal`, `Toast`.
  - Servicios: `api.js` reescrito para el nuevo esquema.
- **Calidad**:
  - Tests unitarios (`vitest`) actualizados y pasando (`api.test.js`, `AuthContext.test.jsx`).
  - Limpieza de código legacy.

## Próximos Pasos
- Despliegue y verificación manual en entorno de staging/producción.
- Validación de flujos de usuario final.
