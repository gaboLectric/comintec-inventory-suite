// Tailwind preset que mapea los tokens CSS de comintec-design-system/tokens.css
// Úsalo en tu app Next.js agregándolo a `presets: [require('./comintec-design-system/tailwind-preset.cjs')]`

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Grays (Display-P3 referenciados via CSS vars)
        gray: {
          1: 'var(--gray-1)',
          2: 'var(--gray-2)',
          3: 'var(--gray-3)',
          4: 'var(--gray-4)',
          5: 'var(--gray-5)',
          6: 'var(--gray-6)',
          7: 'var(--gray-7)',
          8: 'var(--gray-8)',
          9: 'var(--gray-9)',
          10: 'var(--gray-10)',
          11: 'var(--gray-11)',
          12: 'var(--gray-12)',
        },
        text: {
          primary: 'var(--font-color-primary)',
          secondary: 'var(--font-color-secondary)',
          tertiary: 'var(--font-color-tertiary)',
          light: 'var(--font-color-light)',
          extra: 'var(--font-color-extraLight)',
          inverted: 'var(--font-color-inverted)',
          danger: 'var(--font-color-danger)',
        },
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          quaternary: 'var(--bg-quaternary)',
          invertedPrimary: 'var(--bg-inverted-primary)',
          invertedSecondary: 'var(--bg-inverted-secondary)',
          danger: 'var(--bg-danger)',
          transparent: {
            primary: 'var(--bg-transparent-primary)',
            secondary: 'var(--bg-transparent-secondary)',
            strong: 'var(--bg-transparent-strong)',
            medium: 'var(--bg-transparent-medium)',
            light: 'var(--bg-transparent-light)',
            lighter: 'var(--bg-transparent-lighter)',
            blue: 'var(--bg-transparent-blue)',
            orange: 'var(--bg-transparent-orange)',
            success: 'var(--bg-transparent-success)',
          },
        },
        brand: {
          blue: {
            3: 'var(--brand-blue-3)',
            7: 'var(--brand-blue-7)',
            9: 'var(--brand-blue-9)',
            10: 'var(--brand-blue-10)',
            12: 'var(--brand-blue-12)',
          },
          red: {
            3: 'var(--brand-red-3)',
            5: 'var(--brand-red-5)',
            8: 'var(--brand-red-8)',
            9: 'var(--brand-red-9)',
            10: 'var(--brand-red-10)',
          },
        },
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-xxl)',
        pill: 'var(--radius-pill)',
        rounded: 'var(--radius-rounded)',
      },
      boxShadow: {
        light: 'var(--shadow-light)',
        strong: 'var(--shadow-strong)',
        underline: 'var(--shadow-underline)',
        'super-heavy': 'var(--shadow-super-heavy)',
      },
      // Mantén el sistema de spacing por defecto (4px base) — ya coincide con tokens
      fontFamily: {
        sans: 'var(--font-family)',
      },
    },
  },
  plugins: [
    // Puedes agregar utilidades base si lo deseas
    function ({ addBase }) {
      addBase({
        ':root': {
          '--clickable-bg-transition': 'background 0.1s ease',
        },
      });
    },
  ],
};
