# Portar el Design System de Twenty a COMINTEC

Este documento resume cómo extraer y reutilizar el estilo visual (botones, colores, tipografía, tablas, animaciones) del frontend de Twenty en tu propia app.

## Origen del Design System en Twenty

- Paquete núcleo UI: `packages/twenty-ui`
  - Tema y tokens: `src/theme/**`
    - Proveedor de tema (Emotion): `src/theme/provider/ThemeProvider.tsx`
    - Tokens Light/Dark: `src/theme/constants/ThemeLight.ts`, `ThemeDark.ts`
    - Tipografías: `FontCommon.ts`, `FontLight.ts`
    - Colores escala grises: `GrayScaleLight.ts`, `GrayScaleLightAlpha.ts`
    - Fondos/Bordes/Sombras: `BackgroundLight.ts`, `BorderLight.ts`, `BoxShadowLight.ts`
    - Espaciado y tabla: `ThemeCommon.ts` (incluye `spacing`, `table.*`)
  - Componentes base:
    - Botones: `src/input/button/components/**`
    - Tipografía: `src/display/typography/components/**`
- Tablas (estructura/estilos): `packages/twenty-front/src/modules/object-record/record-table/**`
  - Wrapper de estilos: `components/RecordTableStyleWrapper.tsx`
  - Constantes de columnas y sombras de scroll: `constants/**`

## Estrategias de Portabilidad

1) Dependencia directa del paquete UI (más fiel)
- Copiar o incluir `packages/twenty-ui` como submódulo/paquete interno en tu monorepo.
- Usar su `ThemeProvider` de Emotion y componentes (Button, Typography…).
- Pros: 100% fidelity, menos mantenimiento manual.
- Contras: Requiere React + Emotion y respetar su estructura de tema.

2) Capa de tokens via CSS variables (agnóstico al framework)
- Usar `comintec-design-system/tokens.css` como “referencia maestra”.
- Mapear colores, tipografías, espaciados, radios, sombras y animaciones a `--vars` globales.
- En tu app, usar esas variables en CSS/Sass/Tailwind (con `theme.extend`) o en Emotion/Styled-Components como `var(--color-...)`.
- Pros: Portable a cualquier stack.
- Contras: Algunos colores (Radix) requieren definir valores de marca.

3) Híbrido (recomendado)
- Consumir tokens via CSS variables + crear wrappers ligeros de componentes clave (Botón, Tabla) que usen las variables.
- Copiar patrones críticos de la tabla (sticky columns, sombras de scroll, variables de ancho).

## Tokens clave (mapa)

- Tipografía: `--font-family`, `--font-size-*`, `--font-weight-*`, `--line-height-*`
- Espaciado (base 4px): `--space-1 = 4px`, `--space-2 = 8px`, …
- Colores escala grises (Display-P3): `--gray-1..12`, `--grayA-1..12`
- Fondo y overlays: `--bg-primary`, `--bg-secondary`, `--bg-transparent-*`
- Bordes y radios: `--border-color-*`, `--radius-*`
- Sombras: `--shadow-color`, `--shadow-light`, `--shadow-strong`, `--shadow-underline`
- Animaciones: `--anim-duration-instant|fast|normal|slow`
- Tabla: `--table-cell-padding-x`, `--table-checkbox-col-width`, etc.
- Breakpoint móvil: `--mobile-viewport`

Consulta `tokens.css` para una base lista para usar.

## Tablas: patrón de estilos

- Columnas izquierdas sticky (drag, checkbox, label) con `position: sticky` y `z-index` por capas.
- Sombra al hacer scroll: pseudo-elementos `::before/::after` activados por CSS variables.
- Anchos por columna con CSS variables dinámicas (`--record-table-column-field-N`).
- Referencia: `RecordTableStyleWrapper.tsx`.

## Kanban (Record Board)

- DnD: Twenty usa `@hello-pangea/dnd` (fork que soporta React 18 StrictMode).
- Estructura: contenedor → columnas (Droppable) → tarjetas (Draggable).
- Estilos: columnas con `min-width: 200px`, paddings base, borde izquierdo entre columnas, cabecera sticky con contador.
- Tarjetas: fondo `var(--bg-secondary)`, borde `var(--bg-quaternary)`, radio `var(--radius-md)`, sombra ligera.

