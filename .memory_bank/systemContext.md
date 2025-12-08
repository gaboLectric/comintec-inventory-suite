# Contexto del Sistema

## Arquitectura
- **Cliente-Servidor**: Frontend SPA (Single Page Application) consumiendo API REST/Realtime de PocketBase.
- **Contenedores**:
  - `pocketbase`: Servicio de backend y base de datos.
  - `frontend`: Servidor de desarrollo Vite (dev) o Nginx (prod).

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
