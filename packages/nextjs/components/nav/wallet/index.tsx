'use client';

import '@rainbow-me/rainbowkit/styles.css';

import React from 'react';

import type { ComponentProps } from 'react';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Button } from '~~/components/ui/button';
import { cn } from '~~/lib/utils';
import { useAccount } from 'wagmi';

import WalletDropdown from './dropdown';

type TWallet = ComponentProps<'button'>;

export default function Wallet({ className }: TWallet) {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (isConnected) {
    return <WalletDropdown />;
  }

  return (
    <Button color='primary' className={cn(className)} onClick={openConnectModal}>
      Connect Wallet
    </Button>
  );
}
