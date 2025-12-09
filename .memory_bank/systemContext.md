# Contexto del Sistema

## Arquitectura
- **Cliente-Servidor**: Frontend SPA (Single Page Application) consumiendo API REST/Realtime de PocketBase.
- **Runtime**: **Bun** (v1.3.4) para gestión de paquetes y ejecución de scripts.
- **Contenedores**:
  - `pocketbase`: Servicio de backend (Go) y base de datos (SQLite).
  - `frontend`: Servidor de desarrollo Vite (dev) o Nginx (prod).

## Base de Datos (Colecciones)
- `users`: Usuarios del sistema (Admin, User).
- `equipments`: Equipos con número de serie único.
- `supplies`: Insumos con control de stock.
- `equipment_outputs`: Registro de salidas de equipos.
- `supply_outputs`: Registro de salidas de insumos.
- `media`: Imágenes de equipos.

## Estructura de Directorios
- `frontend/`: Código fuente React.
- `pocketbase/`: Datos y configuración del backend.
- `_archive/`: Código antiguo para referencia.
- `.memory_bank/`: Documentación viva del proyecto.
- `.mcp_config/`: Configuración de herramientas de IA.

## Patrones de Diseño
- **Componentes**: React funcional con Hooks.
- **Estilos**: TailwindCSS para utilidad, Emotion para componentes complejos.
- **Estado**: Context API + Hooks de React.
- **API**: Cliente SDK de PocketBase.
