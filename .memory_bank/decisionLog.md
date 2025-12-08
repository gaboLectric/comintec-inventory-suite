# Registro de Decisiones

## 2025-12-05: Migración a PocketBase
- **Contexto**: El sistema Laravel era demasiado complejo y pesado para las necesidades actuales y dificultaba el TDD rápido.
- **Decisión**: Migrar a PocketBase (Go + SQLite).
- **Consecuencias**:
  - Simplificación drástica del backend.
  - Base de datos en un solo archivo (fácil backup/migración).
  - Autenticación y API listas "out of the box".
  - Necesidad de reescribir la lógica de backend (que era mínima en PHP puro, más compleja en Laravel).

## 2025-12-05: Estructura de Memory Bank
- **Contexto**: Necesidad de mantener el contexto del proyecto entre sesiones de IA.
- **Decisión**: Implementar patrón Memory Bank (`productContext`, `activeContext`, `systemContext`, `progress`, `decisionLog`).
- **Consecuencias**: Mejor continuidad y "memoria" del proyecto.
