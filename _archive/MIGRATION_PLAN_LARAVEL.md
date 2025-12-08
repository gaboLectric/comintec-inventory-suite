# Plan de Modernización del Sistema de Inventario

## Objetivo
Migrar la aplicación PHP legacy a una arquitectura moderna, robusta y escalable.

## Stack Tecnológico Seleccionado
- **Backend**: Laravel 10/11 (PHP 8.2+)
  - Framework robusto, seguro y con amplio ecosistema.
  - Eloquent ORM para manejo seguro de base de datos.
  - Protección CSRF, validación y autenticación integradas.
- **Frontend**: React + Emotion (Twenty UI Port)
  - **Framework**: React (Vite).
  - **Styling**: Emotion (@emotion/react, @emotion/styled).
  - **Design System**: Port del Twenty CRM (`comintec-design-system`).
  - **Componentes Clave**: Tablas avanzadas (Sticky headers), Kanban (@hello-pangea/dnd), Theming (Dark/Light).
  - **Comunicación**: API REST (Laravel) o Inertia.js.
- **Base de Datos**: MySQL 8.0
  - Reutilización del motor actual pero con esquema normalizado.
  - Migraciones de Laravel para control de versiones de la BD.
- **Infraestructura**: Docker
  - Contenedores para PHP, MySQL, Nginx/Apache.

## Fases del Proyecto

### Fase 1: Inicialización y Configuración (Actual)
- [ ] Crear estructura del nuevo proyecto (`/modern-system`).
- [ ] Inicializar proyecto Laravel.
- [ ] Configurar entorno Docker para el nuevo sistema.
- [ ] Configurar repositorio y herramientas de calidad de código.

### Fase 2: Migración de Base de Datos
- [ ] Analizar esquema actual (`oswa_inv.sql`).
- [ ] Crear migraciones de Laravel para recrear la estructura de tablas (Users, Products, Categories, Sales, etc.).
- [ ] Crear Seeders para migrar los datos existentes o poblar datos de prueba.

### Fase 3: Backend (API & Lógica)
- [ ] Implementar Autenticación (Laravel Breeze/Sanctum).
- [ ] Crear Modelos y Relaciones (User, Product, Sale, Category).
- [ ] Desarrollar Controladores y API Endpoints.
- [ ] Implementar validaciones y lógica de negocio (manejo de stock, reportes).

### Fase 4: Frontend (UI/UX)
- [ ] Configurar React con Vite.
- [ ] Diseñar Layout principal (Dashboard, Sidebar, Navbar).
- [ ] Implementar vistas:
  - Login
  - Dashboard (Resumen)
  - Gestión de Productos (CRUD)
  - Gestión de Ventas
  - Reportes
- [ ] Integrar con la API del Backend.

### Fase 5: Pruebas y Despliegue
- [ ] Pruebas unitarias y de integración.
- [ ] Optimización de assets.
- [ ] Preparación para producción.

---
**Estado**: Iniciando Fase 1.
