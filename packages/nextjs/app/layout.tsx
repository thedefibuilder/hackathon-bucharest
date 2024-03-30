/* eslint-disable sonarjs/no-duplicate-string */

import '@rainbow-me/rainbowkit/styles.css';

import React from 'react';

import { ScaffoldEthAppWithProviders } from '~~/components/ScaffoldEthAppWithProviders';
import { Metadata } from 'next';

import '~~/styles/globals.css';

import ThemeProvider from '~~/components/theme-provider';
import { Toaster } from '~~/components/ui/toast/toaster';

export const metadata: Metadata = {
  title: 'DeFi Builder - ETH Bucharest',
  description: 'DeFi Builder - ETH Bucharest',
  icons: 'favicon.svg',
  manifest: 'app.webmanifest',
  robots: {
    index: false,
    follow: false
  }
};

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ScaffoldEthAppWithProviders>
            {children}

            <Toaster />
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
