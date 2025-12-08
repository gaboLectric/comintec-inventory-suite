# Integración en Next.js + TailwindCSS

## 1) Copia tokens y preset

- Copia a tu repo (por ejemplo en `./comintec-design-system/`):
  - `comintec-design-system/tokens.css`
  - `comintec-design-system/tailwind-preset.cjs`

## 2) Importa tokens globales

- En `src/styles/globals.css` (o el global de tu app):
```css
@import url('../comintec-design-system/tokens.css');
html { font-size: 13px; }
body { font-family: var(--font-family); }
```

- En `_app.tsx` (Next 12/13 pages) o `app/layout.tsx` (Next 13 app router), asegúrate de importar `globals.css`.

## 3) Configura Tailwind con el preset

- `tailwind.config.cjs` o `tailwind.config.ts`:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./comintec-design-system/tailwind-preset.cjs')],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: { extend: {} },
  plugins: [],
};
```

## 4) Usa los tokens en componentes

- Ejemplo Button (Tailwind + variables):
```tsx
<button
  className="inline-flex items-center justify-center h-8 px-3 rounded-sm border border-[color:var(--border-color-light)] bg-[var(--bg-secondary)] text-[color:var(--font-color-secondary)] hover:bg-[var(--bg-tertiary)] active:bg-[var(--bg-quaternary)]"
  style={{ transition: 'var(--clickable-bg-transition)' }}
>
  Botón
</button>
```

- Tipografía por tokens:
```tsx
<p className="text-[color:var(--font-color-primary)] text-[13px]">Texto</p>
```

- Tabla (sticky primera columna): consulta el ejemplo en `../react/Table.tsx`.

## 5) Colores de marca

- Edita `tokens.css` para asignar tus colores corporativos en `--brand-blue-*`, `--brand-red-*`.
- Si usas Radix Colors, puedes mapear sus valores a las variables.

## 6) Notas

- Las sombras avanzadas y efectos de scroll se alimentan de las variables `--shadow-*`; agrega clases utilitarias o pseudo-elementos según sea necesario.
- El sistema de spacing de Tailwind (4px) ya coincide con `spacingMultiplicator` de Twenty, por lo que no necesitas cambiar la escala base.
