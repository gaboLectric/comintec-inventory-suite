import React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { THEME_LIGHT } from './theme';

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <EmotionThemeProvider theme={THEME_LIGHT}>{children}</EmotionThemeProvider>;
};