### Uso con Tailwind (ejemplos incluidos)
- Archivos: `comintec-design-system/examples/react/{Kanban.tsx, KanbanColumn.tsx, KanbanCard.tsx, Kanban.types.ts}`
- Instala dependencias en tu app host:
```fish
pnpm add @hello-pangea/dnd
```
- Renderiza el board:
```tsx
import { Kanban } from '@/comintec-design-system/examples/react/Kanban';

const initial = {
  columns: [
    { id: 'todo', title: 'Por hacer', items: [{ id: '1', title: 'Card 1' }] },
    { id: 'doing', title: 'En curso', items: [{ id: '2', title: 'Card 2' }] },
  ],
};

<Kanban initial={initial} />
```

### Uso con Emotion (ejemplos incluidos)
- Archivos: `comintec-design-system/emotion/{Kanban.tsx, KanbanColumn.tsx, KanbanCard.tsx}`
- Instala dependencias en tu app host:
```fish
pnpm add @emotion/react @emotion/styled @hello-pangea/dnd
```
- Proveedor de tema y renderizado:
```tsx
import { ThemeProvider } from '@/comintec-design-system/emotion/ThemeProvider';
import { Kanban } from '@/comintec-design-system/emotion/Kanban';

const initial = {
  columns: [
    { id: 'todo', title: 'Por hacer', items: [{ id: '1', title: 'Card 1' }] },
    { id: 'doing', title: 'En curso', items: [{ id: '2', title: 'Card 2' }] },
  ],
};

<ThemeProvider>
  <Kanban initial={initial} />
</ThemeProvider>
```

## Integración recomendada en tu app

1) Importar tokens globales
```css
/* index.css de tu app */
@import url('./comintec-design-system/tokens.css');
@import url('./comintec-design-system/utilities.css');
```

2) Tipografía Inter
- Twenty usa `Inter, sans-serif`. Puedes cargar desde Google Fonts o paquete local.
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

3) Botones
- Usa tus componentes, aplicando variables:
```css
.btn {
  font-family: var(--font-family);
  font-size: var(--font-size-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color-medium);
  transition: var(--clickable-bg-transition);
}
.btn--primary {
  background: var(--bg-secondary);
  color: var(--font-color-secondary);
}
.btn--primary:hover { background: var(--bg-tertiary); }
.btn--primary:active { background: var(--bg-quaternary); }
```

4) Tablas
- Usa sticky columns, `box-shadow` variables y paddings/espaciados de `ThemeCommon`.
- Define columnas con `min/max/width` usando variables por índice si necesitas dinamismo.
- Para sombras de scroll, añade `.scroll-shadows` al contenedor y ajusta overflow.

## Colores de marca (Radix)
- Twenty usa `@radix-ui/colors` (variantes P3) para paleta principal (`blue`, `red`, etc.).
- En `tokens.css` dejamos marcadores `--brand-*` para que definas tu paleta (o instala Radix y asóciala a las variables).

## Cómo mantenerlo
- Mantén este folder `comintec-design-system/` como fuente maestra.
- Si actualizas Twenty, revisa cambios en `packages/twenty-ui/src/theme/**` y sincroniza variables.

## Referencias rápidas
- Tipografía global en `twenty-front/src/index.css`.
- Spacing/Tabla en `twenty-ui/src/theme/constants/ThemeCommon.ts`.
- Botones en `twenty-ui/src/input/button/components/Button/Button.tsx`.
- Tabla en `twenty-front/src/modules/object-record/record-table/components/RecordTableStyleWrapper.tsx`.
- Kanban en `twenty-front/src/modules/object-record/record-board/**`.
 - Preset Tailwind y Next: `comintec-design-system/examples/next/*`
 - Componentes Tailwind (Button/Table/Dropdown/Input/Kanban): `comintec-design-system/examples/react/*`
 - Componentes Emotion (Theme/Button/Table/Input/Kanban): `comintec-design-system/emotion/*`

