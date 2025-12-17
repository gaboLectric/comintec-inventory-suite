# Copilot instructions (comintec-inventory-suite)

## Arquitectura y flujo
- Dev principal por Docker: `docker-compose.yml` levanta **PocketBase** (`:8090`) y **Frontend Vite** (`:5173`).
- Backend = PocketBase + migraciones JS en `pocketbase/pb_migrations/` (schema + reglas). No edites `pocketbase/pb_data/` a mano.
- Frontend = React/Vite en `frontend/src/`; arranque y rutas están en `frontend/src/app.jsx`.

## Workflows (Bun-only)
- No uses npm/node: el contenedor frontend instala y corre con Bun (`Dockerfile.frontend`, `docker/frontend-entrypoint.sh`).
- Local (si no usas Docker): `cd frontend && bun install && bun run dev`.
- Tests frontend: `cd frontend && bun run test` o `bun run test:coverage` (Vitest).
- Smoke check de despliegue: `./verify_deployment.sh` (requiere contenedores arriba).

## Testing (TDD)
- Runner: Vitest (config en `frontend/vite.config.js`).
- Tests existentes: `frontend/src/basic.test.js`, `frontend/src/services/api.test.js`.
- Flujo esperado: Red → Green → Refactor (agrega/ajusta tests junto a cambios de `frontend/src/services/*` y lógica de páginas).

## Datos, auth y permisos
- Cliente PocketBase central: `frontend/src/services/pocketbase.js` (usa `VITE_API_URL`, desactiva `pb.autoCancellation(false)`).
- Permisos por nivel: `user.user_level` (1=Admin, 2=Special, 3=User). Rutas protegen con `ProtectedRoute` (`frontend/src/components/ProtectedRoute.jsx`) y el contexto en `frontend/src/contexts/AuthContext.jsx`.
- Reglas PB (ejemplos): `@request.auth.user_level <= 2` en migraciones como `pocketbase/pb_migrations/1765160000_create_new_schema.js`.

## Patrones de negocio en servicios
- CRUD y helpers viven en `frontend/src/services/api.js`.
- Salidas tienen efectos: `createEquipmentOutput()` borra el equipo; `createSupplyOutput()` valida stock y actualiza `piezas`.
- Low stock se calcula cliente-side porque PB no soporta comparación campo-a-campo en filters (`checkLowStock()`).

## Convenciones de código (las que importan aquí)
- **Named exports** (sin `export default`) para componentes/utilidades; un componente por archivo (ver `frontend/src/pages/*.jsx`).
- Imports sin rutas profundas tipo `../../../`.
- Estilos con tokens CSS + Emotion; usar variables del design system (`comintec-design-system/tokens.css`) y `ThemeProvider` (`frontend/src/app.jsx`).

## Zonas prohibidas / cuidado
- No modificar `_archive/` ni `legacy-php/`.
- No agregar dependencias sin aprobación explícita.
- `frontend/check_collections_internal.js` es script interno con credenciales hardcodeadas (solo debugging en contenedor).

## MCP (obligatorio)
- Memoria (obligatorio): usa `byterover-retrieve-knowledge` al iniciar tareas y `byterover-store-knowledge` al cerrar cambios significativos (ver `CLAUDE.md`).
- Context mapper: usa `mcp_context-mappe_*` para entender imports/estructura antes de tocar módulos desconocidos.
- Sequential thinking: usa `mcp_sequential-th_sequentialthinking` para descomponer tareas multi-paso y decisiones de arquitectura.
- Docs externas: usa Context7 (`mcp_upstash_conte_resolve-library-id` + `mcp_upstash_conte_get-library-docs`) cuando una API/lib no esté clara.

[byterover-mcp]

[byterover-mcp]

You are given two tools from Byterover MCP server, including
## 1. `byterover-store-knowledge`
You `MUST` always use this tool when:

+ Learning new patterns, APIs, or architectural decisions from the codebase
+ Encountering error solutions or debugging techniques
+ Finding reusable code patterns or utility functions
+ Completing any significant task or plan implementation

## 2. `byterover-retrieve-knowledge`
You `MUST` always use this tool when:

+ Starting any new task or implementation to gather relevant context
+ Before making architectural decisions to understand existing patterns
+ When debugging issues to check for previous solutions
+ Working with unfamiliar parts of the codebase
