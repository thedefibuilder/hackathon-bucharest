/* eslint-disable unicorn/filename-case */

'use client';

import React, { useEffect, useState } from 'react';

import { darkTheme, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Footer } from '~~/components/Footer';
import { Header } from '~~/components/Header';
import { BlockieAvatar } from '~~/components/scaffold-eth';
import { ProgressBar } from '~~/components/scaffold-eth/ProgressBar';
import { useNativeCurrencyPrice } from '~~/hooks/scaffold-eth';
import { useGlobalState } from '~~/services/store/store';
import { wagmiConfig } from '~~/services/web3/wagmiConfig';
import { appChains } from '~~/services/web3/wagmiConnectors';
import { useTheme } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { WagmiConfig } from 'wagmi';

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState((state) => state.setNativeCurrencyPrice);

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  return (
    <>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='relative flex flex-1 flex-col'>{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <ProgressBar />
      <RainbowKitProvider
        chains={appChains.chains}
        avatar={BlockieAvatar}
        theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
      >
        <ScaffoldEthApp>{children}</ScaffoldEthApp>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
