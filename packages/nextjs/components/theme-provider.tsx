'use client';

import React from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export default function ThemeProvider({ children, ...properties }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      storageKey='hackathon-bucharest-theme'
      disableTransitionOnChange
      enableSystem
      {...properties}
    >
      {children}
    </NextThemesProvider>
  );
}
