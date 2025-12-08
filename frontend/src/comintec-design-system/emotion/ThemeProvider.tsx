import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { THEME_LIGHT, THEME_DARK, Theme } from './theme';

type Mode = 'light' | 'dark';

type ThemeContextValue = {
  mode: Mode;
  toggleTheme: () => void;
  theme: Theme;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  toggleTheme: () => {},
  theme: THEME_DARK,
});

const STORAGE_KEY = 'app_theme_mode';

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<Mode>('dark');

  // Load persisted mode
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (saved === 'light' || saved === 'dark') {
      setMode(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Sync DOM + storage on mode change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const theme = useMemo(() => (mode === 'dark' ? THEME_DARK : THEME_LIGHT), [mode]);

  const value = useMemo<ThemeContextValue>(() => ({ mode, toggleTheme, theme }), [mode, toggleTheme, theme]);

  return (
    <ThemeContext.Provider value={value}>
      <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
