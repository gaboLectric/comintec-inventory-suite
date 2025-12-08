import { Theme as EmotionTheme } from '@emotion/react';

export type Theme = EmotionTheme & {
  name: 'light' | 'dark';
  color: {
    blue: string;
    red: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    transparent: {
      light: string;
      medium: string;
    };
  };
  font: {
    family: string;
    size: {
      sm: string;
      md: string;
    };
    weight: {
      regular: number;
      medium: number;
      semiBold: number;
    };
    color: {
      primary: string;
      secondary: string;
      inverted: string;
      danger: string;
      extraLight: string;
    };
  };
  border: {
    radius: {
      sm: string;
    };
    color: {
      light: string;
      medium: string;
    };
  };
  spacing: (...args: number[]) => string;
  clickableElementBackgroundTransition: string;
};

// Tema basado en variables CSS de tokens.css para evitar duplicaciones.
const baseTheme: Omit<Theme, 'name'> = {
  color: {
    blue: 'var(--brand-blue-9)',
    red: 'var(--brand-red-9)',
  },
  background: {
    primary: 'var(--bg-primary)',
    secondary: 'var(--bg-secondary)',
    tertiary: 'var(--bg-tertiary)',
    quaternary: 'var(--bg-quaternary)',
    transparent: {
      light: 'var(--bg-transparent-light)',
      medium: 'var(--bg-transparent-medium)',
    },
  },
  font: {
    family: 'var(--font-family)',
    size: { sm: 'var(--font-size-sm)', md: 'var(--font-size-md)' },
    weight: { regular: 400, medium: 500, semiBold: 600 },
    color: {
      primary: 'var(--font-color-primary)',
      secondary: 'var(--font-color-secondary)',
      inverted: 'var(--font-color-inverted)',
      danger: 'var(--font-color-danger)',
      extraLight: 'var(--font-color-extraLight)',
    },
  },
  border: {
    radius: { sm: 'var(--radius-sm)' },
    color: { light: 'var(--border-color-light)', medium: 'var(--border-color-medium)' },
  },
  spacing: (...args: number[]) => args.map((n) => `${n * 4}px`).join(' '),
  clickableElementBackgroundTransition: 'var(--clickable-bg-transition)',
};

export const THEME_LIGHT: Theme = { name: 'light', ...baseTheme } as Theme;
export const THEME_DARK: Theme = { name: 'dark', ...baseTheme } as Theme;
