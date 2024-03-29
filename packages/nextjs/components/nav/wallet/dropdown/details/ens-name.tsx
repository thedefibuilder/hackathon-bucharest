'use client';

import React from 'react';

import type { Address } from 'viem';

import { DropdownMenuLabel } from '~~/components/ui/dropdown-menu';
import { useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import Label from './label';

type TENSName = {
  address: Address | undefined;
};

export default function ENSName({ address }: TENSName) {
  const { data: ensName } = useEnsName({
    chainId: mainnet.id,
    address: address
  });

  return (
    <DropdownMenuLabel>
      <Label property='ENS' value={ensName ?? 'N / A'} />
    </DropdownMenuLabel>
  );
}
