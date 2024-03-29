'use client';

import React, { useMemo } from 'react';

import { DropdownMenuLabel } from '~~/components/ui/dropdown-menu';
import { useChainId, useSwitchNetwork } from 'wagmi';

import Label from './label';

export default function Network() {
  const { chains } = useSwitchNetwork();
  const activeChainId = useChainId();

  const activeChain = useMemo(
    () => chains.find((chain) => chain.id === activeChainId),
    [activeChainId, chains]
  );

  return (
    <DropdownMenuLabel>
      <Label property='Network' value={activeChain?.name ?? 'N / A'} />
    </DropdownMenuLabel>
  );
}
