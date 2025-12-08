# Comintec Design System (Adaptación de Twenty)

Este folder contiene dos variantes para implementar el look & feel de Twenty en tu app:

- Tailwind + CSS Variables (simple de integrar en Next.js)
- Emotion + Theme Provider (más fiel al patrón de Twenty)

## Estructura

- `tokens.css`: Variables CSS maestras (tipografía, colores, bordes, sombras, animaciones, tabla)
- `tailwind-preset.cjs`: Preset Tailwind que mapea tokens a `theme.extend`
- `examples/react/`: Ejemplos de `Button` y `Table` usando Tailwind
- `examples/next/INTEGRATION_STEPS.md`: Guía para Next.js
- `emotion/`: Variante con Emotion (ThemeProvider, Button, Table)

## Uso rápido (Tailwind)

1) Copia `comintec-design-system/` a tu repo
2) Importa tokens en tu `globals.css`:
```css
@import url('../comintec-design-system/tokens.css');
html{font-size:13px} body{font-family:var(--font-family)}
```
3) En `tailwind.config.cjs`:
```js
module.exports = {
  presets: [require('./comintec-design-system/tailwind-preset.cjs')],
  content: ['./pages/**/*.{js,ts,jsx,tsx}','./components/**/*.{js,ts,jsx,tsx}','./app/**/*.{js,ts,jsx,tsx}']
};
```
4) Usa los ejemplos de `examples/react/` como referencia.

## Uso rápido (Emotion)

1) Asegúrate de tener React y Emotion:
```bash
# fish shell
pnpm add react react-dom @emotion/react @emotion/styled --save
```
2) Envuelve tu app con el ThemeProvider:
```tsx
import { ThemeProvider } from '../comintec-design-system/emotion/ThemeProvider';

export default function App({ Component, pageProps }){
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```
3) Usa los componentes:
```tsx
import { Button } from '../comintec-design-system/emotion/Button';
import { Table } from '../comintec-design-system/emotion/Table';
```

## Paleta de marca

Edita `tokens.css` (`--brand-blue-*`, `--brand-red-*`) para adaptar tus colores corporativos. Si usas `@radix-ui/colors`, puedes mapear sus valores a estas variables.

## Notas

- Las variables usan Display-P3 cuando aplica; en monitores sRGB seguirán viéndose correctas.
- La escala de espaciado (4px) de Tailwind coincide con la de Twenty.
- La tabla de ejemplo replica sticky header/columna izquierda y sombreados básicos; para un patrón idéntico, toma como referencia `twenty-front/src/modules/object-record/record-table/*`.
